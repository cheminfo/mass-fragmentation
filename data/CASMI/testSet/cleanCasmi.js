import { readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import OCL from 'openchemlib';

const __dirname = dirname(fileURLToPath(import.meta.url));

const { Molecule } = OCL;

const fullSolutions = JSON.parse(
  readFileSync(`${__dirname}/solutionsChallenge.json`),
);
const fullDataSet = JSON.parse(
  readFileSync(`${__dirname}/spectraChallenge.json`),
);

let notUsableSolution = [];

for (let i = 0; i < fullSolutions.length; i++) {
  try {
    const smilesMoleculeTestSol = fullSolutions[i].smiles;
    Molecule.fromSmiles(smilesMoleculeTestSol);
  } catch (__java$exception) {
    notUsableSolution.push(fullSolutions[i].id);
    continue;
  }
}

let newTestSet = [];
let notUsableCandidates = [];
for (let i = 0; i < fullDataSet.length; i++) {
  for (let f = 0; f < fullDataSet[i].smiles.length; f++) {
    try {
      const smilesMoleculeTest = fullDataSet[i].smiles[f];
      Molecule.fromSmiles(smilesMoleculeTest);
    } catch (__java$exception) {
      notUsableCandidates.push(fullDataSet[i].smiles[f]);
      continue;
    }
  }
}

for (let i = 0; i < fullDataSet.length; i++) {
  if (notUsableSolution.indexOf(fullDataSet[i].id) === -1) {
    newTestSet.push({
      id: fullDataSet[i].id,
      x: fullDataSet[i].x,
      y: fullDataSet[i].y,
      smiles: [],
    });

    for (let f = 0; f < fullDataSet[i].smiles.length; f++) {
      if (
        notUsableCandidates.indexOf(fullDataSet[i].smiles[f]) === -1 &&
        f < 66
      ) {
        newTestSet[i].smiles.push(fullDataSet[i].smiles[f]);
      }
    }
  }
}

writeFileSync(
  join(__dirname, 'newdataset.json'),
  JSON.stringify(newTestSet),
  'utf8',
);
