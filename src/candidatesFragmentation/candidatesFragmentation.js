import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { bondContribution } from '../bondContribution/bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';
import { neutralLoss } from '../neutralLoss/neutralLoss.js';

const { Spectrum } = MassTools;
const { Molecule } = OCL;

/**
 * This function performs the in-silico fragmentation of a given structure and returns the matched fragments and the bond contribution
 * @param {object} spectrum experimental spectra in form {x:[],y:[]}
 * @param {any} idCode The OCL idCode of candidate structure
 * @param {object} options Object containing the ionization (like H+, +,..) and the precision in ppm (like 5ppm) in a format {ionization:[H+],precision:[5ppm]}
 * @returns returns matched fragments with their bond contribution on experimental spectra
 */

export async function candidatesFragmentation(spectrum, idCode, options) {
  const { precision, ionization, limit } = options;

  // Generate molecule from smiles
  const molecule = Molecule.fromIDCode(idCode);

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
            ignored: 0,
          };
        } else {
          groups[em].ignored++;
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
          ignored: 0,
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

  let x = [];
  let y = [];
  for (let i = 0; i < filteredSpectrum.length; i++) {
    x.push(filteredSpectrum[i].x);
    y.push(filteredSpectrum[i].y);
  }
  let spectrumForContribution = { x, y };
  // get intensity of each matched fragment
  for (let i = 0; i < fragmentsResult.length; i++) {
    let massAccuracy = (precision * fragmentsResult[i].ms) / 1e6;
    for (let m = 0; m < filteredSpectrum.length; m++) {
      if (
        Math.abs(filteredSpectrum[m].x - fragmentsResult[i].ms) <= massAccuracy
      ) {
        fragmentsResult[i].intensity = filteredSpectrum[m].y;
      }
      if (fragmentsResult[i].hose === undefined) {
        fragmentsResult[i].intensity = filteredSpectrum[m].y;
      }
    }
  }
  // Bond Contribution of each matched fragment

  let resultContribution = bondContribution(
    spectrumForContribution,
    massPrecursorIon,
    precision,
  );
  //console.log(resultContribution);

  if (resultContribution.length > 0) {
    for (let i = 0; i < fragmentsResult.length; i++) {
      let massAccuracyOfFragment =
        (options.precision * fragmentsResult[i].ms) / 1e6;
      for (let j = 0; j < resultContribution.length; j++) {
        if (
          Math.abs(resultContribution[j].mass - fragmentsResult[i].ms) <=
          massAccuracyOfFragment
        ) {
          fragmentsResult[i].contribution = resultContribution[j].contribution;
        }
        if (fragmentsResult[i].hose === undefined) {
          fragmentsResult[i].contribution = 0;
        }
      }
    }
  }
  return fragmentsResult;
}
