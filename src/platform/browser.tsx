import { doesExist, mustExist, NotFoundError, NotImplementedError } from '@apextoaster/js-utils';
import { createSchema, SchemaOptions } from '@apextoaster/js-yaml-schema';
import { DEFAULT_SAFE_SCHEMA } from 'js-yaml';
import { observable } from 'mobx';
import React from 'react';
import ReactDOM from 'react-dom';

import '../component/base.scss';
import { TextJourney } from '../component/TextJourney';

export function createUsage() {
  throw new NotImplementedError('argument parser is not implemented for browser target');
}

export function getSchemaOptions(): SchemaOptions {
  return {
    include: {
      exists: (path: string) => doesExist(document.getElementById(path)),
      join: (...path: Array<string>) => path.join('-'),
      read: readFile,
      resolve: (path: string) => `data-${path}`,
      schema: DEFAULT_SAFE_SCHEMA,
    }
  };
}

export function readFile(path: string): string {
  const elem = document.getElementById(path);
  if (doesExist(elem)) {
    return mustExist(elem.textContent);
  } else {
    throw new NotFoundError();
  }
}

export function createMarkup(options: SchemaOptions): void {
  const schema = createSchema(options);
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
