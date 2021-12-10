import { contribution } from '../contribution.js';

describe('contribution', () => {
  it('real', () => {
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
    const massPrecursorIon = 350;

    const bondContribution = contribution(
      experimentalSpectrum,
      massPrecursorIon,
    );

    expect(bondContribution.bondContributionResults).toStrictEqual([
      { mass: 82, contribution: 0.028571451785033678 },
      { mass: 90.1, contribution: 1 },
      { mass: 110.5, contribution: 0.028571451785033678 },
      { mass: 117.9, contribution: 0.11428572161632643 },
      { mass: 133.4, contribution: 0.40952382866485226 },
      { mass: 134, contribution: 0.26666665526349215 },
      { mass: 134.9, contribution: 0.04761905780045336 },
      { mass: 163.1, contribution: 0.933333336184127 },
      { mass: 165.9, contribution: 0 },
      { mass: 171.2, contribution: 0.5428571562965984 },
      { mass: 180.1, contribution: 0.06666666381587306 },
      { mass: 202.5, contribution: 0.07619046682358288 },
      { mass: 217.1, contribution: 0.13333332763174613 },
      { mass: 218.1, contribution: 0.11428572161632643 },
      { mass: 223, contribution: 0.019047648777323838 },
      { mass: 224.7, contribution: 0.028571451785033678 },
      { mass: 234.4, contribution: 0.12380952462403624 },
      { mass: 235.3, contribution: 0.20952383721723317 },
      { mass: 243.6, contribution: 0.3904761798875284 },
      { mass: 244.4, contribution: 0.04761905780045336 },
      { mass: 252.5, contribution: 0.49523809849614503 },
      { mass: 260.3, contribution: 0.22857144323265285 },
      { mass: 261.5, contribution: 0.16190477941677983 },
      { mass: 269.3, contribution: 0.028571451785033678 },
      { mass: 274.7, contribution: 0.019047648777323838 },
      { mass: 277.4, contribution: 0.009523803007709844 },
      { mass: 278.2, contribution: 0.12380952462403624 },
      { mass: 289.9, contribution: 0.10476191860861658 },
      { mass: 292.4, contribution: 0.06666666381587306 },
      { mass: 300.7, contribution: 0.07619046682358288 },
      { mass: 301.5, contribution: 0.6666666809206346 },
      { mass: 308.1, contribution: 0.561904762312018 },
      { mass: 333.5, contribution: 0.19047618843990932 },
    ]);
    expect(bondContribution.bondStatisticsResults).toStrictEqual({
      Q1: 0.03809525479274352,
      Q2: 0.11428572161632643,
      Q3: 0.3285714175755103,
      min: 0,
      max: 1,
    });
  });
  it('notReal', () => {
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
    const massPrecursorIon = 351;

    const bondContribution = contribution(
      experimentalSpectrum,
      massPrecursorIon,
    );

    expect(bondContribution.bondContributionResults).toStrictEqual([
      { mass: 82, contribution: 0.028571451785033678 },
      { mass: 90.1, contribution: 1 },
      { mass: 110.5, contribution: 0.028571451785033678 },
      { mass: 117.9, contribution: 0.11428572161632643 },
      { mass: 133.4, contribution: 0.40952382866485226 },
      { mass: 134, contribution: 0.26666665526349215 },
      { mass: 134.9, contribution: 0.04761905780045336 },
      { mass: 163.1, contribution: 0.933333336184127 },
      { mass: 165.9, contribution: 0 },
      { mass: 171.2, contribution: 0.5428571562965984 },
      { mass: 180.1, contribution: 0.06666666381587306 },
      { mass: 202.5, contribution: 0.07619046682358288 },
      { mass: 217.1, contribution: 0.13333332763174613 },
      { mass: 218.1, contribution: 0.11428572161632643 },
      { mass: 223, contribution: 0.019047648777323838 },
      { mass: 224.7, contribution: 0.028571451785033678 },
      { mass: 234.4, contribution: 0.12380952462403624 },
      { mass: 235.3, contribution: 0.20952383721723317 },
      { mass: 243.6, contribution: 0.3904761798875284 },
      { mass: 244.4, contribution: 0.04761905780045336 },
      { mass: 252.5, contribution: 0.49523809849614503 },
      { mass: 260.3, contribution: 0.22857144323265285 },
      { mass: 261.5, contribution: 0.16190477941677983 },
      { mass: 269.3, contribution: 0.028571451785033678 },
      { mass: 274.7, contribution: 0.019047648777323838 },
      { mass: 277.4, contribution: 0.009523803007709844 },
      { mass: 278.2, contribution: 0.12380952462403624 },
      { mass: 289.9, contribution: 0.10476191860861658 },
      { mass: 292.4, contribution: 0.06666666381587306 },
      { mass: 300.7, contribution: 0.07619046682358288 },
      { mass: 301.5, contribution: 0.6666666809206346 },
      { mass: 308.1, contribution: 0.561904762312018 },
      { mass: 333.5, contribution: 0.19047618843990932 },
    ]);
    expect(bondContribution.bondStatisticsResults).toStrictEqual({
      Q1: 0.03809525479274352,
      Q2: 0.11428572161632643,
      Q3: 0.3285714175755103,
      min: 0,
      max: 1,
    });
  });
});
