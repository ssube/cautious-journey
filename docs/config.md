# Config

This guide describes the config file format.

## Contents

- [Config](#config)
  - [Contents](#contents)
  - [Logger](#logger)
    - [Logger Name](#logger-name)
    - [Logger Level](#logger-level)
  - [Projects](#projects)
    - [Project Colors](#project-colors)
    - [Project Flags](#project-flags)
    - [Project Name](#project-name)
    - [Project Remote](#project-remote)
      - [Github Remote](#github-remote)
      - [Gitlab Remote](#gitlab-remote)
    - [Project States](#project-states)
      - [Project State Values](#project-state-values)
        - [Project State Values Become](#project-state-values-become)

## Logger

### Logger Name

String.

### Logger Level

String enum.

- debug
- info
- warn
- error

## Projects

### Project Colors

Hex string, no hash: `abcdef`

### Project Flags

Flags are individual labels, which may be set by themselves.

- `adds`: list of labels to be added
- `color`: hex string, no hash
- `desc`: string, long description
- `name`: string
- `removes`: list of labels to be removed

### Project Name

String.

Project path on the remote, including username, group, etc. Slash-delimited.

### Project Remote

- `data`: string map, arbitrary data for the remote
- `type`: string enum, one of `github` or `gitlab`

#### Github Remote

For token authentication, provide a `token` key in the remote `data`. This should be a Github user token with
project scope.

For app authentication:

- `id`: application ID
- `installationId`: installation ID
- `privateKey`: application key material
- `type`: `installation`

#### Gitlab Remote

For token authentication, provide a `token` key in the remote `data`. This should be a Gitlab personal access token
with API scope.

### Project States

States are groups of labels, only one of which may be set at a time.

- `color`: hex string, no hash
- `desc`: string, long description
- `name`: string
- `values`: list of state values

#### Project State Values

- `becomes`: list of potential state changes
- `color`: hex string, no hash
- `desc`: string, long description
- `name`: string, will be appended to the state name

##### Project State Values Become

Potential state changes, which can be applied if all of the `matches` exist.

- `adds`: list of labels to be added
- `matches`: list of labels that must exist
- `removes`: list of labels to be removed
