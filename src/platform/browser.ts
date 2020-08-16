import { NotImplementedError } from '@apextoaster/js-utils';
import { Schema } from 'js-yaml';

export function createSchema(): Schema {
  throw new NotImplementedError();
}

export function readFile(path: string): string {
  throw new NotImplementedError();
}

/* eslint-disable-next-line */
(window as any).readFile = readFile;
