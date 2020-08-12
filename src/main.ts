import { createParser } from './config/args';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssues, syncLabels } from './sync';

const SLICE_ARGS = 2;
export async function main(argv: Array<string>): Promise<number> {
  // get arguments
  let mode = '';
  const parser = createParser((argMode) => mode = argMode);
  const args = parser.parse(argv.slice(SLICE_ARGS));

  /* eslint-disable no-console */
  console.log('mode:', mode);
  console.log('args:', args);

  // load config
  // create logger
  // create remote

  // mode switch
  // - sync labels
  // - sync issues

  return 0;
}
