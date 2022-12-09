// resolution of 3.5 ppm

import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

import { generateMFs } from 'mf-generator';

import { candidatesFragmentation } from './candidateDebugFrag.js';

const __dirname = new URL('.', import.meta.url).pathname;
export async function debugModel(options) {
  let testSet = JSON.parse(
    readFileSync(
      join(
        __dirname,
        '../model/dataSpectra/casmi_2016_training/trainingSet.json',
      ),
      'utf8',
    ),
  );
  let debugResults = [];
  let fragmentResults = [];
  for (let entry of testSet.slice(0, 20)) {
    let spectra = { x: entry.x, y: entry.y };
    let idCode = entry.idCode;
    let { fragmentsResult, fragmentation } = await candidatesFragmentation(
      spectra,
      idCode,
      options,
    );
    let debugResult = {
      spectrum: spectra,
      ionization: options.ionization,
      precision: options.precision,
      idCode,
      bonds: fragmentsResult,
    };
    debugResults.push(debugResult);
    let format = [];

    for (let i = 0; i < fragmentation.length; i++) {
      let fragment = fragmentation[i];
      let ionizationMf = await generateMFs([fragment.mf], {
        ionizations: 'H+',
      });
      // if index is even, push it in the bond i-1

      let mf = ionizationMf[0].mf;
      let em = ionizationMf[0].em;
      let mass = ionizationMf[0].ms.em;
      let charge = fragment.mfInfo.charge;
      let idCodeFrag = fragment.idCode;
      let hoseCodes = fragment.hoseCodes;
      let atomMap = fragment.atomMap;
      let type = fragment.fragmentType;
      if (i > 1 && i % 2 === 0) {
        format[format.length - 1].idCodeFragment.push(fragment.idCode);
        format[format.length - 1].mf.push(mf);
        format[format.length - 1].em.push(em);
        format[format.length - 1].mass.push(mass);
        continue;
      }
      format.push({
        idCodeFragment: [idCodeFrag],
        mf: [mf],
        em: [em],
        mass: [mass],
        charge,
        atomMap,
        hoseCodes,
        type,
      });
    }

    let fragments = {
      spectrum: spectra,
      ionization: options.ionization,
      precision: options.precision,
      idCode,
      fragmentation: format,
    };
    fragmentResults.push(fragments);
  }
  writeFileSync(
    join(__dirname, 'fragmentResults.json'),
    JSON.stringify(fragmentResults),
  );
  writeFileSync(
    join(__dirname, 'debugModel.json'),
    JSON.stringify(debugResults),
  );
}

const options = { precision: 3.5, ionization: 'H+', limit: 1e7 };

await debugModel(options);
