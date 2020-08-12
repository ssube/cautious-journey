import { FlagLabel, StateLabel } from './labels';

/**
 * How a label changed.
 */
export enum ChangeEffect {
  EXISTING = 'existing',
  CREATED = 'created',
  REMOVED = 'removed',
  REQUIRED = 'required',
}

/**
 * Details of a label change.
 */
export interface ChangeRecord {
  cause: string;
  effect: ChangeEffect;
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
  errors: Array<unknown>;
  labels: Array<string>;
}

export function resolveLabels(options: ResolveInput): ResolveResult {
  const activeLabels = new Set(options.labels);
  const changes: Array<ChangeRecord> = [];
  const errors: Array<unknown> = [];

  const sortedFlags = options.flags.sort((a, b) => a.priority - b.priority);
  for (const flag of sortedFlags) {
    const { name } = flag;
    if (activeLabels.has(name)) {
      // TODO: check removes
      // TODO: check requires
    }
  }

  const sortedStates = options.states.sort((a, b) => a.priority - b.priority);
  for (const state of sortedStates) {
    for (const value of state.values) {
      const name = `${state.name}/${value.name}`;
      if (activeLabels.has(name)) {
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
