import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { csvToObj } from 'csv-to-js-parser';

// Define constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = readdirSync(join(__dirname, 'spectra'));
let parsed = [];
for (let filename of dir) {
  let datas = readFileSync(join(__dirname, 'spectra', filename), 'utf8');
  let data = datas.split('\n').map((ln) => {
    return ln.split('\t');
  });

  let spectra = { id: [], x: [], y: [], smiles: [] };
  spectra.id.push(filename);
  let intensity = [];
  for (let i = 0; i < data.length; i++) {
    if (data[i].length > 1) {
      spectra.x.push(parseFloat(data[i][0]));
      intensity.push(parseFloat(data[i][1]));
    }
  }

  let maxInt = Math.max(...intensity);

  for (let j = 0; j < intensity.length; j++) {
    spectra.y.push(Math.round((intensity[j] / maxInt) * 100 * 10000) / 10000);
  }

  parsed.push(spectra);
}

const __dirname2 = dirname(fileURLToPath(import.meta.url));
const dir2 = readdirSync(join(__dirname2, 'structuresChallenge'));
const structureSmilesChallenge = [];
for (let filename of dir2) {
  let data2 = readFileSync(
    join(__dirname2, 'structuresChallenge', filename),
  ).toString();
  let data3 = csvToObj(data2, ',');
  let smiles = [];
  for (let i = 0; i < data3.length; i++) {
    smiles.push(data3[i].SMILES);
  }

  structureSmilesChallenge.push(smiles);
}

for (let p = 0; p < parsed.length; p++) {
  parsed[p].smiles = structureSmilesChallenge[p];
}

writeFileSync(
  join(__dirname, 'spectraChallenge.json'),
  JSON.stringify(parsed),
  'utf8',
);
