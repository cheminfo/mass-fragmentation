import MassTools from 'mass-tools';
import { getMF, getHoseCodesForAtoms } from 'openchemlib-utils';

import { getCycleAndFragmentationInfo } from './utils/getCycleAndFragmentationInfo.js';

/**
 * The function performs the fragmentation of all single ring bonds not beloning to aromatic rings
 * @param {any} molecule - The OCL molecule to be fragmented
 * @returns  Array with results for the fragmentation of ring bonds
 */

const { MF } = MassTools;

export function fragmentCyclicBonds(molecule) {
  const { Molecule } = molecule.getOCL();

  let atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = [];
  }
  const fragmentableCyclicBonds = getCycleAndFragmentationInfo(molecule);

  let ringsToBeFragmented = [];
  for (let i = 0; i < fragmentableCyclicBonds.length; i++) {
    let ringbond = fragmentableCyclicBonds[i].fragmentation;

    for (let s = 0; s < ringbond.length; s++) {
      let bond = {};
      bond.ring = i;
      bond.i = s;
      bond.atom1 = molecule.getBondAtom(0, ringbond[s][0]);
      bond.atom2 = molecule.getBondAtom(1, ringbond[s][0]);

      bond.atom3 = molecule.getBondAtom(0, ringbond[s][1]);
      bond.atom4 = molecule.getBondAtom(1, ringbond[s][1]);

      bond.bond1 = molecule.getBond(bond.atom1, bond.atom2);
      bond.bond2 = molecule.getBond(bond.atom3, bond.atom4);

      bond.selected = true;
      atoms[bond.atom1].links.push(bond.atom2);
      atoms[bond.atom2].links.push(bond.atom1);
      atoms[bond.atom3].links.push(bond.atom4);
      atoms[bond.atom4].links.push(bond.atom3);

      ringsToBeFragmented.push(bond);
    }
  }

  let brokenMolecule = {};
  let fragmentMap = [];
  let nbFragments = [];
  let fragmentationResults = [];

  for (let bonds of ringsToBeFragmented) {
    brokenMolecule[bonds.i] = molecule.getCompactCopy();
    brokenMolecule[bonds.i].markBondForDeletion(bonds.bond1);
    brokenMolecule[bonds.i].markBondForDeletion(bonds.bond2);
    brokenMolecule[bonds.i].setAtomCustomLabel(bonds.atom1, '*');
    brokenMolecule[bonds.i].setAtomCustomLabel(bonds.atom2, '*');
    brokenMolecule[bonds.i].setAtomCustomLabel(bonds.atom3, '*');
    brokenMolecule[bonds.i].setAtomCustomLabel(bonds.atom4, '*');
    brokenMolecule[bonds.i].deleteMarkedAtomsAndBonds();

    nbFragments = brokenMolecule[bonds.i].getFragmentNumbers(fragmentMap);

    for (let i = 0; i < nbFragments; i++) {
      const result = {};
      let hose = {};
      hose.bond1 = getHoseCodesForAtoms(molecule, [bonds.atom1, bonds.atom2]);
      hose.bond2 = getHoseCodesForAtoms(molecule, [bonds.atom3, bonds.atom4]);
      let hoseBonds = [];
      hoseBonds.push(...hose.bond1, ...hose.bond2);
      let hoseCodes = hoseBonds.slice();
      result.hoseCodes = hoseCodes;
      result.hose = hoseBonds.sort().join(' ');
      result.atomMap = [];
      let includeAtom = fragmentMap.map((id) => {
        return id === i;
      });
      let fragment = new Molecule(0, 0);
      let atomMap = [];

      brokenMolecule[bonds.i].copyMoleculeByAtoms(
        fragment,
        includeAtom,
        false,
        atomMap,
      );
      // if includeAtom has more then 3 true all true should become false and all false should become true

      for (let j = 0; j < atomMap.length; j++) {
        if (fragment.getAtomCustomLabel(atomMap[j]) === '*') {
          result.atomMap.push(j);
          if (atoms[j].links.length > 0) {
            fragment.addBond(atomMap[j], fragment.addAtom(154));
          }
        }
      }
      fragment.removeAtomCustomLabels();

      fragment.setFragment(false);
      result.mf = getMF(fragment).mf.replace(/R[1-9]?/, '');
      result.idCode = fragment.getIDCode();

      result.mfInfo = new MF(result.mf).getInfo();
      result.fragmentType = 'cyclic';
      fragmentationResults.push(result);
    }
  }

  fragmentationResults = fragmentationResults.sort((a, b) => {
    return a.mfInfo.mw - b.mfInfo.mw;
  });
  return fragmentationResults;
}
