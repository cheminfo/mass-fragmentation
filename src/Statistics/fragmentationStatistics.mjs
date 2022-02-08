import sum from 'ml-array-sum';

export function fragmentationStatistics(
  spectra,
  resultMatching,
  massPrecursorIon,
) {
  let molecularIon = [];
  // identify molecular ion (is intensity is conc. A), still missing case when molecular ion is absent
  let mass = spectra.x;
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

  if (closest[0] > 0) {
    for (let i = 0; i < spectra.x.length; i++) {
      if (closest[0] === spectra.x[i]) {
        molecularIon.push({ mass: spectra.x[i], intensity: spectra.y[i] });
      }
    }
    const rapportImolecularIon =
      (molecularIon[0].intensity / sum(spectra.y)) * 100;

    // Duplicates

    const counts = [];
    const duplicates = [];

    for (let i = 0; i < resultMatching.length; i++) {
      duplicates.push(resultMatching[i].experimentalMass);
    }
    duplicates.forEach((x) => {
      counts.push((counts[x] || 0) + 1);
    });

    let numberOfFragmentsWithSameMass = counts.length;

    // Percentage matched fragments
    let intensityMatched = [];
    //let ParsedMasses = [];
    //for (let i = 0; i < resultMatching.length; i++) {
    //  ParsedMasses.push(resultMatching[i].experimentalMass);
    //}

    let masses = [...new Set(duplicates)];
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
    // Number of picks in spectrum
    const numberOfPicks = mass.length;
    // 5 principal fragments
    let intensity = spectra.y;
    let fivePrincipalFragmentsIntensity = intensity
      .sort((a, b) => b - a)
      .slice(0, 5);
    let fivePrincipalFragmentsMatched = [];
    for (let i = 0; i < intensityMatched.length; i++) {
      for (let j = 0; j < fivePrincipalFragmentsIntensity.length; j++) {
        if (fivePrincipalFragmentsIntensity[j] === intensityMatched[i]) {
          fivePrincipalFragmentsMatched.push(
            fivePrincipalFragmentsIntensity[j],
          );
        }
      }
    }
    const fivePrincipalPicks = (fivePrincipalFragmentsMatched.length / 5) * 100;
    // 10 principal fragments
    let tenPrincipalFragmentsIntensity = intensity
      .sort((a, b) => b - a)
      .slice(0, 10);
    let tenPrincipalFragmentsMatched = [];
    for (let i = 0; i < intensityMatched.length; i++) {
      for (let j = 0; j < tenPrincipalFragmentsIntensity.length; j++) {
        if (tenPrincipalFragmentsIntensity[j] === intensityMatched[i]) {
          tenPrincipalFragmentsMatched.push(tenPrincipalFragmentsIntensity[j]);
        }
      }
    }
    const tenPrincipalPicks = (tenPrincipalFragmentsMatched.length / 10) * 100;
    return {
      rapportImolecularIon,
      percantageMatchedFragments,
      numberOfFragmentsMatched,
      numberOfFragmentsWithSameMass,
      numberOfPicks,
      fivePrincipalPicks,
      tenPrincipalPicks,
    };
  }
}
