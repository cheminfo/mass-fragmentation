import { xMedian } from 'ml-spectra-processing';
import OCL from 'openchemlib';

import { candidatesFragmentation } from '../candidatesFragmentation/candidatesFragmentation.js';

const { Molecule } = OCL;

export async function testModel(dataSet, solutions, model) {
  let rankingSolutions = [
    { position: 20, nbCandidates: 65 },
    { position: 12, nbCandidates: 66 },
    { position: 6, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 4, nbCandidates: 66 },
    { position: 13, nbCandidates: 66 },
    { position: 10, nbCandidates: 66 },
    { position: 22, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 5, nbCandidates: 66 },
    { position: 1, nbCandidates: 62 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 61 },
    { position: 1, nbCandidates: 66 },
    { position: 6, nbCandidates: 65 },
    { position: 10, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 8, nbCandidates: 50 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 4, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 6, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 39 },
    { position: 6, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 14, nbCandidates: 66 },
    { position: 3, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 25, nbCandidates: 66 },
    { position: 49, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 19 },
    { position: 1, nbCandidates: 65 },
    { position: 37, nbCandidates: 66 },
    { position: 1, nbCandidates: 65 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 4, nbCandidates: 66 },
    { position: 11, nbCandidates: 66 },
    { position: 14, nbCandidates: 62 },
    { position: 2, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 6, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 1, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 3, nbCandidates: 66 },
    { position: 2, nbCandidates: 66 },
    { position: 48, nbCandidates: 66 },
  ];
  for (let i = 63; i < dataSet.length; i++) {
    // eslint-disable-next-line no-console
    console.log(i);
    let rankCandidatesScore = [];
    let rankCandidatesIDCode = [];
    const experimentalSpectrum = {
      x: dataSet[i].x,
      y: dataSet[i].y,
    };

    for (let f = 0; f < dataSet[i].smiles.length; f++) {
      const smilesMoleculeTest = dataSet[i].smiles[f];
      let candidateIDCode = Molecule.fromSmiles(smilesMoleculeTest).getIDCode();

      const options = { precision: 5, ionization: 'H+' };
      const fragmentsResult = await candidatesFragmentation(
        experimentalSpectrum,
        smilesMoleculeTest,
        options,
      );

      let resultModelContribution = [];
      for (let h = 0; h < fragmentsResult.length; h++) {
        if (fragmentsResult[h][0].hose !== undefined) {
          let hosesFromFragmentation = fragmentsResult[h][0].hose;
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
      let medianContribution = 0;
      if (resultModelContribution.length > 0) {
        medianContribution += xMedian(resultModelContribution);
      }
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
      if (!isNaN(finalScore)) {
        rankCandidatesScore.push(finalScore);
        rankCandidatesIDCode.push(candidateIDCode);
      }
      if (isNaN(finalScore)) {
        rankCandidatesScore.push(weigthFactors);
        rankCandidatesIDCode.push(candidateIDCode);
      }
    }
    if (rankCandidatesIDCode.length > 0) {
      let rankCandidates = [];
      for (let r = 0; r < rankCandidatesScore.length; r++) {
        rankCandidates.push({
          idCode: [rankCandidatesIDCode[r]],
          score: [rankCandidatesScore[r]],
        });
      }

      let rank = rankCandidates.sort((a, b) => b.score[0] - a.score[0]);

      let finalRanking = { idCode: [], score: [] };

      for (let r = 0; r < rank.length; r++) {
        finalRanking.idCode.push(rank[r].idCode[0]);
        finalRanking.score.push(rank[r].score[0]);
      }

      let solutionIDCode = Molecule.fromSmiles(solutions[i].smiles).getIDCode();
      let positionSolution = finalRanking.idCode.indexOf(solutionIDCode);
      let positionResult = [];
      if (positionSolution !== -1) {
        positionResult.push(positionSolution + 1);
      }

      if (positionSolution === -1) {
        positionResult.push('Not in dataset');
      }

      let result = {
        position: positionResult[0],
        nbCandidates: dataSet[i].smiles.length,
      };
      rankingSolutions.push(result);
    }

    // console.log(rankingSolutions);
  }

  return rankingSolutions;
}
