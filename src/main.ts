import { doesExist, InvalidArgumentError, isNil } from '@apextoaster/js-utils';
import { createSchema } from '@apextoaster/js-yaml-schema';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SAFE_SCHEMA, safeLoad } from 'js-yaml';
import { join } from 'path';

import { ConfigData } from './config';
import { Commands, createParser } from './config/args';
import { BunyanLogger } from './logger/bunyan';
import { GithubRemote } from './remote/github';
import { syncIssueLabels, syncLabels, SyncOptions } from './sync';
import { VERSION_INFO } from './version';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssueLabels as syncIssues, syncLabels } from './sync';

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
  const logger = BunyanLogger.create(config.logger);

  logger.info({
    args,
    config,
    mode,
    version: VERSION_INFO,
  }, 'startup environment');

  for (const project of config.projects) {
    const { colors, flags, name, states } = project;

    if (doesExist(args.project) && !args.project.includes(name)) {
      logger.info({ project: name }, 'skipping project');
      continue;
    }

    const remote = new GithubRemote({
      data: project.remote.data,
      dryrun: args.dryrun || project.remote.dryrun,
      logger,
      type: project.remote.type,
    });
    await remote.connect();

    // mode switch
    const options: SyncOptions = {
      colors,
      flags,
      logger,
      project: name,
      remote,
      states,
    };
    switch (mode) {
      case Commands.ISSUES:
        await syncIssueLabels(options);
        break;
      case Commands.LABELS:
        await syncLabels(options);
        break;
      default:
        throw new InvalidArgumentError('unknown command');
    }
  }

  return 0;
}
