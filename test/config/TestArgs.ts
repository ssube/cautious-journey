import { expect } from 'chai';
import { stub } from 'sinon';

import { Commands, createParser } from '../../src/config/args';

describe('args', () => {
  it('should set command mode', () => {
    const modeStub = stub();
    const parser = createParser(modeStub);

    for (const command of [
      Commands.GRAPH,
      Commands.ISSUES,
      Commands.LABELS,
    ]) {
      const args = parser.parse([command]);
      expect(args).to.deep.include({
        dryrun: true,
      });
      expect(modeStub).to.have.been.calledWith(command);
      modeStub.resetHistory();
    }
  });
});
