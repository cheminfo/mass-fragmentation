export function fragmentationStatistics(spectra, resultMatching) {
  const mass = [];

  function diff(A) {
    return A.slice(1).map((n, i) => {
      return n - A[i];
    });
  }

  let diffe = diff(spectra.x);
  let counter = 0;
  for (let p = 0; p < diffe.length; p++) {
    if (Math.abs(diffe[p]) < 1.1) {
      counter += 1;
    }
  }

  let distribution = (counter / diffe.length) * 100;

  let intensityMatched = [];
  let intensity = [];
  intensity.push(spectra.y);

  for (let i = 0; i < resultMatching.length; i++) {
    mass.push(resultMatching[i].experimentalMass);
  }
  let masses = [...new Set(mass.sort())];
  let matchedMass = [];
  for (let i = 0; i < masses.length; i++) {
    for (let j = 0; j < spectra.x.length; j++) {
      if (masses[i] === spectra.x[j]) {
        intensityMatched.push(spectra.y[j]);
        matchedMass.push(spectra.x[j]);
      }
    }
  }

  // 5 principal fragments
  let fivePrincipalFragmentsIntensity = intensity[0]
    .sort((a, b) => b - a)
    .slice(0, 5);

  //console.log(fivePrincipalFragmentsIntensity.length);
  let fivePrincipalFragmentsMatched = [];
  let matMass = [];
  for (let i = 0; i < intensityMatched.length; i++) {
    for (let j = 0; j < fivePrincipalFragmentsIntensity.length; j++) {
      if (fivePrincipalFragmentsIntensity[j] === intensityMatched[i]) {
        fivePrincipalFragmentsMatched.push(fivePrincipalFragmentsIntensity[j]);
        matMass.push(matchedMass[i]);
      }
    }
  }

  let five = [...new Set(fivePrincipalFragmentsMatched.sort())];

  //console.log(fivePrincipalFragmentsMatched);

  const fivePrincipalPicks =
    (five.length / fivePrincipalFragmentsIntensity.length) * 100;

  // 10 principal fragments
  /*let tenPrincipalFragmentsIntensity = intensity[0]
    .sort((a, b) => b - a)
    .slice(0, 10);

  console.log(
    'Five:',
    fivePrincipalFragmentsIntensity,
    'Ten:',
    tenPrincipalFragmentsIntensity,

    'Int Matched:',
    intensityMatched,
    'Mass matched:',
    matchedMass,
  );*/

  /*
  let tenPrincipalFragmentsMatched = [];
  for (let i = 0; i < intensityMatched.length; i++) {
    for (let j = 0; j < tenPrincipalFragmentsIntensity.length; j++) {
      if (tenPrincipalFragmentsIntensity[j] === intensityMatched[i]) {
        tenPrincipalFragmentsMatched.push(tenPrincipalFragmentsIntensity[j]);
      }
    }
  }
  let tenPrincipalPicks = (tenPrincipalFragmentsMatched.length / 10) * 100;*/

  let numberOfPicks = spectra.x.length;

  return {
    fivePrincipalPicks,
    // tenPrincipalPicks,
    distribution,
    numberOfPicks,
  };
}
