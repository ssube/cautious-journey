import { doesExist, mustExist, NotFoundError } from '@apextoaster/js-utils';
import { createSchema as realSchema } from '@apextoaster/js-yaml-schema';
import { DEFAULT_SAFE_SCHEMA, Schema } from 'js-yaml';
import { observable } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';

import { TextJourney } from '../component/TextJourney';


export function createSchema(): Schema {
  return realSchema({
    include: {
      exists: (path: string) => doesExist(document.getElementById(path)),
      join: (...path: Array<string>) => path.join('-'),
      read: readFile,
      resolve: (path: string) => `data-${path}`,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  });
}

export function readFile(path: string): string {
  const elem = document.getElementById(path);
  if (doesExist(elem)) {
    return mustExist(elem.textContent);
  } else {
    throw new NotFoundError();
  }
}

export function createMarkup(schema: Schema): void {
  const state = observable({
    config: `# this field accepts YAML config
projects:
  - name: ssube/cautious-journey
    flags: []
    labels: []
    states: []
    `,
    labels: 'foo,bar',
    output: '',
  });

  ReactDOM.render(<TextJourney
    schema={schema}
    state={state}
  />, document.getElementById('app-container'));
}
