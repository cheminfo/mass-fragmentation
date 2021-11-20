// imports

import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { parse } from 'arraybuffer-xml-parser';

// Define constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const cidLow = [];
const cidMed = [];
const cidHigh = [];
const dir = readdirSync(join(__dirname, 'hmdb/mass')).slice(0, 32);

// for loop to parse masses
for (let filename of dir) {
  const data = readFileSync(join(__dirname, 'hmdb/mass', filename));
  const parsed = parse(data)['ms-ms'];
  // Extract useful data from parsed constant
  const masses = [];
  const id = parsed['database-id'];
  const level = parsed['collision-energy-level'];
  const mode = parsed['ionization-mode'];
  const energy = parsed['collision-energy-voltage'];

  const peaks = parsed['ms-ms-peaks']['ms-ms-peak'].map((entry) => {
    return {
      mz: entry['mass-charge'],
      intensity: entry.intensity,
    };
  });
  masses.push({
    id,
    peaks,
    level,
    mode,
    energy,
  });

// Extract CID Spectra and separate them in function of energy level (low,medium,high)
  for (let i = 0; i < masses.length; i++) {
    if (masses[i].level === 'low') {
      cidLow.push(masses[i]);
    }
    if (masses[i].level === 'med') {
      cidMed.push(masses[i]);
    }
    if (masses[i].level === 'high') {
      cidHigh.push(masses[i]);
    }
  }
}

// Write 3 json files containing CID spectra for low, medium and high energy level
writeFileSync(
  join(__dirname, 'hmdb/cidSpectra/cidLow.json'),
  JSON.stringify(cidLow),
  'utf8',
);

writeFileSync(
  join(__dirname, 'hmdb/cidSpectra/cidMed.json'),
  JSON.stringify(cidMed),
  'utf8',
);

writeFileSync(
  join(__dirname, 'hmdb/cidSpectra/cidHigh.json'),
  JSON.stringify(cidHigh),
  'utf8',
);
