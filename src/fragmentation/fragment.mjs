import OCL from 'openchemlib';

import { fragmentAcyclicBonds } from './fragmentAcyclicBonds.mjs';
import { fragmentCyclicBonds } from './fragmentCyclicBonds.mjs';

const { Molecule } = OCL;
/**
 * This function fragment both acyclic and cyclic bonds of the molecule
 * @param {OCL.Molecule} molecule
 * @returns
 */
export function fragment(molecule) {
  let acyclicBonds = fragmentAcyclicBonds(molecule);
  let cyclicBonds = fragmentCyclicBonds(molecule);
  let result = acyclicBonds.concat(cyclicBonds); /*
  let leveltwo = [];

  for (let i = 1; i < result.length; i++) {
    let fragment1 = Molecule.fromSmiles(result[i].smiles);
    if (fragment1.getAllBonds() > 4) {
      let acyTwo = fragmentAcyclicBonds(fragment1).slice(1);
      let cyTwo = fragmentCyclicBonds(molecule);
      let res = acyTwo.concat(cyTwo);
      if (res.length > 0) {
        leveltwo.push(res[0]);
      }
    }
  }
  if (leveltwo[0] !== undefined) {
    result.concat(leveltwo);
  }
  let levelThree = [];

  if (leveltwo[0] !== undefined) {
    for (let i = 0; i < leveltwo.length; i++) {
      let fragment2 = Molecule.fromSmiles(leveltwo[i].smiles);
      if (fragment2.getAllBonds() > 4) {
        let acyThree = fragmentAcyclicBonds(fragment2).slice(1);
        let cyThree = fragmentCyclicBonds(molecule);
        let res = acyThree.concat(cyThree);
        if (res.length > 0) {
          levelThree.push(res[0]);
        }
      }
    }
    if (levelThree[0] !== undefined) {
      result.concat(levelThree);
    }
  }

  let levelfour = [];

  if (levelThree[0] !== undefined) {
    for (let i = 0; i < levelThree.length; i++) {
      let fragment3 = Molecule.fromSmiles(levelThree[i].smiles);
      if (fragment3.getAllBonds() > 4) {
        let acyfour = fragmentAcyclicBonds(fragment3).slice(1);
        let cyfour = fragmentCyclicBonds(molecule);
        let res = acyfour.concat(cyfour);
        if (res.length > 0) {
          levelfour.push(res[0]);
        }
      }
    }
    if (levelfour[0] !== undefined) {
      result.concat(levelfour);
    }
  }*/

  return result;
}
