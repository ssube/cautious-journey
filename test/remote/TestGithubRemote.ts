import { InvalidArgumentError } from '@apextoaster/js-utils';
import { Octokit } from '@octokit/rest';
import { expect } from 'chai';
import { BaseOptions, Container, NullLogger } from 'noicejs';
import { stub } from 'sinon';

import { RemoteOptions } from '../../src';
import { RemoteModule } from '../../src/module/RemoteModule';
import { GithubRemote } from '../../src/remote/github';
import { ChangeVerb } from '../../src/resolve';
import { createRemoteContainer } from './helpers';

const REMOTE_OPTIONS: Omit<RemoteOptions, 'container'> = {
  data: {
    token: 'test',
    type: 'token',
  },
  dryrun: false,
  logger: NullLogger.global,
  type: '',
};

const DRYRUN_OPTIONS = {
  ...REMOTE_OPTIONS,
  dryrun: true,
};

describe('github remote', () => {
  it('should create an octokit client with token auth', async () => {
    const module = new RemoteModule();
    const container = Container.from(module);
    await container.configure();

    const client = stub();
    module.bind<Octokit, Octokit, BaseOptions>(Octokit).toFactory(client);

    const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
    const status = await remote.connect();

    expect(status).to.equal(true);
    expect(client).to.have.been.calledWithMatch({
      auth: 'test',
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

  it('should not provide a write client for dry run remotes', async () => {
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
      dryrun: true,
      logger,
      type: '',
    });

    expect(remote.writeCapable).to.equal(false);
    expect(() => remote.writeClient).to.throw(InvalidArgumentError);
  });

  describe('format body', () => {
    it('should include change details', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new Octokit();
      stub(client.issues, 'createLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);

      for (const effect of [ChangeVerb.CONFLICTED, ChangeVerb.CREATED, ChangeVerb.REMOVED, ChangeVerb.REQUIRED]) {
        const body = remote.formatBody({
          changes: [{
            cause: 'foo',
            effect,
            label: 'bar',
          }],
          errors: [],
          issue: '',
          project: '',
        });

        expect(body).to.include('bar').and.include('foo');
      }
    });
  });

  describe('create comment endpoint', () => {
    it('should create comments when dryrun=false', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const createStub = stub(client.issues, 'createComment');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        changes: [],
        errors: [],
        issue: '1',
        project: '',
      };
      const result = await remote.createComment(data);

      expect(result).to.include(data);
      expect(createStub).to.have.callCount(1).and.been.calledWithMatch({
        /* eslint-disable-next-line camelcase */
        issue_number: 1,
      });
    });

    it('should not create comments when dryrun=true', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const createStub = stub(client.issues, 'createComment');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, DRYRUN_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        changes: [],
        errors: [],
        issue: '1',
        project: '',
      };
      const result = await remote.createComment(data);

      expect(result).to.include(data);
      expect(createStub).to.have.callCount(0);
    });
  });

  describe('create label endpoint', () => {
    it('should create labels when dryrun=false', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      stub(client.issues, 'createLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: '',
        desc: '',
        name: 'foo',
        project: '',
      };
      const result = await remote.createLabel(data);

      expect(result).to.include(data);
      expect(client.issues.createLabel).to.have.callCount(1).and.been.calledWithMatch({
        name: data.name,
      });
    });

    it('should not create labels when dryrun=true', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      stub(client.issues, 'createLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, DRYRUN_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: '',
        desc: '',
        name: 'foo',
        project: '',
      };
      const result = await remote.createLabel(data);

      expect(result).to.include(data);
      expect(client.issues.createLabel).to.have.callCount(0);
    });
  });

  describe('delete label endpoint', () => {
    it('should delete labels when dryrun=false', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      stub(client.issues, 'deleteLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: '',
        desc: '',
        name: 'foo',
        project: '',
      };
      const result = await remote.deleteLabel(data);

      expect(result).to.include(data);
      expect(client.issues.deleteLabel).to.have.callCount(1).and.been.calledWithMatch({
        name: data.name,
      });
    });

    it('should not delete labels when dryrun=true', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      stub(client.issues, 'deleteLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, DRYRUN_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: '',
        desc: '',
        name: 'foo',
        project: '',
      };
      const result = await remote.deleteLabel(data);

      expect(result).to.include(data);
      expect(client.issues.deleteLabel).to.have.callCount(0);
    });
  });

  describe('list issues endpoint', () => {
    it('should list issues when dryrun=*', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const listStub = stub(client.issues, 'listForRepo').returns(Promise.resolve({
        data: [],
        headers: {},
        status: 0,
        url: '',
      }));
      module.bind(Octokit).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GithubRemote, {
          ...REMOTE_OPTIONS,
          dryrun,
        });

        const status = await remote.connect();
        expect(status).to.equal(true);

        const data = {
          project: '',
        };
        const result = await remote.listIssues(data);

        expect(result).to.deep.equal([]);
        expect(client.issues.listForRepo).to.have.callCount(1);
        listStub.resetHistory();
      }
    });
  });

  describe('list labels endpoint', () => {
    it('should list labels when dryrun=*', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const listStub = stub(client.issues, 'listLabelsForRepo').returns(Promise.resolve({
        data: [],
        headers: {},
        status: 0,
        url: '',
      }));
      module.bind(Octokit).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GithubRemote, {
          ...REMOTE_OPTIONS,
          dryrun,
        });

        const status = await remote.connect();
        expect(status).to.equal(true);

        const data = {
          project: '',
        };
        const result = await remote.listLabels(data);

        expect(result).to.deep.equal([]);
        expect(client.issues.listLabelsForRepo).to.have.callCount(1);
        listStub.resetHistory();
      }
    });
  });

  describe('update issue endpoint', () => {
    it('should update issues when dryrun=false', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const updateStub = stub(client.issues, 'setLabels');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        issue: '1',
        labels: [],
        name: '',
        project: '',
      };
      const result = await remote.updateIssue(data);

      expect(result).to.include(data);
      expect(updateStub).to.have.callCount(1).and.been.calledWithMatch({
        /* eslint-disable-next-line camelcase */
        issue_number: 1,
      });
    });

    it('should not update issues when dryrun=true', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const updateStub = stub(client.issues, 'setLabels');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, DRYRUN_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        issue: 'foo',
        labels: [],
        name: '',
        project: '',
      };
      const result = await remote.updateIssue(data);

      expect(result).to.include(data);
      expect(updateStub).to.have.callCount(0);
    });
  });

  describe('update label endpoint', () => {
    it('should update labels when dryrun=false', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const updateStub = stub(client.issues, 'updateLabel').returns(Promise.resolve({
        data: {
          color: 'red',
          default: false,
          description: 'bar',
          id: 0,
          name: 'foo',
          /* eslint-disable-next-line camelcase */
          node_id: '',
          url: '',
        },
        headers: {},
        status: 0,
        url: '',
      }));
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: 'red',
        desc: 'bar',
        name: 'foo',
        project: '',
      };
      const result = await remote.updateLabel(data);

      expect(result).to.include(data);
      expect(updateStub).to.have.callCount(1).and.been.calledWithMatch({
        name: data.name,
      });
    });

    it('should not update labels when dryrun=true', async () => {
      const { container, module } = await createRemoteContainer();

      const client = new Octokit();
      const updateStub = stub(client.issues, 'updateLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, DRYRUN_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        color: '',
        desc: '',
        name: 'foo',
        project: '',
      };
      const result = await remote.updateLabel(data);

      expect(result).to.include(data);
      expect(updateStub).to.have.callCount(0);
    });
  });
});
