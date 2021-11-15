/** Statistics*/

import { quantile } from 'simple-statistics';

export function bondStatistics(bondContributionResults) {
  let quantilesIndex = [
    '25th percentile',
    '50th percentile',
    '75th percentile',
  ];
  let quantiles = quantile(
    bondContributionResults.bondContribution.contribution,
    [0.25, 0.5, 0.75],
  );

  let bondStatistics = { quantilesIndex, quantiles };

  return bondStatistics;
}
