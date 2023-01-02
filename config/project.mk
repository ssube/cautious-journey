RUN_CONFIG ?= $(HOME)/.cautious-journey.yml

run-help:
	node --require esm ./out/index.js --help

run-graph:
	node --require esm ./out/index.js graph-labels --config $(RUN_CONFIG)

run-version:
	node --require esm ./out/index.js --version

upload-climate:
	cc-test-reporter format-coverage -t lcov -o $(TARGET_PATH)/coverage/codeclimate.json -p $(ROOT_PATH) $(TARGET_PATH)/coverage/lcov.info
	cc-test-reporter upload-coverage --debug -i $(TARGET_PATH)/coverage/codeclimate.json -r "$(shell echo "${CODECLIMATE_SECRET}" | base64 -d)"
