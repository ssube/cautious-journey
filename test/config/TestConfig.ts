import { IncludeOptions } from '@apextoaster/js-yaml-schema';
import { expect } from 'chai';
import { DEFAULT_SCHEMA } from 'js-yaml';
import { match, stub } from 'sinon';

import { initConfig } from '../../src/config';

describe('config', () => {
  describe('init config', () => {
    it('should load a valid config', async () => {
      const path = 'valid.yml';
      const include: IncludeOptions = {
        exists: stub(),
        join: stub().returns(path),
        read: stub().returns(`
logger:
  level: info
  name: test
projects: []
        `),
        resolve: stub(),
        schema: DEFAULT_SCHEMA,
      };

      const config = await initConfig(path, include);
      expect(include.read).to.have.been.calledWith(path, match.object);
      expect(config.logger.name).to.equal('test');
    });

    it('should throw on invalid config', async () => {
      const include: IncludeOptions = {
        exists: stub(),
        join: stub().returnsArg(0),
        read: stub().returns(`
logger: []
projects: {}
        `),
        resolve: stub(),
        schema: DEFAULT_SCHEMA,
      };

      await expect(initConfig('./invalid.yml', include)).to.eventually.be.rejectedWith(Error);
    });

    it('should throw on missing paths', async () => {
      const err = new Error();
      Reflect.set(err, 'code', 'ENOENT');

      const include: IncludeOptions = {
        exists: stub().returns(false),
        join: stub().returnsArg(0),
        read: stub().throws(err),
        resolve: stub(),
        schema: DEFAULT_SCHEMA,
      };

      await expect(initConfig('.fake', include)).to.eventually.be.rejectedWith(Error);
    });
  });
});
