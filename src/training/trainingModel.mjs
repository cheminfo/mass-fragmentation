// Imports
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import generateMFs from 'mf-generator';
import { xBoxPlot } from 'ml-spectra-processing';
import OCL from 'openchemlib';

import { fragmentationStatistics } from '../Statistics/fragmentationStatistics.mjs';
import { neutralLoss } from '../Statistics/neutralLoss.mjs';
import { bondContribution } from '../contribution/bondContribution.mjs';
import { fragment } from '../fragmentation/fragment.mjs';

const mod = [
  'H-1,H-2',
  'H-1,,H-2',
  'H-1,,H-2(H2O)-1,',
  'H-1,,H-2(H2O)-1,(H2O)-2, ',
  'H-1,,H-2(H2O)-1,(H2O)-2,(NH3)-1,(NH3)-2, ',
  'H-1,,H-2(H2O)-1,(H2O)-2,(NH3)-1,(NH3)-2,(CH2O2)-1,(CH2O2)-2,',
  'H-1,,H-2(H2O)-1,(H2O)-2,(NH3)-1,(NH3)-2,(CH2O2)-1,(CH2O2)-2,(HCN)-1,(HCN)-2,',
  'H-1,,H-2(H2O)-1,(H2O)-2,(NH3)-1,(NH3)-2,(CH2O2)-1,(CH2O2)-2,(HCN)-1,(HCN)-2,(CH2O)-1,(CH2O)-2,',
];
const ionisationParameter = [['H+'], ['+'], ['H+,+']];

let boxplotResultsHplus = [];

let boxplotResultsPlus = [];

let boxplotResultsCombined = [];
const __dirname = dirname(fileURLToPath(import.meta.url));
for (let ion = 2; ion < ionisationParameter.length; ion++) {
  for (let p = 0; p < mod.length; p++) {
    const { Molecule } = OCL;

    const dataSet = JSON.parse(
      fs.readFileSync(`${__dirname}/../../data/monadb/trainingSet.json`),
    );
    let model = [];
    let statistics = [];
    let counter = 0;

    for (let i = 0; i < dataSet.length; i++) {
      //Fragmentation Part
      const massPrecursorIon = dataSet[i][0].precursorIon;
      const experimentalSpectrum = dataSet[i][0].spectrum;

      let fragmentsResult = [];
      // let bondHoseResults = [];

      const smilesMoleculeTest = dataSet[i][0].smiles;
      const molecule = Molecule.fromSmiles(smilesMoleculeTest);
      const resultFragmentation = fragment(molecule);
      let mfsArray = [];
      for (let j = 0; j < resultFragmentation.length; j++) {
        //  let neutralLosses = neutralLoss(resultFragmentation[j].idCode);

        mfsArray[j] = [resultFragmentation[j].mf, mod[p] /*neutralLosses[0]*/];
        let fragmentMFwithNLs = {};
        await generateMFs(mfsArray[j], {
          ionizations: ionisationParameter[ion][0],
        }).then((entries) => {
          fragmentMFwithNLs.mf = entries;
        });

        fragmentMFwithNLs.mfInfo = resultFragmentation[j].mfInfo;
        fragmentMFwithNLs.idCode = resultFragmentation[j].idCode;
        fragmentsResult[j] = fragmentMFwithNLs;
      }

      //Contribution Part

      let resultContribution = [];

      resultContribution.push(
        bondContribution(experimentalSpectrum, massPrecursorIon),
      );

      // mass comparaison part

      let result = [];
      if (resultContribution[0].length > 0) {
        const tollerance = 0.01;

        for (let l = 0; l < resultContribution[0].length; l++) {
          for (let s = 0; s < fragmentsResult.length; s++) {
            for (let v = 0; v < fragmentsResult[s].mf.length; v++) {
              if (
                resultContribution[0][l].mass <=
                  fragmentsResult[s].mf[v].ms.em + tollerance &&
                resultContribution[0][l].mass >=
                  fragmentsResult[s].mf[v].ms.em - tollerance
              ) {
                result.push({
                  monoisotopicMass: fragmentsResult[s].mf[v].em,
                  //   hoseCode: bondHoseResults[j],
                  contribution: resultContribution[0][l].contribution,
                  experimentalMass: resultContribution[0][l].mass,
                  mf: fragmentsResult[s].mf[v].parts,
                  idCode: fragmentsResult[s].idCode,
                });
              }
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
      percantageMatchedFragmentsStat.push(
        statistics[i].percantageMatchedFragments,
      );
      numberOfFragmentsWithSameMass.push(
        statistics[i].numberOfFragmentsWithSameMass,
      );
      numberOfPicks.push(statistics[i].numberOfPicks);
      fivePrincipalPicks.push(statistics[i].fivePrincipalPicks);
      tenPrincipalPicks.push(statistics[i].tenPrincipalPicks);
    }

    let boxplotMolecularIon = xBoxPlot(rapportImolecularIonStat);
    let boxplotParcantageMatchedFragments = xBoxPlot(
      percantageMatchedFragmentsStat,
    );
    let boxplotNumberOfMatchedFragments = xBoxPlot(
      numberOfFragmentsMatchedStat,
    );
    let boxplotNumberOfFragmentsWithSameMass = xBoxPlot(
      numberOfFragmentsWithSameMass,
    );
    let boxplotnumberOfPicks = xBoxPlot(numberOfPicks);
    let boxplotfivePrincipalPicks = xBoxPlot(fivePrincipalPicks);
    let boxplottenPrincipalPicks = xBoxPlot(tenPrincipalPicks);
    if (ion === 0) {
      boxplotResultsHplus.push({
        testparameter: mod[p],
        boxplotMolecularIon: boxplotMolecularIon,
        boxplotParcantageMatchedFragments: boxplotParcantageMatchedFragments,
        boxplotNumberOfMatchedFragments: boxplotNumberOfMatchedFragments,
        // boxplotNumberOfFragmentsWithSameMass: boxplotNumberOfFragmentsWithSameMass,
        // boxplotnumberOfPicks: boxplotnumberOfPicks,
        boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
        boxplottenPrincipalPicks: boxplottenPrincipalPicks,
      });
    }
    if (ion === 1) {
      boxplotResultsPlus.push({
        testparameter: mod[p],
        boxplotMolecularIon: boxplotMolecularIon,
        boxplotParcantageMatchedFragments: boxplotParcantageMatchedFragments,
        boxplotNumberOfMatchedFragments: boxplotNumberOfMatchedFragments,
        // boxplotNumberOfFragmentsWithSameMass: boxplotNumberOfFragmentsWithSameMass,
        // boxplotnumberOfPicks: boxplotnumberOfPicks,
        boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
        boxplottenPrincipalPicks: boxplottenPrincipalPicks,
      });
    }
    if (ion === 2) {
      boxplotResultsCombined.push({
        testparameter: mod[p],
        boxplotMolecularIon: boxplotMolecularIon,
        boxplotParcantageMatchedFragments: boxplotParcantageMatchedFragments,
        boxplotNumberOfMatchedFragments: boxplotNumberOfMatchedFragments,
        // boxplotNumberOfFragmentsWithSameMass: boxplotNumberOfFragmentsWithSameMass,
        // boxplotnumberOfPicks: boxplotnumberOfPicks,
        boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
        boxplottenPrincipalPicks: boxplottenPrincipalPicks,
      });
    }
  }
  //index: 7392 counter: 4240
  console.log(ion);
}
fs.writeFileSync(
  join(__dirname, 'statisticsHplus.json'),
  JSON.stringify(boxplotResultsHplus),
  'utf8',
);

fs.writeFileSync(
  join(__dirname, 'statisticsPlus.json'),
  JSON.stringify(boxplotResultsPlus),
  'utf8',
);
fs.writeFileSync(
  join(__dirname, 'statisticsCombined.json'),
  JSON.stringify(boxplotResultsCombined),
  'utf8',
);
