import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { candidatesFragmentation } from '../candidatesFragmentation.js';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('fragment', () => {
  it('CC(=O)CCC(=O)O', async () => {
    const spectrum = {
      x: [
        15.02348, 42.01056, 46.00548, 59.0133, 57.03404, 71.04968, 101.02386,
        117.05462,
      ],
      y: [50, 80, 40, 20, 60, 20, 30, 100],
    };
    const smiles = 'CC(=O)CCC(=O)O';
    const options = { precision: 15, ionization: 'H+', limit: 1e7 };
    const result = await candidatesFragmentation(spectrum, smiles, options);
    expect(result).toMatchSnapshot();
  });
  it('CC(N)C1CCC(CC#N)C(CC=O)C1', async () => {
    const spectrum = {
      x: [
        45.05785, 71.04969, 143.13101, 165.11536, 193.14666, 194.14191,
        209.16539,
      ],
      y: [50, 80, 40, 20, 60, 20, 100],
    };
    const smiles = 'CC(N)C1CCC(CC#N)C(CC=O)C1';
    const options = { precision: 15, ionization: 'H+', limit: 1e7 };
    const result = await candidatesFragmentation(spectrum, smiles, options);
    expect(result).toMatchSnapshot();
  });
});
