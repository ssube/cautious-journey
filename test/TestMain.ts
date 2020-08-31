import { NotImplementedError } from '@apextoaster/js-utils';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import { createStubInstance } from 'sinon';

import { Commands, ParsedArgs } from '../src/config/args';
import { GithubRemote, mainProject, Remote, RemoteOptions, STATUS_FAILURE, STATUS_SUCCESS } from '../src/main';
import { RemoteModule } from '../src/module/RemoteModule';

const TEST_REMOTE = 'test-remote';

describe('main app', () => {
  it('should parse command line arguments');
  it('should load config from file');

  it('should create a remote', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
    };
    const logger = NullLogger.global;
    const mode = Commands.GRAPH;

    const remote = createStubInstance(GithubRemote);
    remote.connect.returns(Promise.resolve(true));

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, mode, {
      colors: [],
      comment: false,
      flags: [],
      initial: [],
      name: '',
      remote: {
        data: {},
        dryrun: true,
        logger,
        type: TEST_REMOTE,
      },
      states: [],
    });

    expect(status).to.equal(STATUS_SUCCESS);
  });

  it('should report connection failures', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
    };
    const logger = NullLogger.global;
    const mode = Commands.GRAPH;

    const remote = createStubInstance(GithubRemote);
    remote.connect.returns(Promise.resolve(false));

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, mode, {
      colors: [],
      comment: false,
      flags: [],
      initial: [],
      name: '',
      remote: {
        data: {},
        dryrun: true,
        logger,
        type: TEST_REMOTE,
      },
      states: [],
    });

    expect(status).to.equal(STATUS_FAILURE);
  });

  it('should not connect to skipped projects', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
      project: ['foo']
    };
    const logger = NullLogger.global;
    const mode = Commands.GRAPH;

    const remote = createStubInstance(GithubRemote);
    remote.connect.throws(new NotImplementedError());

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, mode, {
      colors: [],
      comment: false,
      flags: [],
      initial: [],
      name: 'bar',
      remote: {
        data: {},
        dryrun: true,
        logger,
        type: TEST_REMOTE,
      },
      states: [],
    });

    expect(status).to.equal(STATUS_SUCCESS);
    expect(remote.connect).to.have.callCount(0);
  });
});
