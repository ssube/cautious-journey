import { NotImplementedError } from '@apextoaster/js-utils';

import { IssueUpdate, LabelUpdate, Remote } from '.';

/**
 * Gitlab API implementation of the `Remote` contract.
 */
export class GitlabRemote implements Remote {
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

