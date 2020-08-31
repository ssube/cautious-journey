import { InvalidArgumentError } from '@apextoaster/js-utils';
import { createSchema } from '@apextoaster/js-yaml-schema';
import { createConfig, loadFile } from '@apextoaster/js-config';
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
  remote: Omit<RemoteOptions, 'container'>;

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

export const CONFIG_SCHEMA_KEY = 'cautious-journey#/definitions/config';

/**
 * Load the config from files.
 */
export async function initConfig(path: string): Promise<ConfigData> {
  const include = {
    exists: existsSync,
    join,
    read: readFileSync,
    resolve: realpathSync,
    schema: DEFAULT_SAFE_SCHEMA,
  };

  const validator = new Ajv(SCHEMA_OPTIONS);
  validator.addSchema(SCHEMA_DATA, 'cautious-journey');

  const config = createConfig<ConfigData>({
    config: {
      key: CONFIG_SCHEMA_KEY,
      sources: [{
        include,
        name: '.',
        paths: [path],
        type: 'file',
      }],
    },
    process,
    schema: {
      include,
    },
    validator,
  });

  return config.getData();
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
