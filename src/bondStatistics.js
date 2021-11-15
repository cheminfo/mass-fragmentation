/** Statistics*/

import { xBoxPlot } from 'ml-spectra-processing';
/**
 * @function bondStatistics
 * @param {contribution of each bond calculated in bondContribution.js} bondContributionResults
 * @returns {q1,q2,q3,min,max}
 */
export function bondStatistics(bondContributionResults) {
  let bondStatistics = xBoxPlot(
    bondContributionResults.bondContribution.contribution,
  );

  return bondStatistics;
}
