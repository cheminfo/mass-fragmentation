import OCL from 'openchemlib';

import { neutralLoss } from '../neutralLoss';

const { Molecule } = OCL;

describe('fragment', () => {
  it('NC(CCC(=O)O)CCC(O)C=O', () => {
    const molecule = Molecule.fromSmiles('NC(CCC(=O)O)CCC(O)C=O');
    const idCode = molecule.getIDCode();
    const result = neutralLoss(idCode);

    expect(result).toBe(
      'H0--2(H2O)0--1(H2COO)0--1(H2CO)0--1(NH3)0--1(HCN)0--0',
    );
  });
  it('CNC1CC(=O)CC(CN(C)C)C(C#N)C1', () => {
    const molecule = Molecule.fromSmiles('CNC1CC(=O)CC(CN(C)C)C(C#N)C1');
    const idCode = molecule.getIDCode();
    const result = neutralLoss(idCode);

    expect(result).toBe(
      'H0--2(H2O)0--0(H2COO)0--0(H2CO)0--0(NH3)0--0(HCN)0--1',
    );
  });
  it('O=CCCC(=O)CCCC(O)CCc1ccc(O)cc1', () => {
    const molecule = Molecule.fromSmiles('O=CCCC(=O)CCCC(O)CCc1ccc(O)cc1');
    const idCode = molecule.getIDCode();
    const result = neutralLoss(idCode);

    expect(result).toBe(
      'H0--2(H2O)0--2(H2COO)0--0(H2CO)0--1(NH3)0--0(HCN)0--0',
    );
  });
  it('CCCCCC(CC)CCC', () => {
    const molecule = Molecule.fromSmiles('CCCCCC(CC)CCC');
    const idCode = molecule.getIDCode();
    const result = neutralLoss(idCode);

    expect(result).toBe(
      'H0--2(H2O)0--0(H2COO)0--0(H2CO)0--0(NH3)0--0(HCN)0--0',
    );
  });
});
