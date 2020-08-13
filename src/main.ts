import { InvalidArgumentError, isNil } from '@apextoaster/js-utils';
import { createSchema } from '@apextoaster/js-yaml-schema';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SAFE_SCHEMA, safeLoad } from 'js-yaml';
import { join } from 'path';

import { ConfigData } from './config';
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

async function loadConfig(path: string): Promise<ConfigData> {
  const schema = createSchema({
    include: {
      exists: existsSync,
      join,
      read: readFileSync,
      resolve: realpathSync,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  });
  const rawConfig = readFileSync(path, {
    encoding: 'utf-8',
  });
  const config = safeLoad(rawConfig, { schema });

  if (isNil(config) || typeof config === 'string') {
    throw new Error();
  }

  return config as ConfigData;
}

export async function main(argv: Array<string>): Promise<number> {
  let mode = Commands.UNKNOWN as Commands;
  const parser = createParser((argMode) => mode = argMode as Commands);
  const args = parser.parse(argv.slice(SLICE_ARGS));
  const config = await loadConfig(args.config);
  // TODO: create logger

  /* eslint-disable-next-line no-console */
  console.log({
    args,
    config,
    mode,
    version: VERSION_INFO,
  });

  for (const project of config.projects) {
    const remote = new GithubRemote(project.remote);
    await remote.connect();

    // mode switch
    const options: SyncOptions = {
      flags: project.flags,
      project: project.name,
      remote,
      states: project.states,
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
  }

  return 0;
}
