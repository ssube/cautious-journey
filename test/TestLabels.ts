import { expect } from 'chai';
import { alea } from 'seedrandom';

import { getLabelColor, getLabelNames, prioritySort, StateLabel } from '../src/labels';

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
        adds: [],
        becomes: [],
        name: 'bin',
        priority: 1,
        removes: [],
        requires: [],
      }];
      const states: Array<StateLabel> = [{
        adds: [],
        divider: '/',
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
        values,
      }, {
        adds: [],
        divider: '/',
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
        adds: [],
        name: 'high',
        priority: 5,
        removes: [],
        requires: [],
      };
      const LOW_LABEL = {
        adds: [],
        name: 'low',
        priority: 1,
        removes: [],
        requires: [],
      };

      const sorted = prioritySort([LOW_LABEL, HIGH_LABEL]);
      expect(sorted[0]).to.deep.equal(HIGH_LABEL);
    });

    it('should sort by name when priority is equal', () => {
      const FIRST_LABEL = {
        adds: [],
        name: 'label-a',
        priority: 1,
        removes: [],
        requires: [],
      };
      const SECOND_LABEL = {
        adds: [],
        name: 'label-b',
        priority: 1,
        removes: [],
        requires: [],
      };

      const sorted = prioritySort([SECOND_LABEL, FIRST_LABEL]);
      expect(sorted[0]).to.deep.equal(FIRST_LABEL);
    });
  });

  describe('label color helper', () => {
    it('should return the value color', () => {
      expect(getLabelColor(['test'], alea(), {
        adds: [],
        color: 'beans',
        divider: '/',
        name: '',
        priority: 1,
        removes: [],
        requires: [],
        values: [],
      }, {
        adds: [],
        becomes: [],
        color: 'not',
        name: '',
        priority: 1,
        removes: [],
        requires: [],
      })).to.equal('not');
    });

    it('should return the state color when value color is unset', () => {
      expect(getLabelColor(['test'], alea(), {
        adds: [],
        color: 'beans',
        divider: '/',
        name: '',
        priority: 1,
        removes: [],
        requires: [],
        values: [],
      }, {
        adds: [],
        becomes: [],
        color: '',
        name: '',
        priority: 1,
        removes: [],
        requires: [],
      })).to.equal('beans');
    });

    it('should return the flag color', () => {
      expect(getLabelColor(['test'], alea(), {
        adds: [],
        color: 'not',
        name: '',
        priority: 1,
        removes: [],
        requires: [],
      })).to.equal('not');
    });

    it('should return a random color when the flag color is unset', () => {
      expect(getLabelColor(['test'], alea(), {
        adds: [],
        name: '',
        priority: 1,
        removes: [],
        requires: [],
      })).to.equal('test');
    });
  });
});
