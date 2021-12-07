// https://cheminfo.github.io/openchemlib-js/index.html

import MassTools from 'mass-tools';
import { getMF } from 'openchemlib-utils';
import OCL from 'openchemlib/dist/openchemlib-full.pretty.js';

import { getFragmentableCyclicBonds } from './getFragmentableCyclicBonds';

const { MF } = MassTools;
const { Molecule } = OCL;

export function fragmentCyclicBonds(molecule) {
  let atoms = [];
  // Prepare object with lenght equal to number of atoms
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.links = [];
  }
  const fragmentableCyclicBonds = getFragmentableCyclicBonds(molecule);

  let ringsToBeFragmented = [];
  for (let i = 0; i < fragmentableCyclicBonds.length; i++) {
    // get informations of bonds
    let ringbond = fragmentableCyclicBonds[i].bond.sort();

    for (let s = 0; s < ringbond.length; s++) {
      for (let r = 0; r < ringbond.length; r++) {
        let bond = {
          ring: [],
          i: [],
          index: [],
          order: [],
          atom1: [],
          atom2: [],
          atom3: [],
          atom4: [],
          type: [],
          isAromatic1: [],
          isAromatic2: [],
          isRingBond1: [],
          isRingBond2: [],
          bond1: [],
          bond2: [],
          selected: false,
        };
        bond.ring = i;
        bond.i = ringbond[s];

        if (bond.i + r + 2 > ringbond.slice(-1)[0]) {
          continue;
        } else {
          bond.order = molecule.getBondOrder(bond.i); // dative, single , double, triple
          bond.atom1 = molecule.getBondAtom(0, bond.i); // atom 1 index
          bond.atom2 = molecule.getBondAtom(1, bond.i); // atom 2 index
          // we fragment bond 1 and 3

          bond.atom3 = molecule.getBondAtom(0, bond.i + r + 2); // atom 3 index
          bond.atom4 = molecule.getBondAtom(1, bond.i + r + 2); // atom 4 index
          bond.type = molecule.getBondType(bond.i); // cBondTypeSingle,cBondTypeDouble,cBondTypeTriple,cBondTypeDelocalized
          bond.isAromatic1 = molecule.isAromaticBond(bond.i);
          bond.isAromatic2 = molecule.isAromaticBond(bond.i + r + 2);
          bond.isRingBond1 = molecule.isRingBond(bond.i);
          bond.isRingBond2 = molecule.isRingBond(bond.i + r + 2);

          bond.bond1 = molecule.getBond(bond.atom1, bond.atom2);
          bond.bond2 = molecule.getBond(bond.atom3, bond.atom4);

          //    console.log(ringSet.getRingAtoms(ring))

          // Mapping of bonds to be fragmented, only if they are single bond not aromatic and cicly the mapping occurs

          if (
            bond.isAromatic1 === false &&
            bond.isAromatic2 === false &&
            bond.type < 2 &&
            bond.order !== 0 &&
            bond.order < 3 &&
            bond.isRingBond1 &&
            bond.isRingBond2
          ) {
            bond.selected = true;
            atoms[bond.atom1].links.push(bond.atom2);
            atoms[bond.atom2].links.push(bond.atom1);
            atoms[bond.atom3].links.push(bond.atom4);
            atoms[bond.atom4].links.push(bond.atom3);
          }
          ringsToBeFragmented.push(bond);
        }
      }
    }
  }

  let brokenMolecule = {};
  let fragmentMap = [];
  let nbFragments = [];
  let results = [];

  for (let bonds of ringsToBeFragmented) {
    if (bonds.selected) {
      brokenMolecule[bonds.i] = molecule.getCompactCopy(); // get a copy of the molecule
      brokenMolecule[bonds.i].markBondForDeletion(bonds.bond1); //mark bond to be deleted
      brokenMolecule[bonds.i].markBondForDeletion(bonds.bond2); //mark bond to be deleted
      brokenMolecule[bonds.i].deleteMarkedAtomsAndBonds(); // delete marked bonds
    }

    nbFragments = brokenMolecule[bonds.i].getFragmentNumbers(fragmentMap);

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

        brokenMolecule[bonds.i].copyMoleculeByAtoms(
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
