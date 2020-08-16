import { NotImplementedError } from '@apextoaster/js-utils';
import { Schema } from 'js-yaml';
import React from 'react';
import ReactDOM from 'react-dom';
import { TextJourney } from '../component/TextJourney';

export function createSchema(): Schema {
  throw new NotImplementedError();
}

export function readFile(path: string): string {
  throw new NotImplementedError();
}

export function createMarkup(): void {
  ReactDOM.render(<TextJourney />, document.getElementById('app-container'));
}
