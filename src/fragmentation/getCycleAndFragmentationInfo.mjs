import { getCyclesAndBondsInfo } from './getCyclesAndBondsInfo.mjs';
import { getFragmentableCycleBonds } from './getFragmentableCycleBonds.mjs';

/**
 * This function returns an array containing bonds informations and all combinations of bonds who can be fragmented
 * @param {OCL.Molecule} molecule
 * @returns result
 */
export function getCycleAndFragmentationInfo(molecule) {
  let cycleBonds = getCyclesAndBondsInfo(molecule);
  let fragmentableBonds = getFragmentableCycleBonds(molecule);
  let result = [];
  for (let i = 0; i < cycleBonds.length; i++) {
    result[i] = {
      bonds: cycleBonds[i].bonds,
      fragmentation: fragmentableBonds[i].fragmentation,
    };
  }

  return result;
}
