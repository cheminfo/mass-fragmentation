import sum from 'ml-array-sum';

export function fragmentationStatistics(
  spectra,
  resultMatching,
  massPrecursorIon,
) {
  let molecularIon = [];
  // identify molecular ion (is intensity is conc. A), still missing case when molecular ion is absent
  let mass = spectra.x;
  let closest = mass.reduce(function closestMolecularIonMass(prev, curr) {
    return Math.abs(curr - massPrecursorIon) < Math.abs(prev - massPrecursorIon)
      ? curr
      : prev;
  });

  for (let i = 0; i < spectra.x.length; i++) {
    if (closest === spectra.x[i]) {
      molecularIon.push({ mass: spectra.x[i], intensity: spectra.y[i] });
    }
  }
  const rapportImolecularIon = molecularIon[0].intensity / sum(mass);

  // Percentage matched fragments
  let intensityMatched = [];

  let ParsedMasses = [];
  for (let i = 0; i < resultMatching.length; i++) {
    ParsedMasses.push(resultMatching[i].experimentalMass);
  }
  let masses = [...new Set(ParsedMasses)];
  for (let i = 0; i < masses.length; i++) {
    for (let j = 0; j < spectra.x.length; j++) {
      if (masses[i] === spectra.x[j]) {
        intensityMatched.push(spectra.y[i]);
      }
    }
  }

  const percantageMatchedFragments =
    (sum(intensityMatched) / sum(spectra.y)) * 100;

  //Numbers of fragments matched
  const numberOfFragmentsMatched =
    (intensityMatched.length / spectra.x.length) * 100;

  return {
    rapportImolecularIon,
    percantageMatchedFragments,
    numberOfFragmentsMatched,
  };
}
