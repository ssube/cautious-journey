import { doesExist, mustExist } from '@apextoaster/js-utils';
import { Logger } from 'noicejs';
import { prng } from 'seedrandom';

import { FlagLabel, getLabelColor, getLabelNames, getValueName, StateLabel } from './labels';
import { LabelUpdate, Remote } from './remote';
import { resolveLabels } from './resolve';
import { defaultTo, defaultUntil } from './utils';

export interface SyncOptions {
  /**
   */
  colors: Array<string>;

  /**
   */
  flags: Array<FlagLabel>;

  logger: Logger;
  project: string;
  random: prng;
  remote: Remote;

  /**
   * States from project config.
   */
  states: Array<StateLabel>;
}

/**
 * goes through and resolves each issue in the project.
 * if there are changes and no errors, then updates the issue.
 */
export async function syncIssueLabels(options: SyncOptions): Promise<unknown> {
  const issues = await options.remote.listIssues({
    project: options.project,
  });

  for (const issue of issues) {
    options.logger.info({ issue }, 'project issue');

    const { changes, errors, labels } = resolveLabels({
      flags: options.flags,
      labels: issue.labels,
      states: options.states,
    });

    // TODO: prompt user to update this particular issue
    if (changes.length > 0 && errors.length === 0) {
      options.logger.info({ issue, labels }, 'updating issue');
      await options.remote.updateIssue({
        ...issue,
        labels,
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

    options.logger.info({
      exists,
      expected,
      label,
    }, 'label');

    if (exists) {
      if (expected) {
        const data = mustExist(labels.find((l) => l.name === label));
        await syncSingleLabel(options, data);
      } else {
        options.logger.warn({ label }, 'remove label');
        await options.remote.deleteLabel({
          name: label,
          project: options.project,
        });
      }
    } else {
      if (expected) {
        options.logger.info({ label }, 'create label');
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
      color: getLabelColor(options.colors, options.random, flag),
      desc: mustExist(flag.desc),
      name,
      project: options.project,
    });

    return;
  }

  const state = options.states.find((it) => name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => getValueName(state, it) === name);
    if (doesExist(value)) {
      await options.remote.createLabel({
        color: getLabelColor(options.colors, options.random, state, value),
        desc: defaultUntil(value.desc, state.desc, ''),
        name: getValueName(state, value),
        project: options.project,
      });

      return;
    }
  }
}

export async function syncLabelDiff(options: SyncOptions, oldLabel: LabelUpdate, newLabel: LabelUpdate) {
  const dirty =
    oldLabel.color !== mustExist(newLabel.color) ||
    oldLabel.desc !== mustExist(newLabel.desc);

  if (dirty) {
    const body = {
      color: defaultTo(newLabel.color, oldLabel.color),
      desc: defaultTo(newLabel.desc, oldLabel.desc),
      name: oldLabel.name,
      project: options.project,
    };

    options.logger.debug({ body, newLabel, oldLabel, options }, 'update label');

    const resp = await options.remote.updateLabel(body);

    options.logger.debug({ resp }, 'update resp');
  }
}

export async function syncSingleLabel(options: SyncOptions, label: LabelUpdate): Promise<void> {
  const flag = options.flags.find((it) => label.name === it.name);
  if (doesExist(flag)) {
    const color = getLabelColor(options.colors, options.random, flag);
    await syncLabelDiff(options, label, {
      color,
      desc: defaultTo(flag.desc, label.desc),
      name: flag.name,
      project: options.project,
    });

    return;
  }

  const state = options.states.find((it) => label.name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => getValueName(state, it) === label.name);
    if (doesExist(value)) {
      const color = mustExist(getLabelColor(options.colors, options.random, state, value));
      await syncLabelDiff(options, label, {
        color,
        desc: defaultTo(value.desc, label.desc),
        name: getValueName(state, value),
        project: options.project,
      });

      return;
    }
  }
}
