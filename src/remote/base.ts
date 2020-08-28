import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';

import { CommentUpdate, IssueUpdate, LabelQuery, LabelUpdate, ProjectQuery, Remote, RemoteOptions } from '.';
import { ChangeVerb } from '../resolve';
import { VERSION_INFO } from '../version';

export abstract class BaseRemote<TClient, TOptions extends RemoteOptions> implements Remote {
  protected client?: TClient;
  protected options: TOptions;

  constructor(options: TOptions) {
    this.options = options;
  }

  public abstract connect(): Promise<boolean>;
  public abstract createComment(options: CommentUpdate): Promise<CommentUpdate>;
  public abstract createLabel(options: LabelUpdate): Promise<LabelUpdate>;
  public abstract deleteLabel(options: LabelQuery): Promise<LabelQuery>;
  public abstract listIssues(options: ProjectQuery): Promise<Array<IssueUpdate>>;
  public abstract listLabels(options: ProjectQuery): Promise<Array<LabelUpdate>>;
  public abstract updateIssue(options: IssueUpdate): Promise<IssueUpdate>;
  public abstract updateLabel(options: LabelUpdate): Promise<LabelUpdate>;

  public formatBody(options: CommentUpdate): string {
    const lines = [];
    lines.push(`${VERSION_INFO.package.name} v${VERSION_INFO.package.version} has updated the labels on this issue!`);
    lines.push('');

    for (const change of options.changes) {
      switch (change.effect) {
        case ChangeVerb.CONFLICTED:
          lines.push(`- \`${change.label}\` conflicted with \`${change.cause}\`.`);
          break;
        case ChangeVerb.CREATED:
          lines.push(`- \`${change.label}\` was created by \`${change.cause}\`.`);
          break;
        case ChangeVerb.REMOVED:
          lines.push(`- \`${change.label}\` was removed by \`${change.cause}\`.`);
          break;
        case ChangeVerb.REQUIRED:
          lines.push(`- \`${change.label}\` was removed because it requires \`${change.cause}\`.`);
          break;
        default:
          lines.push(`- an unknown change occurred: \`${JSON.stringify(change)}\`.`);
          break;
      }
    }

    return lines.join('\n');
  }

  public get writeCapable(): boolean {
    return this.options.dryrun === false;
  }

  public get writeClient(): TClient {
    if (doesExist(this.client)) {
      return this.client;
    } else {
      throw new InvalidArgumentError();
    }
  }
}
