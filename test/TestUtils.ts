import { expect } from 'chai';

import { compareItems, defaultTo, defaultUntil, kebabCase } from '../src/utils.js';

const TEST_TRUE = 'foo';
const TEST_FALSE = 'bar';

describe('utils', () => {
  describe('default to value helper', () => {
    it('should return the first defined value', () => {
      /* eslint-disable-next-line no-null/no-null */
      expect(defaultTo(null, TEST_TRUE)).to.equal(TEST_TRUE);
      expect(defaultTo(undefined, TEST_TRUE)).to.equal(TEST_TRUE);
      expect(defaultTo(TEST_TRUE, TEST_FALSE)).to.equal(TEST_TRUE);
    });
  });

  describe('default until value helper', () => {
    it('should return the first defined value', () => {
      /* eslint-disable-next-line no-null/no-null */
      expect(defaultUntil(null, null, TEST_TRUE)).to.equal(TEST_TRUE);
      /* eslint-disable-next-line no-null/no-null */
      expect(defaultUntil(null, undefined, TEST_TRUE)).to.equal(TEST_TRUE);
      expect(defaultUntil(undefined, TEST_TRUE, undefined, undefined, TEST_FALSE)).to.equal(TEST_TRUE);
      expect(defaultUntil(undefined, undefined, TEST_TRUE, undefined)).to.equal(TEST_TRUE);
    });
  });

  describe('compare items helper', () => {
    /* eslint-disable no-magic-numbers */
    it('should compare items by reference', () => {
      const dat = {};
      expect(compareItems([
        1, dat, 3,
      ], [
        1, dat, 3,
      ])).to.equal(true);

      expect(compareItems([
        1, dat, 3,
      ], [
        1, {}, 3,
      ])).to.equal(false);

      expect(compareItems([
        1, 2, 3,
      ], [
        1, 2, 4,
      ])).to.equal(false);
    });

    it('should sort arrays before comparison', () => {
      expect(compareItems([
        1, 2, 3,
      ], [
        3, 2, 1,
      ])).to.equal(true);
    });

    it('should always reject arrays of different lengths', () => {
      expect(compareItems(
        new Array(5).fill(1),
        new Array(3).fill(1)
      )).to.equal(false);
    });
  });

  describe('kebab case helper', () => {
    it('should replace non-alnum characters with dashes', () => {
      expect(kebabCase('1_2,3+4')).to.equal('1-2-3-4');
    });

    it('should lowercase the value', () => {
      expect(kebabCase('ABC')).to.equal('a-b-c');
      expect(kebabCase('A-B-C')).to.equal('a-b-c');
    });

    it('should remove leading dashes', () => {
      expect(kebabCase('--1')).to.equal('1');
      expect(kebabCase('++1')).to.equal('1');
      expect(kebabCase('-g-g')).to.equal('g-g');
    });

    it('should remove trailing dashes', () => {
      expect(kebabCase('1--')).to.equal('1');
      expect(kebabCase('1++')).to.equal('1');
    });

    it('should remove duplicate dashes', () => {
      expect(kebabCase('foo...bar')).to.equal('foo-bar');
      expect(kebabCase('foo-.-bar')).to.equal('foo-bar');
    });
  });
});
