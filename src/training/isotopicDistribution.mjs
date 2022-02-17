import IsotopicDistribution from 'isotopic-distribution';

export function isotopicDistribution(mf, ionization) {
  let isotopicDistribution = new IsotopicDistribution(mf, {
    ionizations: ionization,
  });

  const result = isotopicDistribution.getDistribution().array;

  return result;
}
/*
let results = isotopicDistribution('C10', 'H+');
console.log(results);
*/
