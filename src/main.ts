import { InvalidArgumentError } from '@apextoaster/js-utils';

import { Commands, createParser } from './config/args';
import { GithubRemote } from './remote/github';
import { syncIssues, syncLabels, SyncOptions } from './sync';
import { VERSION_INFO } from './version';

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

  // load config
  const config = {
    colors: [],
    flags: [],
    remotes: [],
    states: [],
  };

  /* eslint-disable-next-line no-console */
  console.log({
    args,
    config,
    mode,
    version: VERSION_INFO,
  });

  // create logger
  // create remote
  const remote = new GithubRemote({
    data: {},
    type: '',
  });

  // mode switch
  const options: SyncOptions = {
    config,
    project: '',
    remote,
  };
  switch (mode) {
    case Commands.ISSUES:
      await syncIssues(options);
      break;
    case Commands.LABELS:
      await syncLabels(options);
      break;
    default:
      throw new InvalidArgumentError('unknown mode');
  }

  return 0;
}
