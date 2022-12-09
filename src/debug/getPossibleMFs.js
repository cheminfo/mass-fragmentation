import { generateMFs } from 'mf-generator';

import { neutralLoss } from '../neutralLoss/neutralLoss.js';

export async function getPossibleMFs(fragmentationResults, optionsMFs) {
  let result = {};
  for (let fragmentCandidate of fragmentationResults) {
    let groups = {};
    let neutralLosses = neutralLoss(fragmentCandidate.idCode);

    let mfsArray = [fragmentCandidate.mf, neutralLosses];
    let mfsMatched = await generateMFs(mfsArray, optionsMFs);

    for (const mf of mfsMatched) {
      const em = Math.round(mf.ms.em * 1e6);
      let neutralLoss = mf.parts[1];
      if (!groups[em]) {
        groups[em] = [
          {
            em: mf.em,
            ms: mf.ms.em,
            mf: mf.mf,
            ppm: mf.ms.ppm,
            neutralLoss: neutralLoss ? neutralLoss : NaN,
            targetMass: mf.ms.target.mass,
            hose: fragmentCandidate.hoseCodes
              ? fragmentCandidate.hoseCodes
              : NaN,
          },
        ];
      } else {
        groups[em].push({
          em: mf.em,
          ms: mf.ms.em,
          mf: mf.mf,
          ppm: mf.ms.ppm,
          neutralLoss: neutralLoss ? neutralLoss : NaN,
          targetMass: mf.ms.target.mass,
          hose: fragmentCandidate.hoseCodes ? fragmentCandidate.hoseCodes : NaN,
        });
      }
    }
    let groupsValues = Object.values(groups);
    if (groupsValues.length > 0) {
      let fragments = [];
      for (let group of groupsValues) {
        group.forEach((item) => {
          fragments.push(item);
        });
      }
      for (let fragment of fragments) {
        if (!result[fragment.targetMass]) {
          result[fragment.targetMass] = {
            idCode: fragmentCandidate.idCode,
            unique: true,
            experimentalMass: fragment.targetMass,
            matches: [
              {
                em: fragment.em,
                ms: fragment.ms,
                mf: fragment.mf,
                ppm: fragment.ppm,
                neutralLoss: fragment.neutralLoss,
                hose: fragment.hose,
              },
            ],
            intensity: NaN,
            contribution: NaN,
          };
        } else {
          result[fragment.targetMass].unique = false;
          result[fragment.targetMass].matches.push({
            em: fragment.em,
            ms: fragment.ms,
            mf: fragment.mf,
            ppm: fragment.ppm,
            neutralLoss: fragment.neutralLoss,
          });
        }
      }
    }
  }
  result = Object.values(result);
  return result;
}
