import { readdirSync, readFileSync, writeFileSync, readFile } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
// Define constants
const __dirname = dirname(fileURLToPath(import.meta.url));
const dir = readdirSync(join(__dirname, 'Spectra'));
let parsed = [];
for (let filename of dir) {
  let datas = readFileSync(join(__dirname, 'Spectra', filename), 'utf8');
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

let dataStr = JSON.parse(readFileSync(join(__dirname, 'structure.json')));

let structure = [];
for (let s = 0; s < dataStr.length; s++) {
  let smiles = dataStr[s].SMILES;
  structure.push(smiles);
}

for (let p = 0; p < parsed.length; p++) {
  parsed[p].smiles = structure[p];
}

writeFileSync(join(__dirname, 'spectra.json'), JSON.stringify(parsed), 'utf8');
