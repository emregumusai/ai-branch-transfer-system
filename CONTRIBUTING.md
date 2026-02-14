# Contributing to AI-Powered Customer Branch Transfer

First off, thank you for considering contributing to this project! 🎉

The following is a set of guidelines for contributing. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)
- [Project Structure](#project-structure)
- [Testing](#testing)

---

## Code of Conduct

This project and everyone participating in it is governed by our commitment to providing a welcoming and inclusive environment. By participating, you are expected to uphold this code.

**Expected Behavior:**
- Use welcoming and inclusive language
- Be respectful of differing viewpoints
- Accept constructive criticism gracefully
- Focus on what is best for the community

**Unacceptable Behavior:**
- Harassment, discriminatory language, or personal attacks
- Publishing others' private information without permission
- Any conduct that could be considered inappropriate in a professional setting

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates. When you create a bug report, include as many details as possible using our [bug report template](../../issues/new?template=bug_report.yml).

**Good Bug Reports Include:**
- Clear and descriptive title
- Exact steps to reproduce the problem
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment details (OS, browser, Node version)
- Error messages and stack traces

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. Use our [feature request template](../../issues/new?template=feature_request.yml) to submit suggestions.

**Good Feature Requests Include:**
- Clear use case description
- Expected benefits
- Potential implementation approach
- Alternative solutions considered
- Mockups or examples (if applicable)

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Make your changes** following our coding standards
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write meaningful commit messages** following our conventions
6. **Submit a pull request** using our PR template

**PR Best Practices:**
- Keep PRs focused on a single concern
- Include screenshots for UI changes
- Link related issues
- Request review from maintainers
- Be responsive to feedback

---

## Development Setup

### Prerequisites

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git**
- **Mistral AI API Key** (get from [console.mistral.ai](https://console.mistral.ai))

### Local Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ai-branch-transfer-system.git
cd ai-branch-transfer-system

# Add upstream remote
git remote add upstream https://github.com/emregumusai/ai-branch-transfer-system.git

# Backend setup
cd AIMusteriSubeDevir/backend
npm install
echo "MISTRAL_API_KEY=your_key_here" > .env
node app.js

# Frontend setup (in new terminal)
cd AIMusteriSubeDevir/frontend
npm install
$env:PORT=3001; npm start  # Windows PowerShell
# export PORT=3001 && npm start  # Linux/Mac
```

### Keeping Your Fork Synced

```bash
git fetch upstream
git checkout main
git merge upstream/main
git push origin main
```

---

## Coding Standards

### JavaScript/React Standards

**General Rules:**
- Use ES6+ syntax
- Prefer functional components over class components
- Use React Hooks for state management
- Keep components small and focused (< 300 lines)
- Extract reusable logic into custom hooks

**Naming Conventions:**
```javascript
// Components: PascalCase
const UserGreeting = () => { };

// Functions/variables: camelCase
const calculateDistance = () => { };
const userPreferences = [];

// Constants: SCREAMING_SNAKE_CASE
const MAX_RETRY_COUNT = 3;

// Files: Match component names
UserGreeting.js  // Component file
user-utils.js    // Utility file
```

**Code Style:**
```javascript
// ✅ Good
const handleSubmit = async (event) => {
  event.preventDefault();
  
  try {
    const result = await submitForm(formData);
    showToast('Success!', 'success');
  } catch (error) {
    console.error('Submission failed:', error);
    showToast('Error occurred', 'error');
  }
};

// ❌ Bad
const handleSubmit = async event => {
    event.preventDefault()
    const result = await submitForm(formData)
    showToast("Success!", "success")
}
```

### Material-UI Guidelines

```javascript
// ✅ Use theme variables
const StyledBox = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2),
}));

// ❌ Avoid hardcoded values
const StyledBox = styled(Box)({
  backgroundColor: '#1E88E5',
  padding: '16px',
});
```

### File Organization

```javascript
// Recommended import order:
// 1. External libraries
import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import axios from 'axios';

// 2. Internal components
import Button from '../common/Button';
import Toast from '../common/Toast';

// 3. Utilities and hooks
import { calculateDistance } from '../../utils/distance.util';
import { useToast } from '../../hooks/useToast';

// 4. Constants and types
import { API_ENDPOINTS } from '../../constants';

// 5. Styles
import './Component.css';
```

---

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format

```
<type>(<scope>): <subject>

[optional body]

[optional footer]
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation only changes
- **style**: Code style changes (formatting, semicolons, etc.)
- **refactor**: Code change that neither fixes a bug nor adds a feature
- **perf**: Performance improvement
- **test**: Adding or updating tests
- **chore**: Maintenance tasks (dependencies, config, etc.)
- **ci**: CI/CD changes
- **build**: Build system changes

### Examples

```bash
# Feature
feat(auth): add social login with Google OAuth
feat(ui): implement dark mode toggle

# Bug fix
fix(drag-drop): resolve coordinate offset in React 18 Strict Mode
fix(api): handle null response from Mistral AI

# Breaking change
feat(ui)!: migrate from inline styles to Material-UI

BREAKING CHANGE: Removed all inline CSS. Components now require MUI theme provider.

# Documentation
docs: update README with v2.0 screenshots
docs(api): add JSDoc comments to scoring service

# Refactoring
refactor(backend): restructure to Clean Architecture pattern
refactor(hooks): extract toast logic into custom hook
```

### Commit Best Practices

- Use imperative mood ("add feature" not "added feature")
- Keep subject line under 72 characters
- Separate subject from body with a blank line
- Use body to explain **what** and **why**, not **how**
- Reference issues and PRs in footer (`Closes #123`, `Fixes #456`)

---

## Project Structure

### Frontend Architecture

```
frontend/src/
├── components/
│   ├── common/           # Reusable UI components
│   │   ├── Button.js
│   │   ├── Toast.js
│   │   ├── Loading.js
│   │   └── ErrorAlert.js
│   └── features/         # Feature-specific components
│       ├── LoginForm.js
│       ├── PreferenceSelector.js
│       └── TercihSiralama.js
├── store/                # Redux state management
│   └── slices/
│       ├── authSlice.js
│       ├── branchSlice.js
│       └── recommendationSlice.js
├── theme/                # Material-UI theme
│   └── theme.js
├── utils/                # Utility functions
└── App.js                # Root component
```

### Backend Architecture (Clean Architecture)

```
backend/src/
├── config/               # Configuration files
├── constants/            # Application constants
├── controllers/          # Request handlers (presentation layer)
├── services/             # Business logic (application layer)
│   ├── ai/
│   ├── branch/
│   └── scoring/
├── repositories/         # Data access (infrastructure layer)
├── middlewares/          # Express middlewares
├── routes/               # API routes
├── validators/           # Input validation
└── utils/                # Helper functions
```

---

## Testing

### Running Tests

```bash
# Frontend tests
cd AIMusteriSubeDevir/frontend
npm test

# Backend tests (when implemented)
cd AIMusteriSubeDevir/backend
npm test
```

### Writing Tests

**Frontend Component Tests:**
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import Button from './Button';

describe('Button Component', () => {
  it('renders with correct label', () => {
    render(<Button label="Click me" />);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const handleClick = jest.fn();
    render(<Button label="Test" onClick={handleClick} />);
    
    fireEvent.click(screen.getByText('Test'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
```

**Backend Service Tests:**
```javascript
const { calculateScore } = require('./scoring.service');

describe('Scoring Service', () => {
  it('calculates correct score for exact preferences', () => {
    const branch = { id: 1, city: 'Istanbul' };
    const preferences = { preferredCity: 'Istanbul' };
    
    const score = calculateScore(branch, preferences);
    expect(score).toBeGreaterThan(0);
  });
});
```

---

## Code Review Process

### As a Contributor

- Be open to feedback
- Respond to comments promptly
- Make requested changes or explain why a change shouldn't be made
- Mark conversations as resolved once addressed

### As a Reviewer

- Be respectful and constructive
- Provide specific, actionable feedback
- Approve PRs that meet standards, even if not perfect
- Use "Request Changes" only for blocking issues

**Review Checklist:**
- [ ] Code follows project standards
- [ ] Tests pass and cover new code
- [ ] Documentation is updated
- [ ] No console errors or warnings
- [ ] UI changes match design intent
- [ ] Performance is acceptable

---

## Release Process

1. **Version Bump:** Update version in `package.json` files
2. **Changelog:** Update `CHANGELOG.md` with release notes
3. **Git Tag:** Create annotated tag (`git tag -a v2.1.0 -m "Release v2.1.0"`)
4. **Push:** `git push origin main --tags`
5. **GitHub Release:** Create release on GitHub with changelog excerpt

---

## Getting Help

- **Documentation:** Check [README.md](README.md) and [CHANGELOG.md](CHANGELOG.md)
- **Issues:** Search [existing issues](../../issues)
- **Discussions:** Start a [GitHub Discussion](../../discussions)
- **Contact:** Reach out to [@emregumusai](https://github.com/emregumusai)

---

## Recognition

Contributors will be recognized in:
- GitHub contributor graph
- Release notes (for significant contributions)
- README acknowledgments (for major features)

---

<div align="center">

**Thank you for contributing! 🙏**

Every contribution, no matter how small, makes a difference.

[Back to README](README.md) · [View Issues](../../issues) · [View PRs](../../pulls)

</div>
