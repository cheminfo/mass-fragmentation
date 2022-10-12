import { bondContribution } from './bondContribution.js';
import { bondStatistics } from './bondStatistics.js';
import { spectraPreparation } from './spectraPreparation.js';

/**
 * This function call bondContribution and bondStatistics functions to return Results from both.
 * @param {object} experimentalSpectrum Experimental spectra in form {x:[],y:[]}}
 * @param {object} massPrecursorIon mass of precursor ion
 * @returns bond Contribution results and bond Statistics results based on bond contribution
 */

export function contribution(
  experimentalSpectrum,
  massPrecursorIon,
  precision,
) {
  let spectra = spectraPreparation(experimentalSpectrum);
  let bondContributionResults = bondContribution(
    spectra,
    massPrecursorIon,
    precision,
  );
  let resultContribution = [];
  for (let i = 0; i < bondContributionResults.length; i++) {
    resultContribution.push(bondContributionResults[i].contribution);
  }

  let bondStatisticsResults = bondStatistics(resultContribution);

  return { bondContributionResults, bondStatisticsResults };
}
