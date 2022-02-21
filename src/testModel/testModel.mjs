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
import { fragment } from '../fragmentation/fragment.js';
import { neutralLoss } from '../neutralLoss/neutralLoss';

const { Spectrum } = MassTools;

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Molecule } = OCL;

const dataSet = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../data/CASMI/testSet/spectraChallenge.json`,
  ),
);

const solutions = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../data/CASMI/testSet/solutionsChallenge.json`,
  ),
);
const model = JSON.parse(fs.readFileSync('../training/model/model.json'));

let statistics = [];
let statisticsSpectrum = [];

let top1Score = [];
let top5Score = [];
let top10Score = [];

for (let i = 0; i < dataSet.length; i++) {
  let rankCandidatesScore = [];
  let rankCandidatesSmiles = [];
  const experimentalSpectrum = {
    x: dataSet[i].x,
    y: dataSet[i].y,
  };
  for (let f = 0; f < dataSet[i].smiles.length; f++) {
    try {
      let fragmentsResult = [];
      const smilesMoleculeTest = dataSet[i].smiles[f];

      const molecule = Molecule.fromSmiles(smilesMoleculeTest);

      let molecularFormula = getMF(molecule).mf;

      let spectrum = new Spectrum(experimentalSpectrum);
      let filtredSpectrum = await spectrum.getFragmentPeaks(molecularFormula, {
        ionizations: 'H+',
        precision: 5,
      });

      let experimentalSpectrumMasses = [];
      let filtredSpectrumForStatistics = { x: [], y: [] };
      for (let p = 0; p < filtredSpectrum.length; p++) {
        let mass = filtredSpectrum[p].x;
        experimentalSpectrumMasses.push(mass);
        filtredSpectrumForStatistics.x.push(filtredSpectrum[p].x);
        filtredSpectrumForStatistics.y.push(filtredSpectrum[p].y);
      }

      let result = [];

      statisticsSpectrum.push(
        (experimentalSpectrumMasses.length / experimentalSpectrum.x.length -
          1) *
          -100,
      );
      const resultFragmentation = fragment(molecule);

      let mfsArray = [];
      const precision = 5;
      const ionization = 'H+';
      const options = {
        ionizations: ionization,
        limit: 1e7,
        uniqueMFs: false,
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
              hose: resultFragmentation[j].hose,
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
              fragmentsResult[j][s].intensity =
                filtredSpectrumForStatistics.y[f];
              result.push(fragmentsResult[j][s]);
            }
          }
        }
      }

      if (result.length > 0) {
        let resultModelContribution = [];
        for (let h = 0; h < result.length; h++) {
          if (result[h].hose !== undefined) {
            let hosesFromFragmentation = result[h].hose;
            if (!Array.isArray(hosesFromFragmentation)) {
              for (let g = 0; g < model.length; g++) {
                for (let k = 0; k < model[g].length; k++) {
                  if (!Array.isArray(model[g][k].hose)) {
                    let modelHoseBond1 = model[g][k].hose.bond1.slice(0, 2);
                    let modelHoseBond2 = model[g][k].hose.bond2.slice(0, 2);

                    if (
                      (hosesFromFragmentation.bond1.slice(0, 1)[0] ===
                        modelHoseBond1[0] &&
                        hosesFromFragmentation.bond1.slice(1, 2)[0] ===
                          modelHoseBond1[1]) ||
                      (hosesFromFragmentation.bond2.slice(0, 1)[0] ===
                        modelHoseBond2[0] &&
                        hosesFromFragmentation.bond1.slice(1, 2)[0] ===
                          modelHoseBond2[1])
                    ) {
                      resultModelContribution.push(model[g][k].contribution);
                    }
                  }
                }
              }
            }

            if (Array.isArray(hosesFromFragmentation)) {
              for (let g = 0; g < model.length; g++) {
                for (let k = 0; k < model[g].length; k++) {
                  if (Array.isArray(model[g][k].hose)) {
                    let modelHose = model[g][k].hose.slice(0, 2);
                    let hosesResult = hosesFromFragmentation.slice(0, 2);
                    if (
                      hosesResult[0] === modelHose[0] &&
                      hosesResult[1] === modelHose[1]
                    ) {
                      resultModelContribution.push(model[g][k].contribution);
                    }
                  }
                }
              }
            }
          }
        }

        let averageContribution = average(resultModelContribution);
        let massOfMatchedFragments = [];
        let intensityOfMatchedFragments = [];
        for (let o = 0; o < result.length; o++) {
          massOfMatchedFragments.push(result[o].experimentalMass);
          intensityOfMatchedFragments.push(result[o].intensity);
        }

        let weigthFactors = 0;
        for (let w = 0; w < massOfMatchedFragments.length; w++) {
          weigthFactors +=
            intensityOfMatchedFragments[w] ** 0.6 *
            massOfMatchedFragments[w] ** 0.3;
        }

        let finalScore = weigthFactors + averageContribution;

        let statisticsResults = fragmentationStatistics(
          filtredSpectrumForStatistics,
          result,
        );
        if (statisticsResults !== undefined) {
          statistics.push(statisticsResults);
        }

        if (isNaN(finalScore) === false) {
          rankCandidatesSmiles.push(smilesMoleculeTest);
          rankCandidatesScore.push(finalScore);
        }
      }
    } catch (__java$exception) {
      continue;
    }
  }
  if (rankCandidatesSmiles.length > 0) {
    let rankCandidates = { smiles: [], score: [] };
    for (let r = 0; r < rankCandidatesScore.length; r++) {
      rankCandidates.smiles.push(rankCandidatesSmiles[r]);
      rankCandidates.score.push(rankCandidatesScore[r]);
    }

    let rank = rankCandidates.score.slice().sort((a, b) => b - a);

    let finalRanking = { smiles: [], score: [] };
    for (let r = 0; r < rank.length; r++) {
      for (let s = 0; s < rankCandidates.score.length; s++) {
        if (rank[r] === rankCandidates.score[s]) {
          finalRanking.smiles.push(rankCandidates.smiles[s]);
          finalRanking.score.push(rank[r]);
        }
      }
    }

    let top1 = {
      smiles: finalRanking.smiles.slice(0, 1),
      score: finalRanking.score.slice(0, 1),
    };
    let top5 = {
      smiles: finalRanking.smiles.slice(0, 5),
      score: finalRanking.score.slice(0, 5),
    };
    let top10 = {
      smiles: finalRanking.smiles.slice(0, 10),
      score: finalRanking.score.slice(0, 10),
    };

    let solutionSmiles = solutions[i].smiles;
    if (solutionSmiles === top1.smiles) {
      top1Score.push(1);
    } else {
      top1Score.push(0);
    }
    for (let r = 0; r < top5.smiles.length; r++) {
      if (solutionSmiles === top5.smiles[r]) {
        top5Score.push(1);
      } else {
        top5Score.push(0);
      }
    }
    for (let r = 0; r < top10.smiles.length; r++) {
      if (solutionSmiles === top10.smiles[r]) {
        top10Score.push(1);
      } else {
        top10Score.push(0);
      }
    }
  }
}

let boxplotTopScore1 = xBoxPlot(top1Score);
let boxplotTopScore5 = xBoxPlot(top5Score);
let boxplotTopScore10 = xBoxPlot(top10Score);

let resultsBoxplot = {
  TopScore1: boxplotTopScore1,
  TopScore5: boxplotTopScore5,
  TopScore10: boxplotTopScore10,
};

fs.writeFileSync(
  join(__dirname, 'resultsTestModel.json'),
  JSON.stringify(resultsBoxplot),
  'utf8',
);
