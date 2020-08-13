import { mustExist, NotImplementedError } from '@apextoaster/js-utils';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { IssueUpdate, LabelUpdate, ProjectQuery, Remote, RemoteOptions } from '.';

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
    const path = await this.splitProject(options.project);
    const repo = await mustExist(this.request).issues.listLabelsForRepo(path);

    const labels: Array<LabelUpdate> = [];
    for (const label of repo.data) {
      labels.push({
        color: label.color,
        desc: label.description,
        name: label.name,
        project: options.project,
      });
    }

    return labels;
  }

  public async updateIssue(): Promise<IssueUpdate> {
    throw new NotImplementedError();
  }

  public async updateLabel(options: LabelUpdate): Promise<LabelUpdate> {
    const path = await this.splitProject(options.project);
    const data = await mustExist(this.request).issues.updateLabel({
      color: options.color,
      description: options.desc,
      name: options.name,
      owner: path.owner,
      repo: path.repo,
    });

    return {
      color: data.data.color,
      desc: data.data.description,
      name: data.data.name,
      project: options.project,
    };
  }
}
