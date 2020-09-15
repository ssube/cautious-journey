import { NotImplementedError } from '@apextoaster/js-utils';
import { SchemaOptions } from '@apextoaster/js-yaml-schema';
import { Schema } from 'js-yaml';
import { usage } from 'yargs';

const SHIM_ERROR = 'load a platform-specific handler';

export function createMarkup(schema: Schema): void {
  throw new NotImplementedError(SHIM_ERROR);
}

export function createUsage(): typeof usage {
  throw new NotImplementedError(SHIM_ERROR);
}

export function getSchemaOptions(): SchemaOptions {
  throw new NotImplementedError(SHIM_ERROR);
}
