import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { fragmentCyclicBonds } from '../fragmentCyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCC13CCCC2CCCC(CCC1)C23', () => {
    const molecule = Molecule.fromSmiles('CCC13CCCC2CCCC(CCC1)C23');
    const result = fragmentCyclicBonds(molecule);
  });
});

// final molecule for tests: 'CCC13CCCC2CCCC(CCC1)C23'
