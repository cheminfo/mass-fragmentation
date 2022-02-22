import { xBoxPlot, xyMedian } from 'ml-spectra-processing';
import OCL from 'openchemlib';

import { candidatesFragmentation } from '../candidatesFragmentation/candidatesFragmentation.js';

const { Molecule } = OCL;

export async function testModel(dataSet, solutions, model) {
  let top1Score = [0, 0, 0, 0, 0];
  let top5Score = [0, 0, 0, 0, 0];
  let top10Score = [0, 0, 0, 0, 0];

  for (let i = 0; i < dataSet.length; i++) {
    let rankCandidatesScore = [];
    let rankCandidatesIDCode = [];
    const experimentalSpectrum = {
      x: dataSet[i].x,
      y: dataSet[i].y,
    };

    for (let f = 0; f < dataSet[i].smiles.length; f++) {
      try {
        const smilesMoleculeTest = dataSet[i].smiles[f];
        const options = { precision: 5, ionization: 'H+' };
        const fragmentsResult = await candidatesFragmentation(
          experimentalSpectrum,
          smilesMoleculeTest,
          options,
        );

        let resultModelContribution = [];
        for (let h = 0; h < fragmentsResult.length; h++) {
          if (fragmentsResult[h].hose !== undefined) {
            let hosesFromFragmentation = fragmentsResult[h].hose;
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

        let medianContribution = xyMedian(
          resultModelContribution.sort((a, b) => b - a),
        );
        let massOfMatchedFragments = [];
        let intensityOfMatchedFragments = [];

        for (let o = 0; o < fragmentsResult.length; o++) {
          massOfMatchedFragments.push(fragmentsResult[o][0].ms);
          intensityOfMatchedFragments.push(fragmentsResult[o][0].intensity);
        }

        let weigthFactors = 0;
        for (let w = 0; w < massOfMatchedFragments.length; w++) {
          weigthFactors +=
            intensityOfMatchedFragments[w] ** 0.6 *
            massOfMatchedFragments[w] ** 0.3;
        }

        let finalScore = weigthFactors + medianContribution;
        if (isNaN(finalScore) === false) {
          let candidateIDCode =
            Molecule.fromSmiles(smilesMoleculeTest).getIDCode();
          rankCandidatesIDCode.push(candidateIDCode);
          rankCandidatesScore.push(finalScore);
        }
      } catch (__java$exception) {
        continue;
      }
    }
    if (rankCandidatesIDCode.length > 0) {
      let rankCandidates = { idCode: [], score: [] };
      for (let r = 0; r < rankCandidatesScore.length; r++) {
        rankCandidates.idCode.push(rankCandidatesIDCode[r]);
        rankCandidates.score.push(rankCandidatesScore[r]);
      }

      let rank = rankCandidates.score.slice().sort((a, b) => b - a);

      let finalRanking = { idCode: [], score: [] };
      for (let r = 0; r < rank.length; r++) {
        for (let s = 0; s < rankCandidates.score.length; s++) {
          if (rank[r] === rankCandidates.score[s]) {
            finalRanking.idCode.push(rankCandidates.idCode[s]);
            finalRanking.score.push(rank[r]);
          }
        }
      }
      let top1 = {
        idCode: finalRanking.idCode.slice(0, 1),
        score: finalRanking.score.slice(0, 1),
      };

      let top5 = {
        idCode: finalRanking.idCode.slice(0, 5),
        score: finalRanking.score.slice(0, 5),
      };
      let top10 = {
        idCode: finalRanking.idCode.slice(0, 10),
        score: finalRanking.score.slice(0, 10),
      };
      let solutionIDCode = Molecule.fromSmiles(solutions[i].smiles).getIDCode();

      if (solutionIDCode === top1.idCode) {
        top1Score.push(1);
      }
      if (solutionIDCode !== top1.idCode) {
        top1Score.push(0);
      }
      for (let r = 0; r < top5.smiles.length; r++) {
        if (solutionIDCode === top5.idCode[r]) {
          top5Score.push(1);
        }
        if (solutionIDCode !== top5.idCode[r]) {
          top5Score.push(0);
        }
      }
      for (let r = 0; r < top10.smiles.length; r++) {
        if (solutionIDCode === top10.idCode[r]) {
          top10Score.push(1);
        }
        if (solutionIDCode !== top10.idCode[r]) {
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
  /*
  fs.writeFileSync(
    join('../resultsTestModel.json'),
    JSON.stringify(resultsBoxplot),
    'utf8',
  );*/
  return resultsBoxplot;
}
