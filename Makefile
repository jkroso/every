REPORTER= spec

all: test/built.js

test:
	@node_modules/.bin/mocha test/*.test.js \
		-R $(REPORTER)

clean:
	@rm -rf dist
	@rm -rf test/built.js

test/built.js: index.js async/* test/*
	@node_modules/.bin/sourcegraph.js test/browser.js \
		--plugins mocha,nodeish \
		| node_modules/.bin/bigfile.js \
			--export null \
			--plugins nodeish,javascript > $@

.PHONY: all test clean browser