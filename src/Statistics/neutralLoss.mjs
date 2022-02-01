import OCL from 'openchemlib';

export function neutralLoss(fragmentIDCodeAndMass) {
  // let fragmentMassesResult = [];

  // const fragment = OCL.Molecule.fromIDCode(fragmentationResult);

  const neutrals = [
    {
      label: 'OH',
      idCode: 'eFHBLGtP',
      loss: 'H2O',
      mass: 18.0106,
    },
    {
      label: 'NH2',
      idCode: 'eF`BLGtX`',
      loss: 'NH3',
      mass: 17.0266,
    },
    {
      label: 'COOH',
      idCode: 'gC``@dfZ@~b`',
      loss: 'HCOOH',
      mass: 46.0055,
    },
    {
      label: 'CN',
      idCode: 'eM`AIx@',
      loss: 'HCN',
      mass: 27.0109,
    },
    {
      label: 'COH',
      idCode: 'eMHAIXOj`',
      loss: 'CH2O',
      mass: 30.0106,
    },
  ];

  for (let neutral of neutrals) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
  }

  const results = [];
  const ssSearcher = new OCL.SSSearcher();
  for (let i = 0; i < fragmentIDCodeAndMass.length; i++) {
    const molecule = OCL.Molecule.fromIDCode(fragmentIDCodeAndMass[i].idCode);
    ssSearcher.setMolecule(molecule);
    const result = {};

    for (const neutral of neutrals) {
      result.idCode = fragmentIDCodeAndMass[i].idCode;

      ssSearcher.setFragment(neutral.fragment);

      if (ssSearcher.isFragmentInMolecule() === true) {
        result.monoisotopicMassProtonated =
          fragmentIDCodeAndMass[i].monoisotopicMass + 1.0078;
        result.monoisotopicMassDoubleProtonated =
          fragmentIDCodeAndMass[i].monoisotopicMass + 1.0078 * 2;
        result.nLType = neutral.label;
        result.nL = true;
        result.monoisotopicMass =
          fragmentIDCodeAndMass[i].monoisotopicMass - neutral.mass + 1.0078;
      } else {
        result.nLType = 'just added H+';
        result.nL = false;
        result.monoisotopicMass =
          fragmentIDCodeAndMass[i].monoisotopicMass + 1.0078;
      }
    }
    results.push(result);
  }
  return results;
}

// once test are finished you need to add the hosecode to neutralLossResult
