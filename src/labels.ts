/**
 * A reference to another label.
 */
export interface LabelRef {
  name: string;
}

/**
 * A set of labels to add and/or remove.
 */
export interface LabelSet {
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
  requires: Array<unknown>;
}

/**
 * Individual labels: the equivalent of a checkbox.
 */
export interface FlagLabel extends BaseLabel, LabelSet {
  /* empty */
}

/**
 * The transition between two state values.
 */
export interface StateChange extends LabelSet {
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
export interface StateLabel extends BaseLabel, LabelSet {
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
      labels.push(valueName(state, value));
    }
  }

  return new Set(labels);
}

export function splitName(name: string): Array<string> {
  return name.split('/');
}

export function valueName(state: StateLabel, value: StateValue): string {
  return `${state.name}/${value.name}`;
}
