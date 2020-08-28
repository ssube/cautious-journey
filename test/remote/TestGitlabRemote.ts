import { ProjectsBundle } from '@gitbeaker/node';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import { match, stub } from 'sinon';

import { RemoteModule } from '../../src/module/RemoteModule';
import { GitlabRemote } from '../../src/remote/gitlab';
import { RemoteOptions } from '../../src';

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

const STUB_PROJECT = {
  id: '',
  namespace: {
    id: '',
  },
};

describe('gitlab remote', () => {
  describe('create comment endpoint', () => {
    it('should create comments when dryrun=false', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const createStub = stub(client.IssueNotes, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, REMOTE_OPTIONS);
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
      expect(createStub).to.have.callCount(1).and.been.calledWithMatch(match.string, 1);
    });

    it('should not create comments when dryrun=true', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const createStub = stub(client.IssueNotes, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, DRYRUN_OPTIONS);
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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const createStub = stub(client.Labels, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, REMOTE_OPTIONS);
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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const createStub = stub(client.Labels, 'create');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, DRYRUN_OPTIONS);
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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const removeStub = stub(client.Labels, 'remove');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, REMOTE_OPTIONS);

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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const removeStub = stub(client.Labels, 'remove');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, DRYRUN_OPTIONS);

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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const listStub = stub(client.Issues, 'all').returns(Promise.resolve([]));
      module.bind(ProjectsBundle).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GitlabRemote, {
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
        expect(listStub).to.have.callCount(1);
        listStub.resetHistory();
      }
    });
  });

  describe('list labels endpoint', () => {
    it('should list labels when dryrun=*', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const listStub = stub(client.Labels, 'all').returns(Promise.resolve([]));
      module.bind(ProjectsBundle).toInstance(client);

      for (const dryrun of [true, false]) {
        const remote = await container.create(GitlabRemote, {
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
        expect(listStub).to.have.callCount(1);
        listStub.resetHistory();
      }
    });
  });

  describe('update issue endpoint', () => {
    it('should update issues when dryrun=false', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const updateStub = stub(client.Issues, 'edit');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, REMOTE_OPTIONS);
      const status = await remote.connect();
      expect(status).to.equal(true);

      const data = {
        issue: '1',
        labels: [],
        name: 'bar',
        project: 'foo',
      };
      const result = await remote.updateIssue(data);

      expect(result).to.include(data);
      expect(updateStub).to.have.callCount(1).and.been.calledWithMatch(match.string, 1);
    });

    it('should not update issues when dryrun=true', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const updateStub = stub(client.Issues, 'edit');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, DRYRUN_OPTIONS);
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
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const updateStub = stub(client.Labels, 'edit').returns(Promise.resolve({
        color: 'red',
        default: false,
        description: 'bar',
        id: 0,
        name: 'foo',
        url: '',
      }));
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, REMOTE_OPTIONS);
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
      expect(updateStub).to.have.callCount(1).and.been.calledWithMatch(match.string, 'foo');
    });

    it('should not update labels when dryrun=true', async () => {
      const module = new RemoteModule();
      const container = Container.from(module);
      await container.configure();

      const client = new ProjectsBundle();
      stub(client.Projects, 'show').returns(Promise.resolve(STUB_PROJECT));
      const updateStub = stub(client.Labels, 'edit');
      module.bind(ProjectsBundle).toInstance(client);

      const remote = await container.create(GitlabRemote, DRYRUN_OPTIONS);
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
