// https://cheminfo.github.io/openchemlib-js/index.html

import { MF } from 'mass-tools';

export function fragment(molecule) {
  console.log(new MF('Et3N').getInfo().monoisotopicMass);

  return {};
}
