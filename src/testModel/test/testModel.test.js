import * as fs from 'fs';

import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { testModel } from '../testModel.js';

const dataSet = JSON.parse(
  fs.readFileSync(
    '/home/ricardo/mass-fragmentation/data/CASMI/testSet/spectraChallenge.json',
  ),
).slice(0, 1);

const solutions = JSON.parse(
  fs.readFileSync(
    '/home/ricardo/mass-fragmentation/data/CASMI/testSet/solutionsChallenge.json',
  ),
).slice(0, 10);
const model = JSON.parse(
  fs.readFileSync(
    '/home/ricardo/mass-fragmentation/src/training/model/model.json',
  ),
);

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('fragment', () => {
  it.only('Casmi', async () => {
    const result = await testModel(dataSet, solutions, model);
    console.log(result);
    expect(result).toMatchCloseTo();
  });
});
