import { InvalidArgumentError, isNil } from '@apextoaster/js-utils';
import { safeDump, safeLoad, Schema } from 'js-yaml';
import { observer } from 'mobx-react';
import React from 'react';

import { CONFIG_SCHEMA_KEY, ConfigData, createValidator } from '../config';
import { resolveProject } from '../resolve';

/* eslint-disable no-console */

export interface TextJourneyProps {
  schema: Schema;
  state: {
    config: string;
    labels: string;
    output: string;
  };
}

@observer
export class TextJourney extends React.Component<TextJourneyProps> {
  public render() {
    return <div>
      <div className='demo-config'>
        <textarea onChange={(e) => this.onConfigChange(e)} cols={80} rows={20} defaultValue={this.props.state.config}></textarea>
      </div>
      <div className='demo-labels'>
        <textarea onChange={(e) => this.onLabelChange(e)} cols={80} rows={2} defaultValue={this.props.state.labels}></textarea>
      </div>
      <div className='demo-divider'>
        <button onClick={(e) => this.onResolve(e)}>Resolve!</button>
      </div>
      <div className='demo-output'>
        <textarea value={this.props.state.output} cols={80} rows={20} readOnly></textarea>
      </div>
    </div>;
  }

  public onConfigChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log('text journey config changed', e);

    this.props.state.config = e.target.value;
  }

  public onLabelChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    console.log('text journey labels changed', e);

    this.props.state.labels = e.target.value;
  }

  public async onResolve(e: unknown) {
    console.log('text journey resolve button clicked', e);

    try {
      // parse the demo-input value using the config schema
      const data = safeLoad(this.props.state.config, {
        schema: this.props.schema,
      });

      if (isNil(data) || typeof data === 'string') {
        throw new InvalidArgumentError('data must be an object');
      }

      const schema = createValidator();
      const valid = schema.validate(CONFIG_SCHEMA_KEY, data);
      if (valid !== true) {
        if (Array.isArray(schema.errors)) {
          this.props.state.output = JSON.stringify(schema.errors);
        } else {
          this.props.state.output = 'schema failed without errors';
        }
      }

      // TODO: shouldn't need a cast, but schema.validate only guards for object
      const config = data as ConfigData;

      // calculate expected labels
      const results = [];
      for (const project of config.projects) {
        const result = resolveProject({
          flags: project.flags,
          initial: [],
          labels: this.props.state.labels.split(','),
          states: project.states,
        });

        results.push(result);
      }
      
      // print the results into demo-output
      this.props.state.output = safeDump(results, {
        schema: this.props.schema,
      });
    } catch (err) {
      this.props.state.output = `Uh oh! ${err.message}`;
    }
  }
}
