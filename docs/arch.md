# Architecture Guide

This guide describes the program architecture.

## Contents

- [Architecture Guide](#architecture-guide)
  - [Contents](#contents)
  - [Purpose](#purpose)
  - [Label](#label)
    - [Flag Label](#flag-label)
    - [State Label](#state-label)
      - [State Label Value](#state-label-value)
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

#### State Label Value

Individual values within the state.

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
