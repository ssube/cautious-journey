import { FlagLabel, getValueName, prioritySort, StateLabel, BaseLabel } from './labels';

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

  function checkLabelRules(label: BaseLabel) {
    let isRemoved = false;
    if (activeLabels.has(label.name)) {
      for (const requiredLabel of label.requires) {
        if (!activeLabels.has(requiredLabel.name)) {
          activeLabels.delete(label.name);
          isRemoved = true;
        }
      }
    }
    if (isRemoved) {
      return true;
    }

    for (const addedLabel of label.adds) {
      activeLabels.add(addedLabel.name);
    }

    for (const removedLabel of label.removes) {
      activeLabels.delete(removedLabel.name);
    }

    return false;
  }

  const sortedFlags = prioritySort(options.flags);
  for (const flag of sortedFlags) {
    checkLabelRules(flag);
  }

  const sortedStates = prioritySort(options.states);
  for (const state of sortedStates) {
    let firstActive = true;
    const sortedValues = prioritySort(state.values);
    for (const value of sortedValues) {
      const name = getValueName(state, value);
      if (activeLabels.has(name)) {
        if (firstActive) {
          if (!checkLabelRules(state)) {
            break;
          }
          if (!checkLabelRules(value)) {
            break;
          }
          // TODO: check becomes
          firstActive = false;
        } else {
          activeLabels.delete(name);
        }
      }
    }
  }

  return {
    changes,
    errors,
    labels: Array.from(activeLabels),
  };
}
