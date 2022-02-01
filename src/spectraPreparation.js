/** organisation of experimental data*/
/**
 * Organise data from experimental spectra ()
 * @param {object} [experimentalSpectrum] experimental ms spectrum data
 * @returns {object} data organised {x:[],y:[]} form
 */

export function spectraPreparation(experimentalSpectrum) {
  let spectra = { x: [], y: [] };

  for (let i = 0; i < experimentalSpectrum.length / 2; i++) {
    spectra.x.push(experimentalSpectrum[i * 2]);
    spectra.y.push(experimentalSpectrum[i * 2 + 1]);
  }
  return spectra;
}
