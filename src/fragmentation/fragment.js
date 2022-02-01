import { fragmentAcyclicBonds } from './fragmentAcyclicBonds.js';
import { fragmentCyclicBonds } from './fragmentCyclicBonds.js';
/**
 * This function fragment both acyclic and cyclic bonds of the molecule
 * @param {OCL.Molecule} molecule
 * @returns
 */
export function fragment(molecule) {
  let acyclicBonds = fragmentAcyclicBonds(molecule);
  let cyclicBonds = fragmentCyclicBonds(molecule);

  return acyclicBonds.concat(cyclicBonds);
}
