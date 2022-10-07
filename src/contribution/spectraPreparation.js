/**
 * Organize data from experimental spectra ([x,y,x,y,x,y...]) to a object with x and y arrays
 * @param {object} [experimentalSpectrum] experimental ms spectrum data
 * @returns {object} data organized {x:[],y:[]} form
 */

export function spectraPreparation(experimentalSpectrum) {
  let spectra = { x: [], y: [] };

  for (let i = 0; i < experimentalSpectrum.length / 2; i++) {
    spectra.x.push(experimentalSpectrum[i * 2]);
    spectra.y.push(experimentalSpectrum[i * 2 + 1]);
  }
  return spectra;
}
