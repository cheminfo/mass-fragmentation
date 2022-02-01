// Imports
import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import OCL from 'openchemlib';
import pkg from 'stream-json/streamers/StreamArray.js';

import { bondContribution } from '../bondContribution.js';
import { fragmentAcyclicBonds } from '../fragmentation/fragmentAcyclicBonds.js';

// Import CID Spectra

// import structures form sdf file
const { createReadStream, writeFileSync } = fs;
const StreamArray = pkg;

const { Molecule } = OCL;
const __dirname = dirname(fileURLToPath(import.meta.url));
const model = JSON.parse(
  fs.readFileSync('/home/ricardo/mass-fragmentation/src/training/model.json'),
);

const entries = [];
const jsonStream = StreamArray.withParser();
jsonStream.on('data', ({ value }) => {
  //Fragmentation Part
  const smilesMoleculeTest = value[0].smiles;
  const molecule = Molecule.fromSmiles(smilesMoleculeTest);
  const resultFragmentation = fragmentAcyclicBonds(molecule);
  let fragmentsResult = [];
  for (let j = 0; j < resultFragmentation.length; j++) {
    let fragment = resultFragmentation[j].hose.hoses;
    for (let s = 0; s < fragment.length; s++) {
      for (let l = 0; l < model.length; l++) {
        for (let n = 0; n < model[l].length; n++) {
          let arr = model[l][n].hoseCode[s].oclID;
          let results = Object.values(arr).filter(function filtre(entry) {
            return entry === fragment[s];
          });
          if (results.length > 0) {
            fragmentsResult.push(resultFragmentation[j].mfInfo);
          }
        }
      }
    }
  }
  console.log(fragmentsResult);
});

jsonStream.on('end', () => {
  // eslint-disable-next-line no-console
  console.log('All done');
});

createReadStream(
  join('/home/ricardo/mass-fragmentation/data/monadb/testSet.json'),
).pipe(jsonStream.input);
