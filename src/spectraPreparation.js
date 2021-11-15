/** organisation of experimental data*/
/**
 * @function spectraPreparation
 * @param {experimental ms spectrum data} experimentalSpectrum
 * @returns {data organised {x:[],y:[]} form}
 */

export function spectraPreparation(experimentalSpectrum) {
  let spectra = [];

  for (let i = 0; i < experimentalSpectrum.length / 2; i++) {
    spectra[i] = {
      x: experimentalSpectrum[i * 2],
      y: experimentalSpectrum[i * 2 + 1],
    };
  }
  return spectra;
}
