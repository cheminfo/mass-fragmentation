import { getCyclesAndBondsInfo } from './getCyclesAndBondsInfo.js';
import { getFragmentableCycleBonds } from './getFragmentableCycleBonds.js';

/**
 * This function returns an array containing bonds information and all combinations of bonds who can be fragmented
 * @param {any} molecule - The OCL molecule to be fragmented
 * @returns Ring Bonds information and bonds who can be fragmented
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
