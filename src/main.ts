import { createParser } from './config/args';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssues, syncLabels } from './sync';

export async function main(argv: Array<string>): Promise<number> {
  // get arguments
  const parser = createParser();
  const args = parser.parse(argv.slice(0));

  /* eslint-disable-next-line no-console */
  console.log('args:', args);

  // load config
  // create logger
  // create remote

  // mode switch
  // - sync labels
  // - sync issues

  return 0;
}
