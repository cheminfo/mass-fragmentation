import { fragmentAcyclicBonds } from './fragmentAcyclicBonds.mjs';
import { fragmentCyclicBonds } from './fragmentCyclicBonds.mjs';
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
