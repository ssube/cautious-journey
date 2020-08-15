import { expect } from 'chai';

import { resolveLabels } from '../../src/resolve';

const TEST_LABELS = ['foo', 'bar'];

describe('resolve labels', () => {
  describe('flags with unfulfilled requires rule', () => {
    it('should be removed when required label is missing', () => {
      const result = resolveLabels({
        flags: [{
          adds: [],
          name: 'gayle',
          priority: 1,
          removes: [],
          requires: [{
            name: 'linda',
          }],
        }],
        labels: ['gayle'],
        states: [],
      });

      expect(result.labels).to.deep.equal([]);
    });
  });

  describe('flags with fulfilled requires rule', () => {
    it('should make no changes', () => {
      const result = resolveLabels({
        flags: [{
          adds: [],
          name: 'gayle',
          priority: 1,
          removes: [],
          requires: [{
            name: 'linda',
          }],
        }],
        labels: ['gayle', 'linda'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['gayle', 'linda']);
    });
  });

  describe('flags with add rules', () => {
    it('should add the labels', () => {
      const result = resolveLabels({
        flags: [{
          adds: [{
            name: 'linda',
          }],
          name: 'bob',
          priority: 1,
          removes: [],
          requires: [],
        }],
        labels: ['bob'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['bob', 'linda']);
    });
  });

  describe('flags with remove rules', () => {
    it('should remove labels', () => {
      const result = resolveLabels({
        flags: [{
          adds: [],
          name: 'bob',
          priority: 1,
          removes: [{
            name: 'hugo',
          }],
          requires: [],
        }],
        labels: ['bob', 'hugo'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['bob']);
    });
  });
});
