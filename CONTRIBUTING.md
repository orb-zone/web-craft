# Contributing to @orb-zone/web-craft

Thank you for your interest in contributing! This document outlines our development process and guidelines.

## Project Overview

**web-craft** is a Bun monorepo containing multiple @orb-zone packages:

- **@orb-zone/dotted** (v2.0.0) - Core JSON dotted path library
- **@orb-zone/surrounded** (v1.0.0) - SurrealDB + Vue 3 integration

## Development Setup

### Prerequisites

- [Bun](https://bun.sh) 1.0+
- Node.js 18+ (for testing compatibility)
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/orb-zone/web-craft.git
cd web-craft

# Install dependencies
bun install
```

### Project Structure

```
web-craft/
├── packages/
│   ├── dotted/          # Core library
│   │   ├── src/         # Source code
│   │   ├── test/        # Test suite
│   │   └── dist/        # Compiled output
│   │
│   └── surrounded/      # SurrealDB integration
│       ├── src/
│       ├── test/
│       └── dist/
│
├── examples/            # Working examples
├── .github/workflows/   # CI/CD pipelines
└── .specify/           # Project documentation
```

## Making Changes

### 1. Create a Feature Branch

```bash
# Create branch from main
git checkout main
git pull origin main
git checkout -b feat/your-feature-name
```

Branch naming conventions:
- `feat/` - New features
- `fix/` - Bug fixes
- `docs/` - Documentation
- `refactor/` - Code refactoring
- `test/` - Test improvements
- `chore/` - Maintenance

### 2. Make Your Changes

**Follow these guidelines:**

#### Code Style
- **Indentation**: 2 spaces
- **Language**: TypeScript with strict mode
- **Imports**: ESM with `.js` extensions
- **No comments**: Unless explaining complex logic

#### Testing (TDD Required)
- Write tests FIRST (RED phase)
- Implement code to pass (GREEN phase)
- Refactor as needed (REFACTOR phase)
- Minimum coverage: 95% of touched code

```bash
# Run tests
bun test

# Watch mode (TDD)
bun test --watch

# Run specific test file
bun test packages/dotted/test/unit/my-feature.test.ts
```

#### Type Safety
- Use strict TypeScript (no `any`)
- Add type annotations for public APIs
- Use `unknown` for untrusted input

```bash
# Type check
bun run type-check
```

#### Bundle Size
- Core library limit: 25 KB
- Check after changes:

```bash
bun run build
ls -lh packages/dotted/dist/index.js
ls -lh packages/surrounded/dist/index.js
```

### 3. Create a Changeset

A changeset describes your changes for automated versioning:

```bash
bun run changeset:add
```

Follow the prompts to select:
1. **Packages affected**: dotted, surrounded, or both
2. **Version bump**: patch, minor, or major
3. **Summary**: What changed and why

This creates a file in `.changeset/` that the release workflow uses.

### 4. Commit Your Changes

```bash
# Stage your changes
git add .

# Commit with semantic message
git commit -m "type(scope): description"

# Examples:
git commit -m "feat(dotted): Add expression caching for performance"
git commit -m "fix(surrounded): Handle null variant values"
git commit -m "docs: Update migration guide"
```

**Commit message format**:
```
type(scope): description

Optional detailed explanation.

Fixes #123
```

Valid types:
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation
- `test` - Test additions/updates
- `refactor` - Code restructuring
- `perf` - Performance improvements
- `chore` - Maintenance

### 5. Run Full Test Suite

Before pushing, verify everything works:

```bash
# Run all tests
bun test

# Type check
bun run type-check

# Build packages
bun run build

# Run examples
bun run examples:all
```

All should pass with green status.

### 6. Push and Create Pull Request

```bash
# Push your branch
git push origin feat/your-feature-name

# Create PR on GitHub
gh pr create --title "Description" --body "Details"
```

**PR Title Format**:
```
type(scope): Description of change
```

**PR Body Template**:
```markdown
## Summary
Brief description of changes

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Documentation
- [ ] Other

## Related Issues
Fixes #123

## Testing
Describe testing approach

## Checklist
- [ ] Tests pass locally
- [ ] Type checking passes
- [ ] Bundle size acceptable
- [ ] Changeset added
- [ ] Documentation updated
```

## Release Process

### Automated Releases

Releases are fully automated via GitHub Actions:

1. **Developer** creates PR with changes + changeset
2. **PR Merged** to main
3. **changesets-release.yml** creates version PR
4. **Maintainer** merges version PR
5. **publish-jsr.yml** publishes to JSR
6. **release.yml** creates GitHub release

### Manual Release (if needed)

```bash
# Bump versions
bun run changeset:version

# Publish
bun run changeset:publish

# Tag release
git tag v2.0.1
git push origin v2.0.1
```

## Code Review Standards

PRs are reviewed for:

1. **Functionality**: Does it work as intended?
2. **Tests**: Are critical paths covered?
3. **Performance**: No unexpected regressions?
4. **Bundle size**: Within limits?
5. **Types**: Strict TypeScript compliant?
6. **Documentation**: API documented?
7. **Security**: No new vulnerabilities?

## Constitutional Principles

Our project follows core principles (see `.specify/memory/constitution.md`):

1. **TDD First**: Tests before implementation
2. **Bundle Awareness**: Monitor size (25 KB limit for dotted)
3. **Security**: Trusted input assumption documented
4. **Backward Compatibility**: Semantic versioning followed
5. **Performance**: No unnecessary overhead

Breaking these requires explicit team discussion.

## Testing Philosophy

### Test Organization

```
packages/*/test/
├── unit/                    # Fast, isolated tests
│   ├── core.test.ts
│   ├── api.test.ts
│   └── plugins.test.ts
│
└── integration/            # Slower, realistic tests
    └── workflow.test.ts
```

### Writing Tests

Use Bun's testing framework:

```typescript
import { describe, it, expect } from "bun:test";

describe("Feature description", () => {
  it("should do something specific", () => {
    // Arrange
    const input = "test";
    
    // Act
    const result = myFunction(input);
    
    // Assert
    expect(result).toBe("expected");
  });
});
```

### Test Naming

- Describe WHAT the test checks
- Use "should" for behavior
- Clear, readable assertions

```typescript
// ✅ Good
it("should validate email format", () => {});

// ❌ Bad
it("test email", () => {});
```

## Documentation Guidelines

### API Documentation

Use JSDoc for public APIs:

```typescript
/**
 * Validates data against a schema
 *
 * @param data - The data to validate
 * @param schema - Zod schema for validation
 * @returns Validated data or error
 * @throws ValidationError if validation fails
 *
 * @example
 * ```typescript
 * const result = validate(data, userSchema);
 * ```
 */
export function validate(data: any, schema: any): any {
  // implementation
}
```

### File Documentation

Add documentation comments to files:

```typescript
/**
 * Expression evaluation engine
 *
 * Parses and evaluates template expressions with variable substitution.
 * Supports: ${path.to.value}, ${resolver.name()}, nested evaluation
 *
 * @module expression-evaluator
 * @see variant-resolver for dynamic path resolution
 */
```

### Example Code

Add examples to `examples/` directory:

- Use real-world scenarios
- Show error handling
- Document common patterns
- Include inline comments for complex logic

## Getting Help

### Documentation
- **Architecture**: `.specify/memory/`
- **Constitution**: `.specify/memory/constitution.md`
- **Migration**: `MIGRATION.md`

### Communication
- **GitHub Issues**: Bug reports, feature requests
- **Discussions**: Design decisions, RFCs

## Troubleshooting

### Tests failing locally but passing in CI
- Check Node version: `node --version`
- Clear cache: `bun run clean`
- Reinstall: `bun install --frozen-lockfile`

### Type errors during build
- Run type checker: `bun run type-check`
- Check imports: TypeScript paths vs actual files
- Verify dependencies: `bun install`

### Bundle size exceeded
- Check imports: Only import what you use
- Tree-shake unused code
- Consider moving to separate file/plugin
- Profile: `bun run build && ls -lh dist/`

## Continuous Integration

Every push triggers:

1. **CI Workflow** (`ci.yml`)
   - Multi-node testing (18.x, 20.x)
   - Type checking
   - Build validation
   - Example execution
   - Bundle size tracking

2. **Pre-release Workflows**
   - changesets-release.yml (version bumping)
   - publish-jsr.yml (JSR publishing)
   - release.yml (GitHub releases)

## Questions?

- Check docs in `.specify/memory/`
- Read existing tests for patterns
- Open a discussion on GitHub
- Review similar features

---

**Last Updated**: 2025-10-20  
**Version**: v2.0.0  
**Part of**: @orb-zone/web-craft
