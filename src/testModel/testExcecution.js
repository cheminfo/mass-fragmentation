import * as fs from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import { testModel } from './testModel.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const fullSolutions = JSON.parse(
  fs.readFileSync(
    `${__dirname}/../../data/CASMI/testSet/solutionsChallenge.json`,
  ),
);
const fullDataSet = JSON.parse(
  fs.readFileSync(`${__dirname}/../../data/CASMI/testSet/newdataset.json`),
);

const model = JSON.parse(
  fs.readFileSync(`${__dirname}/../training/model/model.json`),
);

const dataSet = fullDataSet;

const solutions = fullSolutions;
const result = await testModel(dataSet, solutions, model);

fs.writeFileSync(
  join(__dirname, '../resultswithscores.json'),
  JSON.stringify(result),
  'utf8',
);
