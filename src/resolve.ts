import { doesExist } from '@apextoaster/js-utils';

import { BaseLabel, FlagLabel, getValueName, prioritySort, StateLabel } from './labels';
import { defaultUntil } from './utils';

/**
 * How a label changed.
 */
export enum ChangeVerb {
  BECAME = 'became',
  CONFLICTED = 'conflicted',
  CREATED = 'created',
  EXISTING = 'existing',
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
          if (activeLabels.delete(label.name)) {
            changes.push({
              cause: requiredLabel.name,
              effect: ChangeVerb.REQUIRED,
              label: label.name,
            });
          }

          isRemoved = true;
        }
      }
    }

    if (isRemoved) {
      return true;
    }

    for (const addedLabel of label.adds) {
      // Set.add does not return a boolean, unlike the other methods
      if (!activeLabels.has(addedLabel.name)) {
        activeLabels.add(addedLabel.name);
        changes.push({
          cause: label.name,
          effect: ChangeVerb.CREATED,
          label: addedLabel.name,
        });
      }
    }

    for (const removedLabel of label.removes) {
      if (activeLabels.delete(removedLabel.name)) {
        changes.push({
          cause: label.name,
          effect: ChangeVerb.REMOVED,
          label: removedLabel.name,
        });
      }
    }

    return false;
  }

  const sortedFlags = prioritySort(options.flags);
  for (const flag of sortedFlags) {
    checkLabelRules(flag);
  }

  const sortedStates = prioritySort(options.states);
  for (const state of sortedStates) {
    let activeValue;

    const sortedValues = prioritySort(state.values);
    for (const value of sortedValues) {
      const name = getValueName(state, value);
      if (activeLabels.has(name)) {
        if (doesExist(activeValue)) {
          if (activeLabels.delete(name)) {
            changes.push({
              cause: name,
              effect: ChangeVerb.CONFLICTED,
              label: name,
            });
          }
        } else {
          // TODO: combine rules, but use state/value name
          const combinedValue: BaseLabel = {
            adds: [...state.adds, ...value.adds],
            name,
            priority: defaultUntil(value.priority, state.priority, 0),
            removes: [...state.removes, ...value.removes],
            requires: [...state.requires, ...value.requires],
          };

          if (!checkLabelRules(combinedValue)) {
            break;
          }

          // TODO: check becomes rules
          activeValue = name;
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
