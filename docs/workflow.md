# Workflow Guide

This guide covers the basic development workflow for projects based on https://github.com/ssube/rollup-template/.

## Contents

- [Workflow Guide](#workflow-guide)
  - [Contents](#contents)
  - [Common Tasks](#common-tasks)
    - [Branch Development](#branch-development)
    - [Deploying Releases](#deploying-releases)
    - [Merging Changes](#merging-changes)
    - [Test Coverage](#test-coverage)

## Common Tasks

These guides primarily reference terminal commands. If you are using VS Code or Github's desktop client instead:

- [Using Version Control in VS Code](https://code.visualstudio.com/docs/editor/versioncontrol)
- [Contributing and Collaborating Using Github Desktop](https://docs.github.com/en/desktop/contributing-and-collaborating-using-github-desktop/)

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
- create [merge request](#merging-changes)

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

### Deploying Releases

TODO

### Merging Changes

To stage your changes:

```shell
> git add <filename>
# adds a single file to staging
> git add <directoryname>
# adds all files in a single directory to staging
```

To commit your changes to the checked out branch:

```shell
> git commit
# commits any changes you've added to staging
> git commit -a
# commits all files; does not require staging changes first
> git commit -m "your commit message"
# allows you to add your commit message inline
```

To push your local changes to the repository:

```shell
> git push origin <branchname>
```

After you have pushed your local changes, you can create a pull request and merge from Github: [Proposing Changes to Your Work with Pull Requests](https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests)

### Test Coverage

To see how much of your code is covered by your tests:

```shell
> google-chrome ./out/coverage/index.html
# change google-chrome to your web browser of choice
```
