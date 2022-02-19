import { writeFileSync, createReadStream, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'stream-json/streamers/StreamArray.js';
import pkg2 from 'train-test-split';

const StreamArray = pkg;

const __dirname = dirname(fileURLToPath(import.meta.url));

const dataSet = JSON.parse(readFileSync(`${__dirname}/monadb/testSet.json`));

const entries = [];
const jsonStream = StreamArray.withParser();
let challenge = [];
for (let t = 0; t < dataSet.length; t++) {
  let originalMF = dataSet[t][0].mf;

  jsonStream.on('data', ({ key, value }) => {
    let smiles = [];

    for (let j = 0; j < value.compound[0].metaData.length; j++) {
      if (value.compound[0].metaData[j].name === 'molecular formula') {
        let mf = value.compound[0].metaData[j].value;
        if (mf === originalMF) {
          for (let r = 0; r < value.compound[0].metaData.length; r++) {
            if (
              value.compound[0].metaData[r].name === 'SMILES' &&
              value.compound[0].metaData[r].value !== dataSet[t][0].smiles
            ) {
              smiles.push(value.compound[0].metaData[r].value);
            }
          }
        }
      }
    }
    console.log(key);
    //console.log(precursorIon, closest);

    if (smiles.length > 0) {
      let uniq = [...new Set(smiles)];
      let res = { mf: [originalMF], smiles: uniq };

      entries.push(res);
    }
  });
}

jsonStream.on('end', () => {
  challenge.push(entries);
  // console.log('All done');
});

writeFileSync(
  join(__dirname, 'monadb/structuresChallenge.json'),
  JSON.stringify(challenge),
  'utf8',
);

// eslint-disable-next-line no-unused-vars
const stream = createReadStream(
  join(__dirname, '/monadb/MoNA-export-LC-MS-MS_Positive_Mode.json'),
).pipe(jsonStream.input);
