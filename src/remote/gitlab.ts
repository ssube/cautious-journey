import { mustExist, NotImplementedError } from '@apextoaster/js-utils';
import { GetResponse } from '@gitbeaker/core/dist/types/infrastructure/RequestHelper';
import { Bundle } from '@gitbeaker/core/dist/types/infrastructure/Utils';
import { Issues, Labels, Projects, ProjectsBundle } from '@gitbeaker/node';

import { IssueQuery, IssueUpdate, LabelUpdate, ProjectQuery, Remote, RemoteOptions } from '.';

// gitbeaker exports the bundle types as const, breaking typeof
type RemoteBundle = InstanceType<Bundle<{
  Issues: typeof Issues;
  Labels: typeof Labels;
  Projects: typeof Projects;
}, 'Issues' | 'Labels' | 'Projects'>>;

export function unwrapResponse<T>(resp: GetResponse): T {
  return (resp as unknown) as T;
}

/**
 * Gitlab API implementation of the `Remote` contract.
 */
export class GitlabRemote implements Remote {
  protected client?: RemoteBundle;
  protected options: RemoteOptions;

  /* eslint-disable-next-line no-useless-constructor */
  constructor(options: RemoteOptions) {
    this.options = options;
    this.options.logger.debug(options, 'created gitlab remote');
  }

  public async connect(): Promise<boolean> {
    this.client = new ProjectsBundle({
      host: this.options.data.host,
      token: mustExist(this.options.data.token),
    });

    return true;
  }

  public async createComment(): Promise<void> {
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

  public async listIssues(options: IssueQuery): Promise<Array<IssueUpdate>> {
    const project = await this.resolvePath(options.project);
    const data = unwrapResponse<Array<GitlabIssue>>(await mustExist(this.client).Issues.all({
      ...project,
    }));

    return data.map((issue) => ({
      issue: issue.id.toString(),
      labels: issue.labels,
      name: issue.title,
      project: options.project,
    }));
  }

  public async listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>> {
    const project = await this.resolvePath(options.project);
    const data = unwrapResponse<Array<GitlabLabel>>(await mustExist(this.client).Labels.all(project.projectId));

    return data.map((label) => ({
      color: label.color,
      desc: label.description,
      name: label.name,
      project: options.project,
    }));
  }

  public async updateIssue(): Promise<IssueUpdate> {
    throw new NotImplementedError();
  }

  public async updateLabel(): Promise<LabelUpdate> {
    throw new NotImplementedError();
  }

  public async resolvePath(path: string): Promise<{
    groupId: number;
    projectId: number;
  }> {
    const project = unwrapResponse<GitlabProject>(await mustExist(this.client).Projects.show(path));

    return {
      groupId: project.namespace.id,
      projectId: project.id,
    };
  }
}

interface GitlabProject {
  id: number;
  description: string;
  name: string;
  path: string;
  namespace: {
    id: number;
    name: string;
    path: string;
  };
}

interface GitlabIssue {
  id: number;
  iid: number;
  title: string;
  description: string;
  state: string;
  labels: Array<string>;
}

interface GitlabLabel {
  id: number;
  name: string;
  color: string;
  description: string;
}
