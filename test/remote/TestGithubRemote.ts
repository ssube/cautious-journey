import { InvalidArgumentError } from '@apextoaster/js-utils';
import { Octokit } from '@octokit/rest';
import { expect } from 'chai';
import { BaseOptions, Container, NullLogger } from 'noicejs';
import { stub } from 'sinon';

import { RemoteModule } from '../../src/module/RemoteModule';
import { GithubRemote } from '../../src/remote/github';

describe('github remote', () => {
  it('should create an octokit client with token auth', async () => {
    const logger = NullLogger.global;
    const module = new RemoteModule();
    const container = Container.from(module);
    await container.configure();

    const client = stub();
    module.bind<Octokit, Octokit, BaseOptions>(Octokit).toFactory(client);

    const remote = await container.create(GithubRemote, {
      data: {
        token: 'foo',
        type: 'token',
      },
      logger,
      type: '',
    });
    const status = await remote.connect();

    expect(status).to.equal(true);
    expect(client).to.have.been.calledWithMatch({
      auth: 'foo',
    });
  });

  it('should throw on invalid auth methods', async () => {
    const logger = NullLogger.global;
    const module = new RemoteModule();
    const container = Container.from(module);
    await container.configure();

    const client = stub();
    module.bind<Octokit, Octokit, BaseOptions>(Octokit).toFactory(client);

    const remote = await container.create(GithubRemote, {
      data: {
        type: 'test',
      },
      logger,
      type: '',
    });

    return expect(remote.connect()).to.eventually.be.rejectedWith(InvalidArgumentError);
  });
});
