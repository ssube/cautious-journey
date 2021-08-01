import { doesExist, InvalidArgumentError, mustExist } from '@apextoaster/js-utils';
import { Logger } from 'noicejs';

import { ProjectConfig } from './config';
import { getLabelColor, getLabelNames, getValueName } from './labels';
import { LabelUpdate, Remote } from './remote';
import { resolveProject } from './resolve';
import { compareItems, defaultTo, defaultUntil, RandomGenerator } from './utils';

export interface SyncOptions {
  logger: Logger;
  project: ProjectConfig;
  random: RandomGenerator;
  remote: Remote;
}

/**
 * goes through and resolves each issue in the project.
 * if there are changes and no errors, then updates the issue.
 */
export async function syncIssueLabels(options: SyncOptions): Promise<unknown> {
  const { logger, project, remote } = options;
  const issues = await remote.listIssues({
    project: project.name,
  });

  for (const issue of issues) {
    logger.info({ issue }, 'project issue');

    const { changes, errors, labels } = resolveProject({
      flags: project.flags,
      initial: project.initial,
      labels: issue.labels,
      states: project.states,
    });

    logger.debug({ changes, errors, issue, labels }, 'resolved labels');

    // TODO: prompt user if they want to update this particular issue
    const sameLabels = compareItems(issue.labels, labels) || changes.length === 0;
    if (sameLabels === false && errors.length === 0) {
      logger.info({ changes, errors, issue, labels }, 'updating issue');
      await remote.updateIssue({
        ...issue,
        labels,
      });

      if (project.comment) {
        await remote.createComment({
          ...issue,
          changes,
          errors,
        });
      }
    }
  }

  return undefined;
}

export async function syncProjectLabels(options: SyncOptions): Promise<unknown> {
  const { logger, project, remote } = options;

  const labels = await remote.listLabels({
    project: project.name,
  });

  const present = new Set(labels.map((l) => l.name));
  const desired = getLabelNames(project.flags, project.states);
  const combined = new Set([...desired, ...present]);

  for (const label of combined) {
    const exists = present.has(label);
    const expected = desired.has(label);

    logger.info({
      exists,
      expected,
      label,
    }, 'label');

    if (exists) {
      if (expected) {
        const data = mustExist(labels.find((l) => l.name === label));
        await updateLabel(options, data);
      } else {
        logger.warn({ label }, 'remove label');
        await deleteLabel(options, label);
      }
    } else {
      if (expected) {
        logger.info({ label }, 'create label');
        await createLabel(options, label);
      } else {
        // skip
      }
    }
  }

  return undefined;
}

export async function createLabel(options: SyncOptions, name: string) {
  const { project, remote } = options;

  const flag = project.flags.find((it) => name === it.name);
  if (doesExist(flag)) {
    await remote.createLabel({
      color: getLabelColor(project.colors, options.random, flag),
      desc: mustExist(flag.desc),
      name,
      project: project.name,
    });

    return;
  }

  const state = project.states.find((it) => name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => getValueName(state, it) === name);
    if (doesExist(value)) {
      await remote.createLabel({
        color: getLabelColor(project.colors, options.random, state, value),
        desc: defaultUntil(value.desc, state.desc, ''),
        name: getValueName(state, value),
        project: project.name,
      });

      return;
    }
  }
}

export async function deleteLabel(options: SyncOptions, name: string) {
  const { project, remote } = options;

  // TODO: check if label is in use, prompt user if they want to remove it
  await remote.deleteLabel({
    name,
    project: project.name,
  });
}

export async function diffUpdateLabel(options: SyncOptions, prevLabel: LabelUpdate, newLabel: LabelUpdate) {
  const { logger, project } = options;

  const dirty =
    prevLabel.color !== mustExist(newLabel.color) ||
    prevLabel.desc !== mustExist(newLabel.desc);

  if (dirty) {
    const body = {
      color: defaultTo(newLabel.color, prevLabel.color),
      desc: defaultTo(newLabel.desc, prevLabel.desc),
      name: prevLabel.name,
      project: project.name,
    };

    logger.debug({ body, newLabel, oldLabel: prevLabel }, 'updating label');
    const resp = await options.remote.updateLabel(body);
    logger.debug({ resp }, 'update response');
  }
}

export async function updateLabel(options: SyncOptions, label: LabelUpdate): Promise<void> {
  const { project } = options;

  const flag = project.flags.find((it) => label.name === it.name);
  if (doesExist(flag)) {
    const color = getLabelColor(project.colors, options.random, flag);
    return diffUpdateLabel(options, label, {
      color,
      desc: defaultTo(flag.desc, label.desc),
      name: flag.name,
      project: project.name,
    });
  }

  const state = project.states.find((it) => label.name.startsWith(it.name));
  if (doesExist(state)) {
    const value = state.values.find((it) => getValueName(state, it) === label.name);
    if (doesExist(value)) {
      const color = mustExist(getLabelColor(project.colors, options.random, state, value));
      return diffUpdateLabel(options, label, {
        color,
        desc: defaultTo(value.desc, label.desc),
        name: getValueName(state, value),
        project: project.name,
      });
    }
  }

  throw new InvalidArgumentError('label is not present in options');
}
