import { expect } from 'chai';

import { getSchemaOptions } from '../src/platform';

describe('base platform', () => {
  describe('schema options', () => {
    it('should have include options', () => {
      expect(getSchemaOptions()).to.have.property('include');
    });
  });
});
