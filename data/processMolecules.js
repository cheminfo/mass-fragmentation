import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

import MassTools from 'mass-tools';
import OCL from 'openchemlib';
import { getMF } from 'openchemlib-utils';

const { MF } = MassTools;

const __dirname = dirname(fileURLToPath(import.meta.url));

export function loadDatabases() {
  // cidType: 0 for low, 1 for medium and 2 for high
  const databases = [
    JSON.parse(
      readFileSync(
        join(__dirname, 'hmdb/molecules/cidLowStructures.json'),
        'utf8',
      ),
    ),
    JSON.parse(
      readFileSync(
        join(__dirname, 'hmdb/molecules/cidMedStructures.json'),
        'utf8',
      ),
    ),
    JSON.parse(
      readFileSync(
        join(__dirname, 'hmdb/molecules/cidHighStructures.json'),
        'utf8',
      ),
    ),
  ];

  return databases;
}

export function fragmentMoleculeAcyclic(molecule) {
  // Get atom mapping (numbers)
  let atoms = [];
  for (let i = 0; i < molecule.getAllAtoms(); i++) {
    let atom = {};
    atoms.push(atom);
    atom.i = i;
    atom.mapNo = molecule.getAtomMapNo(i); //Returns an atom mapping number within the context of a reaction.
    atom.links = []; // we will store connected atoms of broken bonds
  }
  // get all bonds
  let bonds = [];
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    const bond = {};
    bonds.push(bond);
    bond.i = i;
    bond.order = molecule.getBondOrder(i); // dative, single , double, triple
    bond.atom1 = molecule.getBondAtom(0, i); // atom 1 index
    bond.atom2 = molecule.getBondAtom(1, i); // atom 2 index
    bond.type = molecule.getBondType(i); // cBondTypeSingle,cBondTypeDouble,cBondTypeTriple,cBondTypeDelocalized
    bond.isAromatic = molecule.isAromaticBond(i); // boolean
    bond.isRingBond = molecule.isRingBond(i); // boolean
    if (atoms[bond.atom1].mapNo && atoms[bond.atom2].mapNo) {
      if (bond.isAromatic || (bond.type & 0b11) > 1 || bond.isRingBond) {
        //ob11=3 but i don't know what you mean
        return;
      } else {
        bond.selected = true;
        atoms[bond.atom1].links.push(bond.atom2); // why inversed?
        atoms[bond.atom2].links.push(bond.atom1); // returns the atom mapping number for fragmentation of acyclic bonds
      }
    }
  }

  let brokenMolecule = molecule.getCompactCopy(); // get i-th neighbour atom of atom being broken
  for (let bond of bonds) {
    if (bond.selected) {
      // if bond.selected true
      brokenMolecule.markBondForDeletion(bond.i); //mark bond to be deleted
    }
  }

  brokenMolecule.deleteMarkedAtomsAndBonds(); // delete marked bonds and atoms and return new mapping index
  let fragmentMap = [];
  let nbFragments = brokenMolecule.getFragmentNumbers(fragmentMap); // locates unconnected fragments and assign index ps. takes input from brokenmolecule and put it in fragmentMap
  let results = [];
  for (let i = 0; i < nbFragments; i++) {
    const result = {};
    result.atomMap = [];
    let includeAtom = fragmentMap.map((id) => {
      // assign fragment id to index of for loop
      return id === i;
    });
    let fragment = new OCL.Molecule(0, 0);
    let atomMap = [];
    brokenMolecule.copyMoleculeByAtoms(fragment, includeAtom, false, atomMap); // copies a part of molecule, false is for reconize delocalize bonds because it was made before
    // we will add some R groups at the level of the broken bonds
    for (let j = 0; j < atomMap.length; j++) {
      if (atomMap[j] > -1) {
        result.atomMap.push(j);
        if (atoms[j].links.length > 0) {
          for (let k = 0; k < atoms[j].links.length; k++) {
            fragment.addBond(atomMap[j], fragment.addAtom(154), 1); // Why we added a R group
          }
        }
      }
    }
    fragment.setFragment(false); // set him as not a fragment state
    result.idCode = fragment.getIDCode(); // returns atom id-coordinates matching idcode
    result.mf = getMF(fragment).mf.replace(/R[1-9]?/, ''); // i think it no more compatible with library
    result.mfInfo = new MF(result.mf).getInfo(); // mass of each fragment
    results.push(result);
  }
  results = results.sort((a, b) => {
    return a.mfInfo.mw - b.mfInfo.mw;
  });

  // we label the fragments
  for (let i = 0; i < results.length; i++) {
    let result = results[i];
    result.code = String.fromCharCode(65 + i);
  }
  return results;
}

const databases = loadDatabases();
for (let entry of databases[0]) {
  const molecule = OCL.Molecule.fromIDCode(entry.oclID);
  const fragments = fragmentMoleculeAcyclic(molecule);
  console.log(fragments);
}
