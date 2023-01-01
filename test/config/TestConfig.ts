import { expect } from 'chai';
import { vol } from 'memfs';

import { Filesystem, initConfig, setFs } from '../../src/config/index.js';

describe('config', () => {
  describe('init config', () => {
    it('should load a valid config', async () => {
      const path = 'valid.yml';
      vol.fromJSON({
        [path]: `
logger:
  level: info
  name: test
projects: []`,
      });

      const restore = setFs(vol.promises as Filesystem);
      const config = await initConfig(path);

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
