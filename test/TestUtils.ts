import { expect } from 'chai';

import { defaultTo, defaultUntil } from '../src/utils';

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
});
