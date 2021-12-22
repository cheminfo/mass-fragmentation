// Imports
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { xBoxPlot } from 'ml-spectra-processing';
import OCL from 'openchemlib';

import { fragmentationStatistics } from '../Statistics/fragmentationStatistics.mjs';
import { bondContribution } from '../bondContribution.mjs';
import { fragmentAcyclicBonds } from '../fragmentation/fragmentAcyclicBonds.mjs';

const { Molecule } = OCL;

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataSet = JSON.parse(
  fs.readFileSync(`${__dirname}/../../data/monadb/trainingSet.json`),
);
let model = [];
let statistics = [];
let counter = 0;
for (let i = 0; i < dataSet.length; i++) {
  //Fragmentation Part
  const experimentalSpectrum = dataSet[i][0].spectrum;
  let fragmentsResult = [];
  let bondHoseResults = [];

  if (experimentalSpectrum.x.length > 0) {
    const smilesMoleculeTest = dataSet[i][0].smiles;
    const molecule = Molecule.fromSmiles(smilesMoleculeTest);
    const resultFragmentation = fragmentAcyclicBonds(molecule);

    for (let j = 0; j < resultFragmentation.length; j++) {
      fragmentsResult.push(resultFragmentation[j].mfInfo);
      bondHoseResults.push(resultFragmentation[j].hose.hoses);
    }
  }
  //Contribution Part

  const massPrecursorIon = dataSet[i][0].precursorIon;
  let resultContribution = [];
  if (experimentalSpectrum.x.length > 0) {
    resultContribution.push(
      bondContribution(experimentalSpectrum, massPrecursorIon),
    );
  }
  // mass comparaison part

  let result = [];
  if (resultContribution[0].length > 0) {
    for (let j = 0; j < fragmentsResult.length; j++) {
      const mass = fragmentsResult[j].monoisotopicMass;
      const tollerance = 0.1;
      for (let l = 0; l < resultContribution[0].length; l++) {
        if (
          resultContribution[0][l].mass <= mass + tollerance &&
          resultContribution[0][l].mass >= mass - tollerance
        ) {
          result.push({
            monoisotopicMass: mass,
            hoseCode: bondHoseResults[j],
            contribution: resultContribution[0][l].contribution,
            experimentalMass: resultContribution[0][l].mass,
          });
        }
      }
    }
  }
  if (result.length > 0) {
    model.push(result[0]);
    counter += 1;
    // Statistic Part

    const statisticsResults = fragmentationStatistics(
      experimentalSpectrum,
      result,
      massPrecursorIon,
    );
    statistics.push(statisticsResults);
  }

  console.log('index:', i, 'counter:', counter);
}

fs.writeFileSync(join(__dirname, 'model.json'), JSON.stringify(model), 'utf8');

const rapportImolecularIonStat = [];
const numberOfFragmentsMatchedStat = [];
const percantageMatchedFragmentsStat = [];
for (let i = 0; i < statistics.length; i++) {
  rapportImolecularIonStat.push(statistics[i].rapportImolecularIon);
  numberOfFragmentsMatchedStat.push(statistics[i].numberOfFragmentsMatched);
  percantageMatchedFragmentsStat.push(statistics[i].percantageMatchedFragments);
}

let boxplotResults = [];

let boxplotMolecularIon = xBoxPlot(rapportImolecularIonStat);
let boxplotParcantageMatchedFragments = xBoxPlot(
  percantageMatchedFragmentsStat,
);
let boxplotNumberOfMatchedFragments = xBoxPlot(numberOfFragmentsMatchedStat);

boxplotResults.push({
  boxplotMolecularIon: boxplotMolecularIon,
  boxplotParcantageMatchedFragments: boxplotParcantageMatchedFragments,
  boxplotNumberOfMatchedFragments: boxplotNumberOfMatchedFragments,
});

fs.writeFileSync(
  join(__dirname, 'statistics.json'),
  JSON.stringify(boxplotResults),
  'utf8',
);
//index: 7392 counter: 4240
