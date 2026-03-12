.PHONY: backend frontend dev clean lint test install help

.DEFAULT_GOAL := help

help: ## Show this help
	@echo "Usage: make [target]"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  %-15s %s\n", $$1, $$2}'

backend: ## Build the Go backend binary
	$(MAKE) -C backend build

frontend: ## Build the frontend production bundle
	$(MAKE) -C frontend build

install: ## Install frontend npm dependencies
	$(MAKE) -C frontend install

# Run both backend and frontend dev servers.
# Ctrl-C kills both processes cleanly.
dev: ## Run backend + frontend dev servers concurrently
	@echo "Starting backend (localhost:8080) and frontend (localhost:5173)..."
	@trap 'kill 0' INT TERM; \
		$(MAKE) -C backend run & \
		$(MAKE) -C frontend dev & \
		wait

clean: ## Remove build artifacts
	$(MAKE) -C backend clean
	$(MAKE) -C frontend clean

lint: ## Lint backend and frontend
	$(MAKE) -C backend lint
	$(MAKE) -C frontend lint

test: ## Run tests in backend and frontend
	$(MAKE) -C backend test
	$(MAKE) -C frontend test
