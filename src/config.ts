import { FlagLabel, StateLabel } from './labels';

/**
 * Config data for the app, loaded from CLI or DOM.
 */
export interface ConfigData {
  /**
   * Color palette for labels without their own.
   */
  colors: Array<string>;

  /**
   * Individual flag labels.
   */
  flags: Array<FlagLabel>;

  /**
   * Grouped state labels.
   */
  states: Array<StateLabel>;
}

/**
 * Load the config from files or the hosting webpage.
 *
 * @todo
 */
export function initConfig(): ConfigData {
  return {
    colors: [],
    flags: [],
    states: [],
  };
}
