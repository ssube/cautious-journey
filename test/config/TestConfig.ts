import { expect } from 'chai';
import { readFile } from 'fs/promises';
import { vol } from 'memfs';

import { configSchemaPath, Filesystem, initConfig, setFs } from '../../src/config/index.js';

describe('config', () => {
  describe('init config', () => {
    it('should load a valid config', async () => {
      const configPath = 'valid.yml';
      const schemaPath = configSchemaPath();

      // eslint-disable-next-line no-console
      console.log('init config, schema path', schemaPath.toString(), schemaPath.pathname);

      vol.fromJSON({
        [configPath]: `
logger:
  level: info
  name: test
projects: []`,
        [schemaPath.pathname]: await readFile(schemaPath, { encoding: 'utf8' }),
      });

      const restore = setFs(vol.promises as Filesystem);
      const config = await initConfig(configPath);

      restore();

      expect(config.logger.name).to.equal('test');
    });

    it('should throw on invalid config', async () => {
      await expect(initConfig('./invalid.yml')).to.eventually.be.rejectedWith(Error);
    });

    it('should throw on missing paths', async () => {
      await expect(initConfig('.fake')).to.eventually.be.rejectedWith(Error);
    });
  });
});
