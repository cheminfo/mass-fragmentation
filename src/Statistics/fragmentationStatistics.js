import sum from 'ml-array-sum';

import { pseudoDistribution } from './pseudoDistribution';

/**
 * This function return the percentage of five principal fragments matched,
 * the number of picks in the experimental spectra,
 * the overAll percentage of matched fragments and the pseudoDistribution for each spetrum
 * @param {object} "Experimental Spectrum"
 * @param {object} "Results of In-silico Fragmentation Matching"
 * @returns {object} Five Principal Matched Fragments,PseudoDistribution,Number Of Picks, Percantage Matched Fragments,
 */

export function fragmentationStatistics(spectrum, resultMatching) {
  // Calculate PseudoDistribution
  let distribution = pseudoDistribution(spectrum.x);

  // Get intensity experimental spectrum

  let intensity = [];
  intensity.push(spectrum.y);
  // Get experimental Mass matched
  const experimentalMass = [];
  for (let i = 0; i < resultMatching.length; i++) {
    experimentalMass.push(resultMatching[i].experimentalMass);
  }

  // Get intensity of matched fragments
  let uniqueMasses = [...new Set(experimentalMass.sort())];
  let intensityMatched = [];
  for (let i = 0; i < uniqueMasses.length; i++) {
    for (let j = 0; j < spectrum.x.length; j++) {
      if (uniqueMasses[i] === spectrum.x[j]) {
        intensityMatched.push(spectrum.y[j]);
      }
    }
  }

  // Overall Percentage of Matched Fragments
  const percantageMatchedFragments =
    (sum(intensityMatched) / sum(spectrum.y)) * 100;

  // Number of peaks in spectra
  let numberOfPicks = spectrum.x.length;

  // Five Principal Matched Fragments
  let fivePrincipalFragmentsIntensity = intensity[0]
    .sort((a, b) => b - a)
    .slice(0, 5);

  let fivePrincipalFragmentsMatched = [];
  for (let i = 0; i < intensityMatched.length; i++) {
    for (let j = 0; j < fivePrincipalFragmentsIntensity.length; j++) {
      if (fivePrincipalFragmentsIntensity[j] === intensityMatched[i]) {
        fivePrincipalFragmentsMatched.push(fivePrincipalFragmentsIntensity[j]);
      }
    }
  }

  let fivePrincipalFragmentsWithUniqueMass = [
    ...new Set(fivePrincipalFragmentsMatched.sort()),
  ];

  const fivePrincipalMatchedFragments =
    (fivePrincipalFragmentsWithUniqueMass.length /
      fivePrincipalFragmentsIntensity.length) *
    100;

  return {
    fivePrincipalMatchedFragments: fivePrincipalMatchedFragments,
    distribution,
    numberOfPicks,
    percantageMatchedFragments,
  };
}
