import yargs from 'yargs';

import { VERSION_INFO } from '../version.js';

export enum Commands {
  UNKNOWN = 'unknown',
  ERROR = 'error',
  GRAPH = 'graph-labels',
  ISSUES = 'sync-issues',
  LABELS = 'sync-projects',
}

export interface ParsedArgs {
  config: string;
  dryrun: boolean;
  mode: Commands;
  project?: Array<string>;
}

export async function parseArgs(args: Array<string>): Promise<ParsedArgs> {
  let mode = Commands.UNKNOWN;

  const parser = yargs(args)
    .usage(`Usage: ${VERSION_INFO.package.name} <mode> [options]`)
    .scriptName(VERSION_INFO.package.name)
    .command({
      command: Commands.GRAPH,
      describe: 'graph label state changes',
      handler: () => {
        mode = Commands.GRAPH;
      },
    })
    .command({
      command: Commands.ISSUES,
      describe: 'sync issue labels',
      handler: () => {
        mode = Commands.ISSUES;
      },
    })
    .command({
      command: Commands.LABELS,
      describe: 'sync project labels',
      handler: () => {
        mode = Commands.LABELS;
      },
    })
    .option({
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
    .help()
    .alias('help', 'h')
    .version(VERSION_INFO.package.version)
    .alias('version', 'v');

  const argsWithoutMode: Omit<ParsedArgs, 'mode'> = await parser.parse(args);
  return {
    ...argsWithoutMode,
    mode,
  };
}
