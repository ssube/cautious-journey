import { doesExist, mustExist } from '@apextoaster/js-utils';

import { FlagLabel, getLabelNames, StateLabel, valueName } from './labels';
import { LabelUpdate, Remote } from './remote';
import { resolveLabels } from './resolve';
import { defaultTo } from './utils';

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

    const resolution = resolveLabels({
      flags: options.flags,
      labels: issue.labels,
      states: options.states,
    });

    // TODO: prompt user to update this particular issue
    if (resolution.changes.length > 0) {
      console.log('updating issue:', issue, resolution);
      await options.remote.updateIssue({
        ...issue,
        labels: resolution.labels,
      });
    }
  }

  return undefined;
}

export async function syncLabels(options: SyncOptions): Promise<unknown> {
  const labels = await options.remote.listLabels({
    project: options.project,
  });

  const present = new Set(labels.map((l) => l.name));
  const desired = getLabelNames(options.flags, options.states);
  const combined = new Set([...desired, ...present]);

  for (const label of combined) {
    const exists = present.has(label);
    const expected = desired.has(label);
    console.log('label:', label, exists, expected);

    if (exists) {
      if (expected) {
        const data = mustExist(labels.find((l) => l.name === label));
        await syncSingleLabel(options, data);
      } else {
        console.log('remove label:', label);
        await options.remote.deleteLabel({
          name: label,
          project: options.project,
        });
      }
    } else {
      if (expected) {
        console.log('create label:', label);
        await createLabel(options, label);
      } else {
        // skip
      }
    }
  }

  return undefined;
}

export async function createLabel(options: SyncOptions, name: string) {
  const flag = options.flags.find((it) => name === it.name);
  if (doesExist(flag)) {
    await options.remote.createLabel({
      color: mustExist(flag.color),
      desc: mustExist(flag.desc),
      name,
      project: options.project,
    });

    return;
  }

  const state = options.states.find((it) => name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => valueName(state, it) === name);
    if (doesExist(value)) {
      await options.remote.createLabel({
        color: defaultTo(defaultTo(value.color, state.color), ''),
        desc: defaultTo(defaultTo(value.desc, state.desc), ''),
        name: valueName(state, value),
        project: options.project,
      });

      return;
    }
  }
}

export async function syncLabelDiff(options: SyncOptions, current: LabelUpdate, expected: LabelUpdate) {
  const dirty =
    current.color !== expected.color ||
    current.desc !== expected.desc;

  if (dirty) {
    const body = {
      color: defaultTo(expected.color, current.color),
      desc: defaultTo(expected.desc, current.desc),
      name: current.name,
      project: options.project,
    };

    console.log('update label:', current, expected, body);

    const resp = await options.remote.updateLabel(body);

    console.log('update resp:', resp);
  }
}

export async function syncSingleLabel(options: SyncOptions, label: LabelUpdate): Promise<void> {
  const flag = options.flags.find((it) => label.name === it.name);
  if (doesExist(flag)) {
    await syncLabelDiff(options, label, {
      color: defaultTo(flag.color, label.color),
      desc: defaultTo(flag.desc, label.desc),
      name: flag.name,
      project: options.project,
    });

    return;
  }

  const state = options.states.find((it) => label.name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => valueName(state, it) === label.name);
    if (doesExist(value)) {
      await syncLabelDiff(options, label, {
        color: defaultTo(value.color, label.color),
        desc: defaultTo(value.desc, label.desc),
        name: valueName(state, value),
        project: options.project,
      });

      return;
    }
  }
}
