import { ProjectsBundle } from '@gitbeaker/node';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import { match, stub } from 'sinon';

import { RemoteModule } from '../../src/module/RemoteModule';
import { GitlabRemote } from '../../src/remote/gitlab';

describe('gitlab remote', () => {
  describe('create label endpoint', () => {
    it('should create labels when dryrun=false', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));
      const createStub = stub(client.Labels, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, {
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
      expect(createStub).to.have.callCount(1).and.been.calledWithMatch(match.string, 'foo');
    });

    it('should not create labels when dryrun=true', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));

      const createStub = stub(client.Labels, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, {
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
      expect(createStub).to.have.callCount(0);
    });
  });

  describe('delete label endpoint', () => {
    it('should delete labels when dryrun=false', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));

      const removeStub = stub(client.Labels, 'remove');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, {
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
      expect(removeStub).to.have.callCount(1).and.been.calledWithMatch(match.string, 'foo');
    });

    it('should not delete labels when dryrun=true', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));

      const removeStub = stub(client.Labels, 'remove');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, {
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
      expect(removeStub).to.have.callCount(0);
    });
  });

  describe('list issues endpoint', () => {
    it('should list issues when dryrun=*', async () => {
      const logger = NullLogger.global;
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));

      const listStub = stub(client.Issues, 'all').returns(Promise.resolve([]));
      module.bind(ProjectsBundle).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GitlabRemote, {
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
        expect(listStub).to.have.callCount(1);
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

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve({
        id: '',
        namespace: {
          id: '',
        },
      }));

      const listStub = stub(client.Labels, 'all').returns(Promise.resolve([]));
      module.bind(ProjectsBundle).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GitlabRemote, {
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
        expect(listStub).to.have.callCount(1);
        listStub.resetHistory();
      }
    });
  });
});
