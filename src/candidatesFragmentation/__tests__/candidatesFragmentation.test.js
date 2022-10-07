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
    expect(result[0]).toMatchCloseTo({
      contribution: 0,
      em: 116.04734411655001,
      hose: undefined,
      intensity: 100,
      mf: 'C5H8O3',
      mfs: [
        {
          atoms: { C: 5, H: 8, O: 3 },
          charge: 0,
          em: 116.04734411655001,
          ionization: {
            atoms: { H: 1 },
            charge: 1,
            em: 1.00782503223,
            mf: 'H+',
          },
          mf: 'C5H8O3',
          ms: {
            charge: 1,
            delta: -5.688709450168972e-7,
            em: 117.05462056887094,
            ionization: 'H+',
            ppm: -0.004859876032678206,
            target: { mass: 117.05462 },
          },
          mw: 116.11542028907729,
          parts: ['C5H8O3'],
          unsaturation: 2,
        },
      ],
      ms: 117.05462056887094,
      ppm: -0.004859876032678206,
    });
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
    expect(result[0]).toMatchCloseTo({
      contribution: 0,
      em: 208.15756327303,
      hose: undefined,
      intensity: 100,
      mf: 'C12H20N2O',
      mfs: [
        {
          atoms: { C: 12, H: 20, N: 2, O: 1 },
          charge: 0,
          em: 208.15756327303,
          ionization: {
            atoms: { H: 1 },
            charge: 1,
            em: 1.00782503223,
            mf: 'H+',
          },
          mf: 'C12H20N2O',
          ms: {
            charge: 1,
            delta: 0.0005502746490719801,
            em: 209.16483972535093,
            ionization: 'H+',
            ppm: 2.6308181135726816,
            target: { mass: 209.16539 },
          },
          mw: 208.30045718914837,
          parts: ['C12H20N2O'],
          unsaturation: 4,
        },
      ],
      ms: 209.16483972535093,
      ppm: 2.6308181135726816,
    });
  });
});
