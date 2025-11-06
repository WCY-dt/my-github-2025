# Development Guide

This document provides information for developers working on My GitHub 2025.

## Development Setup

### Prerequisites

- Python 3.12 or higher
- pip package manager
- Git
- GitHub OAuth App credentials

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/WCY-dt/my-github-2025.git
   cd my-github-2025
   ```

2. Install production dependencies:

   ```bash
   pip install -r requirements.txt
   ```

3. Install development dependencies:

   ```bash
   pip install -r requirements-dev.txt
   ```

4. Set up environment variables:

   ```bash
   cp .env.example .env
   # Edit .env with your GitHub OAuth credentials
   ```

## Development Workflow

### Using Make Commands

We provide a Makefile for common development tasks:

```bash
# View all available commands
make help

# Install dependencies
make install          # Production only
make install-dev      # Development tools

# Code quality
make lint             # Run linting checks
make format           # Auto-format code
make format-check     # Check formatting without changes

# Testing
make test             # Run tests

# Running
make run              # Start the application

# Cleanup
make clean            # Remove cache and temporary files

# All checks
make check            # Run lint, format-check, and test

# Security
make security         # Run security checks
```

### Pre-commit Hooks

We use pre-commit hooks to ensure code quality. Install them with:

```bash
pip install pre-commit
pre-commit install
```

The hooks will automatically run on every commit and check:

- Trailing whitespace
- File endings
- YAML/JSON syntax
- Large files
- Private keys
- Code formatting (black)
- Linting (flake8, pylint)

### Code Style

- Follow PEP 8 style guidelines
- Use type hints for function parameters and returns
- Maximum line length: 100 characters
- Use docstrings for all functions and classes
- Use lazy formatting for logging statements

### Linting

We use multiple linters to ensure code quality:

```bash
# Run pylint
pylint app.py main.py config/ models/ routes/ services/ utils/ --rcfile=.pylintrc

# Run flake8
flake8 app.py main.py config/ models/ routes/ services/ utils/ \
  --max-line-length=100 --extend-ignore=E203,W503

# Run type checking
mypy app.py main.py --ignore-missing-imports
```

### Formatting

We use Black for code formatting:

```bash
# Format all Python files
black app.py main.py config/ models/ routes/ services/ utils/

# Check formatting without making changes
black --check app.py main.py config/ models/ routes/ services/ utils/
```

### Testing

```bash
# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=. --cov-report=html

# View coverage report
open htmlcov/index.html
```

## CI/CD Pipeline

### GitHub Actions Workflows

We have several automated workflows:

#### 1. Lint and Format Check (`lint.yml`)

- Runs on: Push and PRs to main/develop
- Checks: pylint, black, flake8, mypy
- Purpose: Ensure code quality standards

#### 2. Test (`test.yml`)

- Runs on: Push and PRs to main/develop
- Runs: pytest with coverage
- Purpose: Validate functionality

#### 3. Format Code (`format.yml`)

- Runs on: PRs
- Action: Auto-formats code with black
- Purpose: Maintain consistent code style

#### 4. CI/CD Pipeline (`ci.yml`)

- Runs on: Push to main and PRs
- Checks: Syntax validation, imports, security (bandit, trufflehog)
- Purpose: Comprehensive validation

### Workflow Status

All workflows run automatically on:

- Push to main or develop branches
- Pull requests to main or develop branches

You can view workflow status in the Actions tab of the repository.

## Project Structure

```plaintext
my-github-2025/
├── app.py                 # Flask application factory
├── main.py                # Application entry point
├── config/                # Configuration files
│   └── config.py          # App configuration
├── models/                # Database models
│   └── models.py          # SQLAlchemy models
├── routes/                # Flask blueprints
│   ├── auth.py            # Authentication routes
│   ├── main.py            # Main routes
│   └── api.py             # API endpoints
├── services/              # Business logic
│   ├── github_service.py  # GitHub API client
│   ├── data_service.py    # Data processing
│   └── database_service.py # Database operations
├── utils/                 # Utility functions
│   ├── context.py         # Template context builders
│   ├── decorators.py      # Custom decorators
│   ├── error_handlers.py  # Error handling
│   ├── fetch_data.py      # Data fetching utilities
│   └── logging_config.py  # Logging configuration
├── templates/             # Jinja2 templates
├── static/                # Static assets
│   ├── js/                # JavaScript files
│   ├── style/             # CSS files
│   └── img/               # Images
├── .github/               # GitHub specific files
│   ├── workflows/         # CI/CD workflows
│   └── copilot-instructions.md
├── requirements.txt       # Production dependencies
├── requirements-dev.txt   # Development dependencies
├── Makefile               # Development commands
├── .pylintrc              # Pylint configuration
├── .pre-commit-config.yaml # Pre-commit hooks
└── README.md              # Project documentation
```

## Common Development Tasks

### Adding a New Feature

1. Create a new branch:

   ```bash
   git checkout -b feat/your-feature-name
   ```

2. Make your changes following the code style guidelines

3. Run checks:

   ```bash
   make check
   ```

4. Commit with semantic commit message:

   ```bash
   git commit -m "feat(scope): description"
   ```

5. Push and create a pull request

### Fixing a Bug

1. Create a bug fix branch:

   ```bash
   git checkout -b fix/bug-description
   ```

2. Fix the issue and add tests if applicable

3. Run checks:

   ```bash
   make check
   ```

4. Commit:

   ```bash
   git commit -m "fix(scope): description"
   ```

### Adding Tests

1. Create test file in `tests/` directory (create if it doesn't exist)
2. Write tests using pytest
3. Run tests:

   ```bash
   make test
   ```

## Troubleshooting

### Import Errors

If you encounter import errors, make sure:

- All dependencies are installed: `pip install -r requirements-dev.txt`
- You're in the project root directory
- Python version is 3.12 or higher

### Linting Failures

If linting fails:

1. Run `make format` to auto-fix formatting issues
2. Check the specific error messages
3. Fix remaining issues manually
4. Run `make lint` again

### Database Issues

If you have database issues:

1. Delete the database file: `rm my-github-2025.db`
2. Restart the application: `make run`

## Resources

- [Flask Documentation](https://flask.palletsprojects.com/)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [PEP 8 Style Guide](https://pep8.org/)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [CONTRIBUTING.md](CONTRIBUTING.md)
- [AGENTS.md](AGENTS.md)
