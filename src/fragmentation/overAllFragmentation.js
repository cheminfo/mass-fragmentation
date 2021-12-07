import { fragmentAcyclicBonds } from './fragmentAcyclicBonds';
import { fragmentCyclicBonds } from './fragmentCyclicBonds';
/**
 * This function fragment both acyclic and cyclic bonds of the molecule
 * @param {OCL.Molecule} molecule
 * @returns
 */
export function overAllFragmentation(molecule) {
  let results = [];

  let acyclicBonds = fragmentAcyclicBonds(molecule);
  let cyclicBonds = fragmentCyclicBonds(molecule);

  if (acyclicBonds === undefined) {
    acyclicBonds = [];
  }
  if (cyclicBonds === undefined) {
    cyclicBonds = [];
  }
  results.push(acyclicBonds.concat(cyclicBonds));

  for (let i = 0; i < results[0].length; i++) {
    let result = results[0][i];

    result.code = i;
  }

  return results;
}
