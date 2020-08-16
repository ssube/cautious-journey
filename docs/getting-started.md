# Getting Started

This guide explains how to start using `cautious-journey` to manage project and issue labels.

## Contents

- [Getting Started](#getting-started)
  - [Contents](#contents)
  - [Setup](#setup)
    - [Installing](#installing)
    - [Running](#running)
    - [Configuring](#configuring)
  - [Labels](#labels)
    - [Flag Labels](#flag-labels)
    - [State Labels](#state-labels)
  - [Projects](#projects)
    - [Configuring Multiple Projects](#configuring-multiple-projects)
    - [Running Select Projects](#running-select-projects)
  - [Remotes](#remotes)
    - [Available Remotes](#available-remotes)
    - [Copying Project Remotes](#copying-project-remotes)
  - [Commands](#commands)
    - [Sync Issue Labels](#sync-issue-labels)
    - [Sync Project Labels](#sync-project-labels)
  - [Changes](#changes)
    - [Flag Changes](#flag-changes)
    - [State Changes](#state-changes)
    - [State Value Changes](#state-value-changes)
  - [Examples](#examples)
    - [Example: Conflicting Labels](#example-conflicting-labels)
    - [Example: Release Workflow](#example-release-workflow)

## Setup

### Installing

To use the latest version of `master` from Docker Hub:

```shell
> docker pull ssube/cautious-journey:master
```

To use the latest release from npm:

```shell
> yarn add -g cautious-journey
```

To use the latest code from Github, following the [developer guide's `setup` and `build` steps](./dev.md).

### Running

To run the Docker image:

```shell
> docker run --rm -it ssube/cautious-journey:master --help
```

TODO: mounting config file into container

To run the npm package:

```shell
> $(yarn global bin)/cautious-journey --help
```

To run the latest code, once it has been built:

```shell
> node --require esm ./out/index.js --help
```

To pretty-print logs for any of the above methods, pipe the output through `bunyan`:

```shell
> docker run --rm -it ssube/cautious-journey:master --help | $(yarn global bin)/bunyan
> $(yarn global bin)/cautious-journey --help | $(yarn global bin)/bunyan
> node --require esm ./out/index.js --help | ./node_modules/.bin/bunyan
```

### Configuring

Configuration is provided as a YAML file, typically named `~/.cautious-journey.yml`.

Mac OS users may want to omit the leading dot from the filename and use `~/cautious-journey.yml` instead, to make
the file visible in Finder. The hidden filename will be used in examples.

## Labels

Labels are the unit of data being manipulated by cautious-journey. Labels may exist independently (flags) or as part
of a group (state values), with rules to add, remove, and replace labels.

### Flag Labels

Flags exist independently, but have the same rules as other labels:

- `adds`
- `removes`
- `requires`

### State Labels

State labels exist in groups, of which only one value can be set at a time. If multiple values are set, the highest
priority value will be kept, unless some rule removes it.

## Projects

Projects usually map to a repository on some remote service, like Github or Gitlab. Each project can have its own
set of labels and random colors.

### Configuring Multiple Projects

The config file has a `projects` key at its root, containing a list of projects to be processed.

- `colors`
- `flags`
- `name`
- `remote`
- `states`

### Running Select Projects

TODO: how would you run a single project, or a subset?

## Remotes

Remotes abstract the API calls, requests, and writes needed to persist data in some service or file.

### Available Remotes

The following remote services are supported:

- Github

Support for more is planned:

- File
- Gitlab

### Copying Project Remotes

TODO: how would you share a remote config block between two projects?

## Commands

The program can run in a few different modes:

- sync issue labels
- sync project labels

### Sync Issue Labels

This mode will look through each issue on the project, open or closed, and check for label updates. Labels will
be resolved using the project's rules, and a comment left recording any changes.

### Sync Project Labels

This mode will look through the project labels, ensuring they are up to date with the project labels in the
config. Missing labels will be created, extra labels will be deleted, and existing labels will be updated to
match the config.

## Changes

Every change can add or remove flags, but certain labels may have their own rules.

### Flag Changes

- `adds`: labels to be added, `{ name: string }`
- `removes`: labels to be removed, `{ name: string }`
- `requires`:
  - all required labels must be present
  - if any required labels are missing, _this flag_ will be removed
  - `adds`/`removes` rules will not be run if this flag is removed

### State Changes

States have the base rules:

- `adds`: labels to be added
- `removes`: labels to be removed

### State Value Changes

State values have the base rules, which will be combined with their parent state's `adds`/`removes`, as well as
a list of potential state changes that may replace the value, if matching labels exist.

- `becomes`
  - `adds`: labels to be added
  - `matches`:
    - all matched labels must be present
    - if any matched labels are missing, this change will be skipped
    - `adds`/`removes` rules will not be run if this change is skipped
    - if this change is run, _this value_ will be removed
  - `removes`: labels to be removed

## Examples

### Example: Conflicting Labels

TODO: describe a workflow with `blocked` as a flag that removes any `status`

### Example: Release Workflow

TODO: describe a workflow with `status` state and `next`/`release` flags
