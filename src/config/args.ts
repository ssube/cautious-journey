import { usage } from 'yargs';

import { VERSION_INFO } from '../version';

interface Parser<TData> {
  parse(args: Array<string>): TData;
}

interface ParsedArgs {
  remote: string;
}

type Modeback = (mode: string) => void;

export function createParser(modeset: Modeback): Parser<ParsedArgs> {
  /* eslint-disable-next-line sonarjs/prefer-immediate-return */
  const parser = usage(`Usage: ${VERSION_INFO.package.name} <mode> [options]`)
    .command({
      command: 'sync-issues',
      describe: '',
      handler: () => modeset('sync-issues'),
    })
    .command({
      command: 'sync-labels',
      describe: '',
      handler: () => modeset('sync-labels'),
    })
    .options({
      remote: {
        alias: ['r'],
        demand: true,
        type: 'string',
      }
    });

  return parser;
}
