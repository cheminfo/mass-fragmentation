/**
 * This function calculate the contribution of each fragment on spectra based on the reaction rate of fragmentation
 * @param {object} spectra experimental spectra in form {x:[],y:[]}
 * @param {Number} massPrecursorIon massPrecursorIon
 * @param {Number} precision ppm error
 * @returns {Array} Contribution of each fragment on spectra
 */

export function bondContribution(spectra, massPrecursorIon, precision) {
  let molecularIon = [];
  // identify molecular ion (is intensity is conc. A), still missing case when molecular ion is absent
  let fragmentMasses = [];
  let bondContribution = [];
  for (let i = 0; i < spectra.x.length; i++) {
    fragmentMasses.push(spectra.x[i]);
  }

  let closest = [];
  let near = [];

  for (let i = 0; i < fragmentMasses.length; i++) {
    let massAccuracyOfFragment = (precision * fragmentMasses[i]) / 1e6;
    if (
      Math.abs(fragmentMasses[i] - massPrecursorIon) <= massAccuracyOfFragment
    ) {
      near.push(fragmentMasses[i]);
    }
  }
  if (near.length > 0) {
    closest.push(
      near.sort(
        (a, b) =>
          Math.abs(massPrecursorIon - a) - Math.abs(massPrecursorIon - b),
      )[0],
    );
  }
  if (closest.length > 0) {
    for (let i = 0; i < spectra.x.length; i++) {
      if (closest[0] === spectra.x[i]) {
        molecularIon.push({ mass: spectra.x[i], intensity: spectra.y[i] });
      }
    }
  } else {
    molecularIon.push({ mass: massPrecursorIon, intensity: 0.001 });
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
  if (delta <= 0) {
    return [];
  }
  for (let i = 0; i < spectra.x.length; i++) {
    if (spectra.x[i] !== molecularIon[0].mass) {
      let rateFragment = (-1 * rateReactionMolecularIon * spectra.y[i]) / delta;
      rateReactionFragments.push({
        mass: spectra.x[i],
        intensity: spectra.y[i],
        rate: rateFragment,
        contribution: 0,
      });
      rateArray.push(rateFragment);
    }
  }

  // normalization

  let maxRateArray = Math.max(...rateArray);
  let minRateArray = Math.min(...rateArray);
  let deltaMinMax = maxRateArray - minRateArray;

  for (let i = 0; i < rateArray.length; i++) {
    let contribution = (rateArray[i] - minRateArray) / deltaMinMax;
    if (isNaN(contribution) && deltaMinMax === 0) {
      rateReactionFragments[i].contribution = 1;
      continue;
    }
    // add property contribution to each fragment
    rateReactionFragments[i].contribution = contribution;
  }

  for (let i = 0; i < rateReactionFragments.length; i++) {
    bondContribution[i] = {
      mass: rateReactionFragments[i].mass,
      contribution: rateReactionFragments[i].contribution,
    };
  }
  return bondContribution;
}
