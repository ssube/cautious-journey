import { doesExist, InvalidArgumentError, mustExist, NotImplementedError } from '@apextoaster/js-utils';
import { createAppAuth } from '@octokit/auth-app';
import { Octokit } from '@octokit/rest';

import { IssueUpdate, LabelQuery, LabelUpdate, ProjectQuery, Remote, RemoteOptions } from '.';

/**
 * Github/Octokit API implementation of the `Remote` contract.
 */
export class GithubRemote implements Remote {
  protected options: RemoteOptions;

  /**
   * Github API client. Will not be set for a dry run.
   */
  protected request?: Octokit;

  constructor(options: RemoteOptions) {
    this.options = options;

    options.logger.debug({ options }, 'github remote');
  }

  public async connect() {
    this.options.logger.info('connecting to github');

    if (doesExist(this.options.data.installationId)) {
      this.options.logger.info('using app auth');
      this.request = new Octokit({
        auth: {
          id: parseInt(mustExist(this.options.data.id), 10),
          installationId: parseInt(mustExist(this.options.data.installationId), 10),
          privateKey: mustExist(this.options.data.privateKey),
        },
        authStrategy: createAppAuth,
      });
    } else {
      this.options.logger.info('using token auth');
      this.request = new Octokit({
        auth: mustExist(this.options.data.token),
      });
    }
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

  public async createLabel(options: LabelUpdate): Promise<LabelUpdate> {
    const path = await this.splitProject(options.project);

    // TODO: check if the label already exists
    if (this.writeCapable) {
      await this.writeRequest.issues.createLabel({
        color: options.color,
        description: options.desc,
        name: options.name,
        owner: path.owner,
        repo: path.repo,
      });
    }

    return options;
  }

  public async deleteLabel(options: LabelQuery): Promise<LabelQuery> {
    const path = await this.splitProject(options.project);

    // TODO: check if the label is in use
    if (this.writeCapable) {
      await this.writeRequest.issues.deleteLabel({
        name: options.name,
        owner: path.owner,
        repo: path.repo,
      });
    }

    return options;
  }

  public async getIssue(): Promise<Array<IssueUpdate>> {
    throw new NotImplementedError();
  }

  public async getLabel(): Promise<Array<LabelUpdate>> {
    throw new NotImplementedError();
  }

  public async listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>> {
    const path = await this.splitProject(options.project);

    const issues: Array<IssueUpdate> = [];

    const repo = await mustExist(this.request).issues.listForRepo(path);
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

    const labels: Array<LabelUpdate> = [];

    const repo = await mustExist(this.request).issues.listLabelsForRepo(path);
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

    if (this.writeCapable) {
      const data = await this.writeRequest.issues.updateLabel({
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
    } else {
      return options;
    }
  }

  protected get writeCapable(): boolean {
    return this.options.dryrun === false;
  }

  protected get writeRequest(): Octokit {
    if (doesExist(this.request)) {
      return this.request;
    } else {
      throw new InvalidArgumentError();
    }
  }
}
