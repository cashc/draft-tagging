install: clean svg
	NODE_ENV="development" yarn --ignore-engines
	make build-vendor NODE_ENV=development

build-tagging-ui:
	./node_modules/.bin/webpack --config ./webpack/prod.js

dev-tagging-ui:
	NODE_ENV="development" ./node_modules/.bin/webpack-dev-server --config ./webpack/dev.js

build-vendor:
	NODE_ENV="development" ./node_modules/.bin/webpack --config ./webpack/vendor.js

build-vendor-prod:
	NODE_ENV="production" ./node_modules/.bin/webpack --config ./webpack/vendor.js

svg:
	./node_modules/.bin/trove-svgo -f ./public/svg/original -o ./public/svg/optimized --config=.svgo.yml --quiet

clean:
	rm -rf ./public/dist
	rm -rf ./public/svg/optimized/*
