import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';
import { Container, Logger } from 'noicejs';
import { alea } from 'seedrandom';

import { initConfig, ProjectConfig } from './config';
import { Commands, createParser, ParsedArgs } from './config/args';
import { dotGraph, graphProject } from './graph';
import { BunyanLogger } from './logger/bunyan';
import { RemoteModule } from './module/RemoteModule';
import { createMarkup } from './platform';
import { Remote, RemoteOptions } from './remote';
import { syncIssueLabels, SyncOptions, syncProjectLabels } from './sync';
import { defaultUntil } from './utils';
import { VERSION_INFO } from './version';

export { FlagLabel, StateLabel } from './labels';
export { createMarkup, createSchema, readFile } from './platform';
export { Remote, RemoteOptions } from './remote';
export { GithubRemote } from './remote/github';
export { GitlabRemote } from './remote/gitlab';
export { resolveProject } from './resolve';
export { syncIssueLabels, syncProjectLabels } from './sync';

const ARGS_START = 2;

export const STATUS_FAILURE = 1;
export const STATUS_SUCCESS = 0;

export async function main(argv: Array<string>): Promise<number> {
  if (argv[0] === 'html') {
    createMarkup();
    return 0;
  }

  let mode = Commands.UNKNOWN as Commands;
  const parser = createParser((argMode) => mode = argMode as Commands);
  const args = parser.parse(argv.slice(ARGS_START));
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
