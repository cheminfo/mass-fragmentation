import OCL from 'openchemlib';

import { nbOH } from '/home/ricardo/Desktop/openchemUti/openchemlib-utils/src/util/nbOH';
import { nbCOOH } from '/home/ricardo/Desktop/openchemUti/openchemlib-utils/src/util/nbCOOH';
import { nbCHO } from '/home/ricardo/Desktop/openchemUti/openchemlib-utils/src/util/nbCHO';
import { nbCN } from '/home/ricardo/Desktop/openchemUti/openchemlib-utils/src/util/nbCN';
import { nbNH2 } from '/home/ricardo/Desktop/openchemUti/openchemlib-utils/src/util/nbNH2';

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
  /*const groupOH = [{ idCode: 'eFHBLGrQP' }];
  const groupNH = [{ idCode: 'eF`BLGtX' }];
  const groupCOOH = [{ idCode: 'gC``@dfZ@~b`' }];
  const groupCN = [{ idCode: 'eF`BN@' }];
  const groupCHO = [{ idCode: 'eMHAIXOj`' }];*/

  const neutralLossesFragment = [];
  const ssSearcher = new OCL.SSSearcher();

  let combW = [];
  let combNH = [];
  let combCOOH = [];
  let combCHO = [];
  let combCN = [];
  let countW = 0;
  let countNH = 0;
  let countCOOH = 0;
  let countCHO = 0;
  let countCN = 0;

  const molecule = OCL.Molecule.fromIDCode(fragmentIDCode);
  ssSearcher.setMolecule(molecule);

  for (const neutral of neutralLossWater) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
    ssSearcher.setFragment(neutral.fragment);

    if (ssSearcher.isFragmentInMolecule() === true) {
      countW += 1;
    }
  }
  for (const neutral of neutralLossNH3) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
    ssSearcher.setFragment(neutral.fragment);

    if (ssSearcher.isFragmentInMolecule() === true) {
      countNH += 1;
    }
  }
  for (const neutral of neutralLossCOOH) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
    ssSearcher.setFragment(neutral.fragment);

    if (ssSearcher.isFragmentInMolecule() === true) {
      countCOOH += 1;
    }
  }
  for (const neutral of neutralLossCHO) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
    ssSearcher.setFragment(neutral.fragment);

    if (ssSearcher.isFragmentInMolecule() === true) {
      countCHO += 1;
    }
  }
  for (const neutral of neutralLossCN) {
    neutral.fragment = OCL.Molecule.fromIDCode(neutral.idCode);
    ssSearcher.setFragment(neutral.fragment);

    if (ssSearcher.isFragmentInMolecule() === true) {
      countCN += 1;
    }
  }

  for (let i = 1; i < countW + 1; i++) {
    combW.push(`(H2O)-${i}`);
  }
  for (let i = 1; i < countNH + 1; i++) {
    combNH.push(`(NH3)-${i}`);
  }
  for (let i = 1; i < countCOOH + 1; i++) {
    combCOOH.push(`(COOH2)-${i}`);
  }
  for (let i = 1; i < countCHO + 1; i++) {
    combCHO.push(`(CH2O)-${i}`);
  }
  for (let i = 1; i < countCN + 1; i++) {
    combCN.push(`(HCN)-${i}`);
  }

  let combinationNLs = combW.concat(combNH, combCHO, combCN, combCOOH);
  //console.log(combinationNLs);
  let combAll = [];
  for (let i = 0; i < combinationNLs.length; i++) {
    for (let j = i + 1; j < combinationNLs.length + 1; j++) {
      combAll.push('H-1, , '.concat(combinationNLs.slice(i, j)));
    }
  }
  // for(let i=0; i < combAll.length)

  neutralLossesFragment.push(
    `H-1,(H2O)-${countW},(NH3)-${countNH},(COOH2)-${countCOOH},(CH2O)-${countCHO},(HCN)-${countCN},`,
  );

  return neutralLossesFragment;
}
