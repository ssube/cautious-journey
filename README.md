# Cautious Journey

Label manager and state machine, for Github and Gitlab.

## Features

- create, delete, and update project labels
- add and remove issue labels
- mutually-exclusive label groups
- state machine between group values
- `dot` graph output

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
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fssube%2Fcautious-journey.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fssube%2Fcautious-journey?ref=badge_shield)

[![Open bug count](https://img.shields.io/github/issues-raw/ssube/cautious-journey/type-bug.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aopen+is%3Aissue+label%3Atype%2Fbug)
[![Open issue count](https://img.shields.io/github/issues-raw/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aopen+is%3Aissue)
[![Closed issue count](https://img.shields.io/github/issues-closed-raw/ssube/cautious-journey.svg)](https://github.com/ssube/cautious-journey/issues?q=is%3Aissue+is%3Aclosed)

[![Renovate badge](https://badges.renovateapi.com/github/ssube/cautious-journey)](https://renovatebot.com)
[![Dependency status](https://img.shields.io/david/ssube/cautious-journey.svg)](https://david-dm.org/ssube/cautious-journey)
[![Dev dependency status](https://img.shields.io/david/dev/ssube/cautious-journey.svg)](https://david-dm.org/ssube/cautious-journey?type=dev)
[![Known vulnerabilities](https://snyk.io/test/github/ssube/cautious-journey/badge.svg)](https://snyk.io/test/github/ssube/cautious-journey)

TODO: code climate maintainability

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
$(yarn global bin)/cautious-journey --help
```

TODO: explain

### Running with Yarn

```shell
$(yarn global bin)/cautious-journey --help
```

TODO: explain

### Logging with Bunyan

```shell
$(yarn global bin)/cautious-journey sync-issues | $(yarn global bin)/bunyan
```

TODO: explain, note stderr for graph output

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

[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2Fssube%2Fcautious-journey.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2Fssube%2Fcautious-journey?ref=badge_large)
