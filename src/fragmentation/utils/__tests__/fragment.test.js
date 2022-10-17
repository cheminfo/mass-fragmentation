import OCL from 'openchemlib';

import { fragment } from '../../fragment.js';

const { Molecule } = OCL;

describe('fragment', () => {
  it('CCCCC2CCC1C(CC)CC(=O)CC1C2', () => {
    const molecule = Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'); //3 cyclohexane connected
    const result = fragment(molecule);
    expect(result).toMatchSnapshot();
  });
  it('C1CCC1', () => {
    const molecule = Molecule.fromSmiles('C1CCC1'); // just cycle
    const result = fragment(molecule);
    expect(result).toMatchSnapshot();
  });
  it('CCCCCC(CC)CCC', () => {
    const molecule = Molecule.fromSmiles('CCCCCC(CC)CCC'); // just cycle
    const result = fragment(molecule);
    expect(result).toMatchSnapshot();
  });
  it('noMolecule', () => {
    const molecule = Molecule.fromSmiles('');
    const result = fragment(molecule);
    expect(result).toMatchSnapshot();
  });
});
