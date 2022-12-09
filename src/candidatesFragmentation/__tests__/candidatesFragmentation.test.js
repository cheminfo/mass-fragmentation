import { toBeDeepCloseTo, toMatchCloseTo } from 'jest-matcher-deep-close-to';

import { candidatesFragmentation } from '../candidatesFragmentation.js';

expect.extend({ toBeDeepCloseTo, toMatchCloseTo });

describe('fragment', () => {
  it('CC(=O)CCC(=O)O - with Hose Codes', async () => {
    const spectrum = {
      x: [
        15.02348, 42.01056, 46.00548, 59.0133, 57.03404, 71.04968, 101.02386,
        117.05462,
      ],
      y: [50, 80, 40, 20, 60, 20, 30, 100],
    };
    const idCode = 'daxL@@QdfufjX@@';
    const options = {
      calculateHoseCodes: true,
      precision: 15,
      ionization: 'H+',
      limit: 1e7,
    };
    const result = await candidatesFragmentation(spectrum, idCode, options);
    expect(result).toMatchSnapshot();
  });
  it('CC(N)C1CCC(CC#N)C(CC=O)C1 - no Hose Codes', async () => {
    // Only molecular ion should be found
    const spectrum = {
      x: [
        45.05785, 71.04969, 143.13101, 165.11536, 193.14666, 194.14191,
        209.16539,
      ],
      y: [50, 80, 40, 20, 60, 20, 100],
    };
    const idCode = 'do}H@ClDeYeWXYZjjkj@@';
    const options = {
      calculateHoseCodes: false,
      precision: 15,
      ionization: 'H+',
      limit: 1e7,
    };
    const result = await candidatesFragmentation(spectrum, idCode, options);
    expect(result).toMatchSnapshot();
  });
  it('CC(N)C1CCC(CC#N)C(CC=O)C1 - no options', async () => {
    const spectrum = {
      x: [
        45.0573, 71.04914, 143.13101, 165.11536, 193.14666, 194.14191,
        209.16489,
      ],
      y: [50, 80, 40, 20, 60, 20, 100],
    };
    const idCode = 'do}H@ClDeYeWXYZjjkj@@';

    const result = await candidatesFragmentation(spectrum, idCode);

    expect(result).toMatchSnapshot();
  });
  it('C3CCC(C(C1CCCC1)C2CCCC2)C3 - symmetric molecule', async () => {
    const spectrum = {
      x: [28.0313, 42.0469, 143.13101, 178.1721, 192.1878, 220.2191],
      y: [50, 80, 40, 20, 60, 20, 100],
    };
    const idCode = 'f`i@@@LdbbRbaRSNFl{uUUUUUP@@';
    const options = {
      calculateHoseCodes: true,
      precision: 50,
      ionization: '+',
      limit: 1e7,
    };
    const result = await candidatesFragmentation(spectrum, idCode, options);
    expect(result).toMatchSnapshot();
  });
});
