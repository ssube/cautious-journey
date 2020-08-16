import { createSchema as realSchema } from '@apextoaster/js-yaml-schema';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SAFE_SCHEMA, Schema } from 'js-yaml';
import { join } from 'path';

export function createSchema(): Schema {
  return realSchema({
    include: {
      exists: existsSync,
      join,
      read: readFileSync,
      resolve: realpathSync,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  });
}

export function readFile(path: string): string {
  return readFileSync(path, {
    encoding: 'utf-8',
  });
}
