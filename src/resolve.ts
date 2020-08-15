import { FlagLabel, getValueName, prioritySort, StateLabel } from './labels';

/**
 * How a label changed.
 */
export enum ChangeVerb {
  EXISTING = 'existing',
  CREATED = 'created',
  REMOVED = 'removed',
  REQUIRED = 'required',
}

/**
 * Details of a label change.
 */
export interface ChangeRecord {
  /**
   * The label which caused this change.
   */
  cause: string;

  /**
   * How the label was changed.
   */
  effect: ChangeVerb;

  /**
   * The label being changed.
   */
  label: string;
}

export interface ErrorRecord {
  error: Error;
  label: string;
}

/**
 * Collected inputs for a resolver run.
 */
export interface ResolveInput {
  flags: Array<FlagLabel>;
  labels: Array<string>;
  states: Array<StateLabel>;
}

/**
 * Collected results from a resolver run.
 */
export interface ResolveResult {
  changes: Array<ChangeRecord>;
  errors: Array<ErrorRecord>;
  labels: Array<string>;
}

/**
 * Resolve the desired set of labels, given a starting set and the flags/states to be
 * applied.
 */
/* eslint-disable-next-line sonarjs/cognitive-complexity */
export function resolveLabels(options: ResolveInput): ResolveResult {
  const activeLabels = new Set(options.labels);
  const changes: Array<ChangeRecord> = [];
  const errors: Array<ErrorRecord> = [];

  const sortedFlags = prioritySort(options.flags);
  for (const flag of sortedFlags) {
    const { name } = flag;

    if (activeLabels.has(name)) {
      // TODO: check requires rule
      let removed = false;
      for (const requiredLabel of flag.requires) {
        if (!activeLabels.has(requiredLabel.name)) {
          activeLabels.delete(name);
          removed = true;
        }
      }

      if (removed) {
        break;
      }

      // TODO: check adds rule
      for (const addedLabel of flag.adds) {
        activeLabels.add(addedLabel.name);
      }

      // TODO: check removes rule
      for (const removedLabel of flag.removes) {
        activeLabels.delete(removedLabel.name);
      }
    }
  }

  const sortedStates = prioritySort(options.states);
  for (const state of sortedStates) {
    const sortedValues = prioritySort(state.values);
    for (const value of sortedValues) {
      const name = getValueName(state, value);
      if (activeLabels.has(name)) {
        // TODO: check higher-priority values
        // TODO: check removes
        // TODO: check requires
        // TODO: check becomes
      }
    }
  }

  return {
    changes,
    errors,
    labels: Array.from(activeLabels),
  };
}
