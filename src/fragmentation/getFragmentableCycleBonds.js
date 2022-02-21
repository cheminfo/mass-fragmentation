import { getCyclesAndBondsInfo } from './getCyclesAndBondsInfo.js';
/**
 * This function returns an array of objects with all combination of 2 bonds who can be fragmented in the same cycle
 * @param {OCL.Molecule} molecule
 * @returns {Array} All combination of 2 bonds who can be fragmented in the same cycle
 */
export function getFragmentableCycleBonds(molecule) {
  let cycleBondsInfo = getCyclesAndBondsInfo(molecule);
  let result = [];
  for (let i = 0; i < cycleBondsInfo.length; i++) {
    let bonds = cycleBondsInfo[i];
    let fragmentationBonds = [];
    let bondLength = bonds.bonds.length;
    for (let s = 0; s < bondLength; s++) {
      let end = s < 1 ? bondLength - 1 + s : bondLength;
      for (let f = s + 2; f < end; f++) {
        if (
          bonds.bonds[s].bondOrder === 1 &&
          bonds.bonds[f].bondOrder === 1 &&
          !bonds.bonds[s].isAromatic &&
          !bonds.bonds[f].isAromatic &&
          bonds.bonds[s].nbCycles < 2 &&
          bonds.bonds[f].nbCycles < 2
        ) {
          fragmentationBonds.push([bonds.bonds[s].bond, bonds.bonds[f].bond]);
        }
      }
    }
    result.push({ fragmentation: fragmentationBonds });
  }

  return result;
}
