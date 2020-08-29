import { doesExist } from '@apextoaster/js-utils';

import { BaseLabel, FlagLabel, getValueName, prioritySort, StateLabel, StateValue } from './labels';
import { defaultUntil } from './utils';

/**
 * How a label changed.
 */
export enum ChangeVerb {
  BECAME = 'became',
  CONFLICTED = 'conflicted',
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
function resolveBaseLabel(label: BaseLabel, anticipatedResult: ResolveResult, activeLabels: Set<string>) {
  if (activeLabels.has(label.name) === false) {
    return true;
  }

  for (const requiredLabel of label.requires) {
    if (!activeLabels.has(requiredLabel.name)) {
      if (activeLabels.delete(label.name)) {
        anticipatedResult.changes.push({
          cause: requiredLabel.name,
          effect: ChangeVerb.REQUIRED,
          label: label.name,
        });
      }

      return true;
    }
  }

  for (const addedLabel of label.adds) {
    // Set.add does not return a boolean, unlike the other methods
    if (!activeLabels.has(addedLabel.name)) {
      activeLabels.add(addedLabel.name);
      anticipatedResult.changes.push({
        cause: label.name,
        effect: ChangeVerb.CREATED,
        label: addedLabel.name,
      });
    }
  }

  for (const removedLabel of label.removes) {
    if (activeLabels.delete(removedLabel.name)) {
      anticipatedResult.changes.push({
        cause: label.name,
        effect: ChangeVerb.REMOVED,
        label: removedLabel.name,
      });
    }
  }

  return false;
}

function resolveBecomes(label: BaseLabel, anticipatedResult: ResolveResult, activeLabels: Set<string>, value: StateValue): boolean {
  for (const become of value.becomes) {
    const matches = become.matches.every((l) => activeLabels.has(l.name));

    if (matches) {
      resolveBaseLabel({
        ...label,
        adds: become.adds,
        removes: [...become.matches, ...become.removes],
        requires: [],
      }, anticipatedResult, activeLabels);

      if (activeLabels.delete(name)) {
        anticipatedResult.changes.push({
          cause: name,
          effect: ChangeVerb.REMOVED,
          label: name,
        });
      }
      return true;
    }
  }
  return false;
}

/**
 * Need to ensure that there is only 1 active value for the state
 * If no, remove any lower priority active values for the state
 * Need to run the normal (add, remove) rules
 * Need to run the becomes rules
 */
function resolveState(state: StateLabel, anticipatedResult: ResolveResult, activeLabels: Set<string>) {
  let activeValue;

  const sortedValues = prioritySort(state.values);
  for (const value of sortedValues) {
    const name = getValueName(state, value);
    if (!activeLabels.has(name)) {
      continue;
    }

    if (doesExist(activeValue)) { // there is already an active value
      if (activeLabels.delete(name)) {
        anticipatedResult.changes.push({
          cause: name,
          effect: ChangeVerb.CONFLICTED,
          label: name,
        });
      }

      continue;
    }

    const combinedValue: BaseLabel = {
      adds: [...state.adds, ...value.adds],
      name,
      priority: defaultUntil(value.priority, state.priority, 0),
      removes: [...state.removes, ...value.removes],
      requires: [...state.requires, ...value.requires],
    };

    if (resolveBaseLabel(combinedValue, anticipatedResult, activeLabels)) {
      continue;
    }

    if (resolveBecomes(combinedValue, anticipatedResult, activeLabels, value)) {
      continue;
    }

    activeValue = name;
  }
}

export function resolveProject(options: ResolveInput): ResolveResult {
  const result: ResolveResult = {
    changes: [],
    errors: [],
    labels: [],
  };
  const activeLabels = new Set(options.labels);

  const sortedFlags = prioritySort(options.flags);
  for (const flag of sortedFlags) {
    resolveBaseLabel(flag, result, activeLabels);
  }

  const sortedStates = prioritySort(options.states);
  for (const state of sortedStates) {
    resolveState(state, result, activeLabels);
  }

  result.labels = Array.from(activeLabels).sort();

  return result;
}
