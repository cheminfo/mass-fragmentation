import OCL from 'openchemlib';
import { nbOH, nbCOOH, nbCHO, nbCN, nbNH2 } from 'openchemlib-utils';

export function neutralLoss(fragmentIDCode) {
  const neutralLossWater = [
    { idCode: 'gCa@@dmPGrDZ@' },
    { idCode: 'gCa@@dmPGvDJM@' },
    { idCode: 'gCa@@dlpd_dHt@' },
    { idCode: 'didH@@RYWZZ@B`@~pHzA`' },
    { idCode: 'didH@@rJIJFf`@h@OlBN`X@' },
    { idCode: 'didH@@RYeVz@``@~pHjA` ' },
  ];

  const neutralLossNH3 = [
    { idCode: 'gCh@@dmPGrFJ@' },
    { idCode: 'gCh@@dmPGrFZ@' },
    { idCode: 'gCh@@dlpdodLt@' },
    { idCode: 'dif@@@RYWZZ@B`@~pLzA`' },
    { idCode: 'dif@@@RYeVz@``@~pLjA`' },
    { idCode: 'dif@@@rJIJFf`@h@OlCN`X@' },
  ];

  const neutralLossCOOH = [
    { idCode: 'gJP`@dfvhCyJC@' },
    { idCode: 'gJP`@dfvhCyJM@' },
    { idCode: 'dmtD@@QInUwaZ@B`@~qHfE`' },
    { idCode: 'dmtD@@SHihdh^Eh@J@C{DbXV@' },
    { idCode: 'dmtD@@QInYTYZ@``@~qHzE`' },
  ];

  const neutralLossCHO = [
    { idCode: 'gCa@@dkPGrdZ@' },
    { idCode: 'gCa@@dkPGrdJ@' },
    { idCode: 'deTH@@RVYWaXBB@C{Hahf@' },
    { idCode: 'deTH@@rIQIPms@AP@_YDCDp' },
    { idCode: 'deTH@@RVUunX@J@C{H`Xf@' },
  ];

  const neutralLossCN = [
    { idCode: 'gCh@@doPGtt@' },
    { idCode: 'deV@@@RVUunx@J@CyAbX@' },
    { idCode: 'deV@@@rIQIPmw@AP@_HLS@' },
    { idCode: 'deV@@@RVYWaxBB@CyFbX@' },
    { idCode: 'gCh@@doPGtT@' },
    { idCode: 'gCh@@doPGrTZ@' },
  ];

  const ssSearcher = new OCL.SSSearcher();

  const molecule = OCL.Molecule.fromIDCode(fragmentIDCode);
  ssSearcher.setMolecule(molecule);

  let lossH2O = false;
  let lossH2COOH = false;
  let lossNH3 = false;
  let lossH2CO = false;
  let lossHCN = false;

  const numbOH = nbOH(molecule);
  const numbCOOH = nbCOOH(molecule);
  const numbCHO = nbCHO(molecule);
  const numbNH2 = nbNH2(molecule);
  const numbCN = nbCN(molecule);

  if (numbOH > 0) {
    for (const neutral of neutralLossWater) {
      neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
      ssSearcher.setFragment(neutral.fragment);

      if (ssSearcher.isFragmentInMolecule() === true) {
        lossH2O = true;
      }
    }
  }
  if (numbNH2 > 0) {
    for (const neutral of neutralLossNH3) {
      neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
      ssSearcher.setFragment(neutral.fragment);

      if (ssSearcher.isFragmentInMolecule() === true) {
        lossNH3 = true;
      }
    }
  }
  if (numbCOOH > 0) {
    for (const neutral of neutralLossCOOH) {
      neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
      ssSearcher.setFragment(neutral.fragment);

      if (ssSearcher.isFragmentInMolecule() === true) {
        lossH2COOH = true;
      }
    }
  }
  if (numbCHO > 0) {
    for (const neutral of neutralLossCHO) {
      neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
      ssSearcher.setFragment(neutral.fragment);

      if (ssSearcher.isFragmentInMolecule() === true) {
        lossH2CO = true;
      }
    }
  }
  if (numbCN > 0) {
    for (const neutral of neutralLossCN) {
      neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
      ssSearcher.setFragment(neutral.fragment);
      if (ssSearcher.isFragmentInMolecule() === true) {
        lossHCN = true;
      }
    }
  }
  const neutralLossesFragment = `H0--2`;
  let resultH2O = [];
  let resultH2COO = [];
  let resultH2CO = [];
  let resultNH3 = [];
  let resultHCN = [];

  if (lossH2O) {
    resultH2O.push(`(H2O)0--${numbOH}`);
  } else {
    resultH2O.push(`(H2O)0--0`);
  }
  if (lossH2COOH) {
    resultH2COO.push(`(H2COO)0--${numbCOOH}`);
  } else {
    resultH2COO.push(`(H2COO)0--0`);
  }

  if (lossNH3) {
    resultNH3.push(`(NH3)0--${numbNH2}`);
  } else {
    resultNH3.push(`(NH3)0--0`);
  }
  if (lossH2CO) {
    resultH2CO.push(`(H2CO)0--${numbCHO}`);
  } else {
    resultH2CO.push(`(H2CO)0--0`);
  }
  if (lossHCN) {
    resultHCN.push(`(HCN)0--${numbCN}`);
  } else {
    resultHCN.push(`(HCN)0--0`);
  }

  const result = neutralLossesFragment.concat(
    resultH2O[0],
    resultH2COO[0],
    resultH2CO[0],
    resultNH3[0],
    resultHCN[0],
  );

  return result;
}
