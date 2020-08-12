export interface LabelQuery {
  project: string;
  name: string;
}

export interface IssueQuery {
  project: string;
  issue: string;
}

export interface CommentUpdate extends IssueQuery {
  comment: string;
}

export interface IssueUpdate extends IssueQuery {
  labels: Array<string>;
  name: string;
}

export interface LabelUpdate extends LabelQuery {
  color: string;
  desc: string;
}

/**
 * Basic functions which every remote API must provide.
 */
export interface Remote {
  /**
   * Add a comment to an issue (for attribution and auditing).
   */
  createComment(options: CommentUpdate): Promise<unknown>;

  /**
   * Create a new label.
   */
  createLabel(options: LabelQuery): Promise<LabelUpdate>;

  /**
   * Delete an existing label.
   */
  deleteLabel(options: LabelQuery): Promise<LabelUpdate>;

  /**
   * Get details of a single issue.
   */
  getIssue(options: IssueQuery): Promise<Array<IssueUpdate>>;

  /**
   * Get details of a single label.
   */
  getLabel(options: LabelQuery): Promise<Array<LabelUpdate>>;

  /**
   * List all issues.
   */
  listIssues(): Promise<Array<IssueUpdate>>;

  /**
   * List all labels.
   */
  listLabels(): Promise<Array<LabelUpdate>>;

  /**
   * Set labels on an issue.
   */
  updateIssue(options: IssueUpdate): Promise<IssueUpdate>;

  updateLabel(options: LabelUpdate): Promise<LabelUpdate>;
}
