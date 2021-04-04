import { createConfig } from '@apextoaster/js-config';
import { IncludeOptions } from '@apextoaster/js-yaml-schema';
import Ajv from 'ajv';
import { existsSync, readFileSync, realpathSync } from 'fs';
import { DEFAULT_SCHEMA } from 'js-yaml';
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

  initial: Array<string>;

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
export async function initConfig(path: string, include = SCHEMA_OPTIONS): Promise<ConfigData> {
  const validator = new Ajv(AJV_OPTIONS);
  validator.addSchema(SCHEMA_DATA, 'cautious-journey');

  const config = createConfig<ConfigData>({
    config: {
      key: CONFIG_SCHEMA_KEY,
      sources: [{
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

export const AJV_OPTIONS: Ajv.Options = {
  allErrors: true,
  coerceTypes: 'array',
  missingRefs: 'fail',
  removeAdditional: 'failing',
  schemaId: 'auto',
  useDefaults: true,
  verbose: true,
};

export const SCHEMA_OPTIONS: IncludeOptions = {
  exists: existsSync,
  join,
  read: readFileSync,
  resolve: realpathSync,
  schema: DEFAULT_SCHEMA,
};
