/**
 * Organize data from experimental spectra ([x,y,x,y,x,y...]) to a object with x and y arrays
 * @param {Array} experimentalSpectrum experimental ms spectrum data
 * @returns {object} data organized {x:[],y:[]} form
 */

export function spectraPreparation(experimentalSpectrum) {
  let x = [];
  let y = [];
  for (let i = 0; i < experimentalSpectrum.length / 2; i++) {
    let j = 2 * i;
    let k = j + 1;
    x.push(experimentalSpectrum[j]);
    y.push(experimentalSpectrum[k]);
  }
  let spectra = { x, y };
  return spectra;
}
