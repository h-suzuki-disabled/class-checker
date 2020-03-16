.PHONY: all
all: build test deploy

.PHONY: build
build:
	echo build

.PHONY: test
test:
	npm install
	npx eslint *.js public/js/*.js

.PHONY: deploy
deploy:
	npm install
	sudo rsync -av ./ /home/ubuntu/classroom-map/
