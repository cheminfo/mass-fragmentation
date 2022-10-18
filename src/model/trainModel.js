// resolution of 3.5 ppm

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { xSum } from 'ml-spectra-processing';

import { candidatesFragmentation } from '../candidatesFragmentation/candidatesFragmentation.js';

const __dirname = new URL('.', import.meta.url).pathname;
export async function trainModel(options) {
  let testSet = JSON.parse(
    readFileSync(
      join(__dirname, '/dataSpectra/casmi_2016_training/trainingSet.json'),
      'utf8',
    ),
  );
  let model = [];
  let debugResults = [];
  for (let entry of testSet) {
    let spectra = { x: entry.x, y: entry.y };
    let idCode = entry.idCode;
    let result = await candidatesFragmentation(spectra, idCode, options);
    let debugResult = {
      spectrum: spectra,
      ionization: options.ionization,
      precision: options.precision,
      idCode,
      bonds: result,
    };
    debugResults.push(debugResult);

    for (let fragment of result) {
      if (fragment.idHose !== 'none') {
        let index = model.findIndex((x) => x.idHose === fragment.idHose);
        if (index === -1) {
          fragment.fragmentsUsed = 1;
          model.push(fragment);
        } else {
          //check if array
          if (!Array.isArray(model[index].contribution)) {
            model[index].contribution = [model[index].contribution];
          }
          model[index].fragmentsUsed++;
          model[index].contribution.push(fragment.contribution);
        }
      }
    }
    for (let fragment of model) {
      if (Array.isArray(fragment.contribution)) {
        if (fragment.contribution.length > 2) {
          // create a function to calculate the median value of an array
          fragment.contribution = median(fragment.contribution);
        } else if (fragment.contribution.length === 2) {
          fragment.contribution =
            xSum(fragment.contribution) / fragment.contribution.length;
        } else if (fragment.contribution.length === 1) {
          fragment.contribution = fragment.contribution[0];
        }
      }
    }
  }

  writeFileSync(
    join(__dirname, '/dataSpectra/model.json'),
    JSON.stringify(model),
  );
  writeFileSync(
    join(__dirname, '/dataSpectra/debugResults.json'),
    JSON.stringify(debugResults),
  );
}
export function median(array) {
  array.sort((a, b) => a - b);
  let mid = Math.floor(array.length / 2);
  return array.length % 2 !== 0
    ? array[mid]
    : (array[mid - 1] + array[mid]) / 2;
}
const options = { precision: 3.5, ionization: 'H+', limit: 1e7 };

await trainModel(options);
