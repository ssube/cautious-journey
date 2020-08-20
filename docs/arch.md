# Architecture Guide

This guide describes the program architecture.

## Contents

- [Architecture Guide](#architecture-guide)
  - [Contents](#contents)
  - [Purpose](#purpose)
  - [Label](#label)
    - [Flag Label](#flag-label)
    - [State Label](#state-label)
      - [State Value](#state-value)
      - [State Changes](#state-changes)
  - [Remote](#remote)
    - [Github Remote](#github-remote)
    - [Gitlab Remote](#gitlab-remote)
  - [Sync](#sync)
    - [Sync Issues](#sync-issues)
    - [Sync Labels](#sync-labels)

## Purpose

`cautious-journey` exists to manage labels and their workflow.

## Label

While `cautious-journey` reads issue data, labels are what it cares about.

### Flag Label

Flag labels are set individually. While they may depend on or even remove each other,
they are not connected directly.

### State Label

State labels are set from a group. Only one value from each state may be set at a time,
and the highest priority value automatically replaces any others.

#### State Value

Individual values within the state.

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

`cautious-journey` manipulates issues and labels that exist on some remote service.

### Github Remote

Connects to a Github repository.

- `path`

### Gitlab Remote

Connects to a Gitlab repository.

- `path`

## Sync

Update issue labels or the labels themselves.

### Sync Issues

Update issue labels.

### Sync Labels

Update project labels.
