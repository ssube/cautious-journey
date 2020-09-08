const { join } = require('path');
const alias = require('rollup-plugin-alias');
const polyfills = require('rollup-plugin-node-polyfills');
const re = require('rollup-plugin-re');
const replace = require('@rollup/plugin-replace');
const styles = require('rollup-plugin-styles');

const flag_browser = process.env['NODE_TARGET'] === 'browser';
const rootPath = process.env['ROOT_PATH'];

module.exports = {
  plugins: {
    pre: [
      alias({
        resolve: ['.tsx', '.ts'],
        entries: {
          '@gitbeaker/node': flag_browser ? join('.', 'node_modules', '@gitbeaker', 'browser', 'dist', 'index.js') : require.resolve('@gitbeaker/node'),
          'find-up': flag_browser ? join(rootPath, 'src', 'platform', 'path') : require.resolve('find-up'),
          'locate-path': flag_browser ? join(rootPath, 'src', 'platform', 'path') : require.resolve('locate-path'),
          'universal-user-agent': join('.', 'node_modules', 'universal-user-agent', flag_browser ? 'dist-web' : 'dist-node', 'index.js'),
          'universal-github-app-jwt': join('.', 'node_modules', 'universal-github-app-jwt', flag_browser ? 'dist-web' : 'dist-node', 'index.js'),
        },
      }),
      alias({
        resolve: ['.tsx', '.ts'],
        entries: {
          './platform': join(rootPath, 'src', 'platform', flag_browser ? 'browser.tsx' : 'cli.ts'),
          '../platform': join(rootPath, 'src', 'platform', flag_browser ? 'browser.tsx' : 'cli.ts'),
        },
      }),
      replace({
        delimiters: ['', ''],
        values: {
          'Object.defineProperty(exports, "__esModule", { value: true });': '/* removed __esModule flag */',
          'exports.isYargsInstance = exports.rebase = exports.Yargs = void 0;': '/* removed Yargs nonsense */',
        },
      }),
      (flag_browser ? replace({
        delimiters: ['', ''],
        values: {
          'var runtimeEnv;': 'var runtimeEnv = "browser";',
          'var global = getGlobal();': '/* var removed */;',
        },
      }) : undefined),
      re({
        patterns: [{
          test: /import (\{.+\}) from "react";/,
          replace: (_, imp) => `import * as React from 'react'; const ${imp} = React;`,
        }, {
          test: /import React from "react";/,
          replace: (_, imp) => `import * as React from 'react';`,
        }, {
          test: /import React from 'react';/,
          replace: (_, imp) => `import * as React from 'react';`,
        }, {
          test: /import (React.*), (\{.+\}) from 'react';/,
          replace: (_, r, imp) => `import * as ${r} from 'react'; const ${imp} = ${r};`,
        }, {
          test: /import ReactDOM from 'react-dom';/,
          replace: (_, imp) => `import * as ReactDOM from 'react-dom';`,
        }, {
          test: /export (\{.+\}) from "react-dom";/,
          replace: (_, imp) => `import * as ReactDOM from 'react-dom'; const ${imp} = ReactDOM; export ${imp};`,
        }],
      }),
    ],
    post: [
      (flag_browser ? styles({
        // ?
      }) : undefined),
      (flag_browser ? polyfills({
        buffer: false,
        process: true,
      }) : undefined),
    ],
  }
};
