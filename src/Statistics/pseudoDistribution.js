/**
 * This function return number of picks that could be derived from isotopic
 * distribution in a experimental spectrum
 * @param {Array} "Experimental Spectrum Masses"
 * @returns {number} number of picks that could be derived from isotopic distribution
 */

export function pseudoDistribution(spectrumMasses) {
  let difference = spectrumMasses.slice(1).map((n, i) => {
    return n - spectrumMasses[i];
  });
  let counter = 0;
  for (let p = 0; p < difference.length; p++) {
    if (Math.abs(difference[p]) < 1.1) {
      counter += 1;
    }
  }

  let distribution = (counter / difference.length) * 100;

  return distribution;
}
