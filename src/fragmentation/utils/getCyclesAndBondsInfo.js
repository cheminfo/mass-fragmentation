/**
 * This function returns ringBond, and object who contains information about the bonds of each cycle
 * @param {OCL.Molecule} molecule
 * @returns {Array} Information of ring bonds for each cycle in the molecule
 */

export function getCyclesAndBondsInfo(molecule) {
  const ringSet = molecule.getRingSet();
  let ringBonds = [];
  // create a new array with the length of the number of bonds in the molecule and fills it with 0
  let nbCycleForBonds = new Array(molecule.getAllBonds()).fill(0);

  for (let i = 0; i < ringSet.getSize(); i++) {
    for (let bond of ringSet.getRingBonds(i)) {
      nbCycleForBonds[bond]++;
    }
  }

  for (let i = 0; i < ringSet.getSize(); i++) {
    ringBonds.push({
      bonds: ringSet.getRingBonds(i).map((entry) => ({
        bond: entry,
        nbCycles: nbCycleForBonds[entry],
        bondOrder: molecule.getBondOrder(entry),
        isAromatic: ringSet.isAromatic(i),
      })),
    });
  }

  return ringBonds;
}
