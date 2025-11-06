# GitHub Copilot Instructions for My GitHub 2025

## Project Overview

My GitHub 2025 is a web application that generates beautiful statistics and visualizations of user activities on GitHub for any given year (2008-2025). The application uses Flask (Python 3.12+), GitHub OAuth for authentication, and GitHub's GraphQL/REST APIs to fetch and analyze user activity data.

## Project Structure

```
/config       - Configuration files (app settings, constants)
/models       - SQLAlchemy database models
/routes       - Flask blueprints (auth, main, api)
/services     - Business logic (GitHub API, data processing, database)
/utils        - Helper functions (context builders, error handlers, logging)
/templates    - Jinja2 HTML templates
/static       - Static assets (CSS, JavaScript, images)
```

## Technology Stack

### Backend

- **Framework**: Flask (Python 3.12+)
- **Database**: SQLAlchemy with SQLite
- **Authentication**: GitHub OAuth 2.0
- **APIs**: GitHub REST API and GraphQL API
- **HTTP Client**: requests library with tenacity for retries
- **Time Handling**: pytz for timezone support
- **Environment**: python-dotenv for configuration

### Frontend

- **Templating**: Jinja2
- **JavaScript**: Vanilla JS
- **Charts**: Chart.js
- **Styling**: CSS (no framework)

## Development Commands

```bash
# Run the application
python main.py

# Run with specific environment
export FLASK_ENV=development
python app.py

# Lint code (using pylint)
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

```
feat(github): add support for organization statistics
fix(auth): resolve OAuth callback redirect issue
docs(readme): update Python version requirement
refactor(data): extract commit analysis to separate function
perf(api): optimize GraphQL query to reduce API calls
chore(deps): update Flask to version 3.0
```

### Best Practices

- Use present tense (`add` not `added`)
- Use imperative mood (`move` not `moves`)
- Keep first line under 72 characters
- Reference issues/PRs in footer: `Fixes #123`
- Break long descriptions into body paragraphs

## Code Style Guidelines

### General Python

- Follow PEP 8 style guidelines
- Maximum line length: 100 characters (configured in `.pylintrc`)
- Use type hints for function parameters and return values
- Write docstrings for all modules, classes, and functions
- Use meaningful variable and function names

### Import Organization

```python
# Standard library imports
import os
from datetime import datetime

# Third-party imports
from flask import Flask, request
import requests

# Local application imports
from config.config import Config
from services.github_service import GitHubService
```

### Flask Code Style

- Use blueprints for route organization
- Implement proper error handling
- Use Flask's application factory pattern
- Leverage context variables (`current_app`, `g`)
- Keep route handlers thin - delegate to services

### Type Hints

```python
from typing import Dict, List, Optional

def fetch_user_data(username: str, year: int) -> Dict[str, any]:
    """Fetch GitHub user data for a specific year."""
    pass

def calculate_statistics(data: List[Dict]) -> Optional[Dict[str, int]]:
    """Calculate statistics from raw data."""
    pass
```

### Docstrings

Use Google-style docstrings:

```python
def process_commits(commits: List[Dict], year: int) -> Dict[str, int]:
    """Process commit data to extract statistics.
    
    Args:
        commits: List of commit dictionaries from GitHub API
        year: The year to filter commits by
        
    Returns:
        Dictionary containing commit statistics
        
    Raises:
        ValueError: If year is outside valid range (2008-2025)
    """
    pass
```

## Key Features to Understand

### GitHub OAuth Flow

1. User clicks "Sign in with GitHub"
2. Redirect to GitHub authorization page
3. User authorizes the application
4. GitHub redirects back with authorization code
5. Exchange code for access token
6. Store token securely in database
7. Use token for GitHub API requests

### Data Fetching Strategy

- **GraphQL API**: Primary method for fetching user activity data
- **REST API**: Fallback for certain endpoints
- **Caching**: Store processed data in SQLite database
- **Rate Limiting**: Respect GitHub API rate limits
- **Retry Logic**: Use tenacity for handling transient failures

### Statistics Calculated

- Total commits, issues, pull requests
- Commit patterns by hour, day of week, month
- Most active repositories
- Languages used in new repositories
- Conventional commit types
- Longest commit streaks and breaks
- Star counts and followers

## Common Patterns

### Flask Route Definition

```python
from flask import Blueprint, render_template, session, redirect, url_for

main_bp = Blueprint('main', __name__)

@main_bp.route('/dashboard')
def dashboard():
    """Render the dashboard page."""
    if 'access_token' not in session:
        return redirect(url_for('auth.index'))
    
    # Process and render
    return render_template('dashboard.html')
```

### Database Operations

```python
from models.models import db, User

def save_user(user_data: Dict) -> User:
    """Save or update user in database."""
    user = User.query.filter_by(username=user_data['username']).first()
    
    if user:
        # Update existing user
        user.access_token = user_data['access_token']
    else:
        # Create new user
        user = User(**user_data)
        db.session.add(user)
    
    db.session.commit()
    return user
```

### GitHub API Calls

```python
import requests
from tenacity import retry, stop_after_attempt, wait_exponential

@retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=2, max=10))
def fetch_user_profile(access_token: str) -> Dict:
    """Fetch user profile from GitHub API."""
    headers = {
        'Authorization': f'token {access_token}',
        'Accept': 'application/vnd.github.v3+json'
    }
    
    response = requests.get(
        'https://api.github.com/user',
        headers=headers,
        timeout=10
    )
    response.raise_for_status()
    return response.json()
```

## Important Files

- `/app.py` - Flask application factory and initialization
- `/main.py` - Application entry point
- `/config/config.py` - Configuration classes and constants
- `/routes/auth.py` - Authentication routes (OAuth)
- `/routes/main.py` - Main application routes
- `/routes/api.py` - API endpoints
- `/services/github_service.py` - GitHub API interactions
- `/services/data_service.py` - Data processing and statistics
- `/services/database_service.py` - Database operations
- `/templates/template.html` - Main statistics display page
- `/static/js/` - JavaScript for visualizations

## Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
CLIENT_ID=your_github_oauth_client_id
CLIENT_SECRET=your_github_oauth_client_secret
```

### Year Configuration

In `config/config.py`:

```python
PROJECT_YEAR = "2025"  # Current project year
MIN_YEAR = 2008        # Minimum selectable year
CURRENT_YEAR = 2025    # Current year for validation
```

## Security Considerations

### Must Follow

- ✅ Never commit `.env` file or secrets
- ✅ Store OAuth tokens encrypted in database
- ✅ Validate and sanitize all user inputs
- ✅ Use HTTPS in production
- ✅ Implement rate limiting on endpoints
- ✅ Respect GitHub API rate limits and terms of service

### Must Avoid

- ❌ Logging OAuth tokens or sensitive data
- ❌ Storing plaintext credentials
- ❌ Exposing internal errors to users
- ❌ Making unauthenticated API calls with user tokens
- ❌ Committing database files with user data

## Error Handling

Implement comprehensive error handling:

```python
from flask import jsonify
from utils.error_handlers import register_error_handlers

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors."""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors."""
    db.session.rollback()
    return render_template('500.html'), 500
```

## Testing Considerations

When writing tests:

- Mock GitHub API calls
- Test OAuth flow
- Verify database operations
- Test edge cases (no data, large datasets)
- Test year range validation (2008-2025)
- Test error handling and recovery

## Performance Guidelines

- Cache GitHub API responses in database
- Optimize GraphQL queries to fetch only needed data
- Use database indexes for frequently queried fields
- Implement loading states for long operations
- Minimize frontend JavaScript bundle size
- Optimize images and static assets

## Documentation

When making changes:

- Update README.md for user-facing features
- Update README_zh-CN.md (Chinese version)
- Update AGENTS.md for development guidelines
- Add docstrings for new functions and classes
- Comment complex algorithms or non-obvious logic

## Dependencies

Current key dependencies:

- `Flask` - Web framework
- `Flask-SQLAlchemy` - Database ORM
- `requests` - HTTP client for API calls
- `python-dotenv` - Environment variable management
- `pytz` - Timezone handling
- `tenacity` - Retry logic for resilience

## Accessibility

- Ensure UI is keyboard navigable
- Provide appropriate ARIA labels where needed
- Maintain sufficient color contrast
- Support screen readers
- Test with accessibility tools

## Browser Compatibility

- Support modern browsers (Chrome, Firefox, Safari, Edge)
- Test responsive design on mobile devices
- Ensure JavaScript features are compatible
- Gracefully handle JavaScript disabled scenarios

## Helpful Context for AI Tools

- The project focuses on GitHub activity statistics visualization
- Year range is 2008-2025 (GitHub's launch year to current)
- Uses both GitHub GraphQL and REST APIs
- OAuth is required for authentication
- Data is cached in SQLite database
- Supports multiple timezones
- Conventional commit parsing for commit type analysis
- Chart.js used for interactive visualizations
- Python 3.12+ required due to datetime library features
