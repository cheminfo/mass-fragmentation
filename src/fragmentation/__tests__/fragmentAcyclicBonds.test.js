import OCL from 'openchemlib';

import { fragmentAcyclicBonds } from '../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCCCO', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // for some reason tostrictEqual has problems with: 'eMHAIhNFhF`QR\\Ji\\Jh'
    const result = fragmentAcyclicBonds(molecule);
    expect(result).toStrictEqual([
      {
        atomMap: [0],
        hose: [
          {
            atoms: [],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'dH' },
              { sphere: 1, oclID: 'dH' },
              { sphere: 2, oclID: 'dH' },
            ],
            length: -1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
              { sphere: 2, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
            ],
            length: 1,
          },
        ],
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
        code: 'B',
      },
      {
        atomMap: [0],
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 2, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 2, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
            ],
            length: 1,
          },
        ],
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
        code: 'D',
      },
      {
        atomMap: [0],
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
              { sphere: 2, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'dH' },
              { sphere: 1, oclID: 'dH' },
              { sphere: 2, oclID: 'dH' },
            ],
            length: -1,
          },
        ],
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
        code: 'F',
      },
    ]);
  });
  it('c3ccc(CCCC2CCC1CCCCC1C2)cc3', () => {
    const molecule = Molecule.fromSmiles('c3ccc(CCCC2CCC1CCCCC1C2)cc3');
    const result = fragmentAcyclicBonds(molecule);

    expect(result).toStrictEqual([
      {
        atomMap: [0],
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@H`\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@Di@@xPhIP_hdCaUQpj`' },
              { sphere: 2, oclID: 'gFp@DiTt@@CaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
              { sphere: 2, oclID: 'gC`@Dkj@xPhIP_hdCaUQpj`' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@H`\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@Di@@xPhIP_hdCaUQpj`' },
              { sphere: 2, oclID: 'gFp@DiTt@@CaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'eM@HzCaJBhOtTGBjgBj@' },
              { sphere: 2, oclID: 'gJP@DkjhCaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@H`\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@Di@@xPhIP_hdCaUQpj`' },
              { sphere: 2, oclID: 'gFp@DiTt@@CaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@H}PGBEAJC}D`\\JjNET' },
              { sphere: 2, oclID: 'gGP@Djvj`NDJBTGzI@xUT\\Jh' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@H`\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@Di@@xPhIP_hdCaUQpj`' },
              { sphere: 2, oclID: 'gFp@DiTt@@CaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
        hose: [
          {
            atoms: [0, 1],
            from: 0,
            to: 1,
            torsion: undefined,
            hoses: [
              { sphere: 0, oclID: 'eF@Hp\\IPUA~b`xUTxUP' },
              { sphere: 1, oclID: 'gC`@Dij@xPhIP_hdCaUQpj`' },
              { sphere: 2, oclID: 'gFp@DiTvjhCaB`eA~bPNEUGBj@' },
            ],
            length: 1,
          },
        ],
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
