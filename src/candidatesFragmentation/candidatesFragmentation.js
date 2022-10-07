import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { bondContribution } from '../contribution/bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';
import { neutralLoss } from '../neutralLoss/neutralLoss.js';

const { Spectrum } = MassTools;
const { Molecule } = OCL;

/**
 * This function performs the in-silico fragmentation of a given structure and returns the matched fragments and the bond contribution
 * @param {object} spectra experimental spectra in form {x:[],y:[]}
 * @param {object} smiles Smiles of candidate structure
 * @param {object} options Object containing the ionization (like H+, +,..) and the precision in ppm (like 5ppm) in a format {ionization:[H+],precision:[5ppm]}
 * @returns {object} returns matched fragments with their bond contribution on experimental spectra
 */

export async function candidatesFragmentation(spectrum, smiles, options) {
  const { precision, ionization, limit } = options;

  // Generate molecule from smiles
  const molecule = Molecule.fromSmiles(smiles);

  // Get mass precursor ion, used in bondContribution() and MF molecular
  let mfMolecularIon = getMF(molecule).mf;
  let mfPrecursorIon = await generateMFs([mfMolecularIon], {
    ionizations: ionization,
  });
  let massPrecursorIon = mfPrecursorIon[0].ms.em;

  // Filtration of experimental spectrum with Mf of molecular ion
  let newSpectrum = new Spectrum(spectrum);
  let filteredSpectrum = await newSpectrum.getFragmentPeaks(mfMolecularIon, {
    ionizations: ionization,
    precision,
  });

  // filteredSpectrumMasses used for matching in generateMFs() and filtredSpectrumFroStatistics in format for bondContribution() and for matching
  const masses = filteredSpectrum.map((peak) => peak.x);
  const filteredSpectrumForStatistics = {
    x: masses,
    y: filteredSpectrum.map((peak) => peak.y),
  };

  // Perform in-silico fragmentation
  const fragmentation = fragment(molecule);

  let mfsArray = [];
  const optionsMFs = {
    ionizations: ionization,
    limit,
    uniqueMFs: false,
    filter: {
      targetMasses: masses,
      precision,
    },
  };
  let fragmentsResult = [];
  for (let i = 0; i < fragmentation.length; i++) {
    if (fragmentation[i].hose !== undefined) {
      // get neutral losses for each fragment
      let neutralLosses = neutralLoss(fragmentation[i].idCode);
      mfsArray[i] = [fragmentation[i].mf, neutralLosses];
      let results = await generateMFs(mfsArray[i], optionsMFs);
      let groups = {};
      for (const result of results) {
        const em = Math.round(result.ms.em * 1e6);
        if (!groups[em]) {
          groups[em] = {
            em: result.em,
            ms: result.ms.em,
            mf: result.mf,
            ppm: result.ms.ppm,
            mfs: [],
            hose: fragmentation[i].hose,
          };
        }
        groups[em].mfs.push(result.mf);
      }

      groups = Object.values(groups);

      if (groups.length > 0) {
        for (let j = 0; j < groups.length; j++) {
          fragmentsResult.push(groups[j]);
        }
      }
    }
    // Account for Molecular ion to be matched
    if (fragmentation[i].fragmentType === 'Molecular Ion') {
      let resultMolecularIon = await generateMFs(
        [fragmentation[i].mf],
        optionsMFs,
      );
      let group = {};
      for (const result of resultMolecularIon) {
        const em = Math.round(result.ms.em * 1e6);

        group[em] = {
          em: result.em,
          ms: result.ms.em,
          mf: result.mf,
          ppm: result.ms.ppm,
          mfs: [],
          hose: fragmentation[i].hose,
        };

        group[em].mfs.push(result);
      }

      group = Object.values(group);

      if (group.length > 0) {
        for (let j = 0; j < group.length; j++) {
          fragmentsResult.push(group[j]);
        }
      }
    }
  }
  // get intensity of each matched fragment
  for (let i = 0; i < fragmentsResult.length; i++) {
    let massAccuracy = (options.precision * fragmentsResult[i].ms) / 1e6;
    for (let m = 0; m < filteredSpectrumForStatistics.x.length; m++) {
      if (
        filteredSpectrumForStatistics.x[m] <=
          fragmentsResult[i].ms + massAccuracy &&
        filteredSpectrumForStatistics.x[m] >=
          fragmentsResult[i].ms - massAccuracy
      ) {
        fragmentsResult[i].intensity = filteredSpectrumForStatistics.y[m];
      }
      if (fragmentsResult[i].hose === undefined) {
        fragmentsResult[i].intensity = filteredSpectrumForStatistics.y[m];
      }
    }
  }
  // Bond Contribution of each matched fragment

  let resultContribution = bondContribution(
    filteredSpectrumForStatistics,
    massPrecursorIon,
    precision,
  );

  if (resultContribution.length > 0) {
    for (let i = 0; i < fragmentsResult.length; i++) {
      let massAccuracyOfFragment =
        (options.precision * fragmentsResult[i].ms) / 1e6;
      for (let j = 0; j < resultContribution.length; j++) {
        // check if resultContribution[j].mass is in the range of massAccuracyOfFragment+/- of fragmentsResult[i][0].ms
        if (
          resultContribution[j].mass <=
            fragmentsResult[i].ms + massAccuracyOfFragment &&
          resultContribution[j].mass >=
            fragmentsResult[i].ms - massAccuracyOfFragment
        ) {
          fragmentsResult[i].bondContribution =
            resultContribution.bondContribution;
        }
        if (fragmentsResult[i].hose === undefined) {
          fragmentsResult[i].contribution = 0;
        }
      }
    }
  }
  return fragmentsResult;
}
