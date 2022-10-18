import OCL from 'openchemlib';

import { getFragmentableCycleBonds } from '../getFragmentableCycleBonds.js';

const { Molecule } = OCL;

describe('getFragmentableCycleBonds', () => {
  it('C1CC2CCCC3CCCC(C1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = getFragmentableCycleBonds(molecule);
    expect(result).toStrictEqual([
      {
        fragmentation: [
          [0, 10],
          [1, 10],
          [1, 11],
        ],
      },
      {
        fragmentation: [
          [6, 8],
          [6, 9],
          [7, 9],
        ],
      },
      {
        fragmentation: [
          [2, 4],
          [2, 5],
          [3, 5],
        ],
      },
    ]);
  });
  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result = getFragmentableCycleBonds(molecule);

    expect(result).toStrictEqual([
      {
        fragmentation: [
          [3, 5],
          [3, 6],
          [3, 7],
          [4, 6],
          [4, 7],
          [5, 7],
        ],
      },
      {
        fragmentation: [
          [0, 2],
          [0, 9],
          [1, 9],
          [1, 10],
          [2, 9],
          [2, 10],
        ],
      },
    ]);
  });
  it('c1ccccc1', () => {
    const molecule = Molecule.fromSmiles('c1ccccc1'); // benzene
    const result = getFragmentableCycleBonds(molecule);

    expect(result).toStrictEqual([{ fragmentation: [] }]);
  });
});
