/**
 * This function calculate the contribution of each fragment on spectra based on the reaction rate of fragmentation
 * @param {object} spectra experimental spectra in form {x:[],y:[]}
 * @param {object} massPrecursorIon massPrecursorIon
 * @returns {Array} Contribution of each fragment on spectra
 */

export function bondContribution(spectra, massPrecursorIon) {
  let molecularIon = [];
  // identify molecular ion (is intensity is conc. A), still missing case when molecular ion is absent
  let mass = [];
  for (let i = 0; i < spectra.x.length; i++) {
    mass.push(spectra.x[i]);
  }

  let closest = [];
  for (let i = 0; i < mass.length; i++) {
    let near = [];
    if (
      mass[i] <= massPrecursorIon + 0.01 &&
      mass[i] >= massPrecursorIon - 0.01
    ) {
      near.push(mass[i]);
    }
    if (near.length > 0) {
      closest.push(
        near.sort(
          (a, b) =>
            Math.abs(massPrecursorIon - a) - Math.abs(massPrecursorIon - b),
        )[0],
      );
    }
  }

  let bondContribution = [];
  if (closest[0] > 0) {
    for (let i = 0; i < spectra.x.length; i++) {
      if (closest[0] === spectra.x[i]) {
        molecularIon.push({ mass: spectra.x[i], intensity: spectra.y[i] });
      }
    }
    // is the equivalent of conc. A0
    let intensityPrecursorIon = 0;
    for (let i = 0; i < spectra.x.length; i++) {
      if (spectra.y[i] >= 1) {
        intensityPrecursorIon += spectra.y[i];
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
    for (let i = 0; i < spectra.x.length; i++) {
      if (spectra.x[i] !== molecularIon[0].mass) {
        let rateFragment =
          (-1 * rateReactionMolecularIon * spectra.y[i]) / delta;
        rateReactionFragments.push({
          mass: spectra.x[i],
          intensity: spectra.y[i],
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

    for (let i = 0; i < rateReactionFragments.length; i++) {
      bondContribution[i] = {
        mass: rateReactionFragments[i].mass,
        contribution: rateReactionFragments[i].contribution,
      };
    }
  }
  return bondContribution;
}
