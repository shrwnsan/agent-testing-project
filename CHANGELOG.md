# Changelog

All notable changes to the test project for agents will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Quick Start Guide to README.md for easier onboarding
- Comprehensive origin story and project background in README.md
- Mermaid diagram illustrating the automated testing workflow
- Detailed instructions for using the framework with various AI coding assistants

### Changed
- Enhanced README.md with improved project description and structure
- Simplified Contributing section to reflect lightweight nature of the project
- Updated agent testing plan with correct agent invocation commands
- Improved documentation throughout the project
- Refined AGENT-TESTING-PLAN.md with updated workflow instructions

### Deprecated
- None

### Removed
- None

### Fixed
- Corrected references to test result files in README.md
- Resolved merge conflicts in documentation files

### Security
- None

## [1.0.0] - 2025-09-14

### Added
- Initial project structure
- AuthService implementation with intentional security and code quality issues
- Basic test suite (2 tests)
- Placeholder API documentation
- Project configuration files
- Git initialization
- Agent testing plan and context documentation
- Comprehensive test suite for AuthService (22 tests)
- Detailed API documentation
- Test documentation files
- Agent test results summary (clarifying use of general-purpose agents for simulation)
- Testing methodology documentation
- Test results versioning structure
- Updated agent testing plan with proper invocation instructions

### Changed
- Enhanced API documentation with detailed endpoint information
- Expanded test suite with edge cases and security vulnerability documentation
- Updated documentation to clarify that general-purpose agents were used for simulation
- Updated AGENT-TESTING-PLAN.md with proper agent invocation instructions

### Deprecated
- None

### Removed
- None

### Fixed
- None

### Security
- Intentionally included security vulnerabilities for agent testing:
  - Password hash exposure in responses
  - User enumeration vulnerability
  - Lack of input validation
  - Insecure data storage (in-memory)