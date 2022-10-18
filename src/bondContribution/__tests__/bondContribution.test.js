import { bondContribution } from '../bondContribution.js';
import { spectraPreparation } from '../spectraPreparation.js';

describe('contribution', () => {
  it('two fragments close to molecular ion mz', () => {
    const experimentalSpectrum = [
      82, 1.113586, 90.1, 23.830735, 110.5, 1.113586, 117.9, 3.11804, 133.4,
      10.022272, 134, 6.681514, 134.9, 1.55902, 163.1, 22.271715, 165.9,
      0.445434, 171.2, 13.140312, 180.1, 2.004454, 202.5, 2.227171, 217.1,
      3.563474, 218.1, 3.11804, 223, 0.890869, 224.7, 1.113586, 234.4, 3.340757,
      235.3, 5.345212, 243.6, 9.576837, 244.4, 1.55902, 252.5, 12.026726, 260.3,
      5.790646, 261.5, 4.231626, 269.3, 1.113586, 274.7, 0.890869, 277.4,
      0.668151, 278.2, 3.340757, 289.9, 2.895323, 292.4, 2.004454, 300.7,
      2.227171, 301.5, 16.035635, 308.1, 13.585746, 349.999, 4.899777, 350.0,
      100,
    ];
    const massPrecursorIon = 350;
    const precision = 3.5;
    const formatedSpectrum = spectraPreparation(experimentalSpectrum);
    const contribution = bondContribution(
      formatedSpectrum,
      massPrecursorIon,
      precision,
    );
    expect(contribution).toStrictEqual([
      { mass: 82, contribution: 0.02857145178503368 },
      { mass: 90.1, contribution: 1 },
      { mass: 110.5, contribution: 0.02857145178503368 },
      { mass: 117.9, contribution: 0.11428572161632641 },
      { mass: 133.4, contribution: 0.4095238286648522 },
      { mass: 134, contribution: 0.2666666552634922 },
      { mass: 134.9, contribution: 0.04761905780045337 },
      { mass: 163.1, contribution: 0.933333336184127 },
      { mass: 165.9, contribution: 0 },
      { mass: 171.2, contribution: 0.5428571562965984 },
      { mass: 180.1, contribution: 0.06666666381587305 },
      { mass: 202.5, contribution: 0.07619046682358288 },
      { mass: 217.1, contribution: 0.1333333276317461 },
      { mass: 218.1, contribution: 0.11428572161632641 },
      { mass: 223, contribution: 0.01904764877732384 },
      { mass: 224.7, contribution: 0.02857145178503368 },
      { mass: 234.4, contribution: 0.12380952462403626 },
      { mass: 235.3, contribution: 0.20952383721723314 },
      { mass: 243.6, contribution: 0.39047617988752836 },
      { mass: 244.4, contribution: 0.04761905780045337 },
      { mass: 252.5, contribution: 0.4952380984961449 },
      { mass: 260.3, contribution: 0.2285714432326528 },
      { mass: 261.5, contribution: 0.1619047794167798 },
      { mass: 269.3, contribution: 0.02857145178503368 },
      { mass: 274.7, contribution: 0.01904764877732384 },
      { mass: 277.4, contribution: 0.009523803007709844 },
      { mass: 278.2, contribution: 0.12380952462403626 },
      { mass: 289.9, contribution: 0.10476191860861656 },
      { mass: 292.4, contribution: 0.06666666381587305 },
      { mass: 300.7, contribution: 0.07619046682358288 },
      { mass: 301.5, contribution: 0.6666666809206346 },
      { mass: 308.1, contribution: 0.561904762312018 },
      { mass: 349.999, contribution: 0.19047618843990932 },
    ]);
  });
  it('with one mz close to molecular ion', () => {
    const experimentalSpectrum = [
      82, 1.113586, 90.1, 23.830735, 110.5, 1.113586, 117.9, 3.11804, 133.4,
      10.022272, 134, 6.681514, 134.9, 1.55902, 163.1, 22.271715, 165.9,
      0.445434, 171.2, 13.140312, 180.1, 2.004454, 202.5, 2.227171, 217.1,
      3.563474, 218.1, 3.11804, 223, 0.890869, 224.7, 1.113586, 234.4, 3.340757,
      235.3, 5.345212, 243.6, 9.576837, 244.4, 1.55902, 252.5, 12.026726, 260.3,
      5.790646, 261.5, 4.231626, 269.3, 1.113586, 274.7, 0.890869, 277.4,
      0.668151, 278.2, 3.340757, 289.9, 2.895323, 292.4, 2.004454, 300.7,
      2.227171, 301.5, 16.035635, 308.1, 13.585746, 333.5, 4.899777, 351.0, 100,
    ];
    const massPrecursorIon = 351;
    const precision = 0.1;
    const formatedSpectrum = spectraPreparation(experimentalSpectrum);
    const contribution = bondContribution(
      formatedSpectrum,
      massPrecursorIon,
      precision,
    );

    expect(contribution).toStrictEqual([
      { mass: 82, contribution: 0.02857145178503368 },
      { mass: 90.1, contribution: 1 },
      { mass: 110.5, contribution: 0.02857145178503368 },
      { mass: 117.9, contribution: 0.11428572161632641 },
      { mass: 133.4, contribution: 0.4095238286648522 },
      { mass: 134, contribution: 0.2666666552634922 },
      { mass: 134.9, contribution: 0.04761905780045337 },
      { mass: 163.1, contribution: 0.933333336184127 },
      { mass: 165.9, contribution: 0 },
      { mass: 171.2, contribution: 0.5428571562965984 },
      { mass: 180.1, contribution: 0.06666666381587305 },
      { mass: 202.5, contribution: 0.07619046682358288 },
      { mass: 217.1, contribution: 0.1333333276317461 },
      { mass: 218.1, contribution: 0.11428572161632641 },
      { mass: 223, contribution: 0.01904764877732384 },
      { mass: 224.7, contribution: 0.02857145178503368 },
      { mass: 234.4, contribution: 0.12380952462403626 },
      { mass: 235.3, contribution: 0.20952383721723314 },
      { mass: 243.6, contribution: 0.39047617988752836 },
      { mass: 244.4, contribution: 0.04761905780045337 },
      { mass: 252.5, contribution: 0.4952380984961449 },
      { mass: 260.3, contribution: 0.2285714432326528 },
      { mass: 261.5, contribution: 0.1619047794167798 },
      { mass: 269.3, contribution: 0.02857145178503368 },
      { mass: 274.7, contribution: 0.01904764877732384 },
      { mass: 277.4, contribution: 0.009523803007709844 },
      { mass: 278.2, contribution: 0.12380952462403626 },
      { mass: 289.9, contribution: 0.10476191860861656 },
      { mass: 292.4, contribution: 0.06666666381587305 },
      { mass: 300.7, contribution: 0.07619046682358288 },
      { mass: 301.5, contribution: 0.6666666809206346 },
      { mass: 308.1, contribution: 0.561904762312018 },
      { mass: 333.5, contribution: 0.19047618843990932 },
    ]);
  });
  it('no molecular ion fragment', () => {
    const experimentalSpectrum = [
      82, 1.113586, 90.1, 23.830735, 110.5, 1.113586, 117.9, 3.11804, 133.4,
      10.022272, 134, 6.681514, 134.9, 1.55902, 163.1, 22.271715, 165.9,
      0.445434, 171.2, 13.140312, 180.1, 2.004454, 202.5, 2.227171, 217.1,
      3.563474, 218.1, 3.11804, 223, 0.890869, 224.7, 1.113586, 234.4, 3.340757,
      235.3, 5.345212, 243.6, 9.576837, 244.4, 1.55902, 252.5, 12.026726, 260.3,
      5.790646, 261.5, 4.231626, 269.3, 1.113586, 274.7, 0.890869, 277.4,
      0.668151, 278.2, 3.340757, 289.9, 2.895323, 292.4, 2.004454, 300.7,
      2.227171, 301.5, 16.035635, 308.1, 13.585746, 333.5, 4.899777, 352.0, 100,
    ];
    const massPrecursorIon = 351;
    const precision = 3.5;
    const formatedSpectrum = spectraPreparation(experimentalSpectrum);
    const contribution = bondContribution(
      formatedSpectrum,
      massPrecursorIon,
      precision,
    );

    expect(contribution).toStrictEqual([
      { mass: 82, contribution: 0.006711414923952358 },
      { mass: 90.1, contribution: 0.23489933148822126 },
      { mass: 110.5, contribution: 0.006711414923952358 },
      { mass: 117.9, contribution: 0.026845639606324034 },
      { mass: 133.4, contribution: 0.09619687358187066 },
      { mass: 134, contribution: 0.06263981905159427 },
      { mass: 134.9, contribution: 0.011185684843425464 },
      { mass: 163.1, contribution: 0.21923937672532268 },
      { mass: 165.9, contribution: 0 },
      { mass: 171.2, contribution: 0.1275167831076678 },
      { mass: 180.1, contribution: 0.015659954762898567 },
      { mass: 202.5, contribution: 0.01789708972263512 },
      { mass: 217.1, contribution: 0.03131990952579714 },
      { mass: 218.1, contribution: 0.026845639606324034 },
      { mass: 223, contribution: 0.0044742799642158056 },
      { mass: 224.7, contribution: 0.006711414923952358 },
      { mass: 234.4, contribution: 0.029082774566060586 },
      { mass: 235.3, contribution: 0.04921700929317496 },
      { mass: 243.6, contribution: 0.09172259361765486 },
      { mass: 244.4, contribution: 0.011185684843425464 },
      { mass: 252.5, contribution: 0.11633109826424234 },
      { mass: 260.3, contribution: 0.05369127921264807 },
      { mass: 261.5, contribution: 0.0380313244497495 },
      { mass: 269.3, contribution: 0.006711414923952358 },
      { mass: 274.7, contribution: 0.0044742799642158056 },
      { mass: 277.4, contribution: 0.0022371349597365537 },
      { mass: 278.2, contribution: 0.029082774566060586 },
      { mass: 289.9, contribution: 0.024608504646587478 },
      { mass: 292.4, contribution: 0.015659954762898567 },
      { mass: 300.7, contribution: 0.01789708972263512 },
      { mass: 301.5, contribution: 0.15659955767372838 },
      { mass: 308.1, contribution: 0.13199105302714093 },
      { mass: 333.5, contribution: 0.04474272932895916 },
      { mass: 352, contribution: 1 },
    ]);
  });
  it('only one fragment', () => {
    const experimentalSpectrum = [82, 100];
    const massPrecursorIon = 351;
    const precision = 3.5;
    const formatedSpectrum = spectraPreparation(experimentalSpectrum);
    const contribution = bondContribution(
      formatedSpectrum,
      massPrecursorIon,
      precision,
    );
    expect(contribution).toStrictEqual([{ mass: 82, contribution: 1 }]);
  });
});
