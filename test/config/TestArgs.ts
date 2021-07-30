import { expect } from 'chai';
import sinon from 'sinon';

import { Commands, parseArgs } from '../../src/config/args';

const { stub } = sinon;

describe('args', () => {
  it('should set command mode', () => {
    for (const command of [
      Commands.GRAPH,
      Commands.ISSUES,
      Commands.LABELS,
    ]) {
      const args = parseArgs([command, '--config', 'foo.yml']);
      expect(args).to.deep.include({
        dryrun: true,
        mode: command,
      });
    }
  });
});
