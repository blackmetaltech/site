# blackmetal.tech website (static files). Run `make help`.
SHELL := /bin/bash
.SHELLFLAGS := -eo pipefail -c
.DEFAULT_GOAL := help

PORT     ?= 8000
SHOT_DIR ?= build/shots
CHROMIUM ?= chromium

.PHONY: help run test shots clean

help: ## List the targets
	@echo "blackmetal.tech site: make <target>"
	@awk 'BEGIN{FS=":.*## "} /^[a-zA-Z_-]+:.*## /{printf "  make %-8s %s\n",$$1,$$2}' $(MAKEFILE_LIST)
	@echo "Options: PORT=<n> (default $(PORT))"

run: ## Serve the site on http://localhost:PORT (Ctrl-C to stop)
	@echo "Serving the site at http://localhost:$(PORT)/"
	python3 -m http.server $(PORT) --bind 127.0.0.1

test: ## Check the site (links, assets, copy rules)
	node --test scripts/check-site.mjs

shots: ## Screenshot the home page (desktop and phone width) into build/shots
	@mkdir -p $(SHOT_DIR)
	@python3 -m http.server $(PORT) --bind 127.0.0.1 >/dev/null 2>&1 & srv=$$!; \
	trap 'kill $$srv 2>/dev/null' EXIT; sleep 1; \
	$(CHROMIUM) --headless --no-sandbox --hide-scrollbars --virtual-time-budget=4000 --window-size=1280,800 --screenshot=$(SHOT_DIR)/home-desktop.png http://127.0.0.1:$(PORT)/ >/dev/null 2>&1; \
	$(CHROMIUM) --headless --no-sandbox --hide-scrollbars --virtual-time-budget=4000 --window-size=390,844 --screenshot=$(SHOT_DIR)/home-phone.png http://127.0.0.1:$(PORT)/ >/dev/null 2>&1; \
	ls -la $(SHOT_DIR)

clean: ## Remove build outputs (the screenshots)
	rm -rf build
