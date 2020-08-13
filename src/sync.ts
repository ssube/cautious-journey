import { doesExist, mustExist, NotFoundError } from '@apextoaster/js-utils';

import { FlagLabel, getLabelNames, StateLabel, StateValue } from './labels';
import { Remote, LabelUpdate } from './remote';

// TODO: turn this back on/remove the disable pragma
/* eslint-disable no-console */

export interface SyncOptions {
  flags: Array<FlagLabel>;
  project: string;
  remote: Remote;
  states: Array<StateLabel>;
}

export async function syncIssues(options: SyncOptions): Promise<unknown> {
  const issues = await options.remote.listIssues({
    project: options.project,
  });

  for (const issue of issues) {
    console.log('issue:', issue);
  }

  return undefined;
}

function findSyncLabel(name: string, flags: Array<FlagLabel>, states: Array<StateLabel>): FlagLabel | StateValue {
  const flagIndex = flags.find((it) => it.name === name);
  if (doesExist(flagIndex)) {
    return flagIndex;
  }

  const stateIndex = states.find((it) => name.startsWith(it.name));
  if (doesExist(stateIndex)) {
    const valueIndex = stateIndex.values.find((it) => `${stateIndex.name}/${it.name}` === name);
    if (doesExist(valueIndex)) {
      return valueIndex;
    }
  }

  throw new NotFoundError('label not found');
}

export async function syncLabels(options: SyncOptions): Promise<unknown> {
  const labels = await options.remote.listLabels({
    project: options.project,
  });

  const existingLabels = new Set(labels.map((l) => l.name));
  const expectedLabels = getLabelNames(options.flags, options.states);
  const allLabels = new Set([...expectedLabels, ...existingLabels]);

  for (const label of allLabels) {
    const exists = existingLabels.has(label);
    const expected = expectedLabels.has(label);
    console.log('label:', label, exists, expected);

    if (exists) {
      if (expected) {
        const existingData = mustExist(labels.find((l) => l.name === label));
        const expectedData = findSyncLabel(label, options.flags, options.states);

        await updateLabel(existingData, expectedData);
      } else {
        console.log('remove label:', label);
      }
    } else {
      if (expected) {
        console.log('create label:', label);
      } else {
        // skip
      }
    }
  }

  return undefined;
}

export async function updateLabel(existingData: LabelUpdate, expectedData: FlagLabel | StateValue): Promise<void> {
  const dirty =
    existingData.color !== expectedData.color ||
    existingData.desc !== expectedData.desc;

  if (dirty) {
    console.log('update label:', existingData, expectedData);
  }
}
