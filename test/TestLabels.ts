import { expect } from 'chai';

import { getLabelNames } from '../src/labels';

describe('labels', () => {
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
});
