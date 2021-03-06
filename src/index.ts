import { main } from './main';

export { ChangeSet, FlagLabel, StateLabel, StateValue } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { ResolveInput, ResolveResult, resolveProject } from './resolve';
export { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync';

const STATUS_ERROR = 1;

/**
 * This is the main entry-point to the program and the only file not included in the main bundle.
 */
main(process.argv).then((status) => process.exit(status)).catch((err: Error) => {
  // eslint-disable-next-line no-console
  console.error('uncaught error during main:', err.message);
  process.exit(STATUS_ERROR);
});
