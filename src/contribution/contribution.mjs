import { bondContribution } from './bondContribution.mjs';
import { bondStatistics } from './bondStatistics.mjs';
import { spectraPreparation } from './spectraPreparation.js';

/**
 * This function call bondContribution and bondStatistics functions to return Results from both.
 * @param {object} [spectra] Experimental spectra in form {x:[],y:[]}}
 * @param {object} [massPrecursorIon] mass of precursor ion
 * @returns {object} bond Contribution results and bond Statistics results based on bond contribution
 */

export function contribution(experimentalSpectrum, massPrecursorIon) {
  let spectra = spectraPreparation(experimentalSpectrum);
  let bondContributionResults = bondContribution(spectra, massPrecursorIon);
  let resultContribution = [];
  for (let i = 0; i < bondContributionResults.length; i++) {
    resultContribution.push(bondContributionResults[i].contribution);
  }

  let bondStatisticsResults = bondStatistics(resultContribution);

  return { bondContributionResults, bondStatisticsResults };
}
