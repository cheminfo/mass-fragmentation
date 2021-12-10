/**
 * This function calculate the contribution of each fragment on spectra based on the reaction rate of fragmentation
 * @param {object} [spectra] experimental spectra in form {x:[],y:[]}
 * @param {object} [massPrecursorIon] massPrecursorIon
 */

export function bondContribution(spectra, massPrecursorIon) {
  let molecularIon = [];
  const massTollerance = 0.4509; //can be retrived form database, function to do it need to be implemented
  // identify molecular ion (is intensity is conc. A), still missing case when molecular ion is absent
  for (let i = 0; i < spectra.length; i++) {
    if (
      spectra[i].x ===
      Math.round(10 * (massPrecursorIon + massTollerance)) / 10
    ) {
      molecularIon.push({ mass: spectra[i].x, intensity: spectra[i].y });
    }
    if (
      spectra[i].x ===
      Math.round(10 * (massPrecursorIon - massTollerance)) / 10
    ) {
      molecularIon.push({ mass: spectra[i].x, intensity: spectra[i].y });
    }
  }

  // is the equivalent of conc. A0
  let intensityPrecursorIon = 0;
  for (let i = 0; i < spectra.length; i++) {
    if (spectra[i].y >= 1) {
      intensityPrecursorIon += spectra[i].y;
    }
  }
  // reaction rate of consumption of A0 at time t=1
  let rateReactionMolecularIon = Math.log(
    molecularIon[0].intensity / intensityPrecursorIon,
  );

  // reaction rate for each fragment less the molecular ion
  let rateReactionFragments = [];
  let rateArray = [];
  const delta = intensityPrecursorIon - molecularIon[0].intensity;
  for (let i = 0; i < spectra.length; i++) {
    if (spectra[i].y !== molecularIon[0].intensity) {
      let rateFragment = (-1 * rateReactionMolecularIon * spectra[i].y) / delta;
      rateReactionFragments.push({
        mass: spectra[i].x,
        intensity: spectra[i].y,
        rate: rateFragment,
        contribution: [],
      });
      rateArray.push(rateFragment);
    }
  }

  // normalization
  let maxRateArray = Math.max(...rateArray);
  let minRateArray = Math.min(...rateArray);

  for (let i = 0; i < rateArray.length; i++) {
    let deltaMinMax = maxRateArray - minRateArray;
    let contribution = (rateArray[i] - minRateArray) / deltaMinMax;

    rateReactionFragments[i].contribution = contribution;
  }

  let bondContribution = [];
  for (let i = 0; i < rateReactionFragments.length; i++) {
    bondContribution[i] = {
      mass: rateReactionFragments[i].mass,
      contribution: rateReactionFragments[i].contribution,
    };
  }
  return bondContribution;
}
