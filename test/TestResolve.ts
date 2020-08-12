import { expect } from 'chai';

import { resolveLabels } from '../src/resolve';
import { TEST_CASES } from './resolve/cases';

describe('resolve labels', () => {
  it('should return the existing labels when no rules are provided');

  // procedural tests
  describe('resolver test cases', () => {
    for (const test of TEST_CASES) {
      it(`should resolve ${test.name}`, () => {
        const actualResult = resolveLabels(test.input);
        expect(actualResult).to.deep.equal(test.result);
      });
    }
  });
});
