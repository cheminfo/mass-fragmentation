import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { bondContribution } from '../bondContribution/bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';

import { getPossibleMFs } from './getPossibleMFs.js';

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
  masses.sort((a, b) => a - b);
  // Perform in-silico fragmentation
  const fragmentation = fragment(molecule);
  const optionsMFs = {
    ionizations: ionization,
    limit,
    uniqueMFs: false,
    filter: {
      targetMasses: masses,
      precision,
    },
  };

  let fragmentsResult = await getPossibleMFs(fragmentation, optionsMFs);

  let x = [];
  let y = [];
  for (let i = 0; i < filteredSpectrum.length; i++) {
    x.push(filteredSpectrum[i].x);
    y.push(filteredSpectrum[i].y);
  }
  let spectrumForContribution = { x, y };
  // get intensity of each matched fragment
  for (let i = 0; i < fragmentsResult.length; i++) {
    let experimentalMass = fragmentsResult[i].experimentalMass;
    let index = x.indexOf(experimentalMass);
    fragmentsResult[i].intensity = y[index];
  }
  // Bond Contribution of each matched fragment

  let resultContribution = bondContribution(
    spectrumForContribution,
    massPrecursorIon,
    precision,
  );
  if (resultContribution.length > 0) {
    for (let i = 0; i < fragmentsResult.length; i++) {
      let experimentalMass = fragmentsResult[i].experimentalMass;
      for (let j = 0; j < resultContribution.length; j++) {
        if (resultContribution[j].mass === experimentalMass) {
          fragmentsResult[i].contribution = resultContribution[j].contribution;
        }
      }
    }
  }

  return { fragmentsResult, fragmentation };
}
