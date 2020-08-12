import { Commands, createParser } from './config/args';
import { GithubRemote } from './remote/github';
import { syncIssues, syncLabels, SyncOptions } from './sync';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssues, syncLabels } from './sync';

const SLICE_ARGS = 2;

export async function main(argv: Array<string>): Promise<number> {
  // get arguments
  let mode = Commands.UNKNOWN as Commands;
  const parser = createParser((argMode) => mode = argMode as Commands);
  const args = parser.parse(argv.slice(SLICE_ARGS));

  /* eslint-disable no-console */
  console.log('mode:', mode);
  console.log('args:', args);

  // load config
  // create logger
  // create remote

  // mode switch
  const options: SyncOptions = {
    config: {
      colors: [],
      flags: [],
      remotes: [],
      states: [],
    },
    project: '',
    remote: new GithubRemote(),
  };
  switch (mode) {
    case Commands.ISSUES:
      await syncIssues(options);
      break;
    case Commands.LABELS:
      await syncLabels(options);
      break;
    default:
      console.log('unknown command');
  }

  return 0;
}
