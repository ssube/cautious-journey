import { expect } from 'chai';
import { alea } from 'seedrandom';
import { match, spy } from 'sinon';

import { BunyanLogger } from '../../src/logger/bunyan';
import { GithubRemote } from '../../src/remote/github';
import { syncSingleLabel } from '../../src/sync';

describe('label sync', () => {
  it('should sync each label');
  it('should pick a stable random color for each label', async () => {
    const logger = BunyanLogger.create({
      name: 'test',
    });
    const remote = new GithubRemote({
      data: {},
      dryrun: true,
      logger,
      type: '',
    });
    const updateSpy = spy(remote, 'updateLabel');

    await syncSingleLabel({
      colors: [
        'ff0000',
      ],
      flags: [{
        adds: [],
        name: 'foo',
        priority: 1,
        removes: [],
        requires: [],
      }],
      logger,
      project: '',
      random: alea(),
      remote,
      states: [],
    }, {
      color: '',
      desc: '',
      name: 'foo',
      project: '',
    });

    expect(updateSpy).to.have.callCount(1);

    const COLOR_LENGTH = 6;
    expect(updateSpy).to.have.been.calledWithMatch({
      color: match.string.and(match((it) => it.length === COLOR_LENGTH)),
      name: 'foo',
    });
  });
});
