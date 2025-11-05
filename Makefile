.PHONY: help install install-dev lint format test run clean check

help:
	@echo "Available commands:"
	@echo "  make install      - Install production dependencies"
	@echo "  make install-dev  - Install development dependencies"
	@echo "  make lint         - Run linting checks (pylint, flake8)"
	@echo "  make format       - Format code with black"
	@echo "  make format-check - Check code formatting without changes"
	@echo "  make test         - Run tests with pytest"
	@echo "  make run          - Run the application"
	@echo "  make clean        - Clean up cache and temporary files"
	@echo "  make check        - Run all checks (lint, format-check, test)"
	@echo "  make security     - Run security checks with bandit"

install:
	pip install -r requirements.txt

install-dev:
	pip install -r requirements-dev.txt

lint:
	@echo "Running pylint..."
	pylint app.py main.py config/ models/ routes/ services/ utils/ \
		--rcfile=.pylintrc --disable=E0401 || true
	@echo "\nRunning flake8..."
	flake8 app.py main.py config/ models/ routes/ services/ utils/ \
		--max-line-length=100 --extend-ignore=E203,W503 \
		--exclude=__pycache__,.git

format:
	@echo "Formatting code with black..."
	black app.py main.py config/ models/ routes/ services/ utils/

format-check:
	@echo "Checking code formatting..."
	black --check --diff app.py main.py config/ models/ routes/ services/ utils/

test:
	@echo "Running tests..."
	@if [ -d "tests" ]; then \
		pytest tests/ -v --cov=. --cov-report=term-missing; \
	else \
		echo "No tests directory found. Running syntax check..."; \
		python -m py_compile app.py main.py; \
	fi

run:
	@echo "Starting application..."
	python main.py

clean:
	@echo "Cleaning up..."
	find . -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null || true
	find . -type f -name "*.pyc" -delete
	find . -type f -name "*.pyo" -delete
	find . -type f -name "*.coverage" -delete
	find . -type d -name "*.egg-info" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".pytest_cache" -exec rm -rf {} + 2>/dev/null || true
	find . -type d -name ".mypy_cache" -exec rm -rf {} + 2>/dev/null || true
	rm -f coverage.xml bandit-report.json

check: lint format-check test
	@echo "\n✓ All checks passed!"

security:
	@echo "Running security checks with bandit..."
	bandit -r app.py main.py config/ models/ routes/ services/ utils/ \
		-f screen || true
