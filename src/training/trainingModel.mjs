// Imports
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { xBoxPlot } from 'ml-spectra-processing';
import OCL from 'openchemlib';

import { fragmentationStatistics } from '../Statistics/fragmentationStatistics.mjs';
import { neutralLoss } from '../Statistics/neutralLoss.mjs';
import { bondContribution } from '../bondContribution.js';
import { fragment } from '../fragmentation/fragment.js';

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
  // let bondHoseResults = [];

  if (experimentalSpectrum.x.length > 0) {
    const smilesMoleculeTest = dataSet[i][0].smiles;
    const molecule = Molecule.fromSmiles(smilesMoleculeTest);
    const resultFragmentation = fragment(molecule);
    for (let j = 0; j < resultFragmentation[0].length; j++) {
      fragmentsResult.push(resultFragmentation[0][j].mfInfo);

      // bondHoseResults.push(resultFragmentation[j].hose.hoses);
    }
    for (let j = 0; j < resultFragmentation[0].length; j++) {
      fragmentsResult[j].idCode = resultFragmentation[0][j].idCode;
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
    const neutralLosses = neutralLoss(fragmentsResult);

    for (let n = 0; n < neutralLosses.length; n++) {
      const tollerance = 0.01;
      const massNL = neutralLosses[n].monoisotopicMass;
      for (let l = 0; l < resultContribution[0].length; l++) {
        if (
          resultContribution[0][l].mass <= massNL + tollerance &&
          resultContribution[0][l].mass >= massNL - tollerance
        ) {
          result.push({
            monoisotopicMass: massNL,
            //   hoseCode: bondHoseResults[j],
            contribution: resultContribution[0][l].contribution,
            experimentalMass: resultContribution[0][l].mass,
            neutralLossType: neutralLosses[n].nLType,
            idCode: neutralLosses[n].idCode,
          });
        }
        if (
          resultContribution[0][l].mass <=
            neutralLosses[n].monoisotopicMassProtonated + tollerance &&
          resultContribution[0][l].mass >=
            neutralLosses[n].monoisotopicMassProtonated - tollerance
        ) {
          result.push({
            monoisotopicMass: neutralLosses[n].monoisotopicMassProtonated,
            //   hoseCode: bondHoseResults[j],
            contribution: resultContribution[0][l].contribution,
            experimentalMass: resultContribution[0][l].mass,
            neutralLossType: 'none',
            idCode: neutralLosses[n].idCode,
          });
        }

        if (
          resultContribution[0][l].mass <=
            neutralLosses[n].monoisotopicMassDoubleProtonated + tollerance &&
          resultContribution[0][l].mass >=
            neutralLosses[n].monoisotopicMassDoubleProtonated - tollerance
        ) {
          result.push({
            monoisotopicMass: neutralLosses[n].monoisotopicMassDoubleProtonated,
            //   hoseCode: bondHoseResults[j],
            contribution: resultContribution[0][l].contribution,
            experimentalMass: resultContribution[0][l].mass,
            neutralLossType: 'none',
            idCode: neutralLosses[n].idCode,
          });
        }
      }
    }
  }

  if (result.length > 0) {
    model.push(result);
    counter += 1;
    // Statistic Part

    const statisticsResults = fragmentationStatistics(
      experimentalSpectrum,
      result,
      massPrecursorIon,
    );
    if (statisticsResults !== undefined) {
      statistics.push(statisticsResults);
    }
  }

  console.log('index:', i, 'counter:', counter);
}

//fs.writeFileSync(join(__dirname, 'model.json'), JSON.stringify(model), 'utf8');

const rapportImolecularIonStat = [];
const numberOfFragmentsMatchedStat = [];
const percantageMatchedFragmentsStat = [];
const numberOfFragmentsWithSameMass = [];
const numberOfPicks = [];
const fivePrincipalPicks = [];
const tenPrincipalPicks = [];
for (let i = 0; i < statistics.length; i++) {
  rapportImolecularIonStat.push(statistics[i].rapportImolecularIon);
  numberOfFragmentsMatchedStat.push(statistics[i].numberOfFragmentsMatched);
  percantageMatchedFragmentsStat.push(statistics[i].percantageMatchedFragments);
  numberOfFragmentsWithSameMass.push(
    statistics[i].numberOfFragmentsWithSameMass,
  );
  numberOfPicks.push(statistics[i].numberOfPicks);
  fivePrincipalPicks.push(statistics[i].fivePrincipalPicks);
  tenPrincipalPicks.push(statistics[i].tenPrincipalPicks);
}

let boxplotResults = [];

let boxplotMolecularIon = xBoxPlot(rapportImolecularIonStat);
let boxplotParcantageMatchedFragments = xBoxPlot(
  percantageMatchedFragmentsStat,
);
let boxplotNumberOfMatchedFragments = xBoxPlot(numberOfFragmentsMatchedStat);
let boxplotNumberOfFragmentsWithSameMass = xBoxPlot(
  numberOfFragmentsWithSameMass,
);
let boxplotnumberOfPicks = xBoxPlot(numberOfPicks);
let boxplotfivePrincipalPicks = xBoxPlot(fivePrincipalPicks);
let boxplottenPrincipalPicks = xBoxPlot(tenPrincipalPicks);
boxplotResults.push({
  boxplotMolecularIon: boxplotMolecularIon,
  boxplotParcantageMatchedFragments: boxplotParcantageMatchedFragments,
  boxplotNumberOfMatchedFragments: boxplotNumberOfMatchedFragments,
  boxplotNumberOfFragmentsWithSameMass: boxplotNumberOfFragmentsWithSameMass,
  boxplotnumberOfPicks: boxplotnumberOfPicks,
  boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
  boxplottenPrincipalPicks: boxplottenPrincipalPicks,
});

fs.writeFileSync(
  join(__dirname, 'statistics.json'),
  JSON.stringify(boxplotResults),
  'utf8',
);
//index: 7392 counter: 4240
