# Workflow Guide

This guide covers the basic development workflow for projects based on https://github.com/ssube/rollup-template/.

## Contents

- [Workflow Guide](#workflow-guide)
  - [Contents](#contents)
  - [Common Tasks](#common-tasks)
    - [Branch Development](#branch-development)
    - [Merging Changes](#merging-changes)
    - [Deploying Releases](#deploying-releases)

## Common Tasks

### Branch Development

Development for each issue is done on a different branch:

- select an issue
  - assign it to yourself
  - move it to the `status/progress` state
- `git checkout -b feat/XX-brief-title`
- write some code
- write some tests
- `make ci`
- add or update docs, as needed
- create merge request

Branch names are based on ticket type:

- bug fix: `fix/XX-brief-title`
- feature: `feat/XX-brief-title`

Commit messages use the Conventional Commits specification: https://www.conventionalcommits.org/en/v1.0.0/#summary

Messages should finish the prompt "This commit will..." and follow the form: `type(scope): what will be changed`.

For example:

```none
feat(build): deploy new versions automatically
feat(labels): set flux capacitance per label
fix(sync): stop erasing all labels by accident
```

### Merging Changes

TODO

### Deploying Releases

TODO
