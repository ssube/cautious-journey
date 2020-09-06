const { join } = require('path');
const alias = require('rollup-plugin-alias');

module.exports = {
  plugins: [
    alias({
      resolve: ['.tsx', '.ts'],
      entries: {
        '@gitbeaker/node': require.resolve('@gitbeaker/node'),
        'universal-user-agent': join('.', 'node_modules', 'universal-user-agent', 'dist-node', 'index.js'),
        'universal-github-app-jwt': join('.', 'node_modules', 'universal-github-app-jwt', 'dist-node', 'index.js'),
      },
    }),
  ],
};
