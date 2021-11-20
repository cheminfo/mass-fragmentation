/** Statistics*/

import { xBoxPlot } from 'ml-spectra-processing';
/**
 * This function calculate the boxplot parameters of bond contribution data
 * @param {object} [bondContributionResults] contribution of each bond calculated in bondContribution.js
 * @returns {object} Bond Statistics results: q1,q2,q3,min,max
 */
export function bondStatistics(bondContributionResults) {
  let bondStatistics = xBoxPlot(
    bondContributionResults.bondContribution.contribution,
  );

  return bondStatistics;
}
