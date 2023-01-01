import { InvalidArgumentError, NotImplementedError } from '@apextoaster/js-utils';
import { expect } from 'chai';
import { Container, NullLogger } from 'noicejs';
import sinon from 'sinon';

import { FlagLabel, StateLabel } from '../../src/labels.js';
import { BunyanLogger } from '../../src/logger/bunyan.js';
import { random } from '../../src/main.js';
import { GithubRemote } from '../../src/remote/github.js';
import { syncProjectLabels, updateLabel } from '../../src/sync.js';

const { createStubInstance, match, spy, stub } = sinon;

const TEST_FLAG: FlagLabel = {
  adds: [],
  color: 'aabbcc',
  desc: '',
  name: 'foo',
  priority: 1,
  removes: [],
  requires: [],
};

const TEST_STATE: StateLabel = {
  adds: [],
  color: '',
  desc: '',
  divider: '/',
  name: 'foo',
  priority: 1,
  removes: [],
  requires: [],
  values: [{
    adds: [],
    becomes: [],
    color: 'aabbcc',
    name: 'bar',
    priority: 1,
    removes: [],
    requires: [],
  }],
};

describe('project sync', () => {
  describe('all labels', () => {
    it('should sync each label');
    it('should pick a stable random color for each label', async () => {
      const container = Container.from();
      await container.configure();

      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = await container.create(GithubRemote, remoteConfig);
      const updateSpy = spy(remote, 'updateLabel');

      await updateLabel({
        logger,
        project: {
          colors: [
            'ff0000',
          ],
          comment: true,
          flags: [TEST_FLAG],
          initial: [],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: random(),
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

    it('should create missing flags', async () => {
      const container = Container.from();
      await container.configure();

      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = await container.create(GithubRemote, remoteConfig);
      const createStub = stub(remote, 'createLabel');
      const deleteStub = stub(remote, 'deleteLabel');
      const listStub = stub(remote, 'listLabels').returns(Promise.resolve([]));

      await syncProjectLabels({
        logger,
        project: {
          colors: [],
          comment: true,
          flags: [TEST_FLAG],
          initial: [],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: random(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(createStub).to.have.callCount(1);
      expect(deleteStub).to.have.callCount(0);
    });

    it('should create missing states', async () => {
      const container = Container.from();
      await container.configure();

      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = await container.create(GithubRemote, remoteConfig);
      const createStub = stub(remote, 'createLabel');
      const listStub = stub(remote, 'listLabels').returns(Promise.resolve([]));

      await syncProjectLabels({
        logger,
        project: {
          colors: [],
          comment: true,
          flags: [],
          initial: [],
          name: '',
          remote: remoteConfig,
          states: [TEST_STATE],
        },
        random: random(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(createStub).to.have.callCount(1).and.to.have.been.calledWithMatch({
        name: 'foo/bar',
      });
    });

    it('should delete extra labels', async () => {
      const container = Container.from();
      await container.configure();

      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = await container.create(GithubRemote, remoteConfig);
      const createStub = stub(remote, 'createLabel');
      const deleteStub = stub(remote, 'deleteLabel');
      const listStub = stub(remote, 'listLabels').returns(Promise.resolve([{
        color: '',
        desc: '',
        name: '',
        project: '',
      }]));

      await syncProjectLabels({
        logger,
        project: {
          colors: [],
          comment: true,
          flags: [],
          initial: [],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: random(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(createStub).to.have.callCount(0);
      expect(deleteStub).to.have.callCount(1);
    });

    it('should handle error from the remote', async () => {
      const container = Container.from();
      await container.configure();

      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = await container.create(GithubRemote, remoteConfig);
      const listStub = stub(remote, 'listLabels').rejects(NotImplementedError);

      const result = await syncProjectLabels({
        logger,
        project: {
          colors: [],
          comment: true,
          flags: [TEST_FLAG],
          initial: [],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: random(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(result).to.equal(undefined);
    });
  });

  describe('flag labels', () => {
    it('should prefer flag color');
  });

  describe('state labels', () => {
    it('should prefer value color');
    it('should fall back to state color');
    it('should use state divider');
  });

  describe('create label', () => {
    it('should create label');
  });

  describe('update label', () => {
    it('should update flags');
    it('should update states', async () => {
      const logger = NullLogger.global;
      const remote = createStubInstance(GithubRemote);

      await updateLabel({
        logger,
        project: {
          colors: [],
          comment: false,
          flags: [],
          initial: [],
          name: '',
          remote: {
            data: {},
            dryrun: false,
            logger,
            type: '',
          },
          states: [TEST_STATE],
        },
        random: random(),
        remote,
      }, {
        color: '',
        desc: '',
        name: 'foo/bar',
        project: '',
      });

      expect(remote.updateLabel).to.have.been.calledWithMatch({
        name: 'foo/bar',
      });
    });

    it('should throw on labels that do not exist', async () => {
      const logger = NullLogger.global;
      await expect(updateLabel({
        logger,
        project: {
          colors: [],
          comment: false,
          flags: [],
          initial: [],
          name: '',
          remote: {
            data: {},
            dryrun: false,
            logger,
            type: '',
          },
          states: [],
        },
        random: random(),
        remote: createStubInstance(GithubRemote),
      }, {
        color: '',
        desc: '',
        name: '',
        project: '',
      })).to.eventually.be.rejectedWith(InvalidArgumentError);
    });
  });
});
