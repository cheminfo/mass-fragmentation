import { contribution } from '../contribution.js';

describe('contribution', () => {
  it('real', () => {
    const fragmentationResult = [
      { mf: 'C8H10(+)', em: 133.4, bondHose: 'LPQR' },
      { mf: 'C6H5(+)', em: 217.1, bondHose: 'ABCD' },
      { mf: 'C2H5(+)', em: 252.5, bondHose: 'CDAG' },
      { mf: 'C7H7(+)', em: 301.5, bondHose: 'LRKF' },
      { mf: 'CH3(+)', em: 350.5, bondHose: 'PSZU' },
    ];

    const experimentalSpectrum = [
      82, 1.113586, 90.1, 23.830735, 110.5, 1.113586, 117.9, 3.11804, 133.4,
      10.022272, 134, 6.681514, 134.9, 1.55902, 163.1, 22.271715, 165.9,
      0.445434, 171.2, 13.140312, 180.1, 2.004454, 202.5, 2.227171, 217.1,
      3.563474, 218.1, 3.11804, 223, 0.890869, 224.7, 1.113586, 234.4, 3.340757,
      235.3, 5.345212, 243.6, 9.576837, 244.4, 1.55902, 252.5, 12.026726, 260.3,
      5.790646, 261.5, 4.231626, 269.3, 1.113586, 274.7, 0.890869, 277.4,
      0.668151, 278.2, 3.340757, 289.9, 2.895323, 292.4, 2.004454, 300.7,
      2.227171, 301.5, 16.035635, 308.1, 13.585746, 333.5, 4.899777, 350.5, 100,
    ];
    const intensityRefMolecularIon = [4.899777];

    const bondContribution = contribution(
      fragmentationResult,
      experimentalSpectrum,
      intensityRefMolecularIon,
    );

    expect(
      bondContribution.bondContributionResults.bondContribution.bondHose,
    ).toStrictEqual(['LPQR', 'ABCD', 'CDAG', 'LRKF', 'PSZU']);

    expect(bondContribution.bondStatisticsResults).toStrictEqual({
      Q1: 0.04271047062832332,
      Q2: 0.07894233986041684,
      Q3: 0.5539240424882504,
      max: 1,
      min: 0.02061626238276383,
    });
  });
});
