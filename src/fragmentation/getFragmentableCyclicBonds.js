export function getFragmentableCyclicBonds(molecule) {
  const ringSet = molecule.getRingSet();
  let ringBonds = [];

  let ringBondsIndex = [];
  let index = 0;
  for (let bond = 0; bond < molecule.getAllBonds(); bond++) {
    if (molecule.isRingBond(bond)) {
      ringBondsIndex[index] = bond;
      index += 1;
    }
  }

  for (let ring = 0; ring < ringSet.getSize(); ring++) {
    ringBonds[ring] = ringSet.getRingBonds(ring);
  }

  const ringNumber = ringSet.getSize();
  let bondsExtracted = [];

  for (let r = 0; r < ringNumber; r++) {
    let indexOfEachRingBond = [];
    bondsExtracted[r] = indexOfEachRingBond;

    for (let i = 0; i < ringBondsIndex.length; i++) {
      if (ringBonds[r].find((ringBonds) => ringBonds === ringBondsIndex[i])) {
        indexOfEachRingBond.push(
          ringBonds[r].find((ringBonds) => ringBonds === ringBondsIndex[i]),
        );
      }
    }
  }

  let commonBondsRingSet = [];
  let count = 0;
  for (let i = 0; i < ringNumber - 1; i++) {
    let ringOne = bondsExtracted[i];

    for (let s = 1; s < ringNumber; s++) {
      if (i !== s) {
        let ringTwo = bondsExtracted[s];
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
  for (let i = 0; i < molecule.getAllBonds(); i++) {
    let index = {};
    if (!molecule.isRingBond(i)) {
      continue;
    }
    if (notFragment.find((notFragment) => notFragment === i)) {
      continue;
    } else {
      index.i = i;
    }
    result.push(index);
  }

  return result;
}
