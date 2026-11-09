.PHONY: serve check

PORT ?= 8000

# Preview the site locally with live reload: http://localhost:$(PORT)
serve:
	python3 scripts/serve.py --port $(PORT)

# Check that every local link/image/script in site/ points to a real file
check:
	python3 scripts/check_links.py site
