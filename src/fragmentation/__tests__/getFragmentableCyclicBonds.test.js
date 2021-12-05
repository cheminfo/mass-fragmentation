import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { getFragmentableCyclicBonds } from '../getFragmentableCyclicBonds.js';

const { Molecule } = OCL;

describe('getFragmentableCyclicBonds', () => {
  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('CCC13CCCC2CCCC(CCC1)C23'); //3 cyclohexane connected
    const result = getFragmentableCyclicBonds(molecule);
    const moleculeTest1 = [
      { i: 2 },
      { i: 3 },
      { i: 4 },
      { i: 5 },
      { i: 6 },
      { i: 7 },
      { i: 8 },
      { i: 9 },
      { i: 10 },
      { i: 11 },
      { i: 12 },
      { i: 13 },
    ];
    expect(result).toStrictEqual(moleculeTest1);

    const molecule2 = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result2 = getFragmentableCyclicBonds(molecule2);

    const moleculeTest2 = [
      { i: 0 },
      { i: 1 },
      { i: 2 },
      { i: 3 },
      { i: 4 },
      { i: 5 },
      { i: 6 },
      { i: 7 },
      { i: 9 },
      { i: 10 },
    ];
    expect(result2).toStrictEqual(moleculeTest2);
    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
    const molecule3 = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 cycles (2 hexane & 2 heptane)
    const result3 = getFragmentableCyclicBonds(molecule3);
    const moleculeTest3 = [
      { i: 0 },
      { i: 1 },
      { i: 2 },
      { i: 3 },
      { i: 4 },
      { i: 5 },
      { i: 6 },
      { i: 7 },
      { i: 8 },
      { i: 9 },
      { i: 10 },
      { i: 11 },
      { i: 12 },
      { i: 13 },
      { i: 14 },
      { i: 16 },
      { i: 17 },
      { i: 18 },
    ];
    expect(result3).toStrictEqual(moleculeTest3);
  });
});
