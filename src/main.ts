import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';
import { alea } from 'seedrandom';

import { initConfig } from './config';
import { Commands, createParser } from './config/args';
import { dotGraph, graphLabels } from './graph';
import { BunyanLogger } from './logger/bunyan';
import { GithubRemote } from './remote/github';
import { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync';
import { VERSION_INFO } from './version';

export { FlagLabel, StateLabel } from './labels';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveLabels } from './resolve';
export { syncIssueLabels, syncProjectLabels } from './sync';

const SLICE_ARGS = 2;

export async function main(argv: Array<string>): Promise<number> {
  let mode = Commands.UNKNOWN as Commands;
  const parser = createParser((argMode) => mode = argMode as Commands);
  const args = parser.parse(argv.slice(SLICE_ARGS));
  const config = await initConfig(args.config);
  const logger = BunyanLogger.create(config.logger);

  logger.info({
    mode,
    version: VERSION_INFO,
  }, 'running main');
  logger.debug({
    args,
    config,
  }, 'runtime data');

  for (const project of config.projects) {
    const { name } = project;

    if (doesExist(args.project) && !args.project.includes(name)) {
      logger.info({ project: name }, 'skipping project');
      continue;
    }

    const random = alea(name);
    const remote = new GithubRemote({
      data: project.remote.data,
      dryrun: args.dryrun || project.remote.dryrun || false,
      logger,
      type: project.remote.type,
    });
    await remote.connect();

    // mode switch
    const options: SyncOptions = {
      logger,
      project,
      random,
      remote,
    };
    switch (mode) {
      case Commands.GRAPH:
        const graph = graphLabels(project);
        process.stdout.write(dotGraph(graph));
        break;
      case Commands.ISSUES:
        await syncIssueLabels(options);
        break;
      case Commands.LABELS:
        await syncProjectLabels(options);
        break;
      default:
        throw new InvalidArgumentError('unknown command');
    }
  }

  return 0;
}
