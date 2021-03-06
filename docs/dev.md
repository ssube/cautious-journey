# Developer Guide

## Contents

- [Developer Guide](#developer-guide)
  - [Contents](#contents)
  - [Setup](#setup)
    - [Linux](#linux)
    - [Mac OS](#mac-os)
  - [Checking Out the Project](#checking-out-the-project)
  - [Build](#build)
    - [Compiling Typescript](#compiling-typescript)
    - [Running Mocha Tests](#running-mocha-tests)
    - [Running Bundled Code](#running-bundled-code)

## Setup

### Linux

Install NodeSource repository and `node`:

```shell
> curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
> sudo apt-get install -y nodejs
```

- https://github.com/nodesource/distributions/blob/master/README.md#installation-instructions

Install yarnpkg repository and `yarn`:

```shell
> curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
> echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
> sudo apt update && sudo apt install yarn
```

- https://classic.yarnpkg.com/en/docs/install/#debian-stable

### Mac OS

Install `brew`:

```shell
> /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
```

- https://brew.sh/

Install `make`, `node`, and `yarn`:

```shell
> brew install make
> brew install node yarn
```

- https://www.gnu.org/software/make/
- https://formulae.brew.sh/formula/node
- https://classic.yarnpkg.com/en/docs/install/#mac-stable

## Checking Out the Project

Clone the repository:

```shell
> git clone git@github.com:ssube/cautious-journey.git
```

You can also clone the repository through Github Desktop:

- [x-github-client://openRepo/https://github.com/ssube/cautious-journey](x-github-client://openRepo/https://github.com/ssube/cautious-journey)

Change the directory:

```shell
> cd ~/Documents/GitHub/cautious-journey/
```

## Build

Building the app is done through `make` and its targets. To see a list of available targets:

```shell
> make help

Makefile:all                   builds, bundles, and tests the application
Makefile:build                 builds, bundles, and tests the application
Makefile:build-docs            generate html docs
Makefile:build-image           build a docker image
Makefile:clean                 clean up everything added by the default target
Makefile:clean-deps            clean up the node_modules directory
Makefile:clean-target          clean up the target directory
...
```

### Compiling Typescript

```shell
> make
# or
> make ci
```

This will compile the code and run tests.

### Running Mocha Tests

Tests use Mocha: https://mochajs.org/#getting-started

```shell
> make test
```

### Running Bundled Code

```shell
> node ./out/index.js --help
```
