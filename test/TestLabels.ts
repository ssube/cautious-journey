import { expect } from 'chai';

import { getLabelNames, prioritySort } from '../src/labels';

describe('label helpers', () => {
  describe('label name helper', () => {
    it('should return an empty set', () => {
      expect(getLabelNames([], []).size).to.equal(0);
    });

    it('should return all flags', () => {
      const flags = [{
        adds: [],
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
      }, {
        adds: [],
        name: 'bar',
        priority: 1,
        removes: [],
        requires: [],
      }];
      const names = flags.map((f) => f.name);

      const labels = getLabelNames(flags, []);
      expect(Array.from(labels)).to.deep.equal(names);
    });

    it('should return all states', () => {
      const values = [{
        becomes: [],
        name: 'bin',
        priority: 1,
        requires: [],
      }];
      const states = [{
        adds: [],
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
        values,
      }, {
        adds: [],
        name: 'bar',
        priority: 1,
        removes: [],
        requires: [],
        values,
      }];

      const labels = getLabelNames([], states);
      expect(Array.from(labels)).to.deep.equal([
        'foo/bin',
        'bar/bin',
      ]);
    });
  });

  describe('prioritize labels helper', () => {
    it('should sort by priority', () => {
      const HIGH_LABEL = {
        name: 'high',
        priority: 5,
        requires: [],
      };
      const LOW_LABEL = {
        name: 'low',
        priority: 1,
        requires: [],
      };

      const sorted = prioritySort([LOW_LABEL, HIGH_LABEL]);
      expect(sorted[0]).to.deep.equal(HIGH_LABEL);
    });

    it('should sort by name when priority is equal', () => {
      const FIRST_LABEL = {
        name: 'label-a',
        priority: 1,
        requires: [],
      };
      const SECOND_LABEL = {
        name: 'label-b',
        priority: 1,
        requires: [],
      };

      const sorted = prioritySort([SECOND_LABEL, FIRST_LABEL]);
      expect(sorted[0]).to.deep.equal(FIRST_LABEL);
    });
  });
});
