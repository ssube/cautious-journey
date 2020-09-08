ci: build test

RUN_CONFIG ?= $(HOME)/.cautious-journey.yml

build-browser:
	SERVE=TRUE NODE_TARGET=browser make build

run-help:
	node --require esm ./out/index.js --help

run-graph:
	node --require esm ./out/index.js graph-labels --config $(RUN_CONFIG)

run-version:
	node --require esm ./out/index.js --version
