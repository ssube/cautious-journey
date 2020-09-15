import { Config, createConfig } from '@apextoaster/js-config';
import Ajv from 'ajv';
import { LogLevel } from 'noicejs';
import process from 'process';

import { FlagLabel, StateLabel } from '../labels';
import { getSchemaOptions } from '../platform';
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

export const AJV_OPTIONS: Ajv.Options = {
  allErrors: true,
  coerceTypes: 'array',
  missingRefs: 'fail',
  removeAdditional: 'failing',
  schemaId: 'auto',
  useDefaults: true,
  verbose: true,
};

export const CONFIG_SCHEMA_KEY = 'cautious-journey#/definitions/config';

export function createValidator() {
  const validator = new Ajv(AJV_OPTIONS);
  validator.addSchema(SCHEMA_DATA, 'cautious-journey');

  return validator;
}

/**
 * Load the config from files.
 */
export async function initConfig(path: string, schema = getSchemaOptions()): Promise<Config<ConfigData>> {
  const validator = createValidator();
  return createConfig<ConfigData>({
    config: {
      key: CONFIG_SCHEMA_KEY,
      sources: [{
        include: schema.include,
        name: '.',
        paths: [path],
        type: 'file',
      }],
    },
    process,
    schema,
    validator,
  });
}
