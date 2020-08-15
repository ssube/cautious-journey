import Ajv from 'ajv';
import { LogLevel, NullLogger } from 'noicejs';

import { FlagLabel, StateLabel } from '../labels';
import { RemoteOptions } from '../remote';
import * as SCHEMA_DATA from './schema.yml';

/**
 * Config data for the app, loaded from CLI or DOM.
 */
export interface ConfigData {
  logger: {
    level: LogLevel;
    name: string;
  };
  projects: Array<{
    /**
     * Color palette for labels without their own.
     */
    colors: Array<string>;

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
  }>;
}

/**
 * Load the config from files or the hosting webpage.
 *
 * @todo
 */
export function initConfig(): ConfigData {
  return {
    logger: {
      level: LogLevel.Info,
      name: '',
    },
    projects: [{
      colors: [],
      flags: [],
      name: '',
      remote: {
        data: {},
        dryrun: true,
        logger: NullLogger.global,
        type: '',
      },
      states: [],
    }],
  };
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

  return ajv.validate('cautious-journey#/definitions/config', it) === true;
}
