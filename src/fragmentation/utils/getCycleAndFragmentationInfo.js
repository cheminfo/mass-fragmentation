import { getCyclesAndBondsInfo } from './getCyclesAndBondsInfo.js';
import { getFragmentableCycleBonds } from './getFragmentableCycleBonds.js';

/**
 * This function returns an array containing bonds informations and all combinations of bonds who can be fragmented
 * @param {OCL.Molecule} molecule
 * @returns {Array} Ring Bonds informations and bonds who can be fragmented
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
