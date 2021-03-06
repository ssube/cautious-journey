# Cautious Journey

<p align="center">
  <img align="center" src="docs/logo.png">
</p>
<p align="center">
 Label manager and state machine, for Github and Gitlab.
</p>

## Features

- create, delete, and update project labels
- add and remove issue labels
- mutually-exclusive label groups
- state machine between group values
- `dot` graph output
- supports Github and Gitlab

## Contents

- [Cautious Journey](#cautious-journey)
  - [Features](#features)
  - [Contents](#contents)
  - [Status](#status)
  - [Releases](#releases)
  - [Usage](#usage)
    - [Running with Docker](#running-with-docker)
    - [Running with Yarn](#running-with-yarn)
    - [Logging with Bunyan](#logging-with-bunyan)
    - [Graphing with GraphViz](#graphing-with-graphviz)
  - [Build](#build)
  - [License](#license)

## Status

[![Pipeline status](https://img.shields.io/gitlab/pipeline/ssube/cautious-journey.svg?gitlab_url=https%3A%2F%2Fgit.apextoaster.com&logo=gitlab)](https://git.apextoaster.com/ssube/cautious-journey/commits/master)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=ssube_cautious-journey&metric=ncloc)](https://sonarcloud.io/dashboard?id=ssube_cautious-journey)
[![Test coverage](https://codecov.io/gh/ssube/cautious-journey/branch/master/graph/badge.svg)](https://codecov.io/gh/ssube/cautious-journey)
[![MIT license](https://img.shields.io/github/license/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/blob/master/LICENSE.md)

[![Open bug count](https://img.shields.io/github/issues-raw/ssube/cautious-journey/type-bug.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aopen+is%3Aissue+label%3Atype%2Fbug)
[![Open issue count](https://img.shields.io/github/issues-raw/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aopen+is%3Aissue)
[![Closed issue count](https://img.shields.io/github/issues-closed-raw/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aissue+is%3Aclosed)

[![Renovate badge](https://badges.renovateapi.com/github/ssube/cautious-journey)](https://renovatebot.com)
[![Dependency status](https://img.shields.io/librariesio/github/ssube/cautious-journey)](https://libraries.io/github/ssube/cautious-journey)
[![Known vulnerabilities](https://snyk.io/test/github/ssube/cautious-journey/badge.svg)](https://snyk.io/test/github/ssube/cautious-journey)

[![Maintainability](https://api.codeclimate.com/v1/badges/599b7b2382601f95d7a5/maintainability)](https://codeclimate.com/github/ssube/cautious-journey/maintainability)
[![Technical debt ratio](https://img.shields.io/codeclimate/tech-debt/ssube/cautious-journey.svg)](https://codeclimate.com/github/ssube/cautious-journey/trends/technical_debt)
[![Quality issues](https://img.shields.io/codeclimate/issues/ssube/cautious-journey.svg)](https://codeclimate.com/github/ssube/cautious-journey/issues)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/ssube/cautious-journey.svg?logo=lgtm)](https://lgtm.com/projects/g/ssube/cautious-journey/context:javascript)
[![Total alerts](https://img.shields.io/lgtm/alerts/g/ssube/cautious-journey.svg)](https://lgtm.com/projects/g/ssube/cautious-journey/alerts/)

## Releases

[![github release link](https://img.shields.io/badge/github-release-blue?logo=github)](https://github.com/ssube/cautious-journey/releases)
[![github release version](https://img.shields.io/github/tag/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/releases)
[![github commits since release](https://img.shields.io/github/commits-since/ssube/cautious-journey/v0.1.0.svg)](https://github.com/ssube/cautious-journey/compare/v0.1.0...master)

[![npm package link](https://img.shields.io/badge/npm-package-blue?logo=npm)](https://www.npmjs.com/package/cautious-journey)
[![npm release version](https://img.shields.io/npm/v/cautious-journey.svg)](https://www.npmjs.com/package/cautious-journey)
[![Typescript definitions](https://img.shields.io/npm/types/cautious-journey.svg)](https://www.npmjs.com/package/cautious-journey)

## Usage

cautious-journey can be installed as a Docker image or an npm package:

```shell
> docker pull ssube/cautious-journey
> yarn global add cautious-journey
```

### Running with Docker

```shell
> docker run --rm --it ssube/cautious-journey --help

Usage: cautious-journey <mode> [options]

Commands:
  index.js graph-labels   graph label state changes
  index.js sync-issues    sync issue labels
  index.js sync-projects  sync project labels

Options:
  --help         Show help                                             [boolean]
  --version      Show version number                                   [boolean]
  --config, -c                                               [string] [required]
  --dryrun, -d                                         [boolean] [default: true]
  --project, -p                                                          [array]
```

Docker provides a single output stream, regardless of logger configuration. When running `graph-labels`, turning
the `logger.level` to `warn` or `error` will suppress log messages that could confuse `dot`.

### Running with Yarn

```shell
$(yarn global bin)/cautious-journey --help
```

Yarn will install a copy of the latest `cautious-journey` package into your `$(yarn global dir)` path.

### Logging with Bunyan

```shell
$(yarn global bin)/cautious-journey sync-issues | $(yarn global bin)/bunyan
```

Piping logs through `bunyan` will pretty-print the JSON records that `cautious-journey` emits. When running with
`docker`, note that all program output will be combined into a single stream.

You can also use `jq` to format or filter messages. Logs are line-delimited JSON.

### Graphing with GraphViz

```shell
$(yarn global bin)/cautious-journey graph-labels | dot -Tpng -o /tmp/labels.png
sensible-browser /tmp/labels.png
```

More details can be found in the [getting started guide](./docs/getting-started.md#graphing).

## Build

cautious-journey is built with `make`, `node`, and `yarn`. The [developer guide](./docs/dev.md#setup) has steps
for installing these, or you can use a container that provides them.

Node 12 or better is required, along with Yarn 1.x or better.

## License

Released under [the MIT license](./LICENSE.md).
