import { expect } from 'chai';
import { alea } from 'seedrandom';
import { match, spy, stub } from 'sinon';

import { BunyanLogger } from '../../src/logger/bunyan';
import { GithubRemote } from '../../src/remote/github';
import { syncProjectLabels, syncSingleLabel } from '../../src/sync';

describe('project sync', () => {
  describe('all labels', () => {
    it('should sync each label');
    it('should pick a stable random color for each label', async () => {
      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = new GithubRemote(remoteConfig);
      const updateSpy = spy(remote, 'updateLabel');

      await syncSingleLabel({
        logger,
        project: {
          colors: [
            'ff0000',
          ],
          comment: true,
          flags: [{
            adds: [],
            name: 'foo',
            priority: 1,
            removes: [],
            requires: [],
          }],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: alea(),
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

    it('should create missing labels', async () => {
      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = new GithubRemote(remoteConfig);
      const createStub = stub(remote, 'createLabel');
      const deleteStub = stub(remote, 'deleteLabel');
      const listStub = stub(remote, 'listLabels').returns(Promise.resolve([]));

      await syncProjectLabels({
        logger,
        project: {
          colors: [],
          comment: true,
          flags: [{
            adds: [],
            color: '',
            desc: '',
            name: '',
            priority: 1,
            removes: [],
            requires: [],
          }],
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: alea(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(createStub).to.have.callCount(1);
      expect(deleteStub).to.have.callCount(0);
    });

    it('should delete extra labels', async () => {
      const logger = BunyanLogger.create({
        name: 'test',
      });
      const remoteConfig = {
        data: {},
        dryrun: true,
        logger,
        type: '',
      };
      const remote = new GithubRemote(remoteConfig);
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
          name: '',
          remote: remoteConfig,
          states: [],
        },
        random: alea(),
        remote,
      });

      expect(listStub).to.have.callCount(1);
      expect(createStub).to.have.callCount(0);
      expect(deleteStub).to.have.callCount(1);
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
});