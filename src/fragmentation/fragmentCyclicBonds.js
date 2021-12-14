import MassTools from 'mass-tools';
import OCL from 'openchemlib';
import { getMF, getHoseCodesForPath } from 'openchemlib-utils';

import { getCycleAndFragmentationInfo } from './getCycleAndFragmentationInfo';

/**
 * This function returns fragmentation results of cyclic bonds
 * @param {OCL.Molecule} molecule
 * @returns
 */

const { MF } = MassTools;
const { Molecule } = OCL;

export function fragmentCyclicBonds(molecule) {
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
  let results = [];

  for (let bonds of ringsToBeFragmented) {
    brokenMolecule[bonds.i] = molecule.getCompactCopy();
    brokenMolecule[bonds.i].markBondForDeletion(bonds.bond1);
    brokenMolecule[bonds.i].markBondForDeletion(bonds.bond2);
    brokenMolecule[bonds.i].deleteMarkedAtomsAndBonds();

    nbFragments = brokenMolecule[bonds.i].getFragmentNumbers(fragmentMap);

    for (let i = 0; i < nbFragments; i++) {
      const result = {};
      result.atomMap = [];
      let includeAtom = fragmentMap.map((id) => {
        return id === i;
      });
      let fragment = new Molecule(100, 100);
      let atomMap = [];

      brokenMolecule[bonds.i].copyMoleculeByAtoms(
        fragment,
        includeAtom,
        false,
        atomMap,
      );
      result.hose = [];
      let hose = getHoseCodesForPath(fragment, 0, 1, fragment.getAllBonds());
      result.hose.push(hose);

      for (let j = 0; j < atomMap.length; j++) {
        if (atomMap[j] === 0) {
          result.atomMap.push(j);

          if (atoms[j].links.length > 0) {
            fragment.addBond(atomMap[j], fragment.addAtom(154), 1);
          }
        }
      }
      fragment.setFragment(false);
      result.mf = getMF(fragment).mf.replace(/R[1-9]?/, '');
      result.idCode = fragment.getIDCode();
      result.mfInfo = new MF(result.mf).getInfo();
      result.fragmentType = 'cyclic';
      results.push(result);
    }
  }

  results = results.sort((a, b) => {
    return a.mfInfo.mw - b.mfInfo.mw;
  });

  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    result.code = String.fromCharCode(65 + i);
  }

  return results;
}
