/**
 * @function bondContribution
 * @param {Result of in-silico fragmentation} fragmentationResult
 * @param {experimental spectra in form {x:[],y:[]}} spectra
 * @param {intensity of molecular ion M+} intensityRefMolecularIon
 * @returns {variable containing bondHose code and contribution for each fragment}
 */

export function bondContribution(
  fragmentationResult,
  spectra,
  intensityRefMolecularIon,
) {
  /** Normalisation of intensity in function of M+ ion intensity*/

  let contribution = {
    intensityNormalised: [],
    contributionNonNormalized: [],
    contribution: [],
  };
  for (let i = 0; i < spectra.length; i++) {
    contribution.intensityNormalised.push(
      spectra[i].y / intensityRefMolecularIon,
    );
  }

  /** Non-normalized contrubtion calculation*/

  let sumIntensities = 0;
  for (let i = 0; i < contribution.intensityNormalised.length; i++) {
    sumIntensities += contribution.intensityNormalised[i];
  }

  for (let i = 0; i < contribution.intensityNormalised.length; i++) {
    let sumIntensityN = sumIntensities - contribution.intensityNormalised[i];

    let contributionNonNormalized =
      contribution.intensityNormalised[i] / sumIntensityN;
    contribution.contributionNonNormalized.push(contributionNonNormalized);
  }
  /** Normalisation of contribution*/

  let maxContribution = Math.max(...contribution.contributionNonNormalized);
  let minContribution = Math.min(...contribution.contributionNonNormalized);

  for (let i = 0; i < contribution.intensityNormalised.length; i++) {
    let deltaMinMax = maxContribution - minContribution;
    let Contribution =
      (contribution.contributionNonNormalized[i] - minContribution) /
      deltaMinMax;
    contribution.contribution.push(Contribution);
  }

  /** Merge m/z whit contribution*/

  let fragmentContribution = {
    massToCharge: [],
    contribution: [],
  };

  for (let i = 0; i < contribution.intensityNormalised.length; i++) {
    fragmentContribution.massToCharge.push(spectra[i].x);
    fragmentContribution.contribution.push(contribution.contribution[i]);
  }

  let bondContribution = {
    bondHose: [],
    contribution: [],
  };

  for (let i = 0; i < fragmentationResult.length; i++) {
    let exactMassi = fragmentationResult[i].em;
    for (let s = 0; s < fragmentContribution.massToCharge.length; s++) {
      if (exactMassi === fragmentContribution.massToCharge[s]) {
        bondContribution.bondHose.push(fragmentationResult[i].bondHose);
        bondContribution.contribution.push(
          fragmentContribution.contribution[s],
        );
      }
    }
  }

  return { bondContribution };
}
