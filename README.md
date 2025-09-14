# Test Project for Agents

This is a mock project designed to test the capabilities of our subagents team:

1. Code Reviewer
2. Security Code Reviewer
3. Testing Expert
4. Documentation Writer

## Project Structure

- `src/` - Source code directory
- `tests/` - Test files
- `docs/` - Documentation files
- `test-results/` - Versioned test results and documentation
- `package.json` - Project configuration
- `CHANGELOG.md` - Project change history

## Test Scenarios

1. **Code Reviewer**: Review the authentication service for general code quality
2. **Security Code Reviewer**: Review the authentication service for security vulnerabilities
3. **Testing Expert**: Create unit tests for the authentication service
4. **Documentation Writer**: Create API documentation for the authentication service

This project is intentionally simple but contains enough complexity to test all agent capabilities.

## Test Results

Test results are stored in the `test-results/` directory, organized by version:

- `test-results/v1.0.0/` - First comprehensive test using general-purpose agents for simulation (September 2025)

**Important**: The v1.0.0 test used general-purpose agents to simulate our specialized agents rather than invoking the actual agent files directly. For detailed information about the test results and methodology, see `test-results/v1.0.0/SUMMARY.md`.

For a complete history of changes to the test project itself, see `CHANGELOG.md`.