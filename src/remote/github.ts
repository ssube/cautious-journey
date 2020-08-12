import { NotImplementedError, mustExist } from '@apextoaster/js-utils';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { IssueUpdate, LabelUpdate, Remote, RemoteOptions, ProjectQuery } from '.';

/**
 * Github/Octokit API implementation of the `Remote` contract.
 */
export class GithubRemote implements Remote {
  protected options: RemoteOptions;
  protected request?: Octokit;

  constructor(options: RemoteOptions) {
    this.options = options;
  }

  public async connect() {
    this.request = new Octokit({
      auth: {
        id: parseInt(mustExist(this.options.data.id), 10),
        installationId: parseInt(mustExist(this.options.data.installationId), 10),
        privateKey: mustExist(this.options.data.privateKey),
      },
      authStrategy: createAppAuth,
    });
  }

  public async splitProject(project: string): Promise<{
    owner: string;
    repo: string;
  }> {
    const [owner, repo] = project.split('/');
    return {
      owner,
      repo,
    };
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

  public async listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>> {
    const path = await this.splitProject(options.project);
    const repo = await mustExist(this.request).issues.listForRepo(path);

    const issues: Array<IssueUpdate> = [];
    for (const issue of repo.data) {
      issues.push({
        issue: issue.id.toString(10),
        labels: issue.labels.map((l) => l.name),
        name: issue.title,
        project: options.project,
      });
    }

    return issues;
  }

  public async listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>> {
    throw new NotImplementedError();
  }

  public async updateIssue(): Promise<IssueUpdate> {
    throw new NotImplementedError();
  }

  public async updateLabel(): Promise<LabelUpdate> {
    throw new NotImplementedError();
  }
}
