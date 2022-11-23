import { expect } from 'chai';

import { Commands, parseArgs } from '../../src/config/args';

describe('args', () => {
  it('should set command mode', async () => {
    for (const command of [
      Commands.GRAPH,
      Commands.ISSUES,
      Commands.LABELS,
    ]) {
      const args = await parseArgs([command, '--config', 'foo.yml']);
      expect(args).to.deep.include({
        dryrun: true,
        mode: command,
      });
    }
  });
});
