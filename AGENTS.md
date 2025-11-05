# AI Agent Guide for My GitHub 2025

## Introduction

This document provides guidance for AI agents (including GitHub Copilot Workspace, autonomous coding agents, and other AI-powered development tools) working with the My GitHub 2025 codebase.

## Quick Start for AI Agents

### Repository Overview

**My GitHub 2025** is a web application that generates beautiful, comprehensive statistics and visualizations of user activities on GitHub for any given year (2008-2025). It provides insights into commits, issues, pull requests, repositories, languages used, and more.

**Core Technologies:**

- Backend: Flask (Python 3.12+)
- Database: SQLAlchemy with SQLite
- GitHub Integration: GitHub OAuth + GitHub GraphQL API
- Frontend: Vanilla JavaScript + Chart.js
- Templating: Jinja2
- Styling: CSS

### Project Structure

```plaintext
├── app.py                # Flask application factory
├── main.py               # Application entry point
├── config/               # Configuration files
│   └── config.py         # App configuration and constants
├── models/               # Database models
│   └── models.py         # SQLAlchemy models
├── routes/               # Flask blueprints/routes
│   ├── auth.py           # Authentication routes (OAuth)
│   ├── main.py           # Main application routes
│   └── api.py            # API endpoints
├── services/             # Business logic
│   ├── github_service.py # GitHub API interactions
│   ├── data_service.py   # Data processing and statistics
│   └── database_service.py # Database operations
├── utils/                # Utility functions
│   ├── context.py        # Context builders for templates
│   ├── error_handlers.py # Error handling
│   ├── fetch_data.py     # Data fetching utilities
│   ├── logging_config.py # Logging setup
│   └── decorators.py     # Custom decorators
├── templates/            # Jinja2 templates
│   ├── template.html     # Main display template
│   ├── wait.html         # Loading screen
│   └── index.html        # Landing page
├── static/               # Static assets
│   ├── js/               # JavaScript files
│   ├── style/            # CSS files
│   └── img/              # Images and icons
└── requirements.txt      # Python dependencies
```

## Development Workflow

### 1. Setup and Installation

```bash
# Clone the repository
git clone https://github.com/WCY-dt/my-github-2025.git
cd my-github-2025

# Install dependencies (Python 3.12+ required)
pip install -r requirements.txt

# Configure environment variables
cat > .env << EOF
CLIENT_ID=your_github_oauth_client_id
CLIENT_SECRET=your_github_oauth_client_secret
EOF
```

### 2. Running the Application

```bash
# Run in development mode
python main.py

# Or specify environment
export FLASK_ENV=development
python app.py
```

### 3. Code Quality Checks

```bash
# Lint with pylint (configuration in .pylintrc)
pylint app.py routes/ services/ utils/ models/ config/

# Format code (if using black)
black .

# Type checking (if using mypy)
mypy .
```

## Commit Message Guidelines

Follow the [Conventional Commits](https://www.conventionalcommits.org/) specification for semantic commit messages:

### Format

```plaintext
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types

- **feat**: A new feature
- **fix**: A bug fix
- **docs**: Documentation only changes
- **style**: Changes that don't affect code meaning (formatting, whitespace)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **build**: Changes to build system or dependencies
- **ci**: Changes to CI configuration files and scripts
- **chore**: Other changes that don't modify src or test files

### Examples

```bash
feat(github): add support for fetching organization statistics
fix(auth): resolve OAuth callback timeout issue
docs(readme): update installation instructions for Python 3.12
refactor(data): extract statistics calculation to separate service
perf(api): optimize GitHub GraphQL queries to reduce API calls
chore(deps): update Flask to latest version
```

### Best Practices

- Use present tense (`add` not `added`)
- Use imperative mood (`move` not `moves`)
- Keep first line under 72 characters
- Reference issues/PRs in footer when applicable
- Break long descriptions into body paragraphs

## Key Concepts for AI Agents

### Architecture Understanding

#### 1. **Flask Application Structure**

- Uses application factory pattern (`create_app()` in `app.py`)
- Blueprints for modular routing (auth, main, api)
- Before-request handlers for authentication checks
- Configuration management through Config classes

#### 2. **Authentication Flow**

```plaintext
User                    App                     GitHub OAuth
 |                       |                            |
 |---(1) Click Login---->|                            |
 |                       |---(2) Redirect to OAuth--->|
 |                       |                            |
 |<------(3) Authorize-------------------------------|
 |                       |                            |
 |---(4) Callback------->|                            |
 |                       |---(5) Exchange Token------>|
 |                       |<---(6) Access Token--------|
 |                       |                            |
 |<--(7) Redirect to Dashboard                       |
```

#### 3. **Data Fetching and Processing**

- GitHub API (REST and GraphQL) for fetching user data
- Data processing in `data_service.py` to calculate statistics
- Results stored in SQLite database for caching
- Context builders prepare data for template rendering

### Critical Features

#### GitHub API Integration

- **OAuth Authentication**: Secure user authentication via GitHub
- **GraphQL Queries**: Efficient data fetching with GraphQL
- **REST API Calls**: Fallback for certain endpoints
- **Rate Limiting**: Respects GitHub API rate limits
- **Error Handling**: Graceful handling of API failures

#### Statistics Calculation

- **Commit Analysis**: Frequency, patterns, streaks
- **Repository Insights**: Most committed repos, languages used
- **Activity Trends**: Hour-of-day, day-of-week, monthly patterns
- **Contribution Types**: Commits, issues, PRs, code reviews
- **Conventional Commits**: Parsing and categorizing commit types

#### Data Visualization

- **Commit Heatmap**: Calendar-style visualization of daily commits
- **Charts**: Activity trends using Chart.js
- **Progress Indicators**: Real-time loading feedback
- **Responsive Design**: Mobile-friendly layouts

## Code Style and Best Practices

### Python Code Style

- Follow PEP 8 guidelines
- Use type hints for function parameters and returns
- Maximum line length: 100 characters (see `.pylintrc`)
- Use docstrings for modules, classes, and functions
- Organize imports: standard library, third-party, local

### Flask Best Practices

- Use blueprints for route organization
- Implement proper error handling with custom error handlers
- Use Flask's `current_app` and `g` for app context
- Leverage SQLAlchemy sessions properly
- Implement request validation and sanitization

### Database Operations

- Use SQLAlchemy ORM for database interactions
- Implement proper session management
- Handle database errors gracefully
- Use database migrations for schema changes (if applicable)
- Close sessions after operations

### Security Considerations

- Store OAuth tokens securely (encrypted in database)
- Use Flask sessions with secure settings
- Validate and sanitize all user inputs
- Implement CSRF protection
- Use HTTPS in production
- Never log sensitive data (tokens, secrets)

## Common Development Tasks

### Adding a New Statistic

1. **Update Data Service** (`services/data_service.py`):
   - Add calculation method for the new statistic
   - Fetch necessary data from GitHub API

2. **Update Context Builder** (`utils/context.py`):
   - Include new statistic in context dictionary

3. **Update Template** (`templates/template.html`):
   - Add HTML structure to display the statistic
   - Add JavaScript if interactive visualization needed

4. **Update CSS** (`static/style/main.css`):
   - Style the new component

### Adding a New Route

1. Choose appropriate blueprint (auth, main, api)
2. Define route with proper HTTP methods
3. Implement authentication checks if needed
4. Add error handling
5. Return appropriate responses (JSON or rendered template)

### Modifying GitHub API Queries

1. Update query in `services/github_service.py`
2. Handle API response and errors
3. Transform data into usable format
4. Update type hints and docstrings
5. Test with various user profiles

## Testing Checklist

Before committing changes, verify:

- [ ] Code follows PEP 8 style guidelines
- [ ] All functions have type hints and docstrings
- [ ] No sensitive data (tokens, secrets) in code
- [ ] Error handling implemented for edge cases
- [ ] GitHub API rate limits respected
- [ ] Database operations properly handled
- [ ] Templates render correctly with sample data
- [ ] JavaScript console shows no errors
- [ ] Responsive design works on mobile
- [ ] Authentication flow works correctly
- [ ] Year selection (2008-2025) functions properly

## Common Pitfalls and How to Avoid Them

### 1. GitHub API Rate Limiting

- **Problem**: Exceeding GitHub API rate limits
- **Solution**: Implement caching, batch queries, use GraphQL efficiently

### 2. OAuth Token Management

- **Problem**: Token expiration or invalid tokens
- **Solution**: Implement token refresh, proper error handling

### 3. Database Session Issues

- **Problem**: Database locks or session management errors
- **Solution**: Properly close sessions, use context managers

### 4. Large Data Processing

- **Problem**: Timeout when processing users with extensive activity
- **Solution**: Implement background processing, show loading states

### 5. Year-Specific Data

- **Problem**: Incorrect year filtering in queries
- **Solution**: Ensure all queries properly filter by selected year

## Debugging Tips

### Flask Debugging

- Enable debug mode: `FLASK_ENV=development`
- Use Flask's built-in debugger
- Check logs in console output
- Use `print()` or `logging` for debugging (remove before committing)

### GitHub API Debugging

- Check response status codes
- Verify OAuth token validity
- Monitor rate limit headers
- Use GitHub's API explorer for testing queries

### Frontend Debugging

- Open browser developer console
- Check Network tab for API requests
- Verify data format in page source
- Test with different user profiles

## Dependencies Management

### Current Key Dependencies

- `Flask`: Web framework
- `Flask-SQLAlchemy`: Database ORM
- `requests`: HTTP requests to GitHub API
- `python-dotenv`: Environment variable management
- `pytz`: Timezone handling
- `tenacity`: Retry logic for API calls

### Adding New Dependencies

1. **Evaluate necessity**: Is this dependency really needed?
2. **Check compatibility**: Works with Python 3.12+?
3. **Check license**: Ensure license compatibility (project uses MIT)
4. **Check security**: Use `pip audit` or similar tools
5. **Update requirements.txt**: `pip freeze > requirements.txt`

## Security Considerations

### Must Follow

- ✅ Never commit `.env` file or secrets
- ✅ Store OAuth tokens encrypted in database
- ✅ Validate and sanitize all user inputs
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on endpoints
- ✅ Follow GitHub's OAuth best practices

### Must Avoid

- ❌ Logging OAuth tokens or sensitive data
- ❌ Storing plaintext credentials
- ❌ Exposing internal errors to users
- ❌ Making unauthenticated API calls with user data
- ❌ Committing database files with user data

## Documentation Updates

When making changes, update:

- **README.md**: For user-facing features or setup changes
- **README_zh-CN.md**: Keep Chinese version in sync
- **This file (AGENTS.md)**: For new patterns or guidelines
- **Code comments**: For complex logic or algorithms
- **Docstrings**: For all functions and classes

## Useful Resources

### External Documentation

- [Flask Documentation](https://flask.palletsprojects.com/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [GitHub REST API](https://docs.github.com/en/rest)
- [GitHub GraphQL API](https://docs.github.com/en/graphql)
- [Chart.js Documentation](https://www.chartjs.org/docs/)
- [Python 3.12 Documentation](https://docs.python.org/3.12/)

### GitHub OAuth

- [OAuth Apps Documentation](https://docs.github.com/en/developers/apps/building-oauth-apps)
- [Scopes for OAuth Apps](https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps)

## Questions and Support

If you're an AI agent and encounter:

- **Unclear code**: Check commit history and related files
- **Missing context**: Review README.md and architecture section above
- **Uncertain about approach**: Follow existing patterns in the codebase
- **API issues**: Check GitHub API documentation and rate limits
- **Breaking changes**: Preserve backward compatibility; document changes

## Final Notes for AI Agents

- **Prioritize user privacy** - handle GitHub data responsibly
- **Respect rate limits** - GitHub API has strict limits
- **Keep it simple** - avoid over-engineering
- **Test with real data** - use your own GitHub account for testing
- **Follow Python conventions** - PEP 8, type hints, docstrings
- **Think about year ranges** - ensure features work for 2008-2025
- **Document complex logic** - help future developers (human or AI)
- **Handle errors gracefully** - provide helpful feedback to users

Good luck, and happy coding! 🚀
