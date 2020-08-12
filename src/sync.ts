import { ConfigData } from './config';
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
    console.log('issue:', issue.name, issue.labels);
  }

  return undefined;
}

export async function syncLabels(options: SyncOptions): Promise<unknown> {
  const labels = await options.remote.listLabels({
    project: options.project,
  });

  for (const label of labels) {
    console.log('label:', label.name);
  }

  return undefined;
}
