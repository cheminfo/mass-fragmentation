import { bondContribution } from './bondContribution.js';
import { bondStatistics } from './bondStatistics.js';
import { spectraPreparation } from './spectraPreparation.js';

/**
 * @function contribution
 * @param {Result of in-silico fragmentation} fragmentationResult
 * @param {experimental spectra in form {x:[],y:[]}} spectra
 * @param {intensity of molecular ion M+} intensityRefMolecularIon
 * @returns {bond Contribution results and bond Statistics results based on bond contribution}
 */

export function contribution(
  fragmentationResult,
  experimentalSpectrum,
  intensityRefMolecularIon,
) {
  let spectra = spectraPreparation(experimentalSpectrum);
  let bondContributionResults = bondContribution(
    fragmentationResult,
    spectra,
    intensityRefMolecularIon,
  );

  let bondStatisticsResults = bondStatistics(bondContributionResults);

  return { bondContributionResults, bondStatisticsResults };
}
