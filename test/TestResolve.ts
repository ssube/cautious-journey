import { expect } from 'chai';

import { resolveProject } from '../src/resolve';
import { TEST_CASES } from './resolve/cases';

const TEST_LABELS = ['bar', 'foo'];

describe('resolve labels', () => {
  describe('with empty rule set', () => {
    it('should return the existing labels', () => {
      const result = resolveProject({
        flags: [],
        initial: [],
        labels: TEST_LABELS,
        states: [],
      });

      expect(result.labels).to.deep.equal(TEST_LABELS);
    });

    it('should not make any changes', () => {
      const result = resolveProject({
        flags: [],
        initial: [],
        labels: TEST_LABELS,
        states: [],
      });

      expect(result.changes.length).to.equal(0);
    });
  });

  describe('with empty labels', () => {
    it('should return initial labels', () => {
      const initial = ['bar', 'foo'];
      const result = resolveProject({
        flags: [],
        initial,
        labels: [],
        states: [],
      });

      expect(result.labels).to.deep.equal(initial);
    });
  });

  // procedural tests
  describe('resolver test cases', () => {
    for (const test of TEST_CASES) {
      it(`should resolve ${test.name}`, () => {
        const actualResult = resolveProject(test.input);
        expect(actualResult).to.deep.include(test.result);
      });
    }
  });
});
