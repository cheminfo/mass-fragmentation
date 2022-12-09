import OCL from 'openchemlib';

import { parallelFragment } from '../parallelFragment.js';

const { Molecule } = OCL;

describe('fragment', () => {
  it('CC', async () => {
    const molecule = [
      Molecule.fromSmiles('CC'),
      Molecule.fromSmiles('CCC'),
      Molecule.fromSmiles('C1CCC1'),
      Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'),
      Molecule.fromSmiles('CCCCCC(CC)CCC'),
    ]; // just ring

    const results = await parallelFragment(molecule, {
      calculateHoseCodes: true,
    });
    expect(results).toMatchSnapshot();
  });
});
