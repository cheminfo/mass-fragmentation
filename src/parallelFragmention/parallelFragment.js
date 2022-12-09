import { improveFragmentation } from './improveFragmentation';
/**
 * This function performs the fragmentation process in parallel up to n-1 cores
 * @param {Array<import('openchemlib').Molecule>} molecules - The an array of OCL molecules to be fragmented
 * @param {object} [options={}]
 * @param {boolean} [options.calculateHoseCodes=false] - calculating hose code for bonds is quite time consuming
 * @returns {Promise} In-Silico fragmentation results
 */
export async function parallelFragment(molecules, options = {}) {
  let actions = [];
  for (let molecule of molecules) {
    actions.push(improveFragmentation(molecule, options));
  }
  return Promise.all(actions);
}
