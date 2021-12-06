export function getFragmentableCyclicBonds(molecule) {
  const ringSet = molecule.getRingSet();
  let ringBonds = [];

  for (let i = 0; i < ringSet.getSize(); i++) {
    let set = { i: [], bond: [] };
    set.i = i;
    let ring = ringSet.coll.mRingBondSet.array[i];
    for (let s = 0; s < ringSet.coll.mRingBondSet.array[i].length; s++) {
      if (Number.isInteger(ring[s])) {
        set.bond[s] = ring[s];
      }
    }

    ringBonds.push(set);
  }

  let commonBondsRingSet = [];
  let count = 0;
  for (let i = 0; i < ringSet.getSize() - 1; i++) {
    let ringOne = ringBonds[i].bond;

    for (let s = 1; s < ringSet.getSize(); s++) {
      if (i !== s) {
        let ringTwo = ringBonds[s].bond;
        let ringSystem = [ringOne, ringTwo];

        let common = ringSystem.reduce((p, c) =>
          p.filter((e) => c.includes(e)),
        );
        if (common.length !== 0) {
          count += 1;
          commonBondsRingSet[count - 1] = {
            bondCommon: common,
          };
        }
      }
    }
  }

  let notFragment = [];
  for (let s = 0; s < commonBondsRingSet.length; s++) {
    notFragment[s] = commonBondsRingSet[s].bondCommon[0];
  }

  let result = [];
  for (let i = 0; i < ringSet.getSize(); i++) {
    let index = { i: [], bond: [] };
    index.i = i;
    for (let s = 0; s < ringBonds[i].bond.length; s++) {
      if (
        notFragment.find((notFragment) => notFragment === ringBonds[i].bond[s])
      ) {
        continue;
      } else {
        index.bond[s] = ringBonds[i].bond[s];
      }
    }
    let indexFilter = index.bond.filter((a) => a);
    let results = { i: index.i, bond: indexFilter };
    result.push(results);
  }

  return result;
}
