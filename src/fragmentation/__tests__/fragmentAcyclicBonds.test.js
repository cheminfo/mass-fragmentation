import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { fragmentAcyclicBonds } from '../fragmentAcyclicBonds.js';

const { Molecule } = OCL;

describe('fragmentAcyclicBonds', () => {
  it('CCO', () => {
    const molecule = Molecule.fromSmiles('CCCCO');
    const result = fragmentAcyclicBonds(molecule);
    let testResult = [];
    for (let i = 0; i < result.length; i++) {
      testResult[i] = {
        mf: result[i].mf,
        monoisotopicMass: result[i].mfInfo.monoisotopicMass,
        idCode: result[i].idCode,
      };
    }

    const fragmentationButanol = [
      { mf: 'CH3', monoisotopicMass: 15.02347509669, idCode: 'eFBAYc@@' },
      { mf: 'C3H7O', monoisotopicMass: 59.04968984518, idCode: 'gJQHBEeIVj@@' },
      { mf: 'C2H5', monoisotopicMass: 29.03912516115, idCode: 'eMBAYRZ@' },
      { mf: 'C2H5O', monoisotopicMass: 45.03403978072, idCode: 'gCaHLEeIZ`@' },
      { mf: 'C3H7', monoisotopicMass: 43.05477522561, idCode: 'gC`H@liKT@@' },
      { mf: 'CH3O', monoisotopicMass: 31.01838971626, idCode: 'eMJDVTf`@' },
      { mf: 'C4H9', monoisotopicMass: 57.07042529007, idCode: 'gJPH@liJuP@' },
      { mf: 'HO', monoisotopicMass: 17.0027396518, idCode: 'eFJHVXp@' },
    ];

    expect(testResult).toStrictEqual(fragmentationButanol);
  });
});
