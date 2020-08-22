import { InvalidArgumentError } from '@apextoaster/js-utils';
import { createSchema } from '@apextoaster/js-yaml-schema';
import Ajv from 'ajv';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SAFE_SCHEMA, safeLoad } from 'js-yaml';
import { LogLevel } from 'noicejs';
import { join } from 'path';

import { FlagLabel, StateLabel } from '../labels';
import { RemoteOptions } from '../remote';
import * as SCHEMA_DATA from './schema.yml';

export interface LoggerConfig {
  level: LogLevel;
  name: string;
}

export interface ProjectConfig {
  /**
   * Color palette for labels without their own.
   */
  colors: Array<string>;

  /**
   * Leave a comment along with any update, explaining the changes that were made.
   *
   * @default `true`
   */
  comment: boolean;

  /**
   * Individual flag labels.
   */
  flags: Array<FlagLabel>;

  /**
   * Project name or path.
   */
  name: string;

  /**
   * Remote APIs.
   */
  remote: RemoteOptions;

  /**
   * Grouped state labels.
   */
  states: Array<StateLabel>;
}

/**
 * Config data for the app, loaded from CLI or DOM.
 */
export interface ConfigData {
  logger: LoggerConfig;
  projects: Array<ProjectConfig>;
}

/**
 * Load the config from files or the hosting webpage.
 *
 * @todo
 */
export async function initConfig(path: string): Promise<ConfigData> {
  const schema = createSchema({
    include: {
      exists: existsSync,
      join,
      read: readFileSync,
      resolve: realpathSync,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  });
  const rawConfig = readFileSync(path, {
    encoding: 'utf-8',
  });
  const config = safeLoad(rawConfig, { schema });

  if (!validateConfig(config)) {
    throw new InvalidArgumentError();
  }

  return config as ConfigData;
}

export const SCHEMA_OPTIONS: Ajv.Options = {
  allErrors: true,
  coerceTypes: 'array',
  missingRefs: 'fail',
  removeAdditional: 'failing',
  schemaId: 'auto',
  useDefaults: true,
  verbose: true,
};


export function validateConfig(it: unknown): it is ConfigData {
  const ajv = new Ajv(SCHEMA_OPTIONS);
  ajv.addSchema(SCHEMA_DATA, 'cautious-journey');

  if (ajv.validate('cautious-journey#/definitions/config', it) === true) {
    return true;
  } else {
    /* eslint-disable-next-line */
    console.error('invalid config', ajv.errors, it);
    return false;
  }
}
