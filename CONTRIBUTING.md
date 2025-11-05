# Contributing to My GitHub 2025

Thank you for considering contributing to My GitHub 2025! We welcome contributions from the community. Please follow these guidelines to ensure a smooth contribution process.

## Getting Started

1. **Fork the repository** on GitHub.

2. **Clone your forked repository** to your local machine:

   ```bash
   git clone https://github.com/YOUR_USERNAME/my-github-2025.git
   cd my-github-2025
   ```

3. **Set up your development environment**:

   > **Note**: Python 3.12 or above is required due to datetime library features.

   ```bash
   # Install dependencies
   pip install -r requirements.txt
   
   # Create .env file for OAuth credentials
   cat > .env << EOF
   CLIENT_ID=your_github_oauth_client_id
   CLIENT_SECRET=your_github_oauth_client_secret
   EOF
   ```

4. **Create a GitHub OAuth App** for testing:

   Visit [GitHub Developer Settings](https://github.com/settings/developers) and create a new OAuth App with:
   - Homepage URL: `http://127.0.0.1:5000`
   - Authorization callback URL: `http://127.0.0.1:5000/callback`

5. **Create a new branch** for your feature or bugfix:

   ```bash
   git checkout -b feat/your-feature-name
   ```

## Development Workflow

### Running the Application

```bash
# Start the Flask application
python main.py

# The app will be available at http://127.0.0.1:5000
```

### Code Quality

Before submitting changes, ensure your code meets quality standards:

```bash
# Lint your code with pylint
pylint app.py routes/ services/ utils/ models/ config/

# Format your code (if using black)
black .

# Type checking (if using mypy)
mypy .
```

## Making Changes

1. **Follow the project's coding standards**:

   - Follow PEP 8 Python style guidelines
   - Use type hints for function parameters and returns
   - Write docstrings for all functions and classes
   - Keep functions focused and well-named
   - Maximum line length: 100 characters

2. **Write semantic commit messages** following [Conventional Commits](https://www.conventionalcommits.org/):

   ```plaintext
   <type>(<scope>): <description>
   
   [optional body]
   
   [optional footer]
   ```

   **Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`

   **Examples**:

   ```bash
   feat(github): add support for organization statistics
   fix(auth): resolve OAuth token expiration issue
   docs(readme): update installation instructions
   refactor(data): extract statistics calculation to service
   perf(api): optimize GraphQL query to reduce API calls
   ```

3. **Test your changes thoroughly**:

   - Test with your own GitHub account
   - Verify OAuth flow works correctly
   - Test year selection (2008-2025)
   - Check responsive design on mobile
   - Test edge cases (users with no activity, large datasets)
   - Ensure no console errors in browser

4. **Update documentation**:

   - Update README.md for user-facing changes
   - Update README_zh-CN.md (Chinese version) to keep in sync
   - Add or update docstrings for new/modified functions
   - Update AGENTS.md if adding new development patterns

## Submitting a Pull Request

1. **Ensure all changes are committed**:

   ```bash
   git add .
   git commit -m "feat(scope): description of changes"
   ```

2. **Push your changes** to your forked repository:

   ```bash
   git push origin feat/your-feature-name
   ```

3. **Open a pull request** on the original repository.

4. **Provide a clear description**:

   - Explain what changes you made and why
   - Reference any related issues (e.g., "Fixes #123")
   - Include screenshots for UI changes
   - List any breaking changes
   - Mention if documentation was updated

5. **Ensure CI checks pass** (when CI is configured):

   - All tests must pass
   - Code must be properly linted
   - Build must succeed

6. **Respond to review feedback**:

   - Address reviewer comments promptly
   - Make requested changes in new commits
   - Re-request review after updates

## Code Review Process

- Maintainers will review your PR as soon as possible
- Reviews may request changes to improve code quality, security, or performance
- Once approved, a maintainer will merge your PR
- Your contribution will be acknowledged in release notes

## Types of Contributions

We welcome various types of contributions:

- 🐛 **Bug fixes**: Fix issues reported in GitHub Issues
- ✨ **New features**: Add new functionality (discuss in an issue first)
- 📝 **Documentation**: Improve README, guides, or code comments
- 🎨 **UI/UX improvements**: Enhance user interface or experience
- ⚡ **Performance**: Optimize code for better performance
- 🔒 **Security**: Fix security vulnerabilities
- 🌍 **Internationalization**: Add or improve translations

## Development Guidelines

### Python Code Style

- Follow PEP 8 guidelines
- Use type hints consistently
- Write Google-style docstrings
- Keep functions small and focused
- Use meaningful variable names
- Organize imports (standard, third-party, local)

### Flask Patterns

- Use blueprints for organizing routes
- Implement proper error handling
- Validate and sanitize user inputs
- Use SQLAlchemy for database operations
- Keep route handlers thin - delegate to services

### GitHub API Usage

- Respect rate limits (5000 requests/hour for authenticated users)
- Use GraphQL for efficient data fetching
- Implement retry logic for transient failures
- Handle API errors gracefully
- Cache responses when appropriate

### Security Practices

- Never commit secrets or OAuth tokens
- Store sensitive data encrypted
- Validate all user inputs
- Implement CSRF protection
- Use HTTPS in production
- Follow GitHub's OAuth best practices

### Database Operations

- Use SQLAlchemy ORM consistently
- Handle database sessions properly
- Implement proper error handling
- Close sessions after operations
- Use transactions for related operations

## Project-Specific Considerations

### Year Range

- The application supports years 2008-2025
- Ensure all year-related features respect this range
- Validate year inputs on both client and server
- Update `CURRENT_YEAR` in config when appropriate

### GitHub API Integration

- Primary: GraphQL API for efficient data fetching
- Fallback: REST API for certain endpoints
- Handle rate limiting gracefully
- Implement caching to reduce API calls

### Data Processing

- Calculate statistics efficiently
- Handle large datasets (users with thousands of commits)
- Implement background processing for long operations
- Show loading states to users

## Testing Checklist

Before submitting, verify:

- [ ] Code follows PEP 8 and project style guidelines
- [ ] All functions have type hints and docstrings
- [ ] No sensitive data (tokens, secrets) in code
- [ ] OAuth flow works correctly
- [ ] Year selection functions properly (2008-2025)
- [ ] Statistics are calculated correctly
- [ ] UI is responsive on mobile devices
- [ ] No JavaScript console errors
- [ ] Database operations work correctly
- [ ] Documentation is updated

## Getting Help

- Check the [AGENTS.md](AGENTS.md) file for development guidelines
- Review existing code to understand patterns
- Ask questions in GitHub Issues
- Read the [Flask documentation](https://flask.palletsprojects.com/)
- Check [GitHub API documentation](https://docs.github.com/en/rest)

## Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Focus on what is best for the project
- Show empathy towards other contributors
- Follow the [Code of Conduct](CODE_OF_CONDUCT.md)

## License

By contributing to My GitHub 2025, you agree that your contributions will be licensed under the MIT License.

## Recognition

Contributors will be recognized in:
- GitHub's contributor list
- Release notes for significant contributions
- Special mentions for major features

Thank you for contributing to My GitHub 2025! 🚀
