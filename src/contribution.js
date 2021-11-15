import { bondContribution } from './bondContribution.js';
import { bondStatistics } from './bondStatistics.js';
import { spectraPreparation } from './spectraPreparation.js';

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
