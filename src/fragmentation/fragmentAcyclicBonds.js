// https://cheminfo.github.io/openchemlib-js/index.html

import MassTools from 'mass-tools';
import { getMF } from 'openchemlib-utils';
import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

const { MF } = MassTools;
const { Molecule } = OCL;

/**
 * The function performs fragmentation of all bonds not belonging to cyclic or aromatic groups and returns the fragments along with the idCode and monoisotopic mass
 * @param {object} [molecule] Molecule to be fragmented
 * @returns {object} result from fragmentation of acyclic bonds
 */

export function fragmentAcyclicBonds(molecule) {
  let atoms = [];
  // Prepare object with lenght equal to number of atoms
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = [];
  }
  let bonds = [];
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    let bond = {};
    // get informations of bonds
    bond.i = i;
    bond.order = molecule.getBondOrder(i); // dative, single , double, triple
    bond.atom1 = molecule.getBondAtom(0, i); // atom 1 index
    bond.atom2 = molecule.getBondAtom(1, i); // atom 2 index
    bond.type = molecule.getBondType(i); // cBondTypeSingle,cBondTypeDouble,cBondTypeTriple,cBondTypeDelocalized
    bond.isAromatic = molecule.isAromaticBond(i);
    bond.isRingBond = molecule.isRingBond(i);

    // Mapping of bonds to be fragmented, only if they are single bond not aromatic and cicly the mapping occurs
    if (
      bond.isAromatic ||
      bond.type > 1 ||
      bond.isRingBond ||
      bond.order !== 1
    ) {
      return;
    } else {
      bond.selected = true;
      atoms[bond.atom1].links.push(bond.atom2);
      atoms[bond.atom2].links.push(bond.atom1);
    }
    bonds.push(bond);
  }
  let brokenMolecule = {};
  let fragmentMap = [];
  let nbFragments = [];
  let results = [];

  for (let bond of bonds) {
    if (bond.selected) {
      // if bond.selected is true (line 46) the molecule will be fragmented
      brokenMolecule[bond.i] = molecule.getCompactCopy(); // get a copy of the molecule
      brokenMolecule[bond.i].markBondForDeletion(bond.i); //mark bond to be deleted
      brokenMolecule[bond.i].deleteMarkedAtomsAndBonds(bond.i); // delete marked bonds
    }

    nbFragments = brokenMolecule[bond.i].getFragmentNumbers(fragmentMap);
    // only if there are 2 fragments code can continue
    if (nbFragments === 2) {
      for (let i = 0; i < nbFragments; i++) {
        const result = {};
        result.atomMap = [];
        // assign fragment id to index of for loop
        let includeAtom = fragmentMap.map((id) => {
          return id === i;
        });
        let fragment = new Molecule(100, 100);
        let atomMap = [];

        brokenMolecule[bond.i].copyMoleculeByAtoms(
          fragment,
          includeAtom,
          false,
          atomMap,
        );
        // where atomMap[j] is equal to 0 there is a bond who was fragmented
        for (let j = 0; j < atomMap.length; j++) {
          if (atomMap[j] === 0) {
            result.atomMap.push(j);
            // add a R group to fragment
            if (atoms[j].links.length > 0) {
              fragment.addBond(atomMap[j], fragment.addAtom(154), 1);
            }
          }
        }
        fragment.setFragment(false);
        result.mf = getMF(fragment).mf.replace(/R[1-9]?/, ''); // get mf without R group
        result.idCode = fragment.getIDCode();
        result.mfInfo = new MF(result.mf).getInfo();
        results.push(result);
      }
    }
  }
  // sort result in order fragment 1-2; 3-4; ...
  results = results.sort((a, b) => {
    return a.mfInfo.mw - b.mfInfo.mw;
  });

  // Label of each fragment
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    result.code = String.fromCharCode(65 + i);
  }
  return results;
}
