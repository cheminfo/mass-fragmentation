// resolution of 3.5 ppm

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { candidatesFragmentation } from '../candidatesFragmentation/candidatesFragmentation.js';

const __dirname = new URL('.', import.meta.url).pathname;
export async function createModel(options) {
  let testSet = JSON.parse(
    readFileSync(
      join(__dirname, '/dataSpectra/casmi_2016_training/trainingSet.json'),
      'utf8',
    ),
  );
  let model = [];
  let start = Date.now();
  let counter = 0;
  for (let entry of testSet) {
    let spectra = { x: entry.x, y: entry.y };
    let idCode = entry.idCode;
    let result = await candidatesFragmentation(spectra, idCode, options);
    counter++;
    if (Date.now() - start > 10000) {
      //console.log(counter);
      start = Date.now();
    }
    result.forEach((fragment) => {
      // get the neutralLoss of the fragment and add it to the model
      let neutralLoss = [];
      fragment.matches[0].forEach((match) => {
        if (match?.neutralLoss !== 'none') {
          neutralLoss = neutralLoss.concat(match.neutralLoss);
        }
      });
      if (fragment.hoses !== 'none') {
        if (
          model[fragment.hoses[3]] ||
          model[fragment.hoses[2]] ||
          model[fragment.hoses[1]] ||
          model[fragment.hoses[0]]
        ) {
          if (model[fragment.hoses[3]]) {
            model[fragment.hoses[3]].data.contribution.push(
              fragment.contribution,
            );
            if (neutralLoss.length > 0) {
              // push it as string and not as array
              neutralLoss.forEach((loss) => {
                if (!model[fragment.hoses[3]].data.neutralLoss) {
                  model[fragment.hoses[3]].data.neutralLoss = [];
                }
                if (!model[fragment.hoses[3]].data.neutralLoss.includes(loss)) {
                  model[fragment.hoses[3]].data.neutralLoss.push(loss);
                }
              });
            }
          }
          if (model[fragment.hoses[2]]) {
            model[fragment.hoses[2]].data.contribution.push(
              fragment.contribution,
            );
            if (neutralLoss.length > 0) {
              neutralLoss.forEach((loss) => {
                if (!model[fragment.hoses[2]].data.neutralLoss) {
                  model[fragment.hoses[2]].data.neutralLoss = [];
                }
                if (!model[fragment.hoses[2]].data.neutralLoss.includes(loss)) {
                  model[fragment.hoses[2]].data.neutralLoss.push(loss);
                }
              });
            }
          }
          if (model[fragment.hoses[1]]) {
            model[fragment.hoses[1]].data.contribution.push(
              fragment.contribution,
            );
            if (neutralLoss.length > 0) {
              neutralLoss.forEach((loss) => {
                if (!model[fragment.hoses[1]].data.neutralLoss) {
                  model[fragment.hoses[1]].data.neutralLoss = [];
                }
                if (!model[fragment.hoses[1]].data.neutralLoss.includes(loss)) {
                  model[fragment.hoses[1]].data.neutralLoss.push(loss);
                }
              });
            }
          }
          if (model[fragment.hoses[0]]) {
            model[fragment.hoses[0]].data.contribution.push(
              fragment.contribution,
            );
            if (neutralLoss.length > 0) {
              neutralLoss.forEach((loss) => {
                if (!model[fragment.hoses[0]].data.neutralLoss) {
                  model[fragment.hoses[0]].data.neutralLoss = [];
                }
                if (!model[fragment.hoses[0]].data.neutralLoss.includes(loss)) {
                  model[fragment.hoses[0]].data.neutralLoss.push(loss);
                }
              });
            }
          }
        } else {
          model.push({
            _id: fragment.hoses[3],
            data: {
              contribution: [fragment.contribution],
              sphereFour: fragment.hoses[3],
              sphereThree: fragment.hoses[2],
              sphereTwo: fragment.hoses[1],
              sphereOne: fragment.hoses[0],
              neutralLoss: neutralLoss.length > 0 ? neutralLoss : [],
            },
          });
          model.push({
            _id: fragment.hoses[2],
            data: {
              contribution: [fragment.contribution],
              sphereThree: fragment.hoses[2],
              sphereTwo: fragment.hoses[1],
              sphereOne: fragment.hoses[0],
              neutralLoss: neutralLoss.length > 0 ? neutralLoss : [],
            },
          });
          model.push({
            _id: fragment.hoses[1],
            data: {
              contribution: [fragment.contribution],
              sphereTwo: fragment.hoses[1],
              sphereOne: fragment.hoses[0],
              neutralLoss: neutralLoss.length > 0 ? neutralLoss : [],
            },
          });
          model.push({
            _id: fragment.hoses[0],
            data: {
              contribution: [fragment.contribution],
              sphereOne: fragment.hoses[0],
              neutralLoss: neutralLoss.length > 0 ? neutralLoss : [],
            },
          });
        }
      }
    });
  }
  for (let entry of model) {
    entry.data.contribution = median(entry.data.contribution);
  }

  writeFileSync(
    join(__dirname, '/dataSpectra/modelnew.json'),
    JSON.stringify(model),
  );
}
export function median(array) {
  array.sort((a, b) => a - b);
  let mid = Math.floor(array.length / 2);
  return array.length % 2 !== 0
    ? array[mid]
    : (array[mid - 1] + array[mid]) / 2;
}

const options = {
  precision: 3.5,
  ionization: 'H+',
  limit: 1e7,
  calculateHoseCodes: true,
};

await createModel(options);
