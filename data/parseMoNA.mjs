import { writeFileSync, createReadStream } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import pkg from 'stream-json/streamers/StreamArray.js';
import pkg2 from 'train-test-split';

const trainTestSplit = pkg2;

const StreamArray = pkg;

const entries = [];
const jsonStream = StreamArray.withParser();
jsonStream.on('data', ({ key, value }) => {
  let meta = [];
  for (let i = 0; i < value.metaData.length; i++) {
    if (value.metaData[i].value === 'CID') {
      let fragmentationMode = value.metaData[i].value;

      const lines = value.spectrum.split(' ');

      const points = lines.map((line) => line.split(':').map(Number));

      const spectra = {
        x: points.map((point) => point[0]),
        y: points.map((point) => point[1]),
      };
      let molFile = value.compound[0].molFile;
      let smiles = [];

      let collisionEnergy = [];
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'collision energy') {
          let energy = value.metaData[j].value.toString().split(' ');

          if (energy[1] !== '%') {
            let energyResult = energy.map(Number);

            if (
              isNaN(energyResult[0]) === false &&
              Array.isArray(energyResult) &&
              energyResult.length > 0
            ) {
              collisionEnergy.push(energyResult[0]);
            }
          }
        }
      }
      for (let j = 0; j < value.compound[0].metaData.length; j++) {
        if (value.compound[0].metaData[j].name === 'SMILES') {
          smiles.push(value.compound[0].metaData[j].value);
        }
      }
      let pubchemCID = [];
      for (let j = 0; j < value.compound[0].metaData.length; j++) {
        if (value.compound[0].metaData[j].name === 'pubchem cid') {
          pubchemCID.push(value.compound[0].metaData[j].value);
        }
      }
      let precursorType = [];
      let precursorIon = [];
      let exactMass = [];
      let resolution = [];
      let instrumentType = [];
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'precursor type') {
          precursorType.push(value.metaData[j].value);
        }
      }
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'precursor m/z') {
          precursorIon.push(value.metaData[j].value);
        }
      }
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'exact mass') {
          exactMass.push(value.metaData[j].value);
        }
      }
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'resolution') {
          resolution.push(value.metaData[j].value);
        }
      }
      for (let j = 0; j < value.metaData.length; j++) {
        if (value.metaData[j].name === 'instrument type') {
          instrumentType.push(value.metaData[j].value);
        }
      }
      if (collisionEnergy.length > 0 && collisionEnergy[0] >= 0) {
        console.log(collisionEnergy);
        meta.push({
          fragmentationMode: fragmentationMode,
          spectrum: spectra,
          molFile: molFile,
          smiles: smiles[0],
          pubchemCID: pubchemCID[0],
          precursorIon: precursorIon[0],
          precursorType: precursorType[0],
          exactMass: exactMass[0],
          resolution: resolution[0],
          instrumentType: instrumentType[0],
          energyRamp: collisionEnergy[0],
        });
      }
    }
  }

  if (meta.length > 0) {
    entries.push(meta);
  }
});

jsonStream.on('end', () => {
  const [train, test] = trainTestSplit(entries, 0.99);
  writeFileSync(
    join(__dirname, 'monadb/trainingSet.json'),
    JSON.stringify(train),
    'utf8',
  );
  writeFileSync(
    join(__dirname, 'monadb/testSet.json'),
    JSON.stringify(test),
    'utf8',
  );
  console.log('All done');
});

const __dirname = dirname(fileURLToPath(import.meta.url));

// eslint-disable-next-line no-unused-vars
const stream = createReadStream(
  join(__dirname, '/monadb/MoNA-export-LC-MS-MS_Positive_Mode.json'),
).pipe(jsonStream.input);
