import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { getCyclesAndBondsInfo } from '../getCyclesAndBondsInfo.js';

const { Molecule } = OCL;

describe('getCyclesAndBondsInfo', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // butane
    const result = getCyclesAndBondsInfo(molecule);
    //console.log(result);

    expect(result).toStrictEqual([]);
  });
  it('C1CC1', () => {
    const molecule = Molecule.fromSmiles('C1CC1'); // butane
    const result = getCyclesAndBondsInfo(molecule);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1 },
          { bond: 1, nbCycles: 1 },
          { bond: 2, nbCycles: 1 },
        ],
      },
    ]);
  });
  it.only('c1ccccc1', () => {
    const molecule = Molecule.fromSmiles('c1ccccc1'); // benzene
    const result = getCyclesAndBondsInfo(molecule);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1 },
          { bond: 1, nbCycles: 1 },
          { bond: 2, nbCycles: 1 },
        ],
      },
    ]);
  });
  it.only('c1ccncc1', () => {
    const molecule = Molecule.fromSmiles('c1ccncc1'); // benzene
    const result = getCyclesAndBondsInfo(molecule);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1 },
          { bond: 1, nbCycles: 1 },
          { bond: 2, nbCycles: 1 },
        ],
      },
    ]);
  });

  it.only('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = getCyclesAndBondsInfo(molecule);
    //console.log(result);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1 },
          { bond: 1, nbCycles: 1 },
          { bond: 13, nbCycles: 2 },
          { bond: 12, nbCycles: 2 },
          { bond: 10, nbCycles: 1 },
          { bond: 11, nbCycles: 1 },
        ],
      },
      {
        bonds: [
          { bond: 6, nbCycles: 1 },
          { bond: 7, nbCycles: 1 },
          { bond: 8, nbCycles: 1 },
          { bond: 9, nbCycles: 1 },
          { bond: 12, nbCycles: 2 },
          { bond: 14, nbCycles: 2 },
        ],
      },
      {
        bonds: [
          { bond: 2, nbCycles: 1 },
          { bond: 3, nbCycles: 1 },
          { bond: 4, nbCycles: 1 },
          { bond: 5, nbCycles: 1 },
          { bond: 14, nbCycles: 2 },
          { bond: 13, nbCycles: 2 },
        ],
      },
    ]);
  });
  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result2 = getCyclesAndBondsInfo(molecule);

    const moleculeTest2 = [
      { i: 0, bond: [3, 4, 5, 6, 7] },
      { i: 1, bond: [1, 2, 9, 10] },
    ];
    expect(result2).toStrictEqual(moleculeTest2);
    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
  });
  it('C2CCC1CCCC3CCCC4CCCC1', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 cycles (2 hexane & 2 heptane)
    const result3 = getCyclesAndBondsInfo(molecule);
    const moleculeTest3 = [
      { i: 0, bond: [1, 2, 16, 17, 18] },
      { i: 1, bond: [3, 4, 5, 6] },
      { i: 2, bond: [11, 12, 13, 14] },
      { i: 3, bond: [7, 8, 9, 10] },
    ];
    expect(result3).toStrictEqual(moleculeTest3);
  });
});
