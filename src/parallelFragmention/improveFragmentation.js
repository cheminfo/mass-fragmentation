import { fragmentAcyclicBonds } from '../fragmentation/fragmentAcyclicBonds.js';
import { fragmentRings } from '../fragmentation/fragmentRings.js';

/**
 * This function fragment both acyclic and cyclic bonds of the molecule
 * @param {import('openchemlib').Molecule} molecule - The OCL molecule to be fragmented
 * @param {object} [options={}]
 * @param {boolean} [options.calculateHoseCodes=false] - calculating hose code for bonds is quite time consuming
 * @returns {object} In-Silico fragmentation results
 */
export function improveFragmentation(molecule, options = {}) {
  let acyclicBonds = fragmentAcyclicBonds(molecule, options);
  let cyclicBonds = fragmentRings(molecule, options);
  let result = acyclicBonds.concat(cyclicBonds);

  return result.sort(
    (a, b) => a.mfInfo.monoisotopicMass - b.mfInfo.monoisotopicMass,
  );
}
