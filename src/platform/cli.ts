import { NotImplementedError } from '@apextoaster/js-utils';
import { SchemaOptions } from '@apextoaster/js-yaml-schema';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SAFE_SCHEMA } from 'js-yaml';
import { join } from 'path';
import { usage } from 'yargs';

export function createMarkup(): void {
  throw new NotImplementedError('not implemented for the CLI');
}

export function createUsage(): typeof usage {
  return usage;
}

export function getSchemaOptions(): SchemaOptions {
  return {
    include: {
      exists: existsSync,
      join,
      read: readFileSync,
      resolve: realpathSync,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  };
}
