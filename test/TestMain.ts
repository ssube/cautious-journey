import { NotImplementedError } from '@apextoaster/js-utils';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import sinon from 'sinon';

import { Commands, ParsedArgs } from '../src/config/args';
import { GithubRemote, mainProject, Remote, RemoteOptions, STATUS_FAILURE, STATUS_SUCCESS } from '../src/main';
import { RemoteModule } from '../src/module/RemoteModule';
import { ProjectConfig } from '../src/config';

const { createStubInstance } = sinon;

const TEST_REMOTE = 'test-remote';
const TEST_PROJECT: ProjectConfig = {
  colors: [],
  comment: false,
  flags: [],
  initial: [],
  name: 'bar',
  remote: {
    data: {},
    dryrun: true,
    logger: NullLogger.global,
    type: TEST_REMOTE,
  },
  states: [],
};

describe('main app', () => {
  it('should parse command line arguments');
  it('should load config from file');

  it('should create a remote', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
      mode: Commands.GRAPH,
    };
    const logger = NullLogger.global;

    const remote = createStubInstance(GithubRemote);
    remote.connect.returns(Promise.resolve(true));

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, args.mode, TEST_PROJECT);
    expect(status).to.equal(STATUS_SUCCESS);
  });

  it('should report connection failures', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
      mode: Commands.GRAPH,
    };
    const logger = NullLogger.global;

    const remote = createStubInstance(GithubRemote);
    remote.connect.returns(Promise.resolve(false));

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, args.mode, TEST_PROJECT);
    expect(status).to.equal(STATUS_FAILURE);
  });

  it('should not connect to skipped projects', async () => {
    const args: ParsedArgs = {
      config: '',
      dryrun: true,
      mode: Commands.GRAPH,
      project: ['foo']
    };
    const logger = NullLogger.global;

    const remote = createStubInstance(GithubRemote);
    remote.connect.throws(new NotImplementedError());

    const module = new RemoteModule();
    module.bind<Remote, Remote, RemoteOptions>(TEST_REMOTE).toInstance(remote);

    const container = Container.from(module);
    await container.configure();

    const status = await mainProject(args, container, logger, args.mode, TEST_PROJECT);
    expect(status).to.equal(STATUS_SUCCESS);
    expect(remote.connect).to.have.callCount(0);
  });
});
