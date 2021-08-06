import { NotImplementedError } from '@apextoaster/js-utils';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import { alea } from 'seedrandom';
import sinon from 'sinon';

import { GithubRemote } from '../../src/remote/github';
import { syncIssueLabels } from '../../src/sync';

const { stub } = sinon;

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
        initial: [],
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

  it('should comment on updated issues', async () => {
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
    stub(remote, 'listIssues').resolves([{
      issue: '',
      labels: ['nope'],
      name: '',
      project: 'foo',
    }]);

    const commentStub = stub(remote, 'createComment');

    await syncIssueLabels({
      logger,
      project: {
        colors: [],
        comment: true,
        flags: [{
          adds: [],
          name: 'nope',
          priority: 0,
          removes: [],
          requires: [{
            name: 'yep',
          }],
        }],
        initial: [],
        name: 'foo',
        remote: remoteData,
        states: [],
      },
      random: alea(),
      remote,
    });

    expect(commentStub).to.have.callCount(1);
  });

  it('should handle errors from the remote', async () => {
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
    const listStub = stub(remote, 'listIssues').rejects(NotImplementedError);

    const result = await syncIssueLabels({
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
        initial: [],
        name: 'foo',
        remote: remoteData,
        states: [],
      },
      random: alea(),
      remote,
    });

    expect(listStub).to.have.callCount(1);
    expect(result).to.equal(undefined);
  });
});
