import { usage } from 'yargs';

import { VERSION_INFO } from '../version';

export enum Commands {
  UNKNOWN = 'unknown',
  ISSUES = 'sync-issues',
  LABELS = 'sync-labels',
}

interface Parser<TData> {
  parse(args: Array<string>): TData;
}

export interface ParsedArgs {
  config: string;
  dryrun: boolean;
  remote: string;
}

type Modeback = (mode: string) => void;

export function createParser(modeset: Modeback): Parser<ParsedArgs> {
  /* eslint-disable-next-line sonarjs/prefer-immediate-return */
  const parser = usage(`Usage: ${VERSION_INFO.package.name} <mode> [options]`)
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
        type: 'string',
      },
      dryrun: {
        alias: ['d'],
        default: true,
        demand: false,
        type: 'boolean',
      },
      remote: {
        alias: ['r'],
        demand: true,
        type: 'string',
      }
    });

  return parser;
}
