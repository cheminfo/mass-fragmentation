/** organisation of experimental data*/

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
