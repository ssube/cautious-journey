import { NotImplementedError } from '@apextoaster/js-utils';
import { Schema } from 'js-yaml';

export function createMarkup(schema: Schema): void {
  throw new NotImplementedError('load a platform-specific handler');
}

export function createSchema(): Schema {
  throw new NotImplementedError('load a platform-specific handler');
}

export function readFile(path: string): string {
  throw new NotImplementedError('load a platform-specific handler');
}
