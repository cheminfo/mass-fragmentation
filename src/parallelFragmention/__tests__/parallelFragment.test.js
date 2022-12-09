import Benchmark from 'benchmark';
import OCL from 'openchemlib';

import { fragment } from '../../fragmentation/fragment.js';
import { parallelFragment } from '../parallelFragment.js';

const { Molecule } = OCL;
// timeout of 10000000
jest.setTimeout(100000000);
describe('fragment', () => {
  it('parallel', async () => {
    const molecule = [
      Molecule.fromSmiles('CC'),
      Molecule.fromSmiles('CCC'),
      Molecule.fromSmiles('C1CCC1'),
      Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'),
      Molecule.fromSmiles('CCCCCC(CC)CCC'),
    ];

    const results = await parallelFragment(molecule, {
      calculateHoseCodes: true,
    });
    expect(results).toMatchSnapshot();
  });
  it('benchMark', async () => {
    const molecules = [
      Molecule.fromSmiles('CC'),
      Molecule.fromSmiles('CCC'),
      Molecule.fromSmiles('C1CCC1'),
      Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'),
      Molecule.fromSmiles('CCCCCC(CC)CCC'),
      Molecule.fromSmiles('CCCCC2CCC1C(CC)CC(=O)CC1C2'),
      Molecule.fromSmiles('CC'),
    ];
    let result;
    const suite = new Benchmark.Suite();
    suite
      .add('fragment', () => {
        for (let molecule of molecules) {
          fragment(molecule, {
            calculateHoseCodes: true,
          });
        }
      })
      .add('parallelFragment', async () => {
        await parallelFragment(molecules, {
          calculateHoseCodes: true,
        });
      })
      .on('complete', function onComplete() {
        result = `Fastest is ${this.filter('fastest').map('name')}`;
      })
      .run();

    expect(result).toMatchSnapshot();
  });
});
