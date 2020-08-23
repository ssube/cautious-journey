import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import { alea } from 'seedrandom';
import { stub } from 'sinon';

import { GithubRemote } from '../../src/remote/github';
import { syncIssueLabels } from '../../src/sync';

describe('issue sync', () => {
  it('should resolve each issue', async () => {
    const container = Container.from();
    await container.configure();

    const logger = NullLogger.global;
    const remoteData = {
      data: {},
      dryrun: true,
      logger,
      type: '',
    };
    const remote = await container.create(GithubRemote, remoteData);
    const listStub = stub(remote, 'listIssues').returns(Promise.resolve([{
      issue: '',
      labels: ['nope'],
      name: '',
      project: 'foo',
    }]));
    const updateStub = stub(remote, 'updateIssue').returns(Promise.resolve({
      issue: '',
      labels: [],
      name: '',
      project: '',
    }));

    await syncIssueLabels({
      logger,
      project: {
        colors: [],
        comment: false,
        flags: [{
          adds: [],
          name: 'nope',
          priority: 0,
          removes: [],
          requires: [{
            name: 'yep',
          }],
        }],
        name: 'foo',
        remote: remoteData,
        states: [],
      },
      random: alea(),
      remote,
    });
    expect(listStub).to.have.callCount(1);
    expect(updateStub).to.have.callCount(1);
    expect(updateStub).to.have.been.calledWithMatch({
      project: 'foo',
    });
  });

  it('should update issues with label changes');
});
