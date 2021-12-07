import OCL from 'openchemlib';

import { fragmentAcyclicBonds } from '../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCCCO', () => {
    const molecule = Molecule.fromSmiles('CCCCO');
    const result = fragmentAcyclicBonds(molecule);
    expect(result).toStrictEqual([
      {
        atomMap: [0],
        mf: 'CH3',
        idCode: 'eFBAYc@@',
        mfInfo: {
          mass: 15.03455815890258,
          monoisotopicMass: 15.02347509669,
          charge: 0,
          mf: 'CH3',
          atoms: { C: 1, H: 3 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'A',
      },
      {
        atomMap: [1],
        mf: 'C3H7O',
        idCode: 'gJQHBEeIVj@@',
        mfInfo: {
          mass: 59.08719789291446,
          monoisotopicMass: 59.04968984518,
          charge: 0,
          mf: 'C3H7O',
          atoms: { C: 3, H: 7, O: 1 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'B',
      },
      {
        atomMap: [0],
        mf: 'C2H5',
        idCode: 'eMBAYRZ@',
        mfInfo: {
          mass: 29.061175563749384,
          monoisotopicMass: 29.03912516115,
          charge: 0,
          mf: 'C2H5',
          atoms: { C: 2, H: 5 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'C',
      },
      {
        atomMap: [2],
        mf: 'C2H5O',
        idCode: 'gCaHLEeIZ`@',
        mfInfo: {
          mass: 45.06058048806766,
          monoisotopicMass: 45.03403978072,
          charge: 0,
          mf: 'C2H5O',
          atoms: { C: 2, H: 5, O: 1 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'D',
      },
      {
        atomMap: [0],
        mf: 'C3H7',
        idCode: 'gC`H@liKT@@',
        mfInfo: {
          mass: 43.08779296859618,
          monoisotopicMass: 43.05477522561,
          charge: 0,
          mf: 'C3H7',
          atoms: { C: 3, H: 7 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'E',
      },
      {
        atomMap: [3],
        mf: 'CH3O',
        idCode: 'eMJDVTf`@',
        mfInfo: {
          mass: 31.033963083220858,
          monoisotopicMass: 31.01838971626,
          charge: 0,
          mf: 'CH3O',
          atoms: { C: 1, H: 3, O: 1 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'F',
      },
      {
        atomMap: [0],
        mf: 'C4H9',
        idCode: 'gJPH@liJuP@',
        mfInfo: {
          mass: 57.114410373442986,
          monoisotopicMass: 57.07042529007,
          charge: 0,
          mf: 'C4H9',
          atoms: { C: 4, H: 9 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'G',
      },
      {
        atomMap: [4],
        mf: 'HO',
        idCode: 'eFJHVXp@',
        mfInfo: {
          mass: 17.007345678374055,
          monoisotopicMass: 17.0027396518,
          charge: 0,
          mf: 'HO',
          atoms: { H: 1, O: 1 },
          unsaturation: 0.5,
        },
        fragmentType: 'acyclic',
        code: 'H',
      },
    ]);
  });
  it('c3ccc(CCCC2CCC1CCCCC1C2)cc3', () => {
    const molecule = Molecule.fromSmiles('c3ccc(CCCC2CCC1CCCCC1C2)cc3');
    const result = fragmentAcyclicBonds(molecule);
    expect(result).toStrictEqual([
      {
        atomMap: [0],
        mf: 'C6H6',
        idCode: 'gFp@DiTt@@@',
        mfInfo: {
          mass: 78.11205990474615,
          monoisotopicMass: 78.04695019338,
          charge: 0,
          mf: 'C6H6',
          atoms: { C: 6, H: 6 },
          unsaturation: 4,
        },
        fragmentType: 'acyclic',
        code: 'A',
      },
      {
        atomMap: [4],
        mf: 'C13H23',
        idCode: 'dg|@`@VTeVUmQd{jjjjj@@',
        mfInfo: {
          mass: 179.3222040008411,
          monoisotopicMass: 179.17997574129,
          charge: 0,
          mf: 'C13H23',
          atoms: { C: 13, H: 23 },
          unsaturation: 2.5,
        },
        fragmentType: 'acyclic',
        code: 'B',
      },
      {
        atomMap: [0],
        mf: 'C7H8',
        idCode: 'gOp@DjWkB@@@',
        mfInfo: {
          mass: 92.13867730959296,
          monoisotopicMass: 92.06260025784,
          charge: 0,
          mf: 'C7H8',
          atoms: { C: 7, H: 8 },
          unsaturation: 4,
        },
        fragmentType: 'acyclic',
        code: 'C',
      },
      {
        atomMap: [5],
        mf: 'C12H21',
        idCode: 'dk\\@`@VTeYVux]Njjjj`@',
        mfInfo: {
          mass: 165.2955865959943,
          monoisotopicMass: 165.16432567683,
          charge: 0,
          mf: 'C12H21',
          atoms: { C: 12, H: 21 },
          unsaturation: 2.5,
        },
        fragmentType: 'acyclic',
        code: 'D',
      },
      {
        atomMap: [0],
        mf: 'C8H10',
        idCode: 'daD@@DjUZxHH@@',
        mfInfo: {
          mass: 106.16529471443975,
          monoisotopicMass: 106.0782503223,
          charge: 0,
          mf: 'C8H10',
          atoms: { C: 8, H: 10 },
          unsaturation: 4,
        },
        fragmentType: 'acyclic',
        code: 'E',
      },
      {
        atomMap: [6],
        mf: 'C11H19',
        idCode: 'dcl@`@VTee[UnWZjjjh@@',
        mfInfo: {
          mass: 151.2689691911475,
          monoisotopicMass: 151.14867561237,
          charge: 0,
          mf: 'C11H19',
          atoms: { C: 11, H: 19 },
          unsaturation: 2.5,
        },
        fragmentType: 'acyclic',
        code: 'F',
      },
      {
        atomMap: [0],
        mf: 'C9H12',
        idCode: 'did@@DjU^nBBH@@',
        mfInfo: {
          mass: 120.19191211928656,
          monoisotopicMass: 120.09390038676,
          charge: 0,
          mf: 'C9H12',
          atoms: { C: 9, H: 12 },
          unsaturation: 4,
        },
        fragmentType: 'acyclic',
        code: 'G',
      },
      {
        atomMap: [7],
        mf: 'C10H17',
        idCode: 'dmL@`@VTfUmZZUjjjj@@',
        mfInfo: {
          mass: 137.2423517863007,
          monoisotopicMass: 137.13302554791,
          charge: 0,
          mf: 'C10H17',
          atoms: { C: 10, H: 17 },
          unsaturation: 2.5,
        },
        fragmentType: 'acyclic',
        code: 'H',
      },
    ]);
  });
});
