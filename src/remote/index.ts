import { BaseOptions, Logger } from 'noicejs';

import { ChangeRecord, ErrorRecord } from '../resolve.js';

export interface ProjectQuery {
  project: string;
}

export interface LabelQuery extends ProjectQuery {
  name: string;
}

export interface IssueQuery extends ProjectQuery {
  issue: string;
}

/**
 * Changes to be recorded in a project comment. This takes an abstract set of change/error
 * records and allows the remote implementation to handle formatting and localization.
 */
export interface CommentUpdate extends IssueQuery {
  changes: Array<ChangeRecord>;
  errors: Array<ErrorRecord>;
}

export interface IssueUpdate extends IssueQuery {
  labels: Array<string>;
  name: string;
}

export interface LabelUpdate extends LabelQuery {
  color: string;
  desc: string;
}

export interface RemoteOptions extends BaseOptions {
  /**
   * Arbitrary key-value data for this remote, usually credentials and base URLs.
   */
  data: Record<string, string>;

  /**
   * If set, do not make any real changes.
   */
  dryrun: boolean;

  logger: Logger;

  /**
   * Remote class/type name.
   */
  type: string;
}

/**
 * Basic functions which every remote API must provide.
 */
export interface Remote {
  connect(): Promise<boolean>;

  /**
   * Add a comment to an issue (for attribution and auditing).
   */
  createComment(options: CommentUpdate): Promise<CommentUpdate>;

  /**
   * Create a new label.
   */
  createLabel(options: LabelUpdate): Promise<LabelUpdate>;

  /**
   * Delete an existing label.
   */
  deleteLabel(options: LabelQuery): Promise<LabelQuery>;

  /**
   * List all issues.
   */
  listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>>;

  /**
   * List all labels.
   */
  listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>>;

  /**
   * Update an issue.
   *
   * Only labels will be modified.
   */
  updateIssue(options: IssueUpdate): Promise<IssueUpdate>;

  /**
   * Update a label.
   */
  updateLabel(options: LabelUpdate): Promise<LabelUpdate>;
}
