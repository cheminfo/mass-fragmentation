// Imports
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import { xBoxPlot } from 'ml-spectra-processing';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { fragmentationStatistics } from '../Statistics/fragmentationStatistics.js';
import { bondContribution } from '../contribution/bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';
import { neutralLoss } from '../neutralLoss/neutralLoss.js';

const { Spectrum } = MassTools;

let boxplotResults = [];

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Molecule } = OCL;

const dataSet = JSON.parse(
  fs.readFileSync(`${__dirname}/../../data/monadb/trainingSet.json`),
);

let statistics = [];
let statSpectra = [];
let model = [];
for (let i = 0; i < dataSet.length; i++) {
  const experimentalSpectrum = {
    x: dataSet[i][0].spectrum.x,
    y: dataSet[i][0].spectrum.y,
  };

  let fragmentsResult = [];
  const smilesMoleculeTest = dataSet[i][0].smiles;

  const molecule = Molecule.fromSmiles(smilesMoleculeTest);

  let mf = getMF(molecule).mf;
  let mfPrecursorIon = await generateMFs([mf], { ionizations: 'H+' });
  let massPrecursorIon = mfPrecursorIon[0].ms.em;
  let spectrum = new Spectrum(experimentalSpectrum);
  let filtredSpectrum = await spectrum.getFragmentPeaks(mf, {
    ionizations: 'H+',
    precision: 5,
  });

  let experimentalSpectrumMasses = [];
  let filtredSpectrumStat = { x: [], y: [] };
  for (let p = 0; p < filtredSpectrum.length; p++) {
    let mass = filtredSpectrum[p].x;
    experimentalSpectrumMasses.push(mass);
    filtredSpectrumStat.x.push(filtredSpectrum[p].x);
    filtredSpectrumStat.y.push(filtredSpectrum[p].y);
  }

  let result = [];
  if (experimentalSpectrumMasses.length > 0) {
    statSpectra.push(
      (experimentalSpectrumMasses.length / experimentalSpectrum.x.length - 1) *
        -100,
    );
    const resultFragmentation = fragment(molecule);

    let mfsArray = [];
    const precision = 5;
    const ionization = 'H+';
    const options = {
      ionizations: ionization,
      limit: 1e7,
      uniqueMFs: true,
      filter: {
        targetMasses: experimentalSpectrumMasses,
        precision: precision,
      },
    };
    for (let j = 0; j < resultFragmentation.length; j++) {
      let neutralLosses = neutralLoss(resultFragmentation[j].idCode);
      mfsArray[j] = [resultFragmentation[j].mf, neutralLosses];

      let results = await generateMFs(mfsArray[j], options);

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
            hose: Molecule.fromIDCode(resultFragmentation[j].idCode).toSmiles(),
          };
        }
        groups[em].mfs.push(result);
      }

      groups = Object.values(groups);

      if (groups.length > 0) {
        fragmentsResult.push(groups);
      }
    }

    for (let j = 0; j < fragmentsResult.length; j++) {
      for (let s = 0; s < fragmentsResult[j].length; s++) {
        let matchedFragmentMass = fragmentsResult[j][s].ms;
        for (let f = 0; f < experimentalSpectrumMasses.length; f++) {
          let experimentalMass = experimentalSpectrumMasses[f];

          if (
            matchedFragmentMass - 0.01 <= experimentalMass &&
            matchedFragmentMass + 0.01 >= experimentalMass
          ) {
            fragmentsResult[j][s].experimentalMass = experimentalMass;
            fragmentsResult[j][s].intensity = filtredSpectrumStat.y[f];
            result.push(fragmentsResult[j][s]);
          }
        }
      }
    }
    result.push(dataSet[i][0].id);
  }

  //Contribution Part

  let resultContribution = [];

  resultContribution.push(
    bondContribution(filtredSpectrumStat, massPrecursorIon),
  );
  model.push(result);

  if (resultContribution[0].length > 0) {
    if (result.length > 0) {
      for (let l = 0; l < result.length; l++) {
        for (let m = 0; m < resultContribution[0].length; m++) {
          if (resultContribution[0][m].mass === result[l].experimentalMass) {
            result[l].contribution = resultContribution[0][m].contribution;
          }
        }
      }
      model.push(result);

      // Statistic Part

      let statisticsResults = fragmentationStatistics(
        filtredSpectrumStat,
        result,
      );
      if (statisticsResults !== undefined) {
        statistics.push(statisticsResults);
      }
    }
  }
}

const numberOfPicks = [];
const fivePrincipalPicks = [];

let distribution = [];
for (let i = 0; i < statistics.length; i++) {
  numberOfPicks.push(statistics[i].numberOfPicks);
  fivePrincipalPicks.push(statistics[i].fivePrincipalMatchedFragments);
  distribution.push(statistics[i].distribution);
}

let boxplotfivePrincipalPicks = xBoxPlot(fivePrincipalPicks);
let boxplotDistribution = xBoxPlot(distribution);

let boxplotSpectra = xBoxPlot(statSpectra);
const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const meanFive = average(fivePrincipalPicks);

boxplotResults.push({
  boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
  boxplotDistribution: boxplotDistribution,
  distributionMean: average(distribution),
  mean: meanFive,
  boxplotSpectra: boxplotSpectra,
  boxplotSpectraMean: average(statSpectra),
});
fs.writeFileSync(
  join(__dirname, '/model/fivemolecules.json'),
  JSON.stringify(model),
  'utf8',
);
fs.writeFileSync(
  join(__dirname, '/model/statisticsMoNA.json'),
  JSON.stringify(boxplotResults),
  'utf8',
);
