import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { getFragmentableCyclicBonds } from '../getFragmentableCyclicBonds.js';

const { Molecule } = OCL;

describe('getFragmentableCyclicBonds', () => {
  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = getFragmentableCyclicBonds(molecule);
    //console.log(result);

    const moleculeTest1 = [
      { i: 0, bond: [1, 10, 11] },
      { i: 1, bond: [6, 7, 8, 9] },
      { i: 2, bond: [2, 3, 4, 5] },
    ];
    expect(result).toStrictEqual(moleculeTest1);
    const molecule2 = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result2 = getFragmentableCyclicBonds(molecule2);

    const moleculeTest2 = [
      { i: 0, bond: [3, 4, 5, 6, 7] },
      { i: 1, bond: [1, 2, 9, 10] },
    ];
    expect(result2).toStrictEqual(moleculeTest2);
    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
    const molecule3 = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 cycles (2 hexane & 2 heptane)
    const result3 = getFragmentableCyclicBonds(molecule3);
    const moleculeTest3 = [
      { i: 0, bond: [1, 2, 16, 17, 18] },
      { i: 1, bond: [3, 4, 5, 6] },
      { i: 2, bond: [11, 12, 13, 14] },
      { i: 3, bond: [7, 8, 9, 10] },
    ];
    expect(result3).toStrictEqual(moleculeTest3);
  });
});
