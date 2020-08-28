import { mustExist } from '@apextoaster/js-utils';
import { GetResponse } from '@gitbeaker/core/dist/types/infrastructure/RequestHelper';
import { Bundle } from '@gitbeaker/core/dist/types/infrastructure/Utils';
import { IssueNotes, Issues, Labels, Projects, ProjectsBundle } from '@gitbeaker/node';

import { CommentUpdate, IssueUpdate, LabelUpdate, ProjectQuery, Remote, RemoteOptions } from '.';
import { BaseRemote } from './base';

// gitbeaker exports the bundle types as const, breaking typeof
type RemoteBundle = InstanceType<Bundle<{
  Issues: typeof Issues;
  IssueNotes: typeof IssueNotes;
  Labels: typeof Labels;
  Projects: typeof Projects;
}, 'Issues' | 'IssueNotes' | 'Labels' | 'Projects'>>;

export function unwrapResponse<T>(resp: GetResponse): T {
  return (resp as unknown) as T;
}

/**
 * Gitlab API implementation of the `Remote` contract.
 */
export class GitlabRemote extends BaseRemote<RemoteBundle, RemoteOptions> implements Remote {
  constructor(options: RemoteOptions) {
    super(options);

    this.options.logger.debug(options, 'created gitlab remote');
  }

  public async connect(): Promise<boolean> {
    this.client = await this.options.container.create(ProjectsBundle, {
      host: this.options.data.host,
      token: mustExist(this.options.data.token),
    });

    return true;
  }

  public async createComment(options: CommentUpdate): Promise<CommentUpdate> {
    const project = await this.resolvePath(options.project);
    const body = this.formatBody(options);

    if (this.writeCapable) {
      await this.writeClient.IssueNotes.create(project.projectId, parseInt(options.issue, 10), body);
    }

    return options;
  }

  public async createLabel(options: LabelUpdate): Promise<LabelUpdate> {
    const project = await this.resolvePath(options.project);

    if (this.writeCapable) {
      await this.writeClient.Labels.create(project.projectId, options.name, '#' + options.color, {
        description: options.desc,
      });
    }

    return options;
  }

  public async deleteLabel(options: LabelUpdate): Promise<LabelUpdate> {
    const project = await this.resolvePath(options.project);

    if (this.writeCapable) {
      await this.writeClient.Labels.remove(project.projectId, options.name);
    }

    return options;
  }

  public async listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>> {
    const project = await this.resolvePath(options.project);
    const data = unwrapResponse<Array<GitlabIssue>>(await mustExist(this.client).Issues.all({
      ...project,
    }));

    return data.map((issue) => ({
      issue: issue.iid.toString(),
      labels: issue.labels,
      name: issue.title,
      project: options.project,
    }));
  }

  public async listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>> {
    const project = await this.resolvePath(options.project);
    const data = unwrapResponse<Array<GitlabLabel>>(await mustExist(this.client).Labels.all(project.projectId));

    return data.map((label) => ({
      color: label.color.replace(/^#/, ''),
      desc: label.description,
      name: label.name,
      project: options.project,
    }));
  }

  public async updateIssue(options: IssueUpdate): Promise<IssueUpdate> {
    const project = await this.resolvePath(options.project);

    if (this.writeCapable) {
      await this.writeClient.Issues.edit(project.projectId, parseInt(options.issue, 10), {
        labels: options.labels,
      });
    }

    return options;
  }

  public async updateLabel(options: LabelUpdate): Promise<LabelUpdate> {
    const project = await this.resolvePath(options.project);

    if (this.writeCapable) {
      await this.writeClient.Labels.edit(project.projectId, options.name, {
        color: '#' + options.color,
        description: options.desc,
      });
    }

    return options;
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
