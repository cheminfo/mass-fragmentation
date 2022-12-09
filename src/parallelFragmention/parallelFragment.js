import { improveFragmentation } from './improveFragmentation';

export async function parallelFragment(molecules, options = {}) {
  let actions = [];
  let fragmentationResults = [];
  for (let molecule of molecules) {
    actions.push(improveFragmentation(molecule, options));
  }
  return Promise.all(actions);
}
