import { LogLevel, NullLogger } from 'noicejs';

import { FlagLabel, StateLabel } from '../labels';
import { RemoteOptions } from '../remote';

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
