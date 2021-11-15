import { bondContribution } from './bondContribution.js';
import { bondStatistics } from './bondStatistics.js';
import { spectraPreparation } from './spectraPreparation.js';

/**
 * Blabla
 * @param {object} [fragmentationResult] Result of in-silico fragmentation
 * @param {object} [spectra] Experimental spectra in form {x:[],y:[]}}
 * @param {intensity of molecular ion M+} intensityRefMolecularIon
 * @returns {object} bond Contribution results and bond Statistics results based on bond contribution
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
