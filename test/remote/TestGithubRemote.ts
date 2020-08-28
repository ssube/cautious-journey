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

  describe('create label endpoint', () => {
    it('should create labels when dryrun=false', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new Octokit();
      stub(client.issues, 'createLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, {
        data: {
          token: 'test',
          type: 'token',
        },
        dryrun: false,
        logger,
        type: '',
      });

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
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new Octokit();
      stub(client.issues, 'createLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, {
        data: {
          token: 'test',
          type: 'token',
        },
        dryrun: true,
        logger,
        type: '',
      });

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
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new Octokit();
      stub(client.issues, 'deleteLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, {
        data: {
          token: 'test',
          type: 'token',
        },
        dryrun: false,
        logger,
        type: '',
      });

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
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new Octokit();
      stub(client.issues, 'deleteLabel');
      module.bind(Octokit).toInstance(client);

      const remote = await container.create(GithubRemote, {
        data: {
          token: 'test',
          type: 'token',
        },
        dryrun: true,
        logger,
        type: '',
      });

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
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

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
          data: {
            token: 'test',
            type: 'token',
          },
          dryrun,
          logger,
          type: '',
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
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

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
          data: {
            token: 'test',
            type: 'token',
          },
          dryrun,
          logger,
          type: '',
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
});
