# Architecture Guide

This guide describes the program architecture.

## Contents

- [Architecture Guide](#architecture-guide)
  - [Contents](#contents)
  - [Summary](#summary)
  - [Labels](#labels)
    - [Flag Labels](#flag-labels)
      - [Change Sets](#change-sets)
    - [State Labels](#state-labels)
      - [State Values](#state-values)
      - [State Changes](#state-changes)
  - [Remote](#remote)
    - [Github Remote](#github-remote)
    - [Gitlab Remote](#gitlab-remote)
  - [Sync](#sync)
    - [Sync Issues](#sync-issues)
    - [Sync Projects](#sync-projects)

## Summary

`cautious-journey` is a label manager and state machine for remote APIs. It creates and updates labels to match
the configuration, can replace labels to create complex workflows, and supports multiple projects with shared or
unique labels.

## Labels

Labels come in two varieties: individual flags and mutually-exclusive states. These are equivalent to
checkboxes and radio groups in web forms, with the state changes between values forming a state machine within
each group of state labels.

### Flag Labels

Flag labels are set individually. They support basic change sets, like `adds` and `removes`. While flags are
independent by default, they can depend on other labels in `requires`.

#### Change Sets

If the flag in question is present on an issue, then:

- the labels listed in `adds` will be added
- the labels listed in `removes` will be removed

### State Labels

State labels are set from a group of values. Only one value from each state may be present at a time; if more than
one value exists, the highest priority will be kept. Each value can define a set of potential state changes, which
will replace the current value with another label (flag or state value).

#### State Values

State values are mutually exclusive, but are normal labels in other ways. They support basic change sets, like
`adds` and `removes`, along with a set of potential changes in `becomes`.

#### State Changes

State labels may replace one value with another using normal change rules, with the addition
of a list of matching labels that must be present for the state change to be resolved.

For example, a state with three values like so:

```yaml
projects:
  - name: foo
    flags:
      - name: next
    states:
      - name: status
        values:
          - name: new
            becomes:
              - adds: [status/in-progress]
                matches: [next]
          - name: in-progress
            becomes:
              - adds: [status/done]
                matches: [next]
          - name: done
            becomes:
              - adds: [status/new]
                matches: [next]
```

Each time `cautious-journey` evaluates the labels on this project, any issues with the `status/new` **and** `next`
labels will be promoted to `status/in-progress`, and both the `status/new` and `next` labels will be removed.

## Remote

`cautious-journey` typically connects to some remote service to manage labels there. You can choose which remote
should be used for each project.

### Github Remote

Connects to a Github repository.

- `type: github-remote`
- `data:`
  - `type: app`
    - `appId`
    - `installationId`
    - `privateKey`
  - `type: token`
    - `token`: personal token with `repo` scope

### Gitlab Remote

Connects to a Gitlab repository.

- `type: gitlab-remote`
- `data:`
  - `type: token`
    - `token`: personal access token with `api` scope

## Sync

Update issue labels or the labels themselves.

### Sync Issues

Update issue labels by resolving state changes and other change sets.

### Sync Projects

Update project labels to match the `flags` and `states` provided in the config.

The project config is considered the source of truth when syncing projects, and the remote labels will be
updated to match the config.
