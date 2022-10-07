import MassTools from 'mass-tools';
import { getMF, getHoseCodesForAtoms } from 'openchemlib-utils';

const { MF } = MassTools;

/**
 * The function performs the fragmentation of all single linear bonds
 * @param {OCL.molecule} molecule Molecule to be fragmented
 * @returns {object} Results fragmentation of acyclic bonds
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

    // Mapping of bonds to be fragmented, only if they are single bond not aromatic and cyclic the mapping occurs
    if (
      bond.isAromatic ||
      bond.type > 1 ||
      bond.isRingBond ||
      bond.order !== 1
    ) {
      continue;
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
  let results = [
    {
      mf: getMF(molecule).mf,
      idCode: molecule.getIDCode(),
      mfInfo: new MF(getMF(molecule).mf).getInfo(),
      fragmentType: 'Molecular Ion',
    },
  ];

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
        let hose = getHoseCodesForAtoms(molecule, [bond.atom1, bond.atom2], 1);
        result.hose = hose;

        result.atomMap = [];
        // assign fragment id to index of for loop
        let includeAtom = fragmentMap.map((id) => {
          return id === i;
        });
        let fragment = new (molecule.getOCL().Molecule)(
          molecule.getAllAtoms(),
          molecule.getAllBonds(),
        );

        let atomMap = [];

        brokenMolecule[bond.i].copyMoleculeByAtoms(
          fragment,
          includeAtom,
          false,
          atomMap,
        );
        result.smiles = fragment.toSmiles();

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
        result.fragmentType = 'acyclic';

        results.push(result);
      }
    }
  }
  // sort result in order fragment 1-2; 3-4; ...
  results = results.sort((a, b) => {
    return a.mfInfo.mw - b.mfInfo.mw;
  });

  return results;
}
