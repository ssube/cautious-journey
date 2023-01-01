import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';
import { Container, Logger } from 'noicejs';
import seedrandom from 'seedrandom';

import { initConfig, ProjectConfig } from './config/index.js';
import { Commands, parseArgs, ParsedArgs } from './config/args.js';
import { dotGraph, graphProject } from './graph.js';
import { BunyanLogger } from './logger/bunyan.js';
import { RemoteModule } from './module/RemoteModule.js';
import { Remote, RemoteOptions } from './remote/index.js';
import { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync.js';
import { defaultUntil } from './utils.js';
import { VERSION_INFO } from './version.js';

// eslint-disable-next-line @typescript-eslint/unbound-method
const { alea } = seedrandom;

export { alea as random };
export { FlagLabel, StateLabel } from './labels.js';
export { Remote, RemoteOptions } from './remote/index.js';
export { GithubRemote } from './remote/github.js';
export { GitlabRemote } from './remote/gitlab.js';
export { resolveProject } from './resolve.js';
export { syncIssueLabels, syncProjectLabels } from './sync.js';

const ARGS_START = 2;

export const STATUS_FAILURE = 1;
export const STATUS_SUCCESS = 0;

export async function main(argv: Array<string>): Promise<number> {
  const args = await parseArgs(argv.slice(ARGS_START));
  const config = await initConfig(args.config);
  const logger = BunyanLogger.create(config.logger);

  const { mode } = args;
  logger.info({
    mode,
    version: VERSION_INFO,
  }, 'running main');
  logger.debug({
    args,
    config,
  }, 'runtime data');

  const container = Container.from(new RemoteModule());
  await container.configure();

  for (const project of config.projects) {
    const projectStatus = await mainProject(args, container, logger, mode, project);
    if (projectStatus !== STATUS_SUCCESS) {
      return projectStatus;
    }
  }

  return STATUS_SUCCESS;
}

/* eslint-disable-next-line max-params */
export async function mainProject(args: ParsedArgs, container: Container, logger: Logger, mode: Commands, project: ProjectConfig): Promise<number> {
  const { name } = project;

  if (doesExist(args.project) && !args.project.includes(name)) {
    logger.info({ project: name }, 'skipping project');
    return STATUS_SUCCESS;
  }

  const remote = await container.create<Remote, RemoteOptions>(project.remote.type, {
    data: project.remote.data,
    dryrun: defaultUntil(args.dryrun, project.remote.dryrun, false),
    logger,
    type: project.remote.type,
  });

  const connected = await remote.connect();
  if (!connected) {
    logger.error({ type: project.remote.type }, 'unable to connect to remote');
    return STATUS_FAILURE;
  }

  // mode switch
  const options: SyncOptions = {
    logger,
    project,
    random: alea(name),
    remote,
  };
  switch (mode) {
    case Commands.GRAPH:
      const graph = graphProject(project);
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

  return STATUS_SUCCESS;
}
