import { ConfigData } from './config';
import { getLabelNames } from './labels';
import { Remote } from './remote';

// TODO: turn this back on/remove the disable pragma
/* eslint-disable no-console */

export interface SyncOptions {
  config: ConfigData;
  project: string;
  remote: Remote;
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

export async function syncLabels(options: SyncOptions): Promise<unknown> {
  const labels = await options.remote.listLabels({
    project: options.project,
  });

  const existingLabels = new Set(labels.map((l) => l.name));
  const expectedLabels = getLabelNames(options.config.projects[0].flags, options.config.projects[0].states);

  for (const label of labels) {
    const exists = existingLabels.has(label.name);
    const expected = expectedLabels.has(label.name);

    if (exists) {
      if (expected) {
        console.log('update label:', label);
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
