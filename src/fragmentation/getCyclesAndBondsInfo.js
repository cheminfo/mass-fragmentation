/**
 * This function returns ringBond, and object who contains informations about the bonds of each cycle
 * @param {OCL.Molecule} molecule
 * @returns ringBonds
 */

export function getCyclesAndBondsInfo(molecule) {
  const ringSet = molecule.getRingSet();
  let ringBonds = [];

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
