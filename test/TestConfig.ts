import { expect } from 'chai';

import { validateConfig } from '../src/config';

describe('config', () => {
  describe('validate config', () => {
    it('should reject non-objects', () => {
      expect(validateConfig('')).to.equal(false);
      expect(validateConfig(1)).to.equal(false);
    });

    it('should insert default values', () => {
      const config = {
        logger: {
          level: 'info',
          name: 'test',
        },
        projects: [{
          flags: undefined,
          name: 'foo',
          remote: {
            data: {},
            type: 'github-remote',
          },
        }]
      };

      expect(validateConfig(config)).to.equal(true);
      expect(config.projects[0].flags).to.deep.equal([]);
    });
  });
});
