// Imports
import * as fs from 'fs';
import { connect } from 'http2';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import MassTools from 'mass-tools';
import generateMFs from 'mf-generator';
import { xBoxPlot } from 'ml-spectra-processing';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

import { fragmentationStatistics } from '../Statistics/fragmentationStatistics.mjs';
import { fragment } from '../fragmentation/fragment.mjs';
import { neutralLoss } from '../training/neutralLoss.mjs';

const { Spectrum } = MassTools;

const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

let boxplotResultsHplus = [];

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
let statSpectra = [];
let count = 0;

let counterSpectra = 0;
let top1Score = 0;
let top5Score = 0;
let top10Score = 0;

for (let i = 0; i < 20 /*dataSet.length*/; i++) {
  counterSpectra += 1;
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

      let mf = getMF(molecule).mf;

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

      statSpectra.push(
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
              fragmentsResult[j][s].intensity = filtredSpectrumStat.y[f];
              result.push(fragmentsResult[j][s]);
            }
          }
        }
      }

      if (result.length > 0) {
        count += 1;
        // Statistic Part
        let resultModelContribution = [];
        for (let h = 0; h < result.length; h++) {
          if (result[h].hose !== undefined) {
            // problems with undefinded
            let hoses = result[h].hose;
            if (!Array.isArray(hoses)) {
              for (let g = 0; g < model.length; g++) {
                for (let k = 0; k < model[g].length; k++) {
                  if (!Array.isArray(model[g][k].hose)) {
                    let modelHoseBond1 = model[g][k].hose.bond1.slice(0, 2);
                    let modelHoseBond2 = model[g][k].hose.bond2.slice(0, 2);

                    if (
                      (hoses.bond1.slice(0, 1)[0] === modelHoseBond1[0] &&
                        hoses.bond1.slice(1, 2)[0] === modelHoseBond1[1]) ||
                      (hoses.bond2.slice(0, 1)[0] === modelHoseBond2[0] &&
                        hoses.bond1.slice(1, 2)[0] === modelHoseBond2[1])
                    ) {
                      resultModelContribution.push(model[g][k].contribution);
                    }
                  }
                }
              }
            }

            if (Array.isArray(hoses)) {
              for (let g = 0; g < model.length; g++) {
                for (let k = 0; k < model[g].length; k++) {
                  if (Array.isArray(model[g][k].hose)) {
                    let modelHose = model[g][k].hose.slice(0, 2);
                    let hosesResult = hoses.slice(0, 2);
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
        let weigthed = [];
        let intI = [];
        for (let o = 0; o < result.length; o++) {
          weigthed.push(result[o].experimentalMass);
          intI.push(result[o].intensity);
        }

        let maxW = Math.max(...weigthed);
        let wI = 0;
        for (let w = 0; w < weigthed.length; w++) {
          wI += intI[w] ** 0.6 / weigthed[w] ** 0.3 / maxW;
        }

        let finalScore = wI + averageContribution;

        let statisticsResults = fragmentationStatistics(
          filtredSpectrumStat,
          result,
        );
        if (statisticsResults !== undefined) {
          statistics.push(statisticsResults);
        }

        if (isNaN(finalScore) === false) {
          rankCandidatesSmiles.push(smilesMoleculeTest);
          rankCandidatesScore.push(finalScore);
        }

        console.log(
          'count:',
          count,
          'index:',
          i,
          'stat:',
          smilesMoleculeTest,
          'challenge:',
          dataSet[i].id,
          // smilesMoleculeTest,
        );

        // console.log(result);
      }
    } catch (__java$exception) {
      continue;
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
        top1Score += 1;
      }
      for (let r = 0; r < top5.smiles.length; r++) {
        if (solutionSmiles === top5.smiles[r]) {
          top5Score += 1;
        }
      }
      for (let r = 0; r < top10.smiles.length; r++) {
        if (solutionSmiles === top10.smiles[r]) {
          top10Score += 1;
        }
      }
    }
  }
}

connsole.log(
  'top 1:',
  (top1Score / counterSpectra) * 100,
  'top5:',
  (top5Score / counterSpectra) * 100,
  'top 10:',
  (top10Score / counterSpectra) * 100,
);

/*
const numberOfPicks = [];
const fivePrincipalPicks = [];

let distribution = [];
for (let i = 0; i < statistics.length; i++) {
  numberOfPicks.push(statistics[i].numberOfPicks);
  fivePrincipalPicks.push(statistics[i].fivePrincipalPicks);
  distribution.push(statistics[i].distribution);
}

let boxplotfivePrincipalPicks = xBoxPlot(fivePrincipalPicks);
let boxplotDistribution = xBoxPlot(distribution);

let boxplotSpectra = xBoxPlot(statSpectra);
const average = (arr) => arr.reduce((a, b) => a + b, 0) / arr.length;

const meanFive = average(fivePrincipalPicks);

boxplotResultsHplus.push({
  boxplotfivePrincipalPicks: boxplotfivePrincipalPicks,
  boxplotDistribution: boxplotDistribution,
  distributionMean: average(distribution),
  mean: meanFive,
  boxplotSpectra: boxplotSpectra,
  boxplotSpectraMean: average(statSpectra),
});
fs.writeFileSync(
  join(__dirname, '/model/model.json'),
  JSON.stringify(model),
  'utf8',
);
fs.writeFileSync(
  join(__dirname, '/model/statistics.json'),
  JSON.stringify(boxplotResultsHplus),
  'utf8',
);
*/
