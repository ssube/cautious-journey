import { main } from './main.js';

export { ChangeSet, FlagLabel, StateLabel, StateValue } from './labels.js';
export { Remote, RemoteOptions } from './remote/index.js';
export { GithubRemote } from './remote/github.js';
export { GitlabRemote } from './remote/gitlab.js';
export { ResolveInput, ResolveResult, resolveProject } from './resolve.js';
export { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync.js';

const STATUS_ERROR = 1;

/**
 * This is the main entry-point to the program and the only file not included in the main bundle.
 */
main(process.argv).then((status) => process.exit(status)).catch((err: Error) => {
  // eslint-disable-next-line no-console
  console.error('uncaught error during main:', err.message);
  process.exit(STATUS_ERROR);
});
