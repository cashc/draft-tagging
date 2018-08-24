BIN=./node_modules/.bin

install: clean svg
	NODE_ENV="development" yarn --ignore-engines
	make build-vendor NODE_ENV=development

build:
	${BIN}/webpack --config ./webpack/prod.js

dev:
	NODE_ENV="development" ${BIN}/webpack-dev-server --config ./webpack/dev.js

build-vendor:
	NODE_ENV="development" ${BIN}/webpack --config ./webpack/vendor.js

build-vendor-prod:
	NODE_ENV="production" ${BIN}/webpack --config ./webpack/vendor.js

svg:
	${BIN}/svgo -f ./public/svg/original -o ./public/svg/optimized --config=.svgo.yml --quiet

clean:
	rm -rf ./public/dist
	rm -rf ./public/svg/optimized/*

test: lint jest

lint:
	${BIN}/eslint src *.js --cache --quiet

jest:
	BABEL_ENV=test ${BIN}/jest --config jest.json

jest-watch:
	BABEL_ENV=test ${BIN}/jest --config jest.json --watch --verbose
