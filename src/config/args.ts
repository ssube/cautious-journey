import { usage } from 'yargs';

import { VERSION_INFO } from '../version';

export function createParser() {
  let mode = '';

  function handleMode(argi: string) {
    mode = argi;
  }

  /* eslint-disable-next-line sonarjs/prefer-immediate-return */
  const parser = usage(`Usage: ${VERSION_INFO.package.name} <mode> [options]`)
    .command({
      command: 'sync-issues',
      describe: '',
      handler: handleMode,
    })
    .command({
      command: 'sync-labels',
      describe: '',
      handler: handleMode,
    });

  return parser;
}
