import sum from 'ml-array-sum';
import OCL from 'openchemlib';

import { candidatesFragmentation } from '../candidatesFragmentation/candidatesFragmentation.js';
/**
 * This function performs the in-silico fragmentation of n structures candidate for a experimental spectrum
 * @param {object} dataSet object containing experimental spectra and n candidate structures Smiles
 * @param {object} solutions Smiles correct structure
 * @param {object} model object containing HOSE-Contribution model
 * @returns {object} object containing the ranking of correct structure and the number of candidates
 */

const { Molecule } = OCL;

export async function testModel(dataSet, solutions, model) {
  let rankingSolutions = [];
  for (let i = 0; i < dataSet.length; i++) {
    let rankCandidatesScore = [];
    let rankCandidatesIDCode = [];
    const experimentalSpectrum = {
      x: dataSet[i].x,
      y: dataSet[i].y,
    };

    for (let f = 0; f < dataSet[i].smiles.length; f++) {
      const smilesMoleculeTest = dataSet[i].smiles[f];
      let candidateIDCode = Molecule.fromSmiles(smilesMoleculeTest).getIDCode();
// in-silico fragmentation
      const options = { precision: 5, ionization: 'H+' };
      const fragmentsResult = await candidatesFragmentation(
        experimentalSpectrum,
        smilesMoleculeTest,
        options,
      );
// Search for matching on model
      let resultModelContribution = [0];
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
      // contribution factor
      let sumContribution = sum(resultModelContribution);
      let massOfMatchedFragments = [];
      let intensityOfMatchedFragments = [];

      for (let o = 0; o < fragmentsResult.length; o++) {
        massOfMatchedFragments.push(fragmentsResult[o][0].ms);
        intensityOfMatchedFragments.push(fragmentsResult[o][0].intensity);
      }
      // Weigth factor
      let weigthFactors = 0;
      for (let w = 0; w < massOfMatchedFragments.length; w++) {
        weigthFactors +=
          intensityOfMatchedFragments[w] ** 0.6 *
          massOfMatchedFragments[w] ** 0.3;
      }
      // final score
      let finalScore = weigthFactors + sumContribution;
      if (!isNaN(finalScore)) {
        rankCandidatesScore.push(finalScore);
        rankCandidatesIDCode.push(candidateIDCode);
      }
      if (isNaN(finalScore)) {
        rankCandidatesScore.push(0);
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
      // Ranking of candidates
      let rank = rankCandidates.sort((a, b) => b.score[0] - a.score[0]);

      let finalRanking = { idCode: [], score: [] };

      for (let r = 0; r < rank.length; r++) {
        finalRanking.idCode.push(rank[r].idCode[0]);
        finalRanking.score.push(rank[r].score[0]);
      }

      let solutionIDCode = Molecule.fromSmiles(solutions[i].smiles).getIDCode();
      let positionSolution = finalRanking.idCode.indexOf(solutionIDCode);

      let positionResult = 0;
      if (positionSolution !== -1) {
        positionResult += +1;
      }
      let count = (input, arr) => arr.filter((x) => x === input).length;

      let truePosition = count(
        finalRanking.score[positionSolution],
        finalRanking.score,
      );

      let finalPosition = [];

      if (count(finalRanking.score[positionSolution], finalRanking.score) > 1) {
        finalPosition.push(positionResult + truePosition - 1);
      }
      if (
        count(finalRanking.score[positionSolution], finalRanking.score) === 1
      ) {
        finalPosition.push(positionResult);
      }

      let result = {
        position: finalPosition[0],
        nbCandidates: dataSet[i].smiles.length,
      };
      rankingSolutions.push(result);
    }
  }

  return rankingSolutions;
}
