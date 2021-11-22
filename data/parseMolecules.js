// Imports
import { createReadStream, writeFileSync } from 'fs';
import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import OCL from 'openchemlib';
import { molecules } from 'sdf-parser';

// Import CID Spectra
const cidHigh = JSON.parse(await readFile('./hmdb/cidSpectra/cidHigh.json'));
const cidLow = JSON.parse(await readFile('./hmdb/cidSpectra/cidLow.json'));
const cidMed = JSON.parse(await readFile('./hmdb/cidSpectra/cidMed.json'));

// import structures form sdf file
const __dirname = dirname(fileURLToPath(import.meta.url));

const entries = [];

const stream = createReadStream(join(__dirname, 'hmdb/structures.sdf')).pipe(
  molecules(),
);

// convert structures in oclID and create variable with oclID and Database id
for await (let entry of stream) {
  const molecule = OCL.Molecule.fromMolfile(entry.molfile);
  entries.push({
    oclID: molecule.getIDCode(),
    id: entry.DATABASE_ID,
  });
}

// Get structures who were measured in CID and separate them in function of energy level
const cidLowStructures = [];
const cidMedStructures = [];
const cidHighStructures = [];
for (let i = 0; i < entries.length; i++) {
  for (let s = 0; s < cidLow.length; s++) {
    if (entries[i].id === cidLow[s].id) {
      cidLowStructures.push(entries[i]);
    }
  }
  for (let a = 0; a < cidMed.length; a++) {
    if (entries[i].id === cidMed[a].id) {
      cidMedStructures.push(entries[i]);
    }
  }
  for (let b = 0; b < cidHigh.length; b++) {
    if (entries[i].id === cidHigh[b].id) {
      cidHighStructures.push(entries[i]);
    }
  }
}

// Write 3 json files containing structures of each CID spectra in function of energy level
writeFileSync(
  join(__dirname, 'hmdb/molecules/cidLowStructures.json'),
  JSON.stringify(cidLowStructures),
  'utf8',
);

writeFileSync(
  join(__dirname, 'hmdb/molecules/cidMedStructures.json'),
  JSON.stringify(cidMedStructures),
  'utf8',
);
writeFileSync(
  join(__dirname, 'hmdb/molecules/cidHighStructures.json'),
  JSON.stringify(cidHighStructures),
  'utf8',
);
