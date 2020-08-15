import { doesExist, InvalidArgumentError } from '@apextoaster/js-utils';

import { randomItem } from './utils';

/**
 * A reference to another label.
 */
export interface LabelRef {
  name: string;
}

/**
 * A set of labels to add and/or remove.
 */
export interface ChangeSet {
  adds: Array<LabelRef>;
  removes: Array<LabelRef>;
}

/**
 * Common fields for all labels.
 */
export interface BaseLabel {
  /**
   * Label name.
   */
  name: string;

  /**
   * Display color.
   */
  color?: string;
  desc?: string;
  priority: number;
  requires: Array<LabelRef>;
}

/**
 * Individual labels: the equivalent of a checkbox.
 */
export interface FlagLabel extends BaseLabel, ChangeSet {
  /* empty */
}

/**
 * The transition between two state values.
 */
export interface StateChange extends ChangeSet {
  /**
   * Required labels for this state change to occur.
   */
  matches: Array<LabelRef>;
}

/**
 * One of many values for a particular state.
 */
export interface StateValue extends BaseLabel {
  /**
   * State changes that could occur to this value.
   */
  becomes: Array<StateChange>;
}

/**
 * Grouped labels: the equivalent of a radio group.
 */
export interface StateLabel extends BaseLabel, ChangeSet {
  /**
   * Values for this state.
   */
  values: Array<StateValue>;
}

/**
 * Calculate the set of unique names for a list of flags and a list of states, with all state values
 * qualified and included.
 */
export function getLabelNames(flags: Array<FlagLabel>, states: Array<StateLabel>): Set<string> {
  const labels = [];

  for (const flag of flags) {
    labels.push(flag.name);
  }

  for (const state of states) {
    for (const value of state.values) {
      labels.push(getValueName(state, value));
    }
  }

  return new Set(labels);
}

export function splitValueName(name: string): Array<string> {
  return name.split('/');
}

export function getValueName(state: StateLabel, value: StateValue): string {
  return `${state.name}/${value.name}`;
}

/**
 * Sort labels by their priority field, highest first.
 *
 * TODO: add some sort options: high-first or low-first, case-sensitivity
 */
export function prioritySort<TLabel extends BaseLabel>(labels: Array<TLabel>): Array<TLabel> {
  return labels.sort((a, b) => {
    if (a.priority === b.priority) {
      const aName = a.name.toLocaleLowerCase();
      const bName = b.name.toLocaleLowerCase();
      return aName.localeCompare(bName);
    } else {
      // B first for high-to-low
      return b.priority - a.priority;
    }
  });
}

/**
 * Pick a label color, preferring the label data if set, falling back to a randomly selected color.
 *
 * TODO: this is a terrible overload
 */
export function getLabelColor(flag: FlagLabel, colors: Array<string>): string;
export function getLabelColor(state: StateLabel, value: StateValue, colors: Array<string>): string;
export function getLabelColor(label: BaseLabel, colorsOrValue: Array<string> | StateValue, maybeColors?: Array<string>): string {
  if (Array.isArray(colorsOrValue)) {
    const { color } = label;
    if (doesExist(color)) {
      return color;
    } else {
      return randomItem(colorsOrValue);
    }
  } else {
    if (!Array.isArray(maybeColors)) {
      throw new InvalidArgumentError();
    }

    const { color = colorsOrValue.color } = label;
    if (doesExist(color)) {
      return color;
    } else {
      return randomItem(maybeColors);
    }
  }
}
