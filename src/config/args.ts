import { usage } from 'yargs';

import { VERSION_INFO } from '../version';

export enum Commands {
  UNKNOWN = 'unknown',
  ERROR = 'error',
  GRAPH = 'graph-labels',
  ISSUES = 'sync-issues',
  LABELS = 'sync-projects',
}

interface Parser<TData> {
  parse(args: Array<string>): TData;
}

export interface ParsedArgs {
  config: string;
  dryrun: boolean;
  project?: Array<string>;
}

type Modeback = (mode: string) => void;

export function createParser(modeset: Modeback): Parser<ParsedArgs> {
  /* eslint-disable-next-line sonarjs/prefer-immediate-return */
  const parser = usage(`Usage: ${VERSION_INFO.package.name} <mode> [options]`)
    .scriptName(VERSION_INFO.package.name)
    .command({
      command: Commands.GRAPH,
      describe: 'graph label state changes',
      handler: () => modeset(Commands.GRAPH),
    })
    .command({
      command: Commands.ISSUES,
      describe: 'sync issue labels',
      handler: () => modeset(Commands.ISSUES),
    })
    .command({
      command: Commands.LABELS,
      describe: 'sync project labels',
      handler: () => modeset(Commands.LABELS),
    })
    .options({
      config: {
        alias: ['c'],
        demand: true,
        desc: 'Config file path',
        type: 'string',
      },
      dryrun: {
        alias: ['d'],
        default: true,
        demand: false,
        desc: 'Run without updating remote labels',
        type: 'boolean',
      },
      project: {
        alias: ['p'],
        array: true,
        demand: false,
        desc: 'Project names to be run',
        type: 'string',
      },
    })
    .completion()
    .exitProcess(false)
    .fail((msg: string, err: Error) => {
      modeset(Commands.ERROR);
    })
    .help()
    .alias('help', 'h')
    .version(VERSION_INFO.package.version)
    .alias('version', 'v');

  return parser;
}
