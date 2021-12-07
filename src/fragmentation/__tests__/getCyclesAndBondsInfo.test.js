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
          { bond: 0, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 1, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 2, nbCycles: 1, bondOrder: 1, isAromatic: false },
        ],
      },
    ]);
  });
  it('c1ccncc1', () => {
    const molecule = Molecule.fromSmiles('c1ccncc1'); // benzene
    const result = getCyclesAndBondsInfo(molecule);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1, bondOrder: 2, isAromatic: true },
          { bond: 1, nbCycles: 1, bondOrder: 1, isAromatic: true },
          { bond: 2, nbCycles: 1, bondOrder: 2, isAromatic: true },
          { bond: 3, nbCycles: 1, bondOrder: 1, isAromatic: true },
          { bond: 4, nbCycles: 1, bondOrder: 2, isAromatic: true },
          { bond: 5, nbCycles: 1, bondOrder: 1, isAromatic: true },
        ],
      },
    ]);
  });
  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = getCyclesAndBondsInfo(molecule);
    //console.log(result);

    expect(result).toStrictEqual([
      {
        bonds: [
          { bond: 0, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 1, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 13, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 12, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 10, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 11, nbCycles: 1, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 6, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 7, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 8, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 9, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 12, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 14, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 2, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 3, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 4, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 5, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 14, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 13, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
    ]);
  });
  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result2 = getCyclesAndBondsInfo(molecule);

    const moleculeTest2 = [
      {
        bonds: [
          { bond: 3, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 4, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 5, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 6, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 7, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 8, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 0, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 1, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 2, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 8, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 9, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 10, nbCycles: 1, bondOrder: 1, isAromatic: false },
        ],
      },
    ];
    expect(result2).toStrictEqual(moleculeTest2);
    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
  });
  it('C2CCC1CCCC3CCCC4CCCC1', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 cycles (2 hexane & 2 heptane)
    const result3 = getCyclesAndBondsInfo(molecule);
    const moleculeTest3 = [
      {
        bonds: [
          { bond: 0, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 1, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 2, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 15, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 16, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 17, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 18, nbCycles: 1, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 3, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 4, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 5, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 6, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 20, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 19, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 15, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 11, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 12, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 13, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 14, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 19, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 21, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
      {
        bonds: [
          { bond: 7, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 8, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 9, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 10, nbCycles: 1, bondOrder: 1, isAromatic: false },
          { bond: 21, nbCycles: 2, bondOrder: 1, isAromatic: false },
          { bond: 20, nbCycles: 2, bondOrder: 1, isAromatic: false },
        ],
      },
    ];
    expect(result3).toStrictEqual(moleculeTest3);
  });
});
