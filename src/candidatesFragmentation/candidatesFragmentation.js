import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { bondContribution } from '../contribution/bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';
import { neutralLoss } from '../neutralLoss/neutralLoss.js';

const { Spectrum } = MassTools;
const { Molecule } = OCL;

export async function candidatesFragmentation(spectrum, smiles, options) {
  let fragmentsResult = [];

  const molecule = Molecule.fromSmiles(smiles);

  let mfMolecularIon = getMF(molecule).mf;
  let mfPrecursorIon = await generateMFs([mfMolecularIon], {
    ionizations: options.ionization,
  });
  let massPrecursorIon = mfPrecursorIon[0].ms.em;
  let newspectrum = new Spectrum(spectrum);
  let filtredSpectrum = await newspectrum.getFragmentPeaks(mfMolecularIon, {
    ionizations: options.ionization,
    precision: options.precision,
  });

  let filtredSpectrumMasses = [];
  let filtredSpectrumForStatistics = { x: [], y: [] };
  for (let p = 0; p < filtredSpectrum.length; p++) {
    let mass = filtredSpectrum[p].x;
    filtredSpectrumMasses.push(mass);
    filtredSpectrumForStatistics.x.push(filtredSpectrum[p].x);
    filtredSpectrumForStatistics.y.push(filtredSpectrum[p].y);
  }

  const fragmentation = fragment(molecule);

  let mfsArray = [];
  const precision = options.precision;
  const ionization = options.ionization;
  const optionsMFs = {
    ionizations: ionization,
    limit: 1e7,
    uniqueMFs: false,
    filter: {
      targetMasses: filtredSpectrumMasses,
      precision: precision,
    },
  };
  for (let j = 0; j < fragmentation.length; j++) {
    if (fragmentation[j].hose !== undefined) {
      let neutralLosses = neutralLoss(fragmentation[j].idCode);
      mfsArray[j] = [fragmentation[j].mf, neutralLosses];

      let results = await generateMFs(mfsArray[j], optionsMFs);
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
            hose: fragmentation[j].hose,
          };
        }
        groups[em].mfs.push(result);
      }

      groups = Object.values(groups);

      if (groups.length > 0) {
        fragmentsResult.push(groups);
      }
    }

    if (fragmentation[j].fragmentType === 'Molecular Ion') {
      let resultMolecularIon = await generateMFs(
        [fragmentation[j].mf],
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
          hose: fragmentation[j].hose,
        };

        group[em].mfs.push(result);
      }

      group = Object.values(group);

      if (group.length > 0) {
        fragmentsResult.push(group);
      }
    }
  }
  for (let l = 0; l < fragmentsResult.length; l++) {
    let massAccurancy = (options.precision * fragmentsResult[l][0].ms) / 1e6;

    for (let m = 0; m < filtredSpectrumForStatistics.x.length; m++) {
      if (
        filtredSpectrumForStatistics.x[m] <=
          fragmentsResult[l][0].ms + massAccurancy &&
        filtredSpectrumForStatistics.x[m] >=
          fragmentsResult[l][0].ms - massAccurancy
      ) {
        fragmentsResult[l][0].intensity = filtredSpectrumForStatistics.y[m];
      }
      if (fragmentsResult[l][0].hose === undefined) {
        fragmentsResult[l][0].intensity = filtredSpectrumForStatistics.y[m];
      }
    }
  }

  //Contribution Part

  let resultContribution = bondContribution(
    filtredSpectrumForStatistics,
    massPrecursorIon,
  );

  if (resultContribution.length > 0) {
    if (fragmentsResult.length > 0) {
      for (let l = 0; l < fragmentsResult.length; l++) {
        let massAccurancy =
          (options.precision * fragmentsResult[l][0].ms) / 1e6;

        for (let m = 0; m < resultContribution.length; m++) {
          if (
            resultContribution[m].mass <=
              fragmentsResult[l][0].ms + massAccurancy &&
            resultContribution[m].mass >=
              fragmentsResult[l][0].ms - massAccurancy
          ) {
            fragmentsResult[l][0].contribution =
              resultContribution[m].contribution;
          }
          if (fragmentsResult[l][0].hose === undefined) {
            fragmentsResult[l][0].contribution = 0;
          }
        }
      }
    }
  }

  return fragmentsResult;
}
