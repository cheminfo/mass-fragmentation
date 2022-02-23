import { toMatchCloseTo } from 'jest-matcher-deep-close-to';

import fullSolutions from '../../../data/CASMI/testSet/solutionsChallenge.json';
import fullDataSet from '../../../data/CASMI/testSet/spectraChallenge.json';
import model from '../../training/model/model.json';
import { testModel } from '../testModel.js';

const dataSet = fullDataSet.slice(0, 1);

const solutions = fullSolutions.slice(0, 10);

expect.extend({ toMatchCloseTo });

describe('fragment', () => {
  it('Casmi', async () => {
    const result = await testModel(dataSet, solutions, model);

    expect(result).toBeDefined();
  });
});
