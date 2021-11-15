import { Molecule } from 'openchemlib';

import { fragment } from '../fragment.js';

describe('fragment', () => {
  it('CCO', () => {
    const molecule = Molecule.fromSmiles('CCO');
    const result = fragment(molecule);
    console.log(result);
  });
});
