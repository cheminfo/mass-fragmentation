import OCL from 'openchemlib';

import { fragmentCyclicBonds } from '../../fragmentCyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentCyclicBonds', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // butane
    const result = fragmentCyclicBonds(molecule);

    expect(result).toStrictEqual([]);
  });
  it('C1CC1', () => {
    const molecule = Molecule.fromSmiles('C1CC1'); // butane
    const result = fragmentCyclicBonds(molecule);
    expect(result).toStrictEqual([]);
  });

  it('c1ccncc1', () => {
    const molecule = Molecule.fromSmiles('c1ccncc1'); // benzene
    const result = fragmentCyclicBonds(molecule);

    expect(result).toStrictEqual([]);
  });

  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('C1CC2CCCC3CCCC(C1)C23'); //3 cyclohexane connected
    const result = fragmentCyclicBonds(molecule);

    expect(result).toMatchSnapshot();
  });

  it('C2CCC1CCCCC1C2', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCCC1C2'); //2 cyclohexane
    const result = fragmentCyclicBonds(molecule);
    expect(result).toMatchSnapshot();

    // Bug: getRingSet do not reconise rings with less than 6 carbons and with more than 7
  });
  it('C2CCC1CCCC3CCCC4CCCC1', () => {
    const molecule = Molecule.fromSmiles('C2CCC1CCCC3CCCC4CCCC1(CC2)C34'); //4 cycles (2 hexane & 2 heptane)
    const result = fragmentCyclicBonds(molecule);

    expect(result).toMatchSnapshot();
  });
});
