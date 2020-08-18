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
    const remoteConfig = {
      data: {},
      dryrun: true,
      logger,
      type: '',
    };
    const remote = new GithubRemote(remoteConfig);
    const updateSpy = spy(remote, 'updateLabel');

    await syncSingleLabel({
      logger,
      project: {
        colors: [
          'ff0000',
        ],
        comment: true,
        flags: [{
          adds: [],
          name: 'foo',
          priority: 1,
          removes: [],
          requires: [],
        }],
        name: '',
        remote: remoteConfig,
        states: [],
      },
      random: alea(),
      remote,
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
