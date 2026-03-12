.PHONY: backend frontend dev clean lint test

backend:
	$(MAKE) -C backend build

frontend:
	$(MAKE) -C frontend build

dev:
	@echo "Starting backend and frontend dev servers..."
	$(MAKE) -C backend run &
	$(MAKE) -C frontend dev &
	wait

clean:
	$(MAKE) -C backend clean
	$(MAKE) -C frontend clean

lint:
	$(MAKE) -C backend lint
	$(MAKE) -C frontend lint

test:
	$(MAKE) -C backend test
	$(MAKE) -C frontend test
