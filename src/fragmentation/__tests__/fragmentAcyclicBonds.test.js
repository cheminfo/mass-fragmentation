import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { fragmentAcyclicBonds } from '../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCO', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const result = fragmentAcyclicBonds(molecule);
    console.log(result);
  });
});
