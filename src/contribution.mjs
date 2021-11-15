import { bondContribution } from './bondContribution.mjs';
import { bondStatistics } from './bondStatistics.mjs';
import { spectraPreparation } from './spectraPreparation.mjs';

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
