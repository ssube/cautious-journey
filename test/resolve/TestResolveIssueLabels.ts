import { expect } from 'chai';

import { resolveProject } from '../../src/resolve';

describe('resolve labels', () => {
  describe('flags with unfulfilled requires rule', () => {
    it('should be removed when required label is missing', () => {
      const result = resolveProject({
        flags: [{
          adds: [],
          name: 'gayle',
          priority: 1,
          removes: [],
          requires: [{
            name: 'linda',
          }],
        }],
        initial: [],
        labels: ['gayle'],
        states: [],
      });

      expect(result.labels).to.deep.equal([]);
    });
  });

  describe('flags with fulfilled requires rule', () => {
    it('should make no changes', () => {
      const result = resolveProject({
        flags: [{
          adds: [],
          name: 'gayle',
          priority: 1,
          removes: [],
          requires: [{
            name: 'linda',
          }],
        }],
        initial: [],
        labels: ['gayle', 'linda'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['gayle', 'linda']);
    });
  });

  describe('flags with add rules', () => {
    it('should add the labels', () => {
      const result = resolveProject({
        flags: [{
          adds: [{
            name: 'linda',
          }],
          name: 'bob',
          priority: 1,
          removes: [],
          requires: [],
        }],
        initial: [],
        labels: ['bob'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['bob', 'linda']);
    });
  });

  describe('flags with remove rules', () => {
    it('should remove labels', () => {
      const result = resolveProject({
        flags: [{
          adds: [],
          name: 'bob',
          priority: 1,
          removes: [{
            name: 'hugo',
          }],
          requires: [],
        }],
        initial: [],
        labels: ['bob', 'hugo'],
        states: [],
      });

      expect(result.labels).to.deep.equal(['bob']);
    });
  });
});
