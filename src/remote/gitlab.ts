import { NotImplementedError } from '@apextoaster/js-utils';

import { IssueUpdate, LabelUpdate, Remote, RemoteOptions } from '.';

/**
 * Gitlab API implementation of the `Remote` contract.
 */
export class GitlabRemote implements Remote {
  /* eslint-disable-next-line no-useless-constructor */
  constructor(options: RemoteOptions) {
    // TODO: set up gitlab API
  }

  public async createComment() {
    throw new NotImplementedError();
  }

  public async createLabel(): Promise<LabelUpdate> {
    throw new NotImplementedError();
  }

  public async deleteLabel(): Promise<LabelUpdate> {
    throw new NotImplementedError();
  }

  public async getIssue(): Promise<Array<IssueUpdate>> {
    throw new NotImplementedError();
  }

  public async getLabel(): Promise<Array<LabelUpdate>> {
    throw new NotImplementedError();
  }

  public async listIssues(): Promise<Array<IssueUpdate>> {
    throw new NotImplementedError();
  }

  public async listLabels(): Promise<Array<LabelUpdate>> {
    throw new NotImplementedError();
  }

  public async updateIssue(): Promise<IssueUpdate> {
    throw new NotImplementedError();
  }

  public async updateLabel(): Promise<LabelUpdate> {
    throw new NotImplementedError();
  }
}

