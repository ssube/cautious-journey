import { Schema } from 'js-yaml';
import { NotImplementedError } from '@apextoaster/js-utils';

export function createMarkup(): void {
  throw new NotImplementedError('load a platform-specific handler');
}

export function createSchema(): Schema {
  throw new NotImplementedError('load a platform-specific handler');
}

export function readFile(path: string): string {
  throw new NotImplementedError('load a platform-specific handler');
}
