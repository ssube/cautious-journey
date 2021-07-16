import { createSchema } from '@apextoaster/js-yaml-schema';
import Ajv from 'ajv';
import { promises } from 'fs';
import { load } from 'js-yaml';
import { LogLevel } from 'noicejs';

import { FlagLabel, StateLabel } from '../labels';
import { RemoteOptions } from '../remote';
import * as SCHEMA_DATA from './schema.yml';

let { readFile } = promises;

export const FILE_ENCODING = 'utf-8';

export type Filesystem = Pick<typeof promises, 'readFile'>;

/**
 * Hook for tests to override the fs fns.
 */
export function setFs(fs: Filesystem) {
  const originalRead = readFile;

  readFile = fs.readFile;

  return () => {
    readFile = originalRead;
  };
}

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
export async function initConfig(path: string): Promise<ConfigData> {
  const schema = createSchema({});
  const validator = new Ajv(AJV_OPTIONS);
  validator.addSchema(SCHEMA_DATA, 'cautious-journey');

  const data = await readFile(path, {
    encoding: 'utf8',
  });

  const config = load(data, {
    schema,
  });

  if (validator.validate(CONFIG_SCHEMA_KEY, config) === true) {
    return config as ConfigData;
  } else {
    throw new Error('invalid config data');
  }
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
