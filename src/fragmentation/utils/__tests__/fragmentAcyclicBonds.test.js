import OCL from 'openchemlib';

import { fragmentAcyclicBonds } from '../../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCCC', () => {
    const molecule = Molecule.fromSmiles('CCCC'); // for some reason tostrictEqual has problems with: 'eMHAIhNFhF`QR\\Ji\\Jh'
    const result = fragmentAcyclicBonds(molecule);

    expect(result).toStrictEqual([
      {
        mf: 'C4H10',
        idCode: 'gC`@Dij@@',
        mfInfo: {
          mass: 58.12235112749877,
          monoisotopicMass: 58.0782503223,
          charge: 0,
          mf: 'C4H10',
          atoms: { C: 4, H: 10 },
          unsaturation: 0,
        },
        fragmentType: 'Molecular Ion',
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'eM@HzCaJBhOIewzJCaUSaU@',
            'gC`@Dkj@xPhIP^pr\\l\x7FQHGBjcaU@',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [0],
        smiles: 'C',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'eM@HzCaJBhOIewzJCaUSaU@',
            'gC`@Dkj@xPhIP^pr\\l\x7FQHGBjcaU@',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [1],
        smiles: 'CCC',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gC`@Dij@XPhIP_hdCaUQpj`',
            'gC`@Dij@XPhIP_hdCaUQpj`',
            'gC`@Dij@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [0],
        smiles: 'CC',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gC`@Dij@XPhIP_hdCaUQpj`',
            'gC`@Dij@XPhIP_hdCaUQpj`',
            'gC`@Dij@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [2],
        smiles: 'CC',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'eM@HzCaJBhOIewzJCaUSaU@',
            'gC`@Dkj@xPhIP^pr\\l\x7FQHGBjcaU@',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [0],
        smiles: 'CCC',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'eM@HzCaJBhOIewzJCaUSaU@',
            'gC`@Dkj@xPhIP^pr\\l\x7FQHGBjcaU@',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
            'gC`@Dkj@XPhIP_hdCaUQpj`',
          ],
        },
        atomMap: [3],
        smiles: 'C',
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
      },
    ]);
  });
  it('c3ccc(CCCC2CCC1CCCCC1C2)cc3', () => {
    const molecule = Molecule.fromSmiles('c3ccc(CCCC2CCC1CCCCC1C2)cc3');
    const result = fragmentAcyclicBonds(molecule);

    expect(result).toStrictEqual([
      {
        mf: 'C19H28',
        idCode: 'flu@@@DjU_YVuirshiBBJjjjJ@@',
        mfInfo: {
          mass: 256.4263231515315,
          monoisotopicMass: 256.21910090244,
          charge: 0,
          mf: 'C19H28',
          atoms: { C: 19, H: 28 },
          unsaturation: 6,
        },
        fragmentType: 'Molecular Ion',
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gJP@DjXHCaB`eAzSOtRApjhxUP',
            'dax@@DjUXHH@xPJBJCqQbQdEgzH`NEUCaU@',
            'deT@@DjUWXXHH`@xPJBJCwQbQdEePt]gzH`NEUCaU@',
            'dcL@@DjUWya``bh@NDB`b`}LXdYAYTMGXLSGzH`NEUCaU@',
          ],
        },
        atomMap: [0],
        smiles: 'C1(=CC=CC=C1)',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gJP@DjXHCaB`eAzSOtRApjhxUP',
            'dax@@DjUXHH@xPJBJCqQbQdEgzH`NEUCaU@',
            'deT@@DjUWXXHH`@xPJBJCwQbQdEePt]gzH`NEUCaU@',
            'dcL@@DjUWya``bh@NDB`b`}LXdYAYTMGXLSGzH`NEUCaU@',
          ],
        },
        atomMap: [4],
        smiles: 'CCCC2(CCC1(CCCCC1C2))',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gNp@DiYjB@xPhIP^prYl\x7FQHGBjcaU@',
            'dmT@@DiYUj``h@xPJBJCsAdYfEEPt_hb@xUTNET',
            'dg\\@@DiYUgQvhHJJ@Ca@hHhOJFQfXTUCQtCDxn_hb@xUTNET',
          ],
        },
        atomMap: [0],
        smiles: 'C1(=CC=C(C)C=C1)',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gNp@DiYjB@xPhIP^prYl\x7FQHGBjcaU@',
            'dmT@@DiYUj``h@xPJBJCsAdYfEEPt_hb@xUTNET',
            'dg\\@@DiYUgQvhHJJ@Ca@hHhOJFQfXTUCQtCDxn_hb@xUTNET',
          ],
        },
        atomMap: [5],
        smiles: 'CCC2(CCC1(CCCCC1C2))',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gNp@DiYjj@xPhIP^HrXhv_hdCaUQpj`',
            'dmT@@DiYUjjj@@xPJBJCsAdXdYaYV_hb@xUTNET',
            'do|@@DiYUft]jjhJBQJNHCa@hHhOJFQbQfEeYtCdpl_hb@xUTNET',
          ],
        },
        atomMap: [0],
        smiles: 'C1(=CC=C(CC)C=C1)',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gC`@Dij@xPhIP^PrY~bPNEUGBj@',
            'gNp@DiYjj@xPhIP^HrXhv_hdCaUQpj`',
            'dmT@@DiYUjjj@@xPJBJCsAdXdYaYV_hb@xUTNET',
            'do|@@DiYUft]jjhJBQJNHCa@hHhOJFQbQfEeYtCdpl_hb@xUTNET',
          ],
        },
        atomMap: [6],
        smiles: 'CC2(CCC1(CCCCC1C2))',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gJP@DjZhCaB`eAyBIgzI@xUT\\Jh',
            'dax@@DjUZjh@xPJBJCuADXfYaY~bHCaUPxUP',
            'dmt@@DjUVvFjjjdBbb@xPJBJCpaDXfYaYTMgY~bHCaUPxUP',
            'do|@@DjUVuYajjjjBpJJHD`NDB`b`|hQFIfXVUCYvCDy~bHCaUPxUP',
          ],
        },
        atomMap: [0],
        smiles: 'C1(=CC=C(CCC)C=C1)',
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
      },
      {
        hose: {
          bond1: [
            'eF@Hp\\IPUA~b`xUTxUP',
            'gJP@DjZhCaB`eAyBIgzI@xUT\\Jh',
            'dax@@DjUZjh@xPJBJCuADXfYaY~bHCaUPxUP',
            'dmt@@DjUVvFjjjdBbb@xPJBJCpaDXfYaYTMgY~bHCaUPxUP',
            'do|@@DjUVuYajjjjBpJJHD`NDB`b`|hQFIfXVUCYvCDy~bHCaUPxUP',
          ],
        },
        atomMap: [7],
        smiles: 'C2(CCC1(CCCCC1C2))',
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
      },
    ]);
  });
});
