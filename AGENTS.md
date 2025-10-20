# Agent Guidelines for web-craft (Monorepo)

**Project**: @orb-zone/web-craft  
**Type**: Bun workspace monorepo  
**Packages**: dotted (core), surrounded (framework)  
**Status**: v2.0.0 (major release)

---

## Quick Reference

### Development Commands

```bash
# Root workspace
bun install                    # Install all dependencies
bun run build                  # Build all packages
bun test                       # Run all tests
bun run lint                   # Lint all packages
bun run typecheck              # Type-check all packages
bun run changeset:add          # Create changeset entry

# Per-package (from project root)
cd packages/dotted
bun test                       # Just dotted tests
bun run build                  # Just dotted build

cd packages/surrounded
bun test                       # Just surrounded tests
```

### Project Structure

```
packages/
├── dotted/
│   ├── src/                  # Core source
│   ├── test/                 # Tests
│   ├── tools/                # CLI tools (translate)
│   ├── examples/             # Usage examples
│   └── package.json
└── surrounded/
    ├── src/                  # Framework source
    ├── test/                 # Tests
    ├── tools/                # CLI tools (surql-to-ts)
    ├── examples/             # Usage examples
    └── package.json
```

## About This Project

### What is web-craft?

**web-craft** is a Bun workspace monorepo that represents the v2.x evolution of the @orb-zone project:

**v1.x (jsön)**: Single package `@orb-zone/dotted-json` with bundled SurrealDB integration

**v2.x (web-craft)**: Multiple packages with clear separation:
- `@orb-zone/dotted@2.0.0` - Core (renamed from dotted-json)
- `@orb-zone/surrounded@1.0.0` - SurrealDB + Vue framework

### Why the Split?

1. **Bundle size**: Users who only need JSON dotted paths don't pay for SurrealDB
2. **Independent versioning**: Frameworks can evolve without changing core
3. **Clear concerns**: Core stays focused, frameworks can experiment
4. **Better DX**: Smaller, focused packages are easier to understand

### Breaking Changes

This is a **v2.0.0 MAJOR** release with intentional breaking changes:

✅ **New**:
- Package renamed: `dotted-json` → `dotted`
- Monorepo structure with multiple packages
- Vue 3 composables in `surrounded`
- Improved SurrealDB integration

⚠️ **Requires migration**:
- See [MIGRATION.md](./MIGRATION.md) for upgrade guide
- Import paths change
- API may be reorganized

## Package Reference

### @orb-zone/dotted (packages/dotted/)

**Version**: v2.0.0 (core library, major release)  
**Bundle limit**: 25 kB (constitutional)  
**Dependencies**: `dot-prop`  
**Peer deps**: `zod` (optional)

**Public API**:
- `DottedJson` class - Main entry point
- Expression evaluation engine
- Variant resolution system
- i18n support
- File loader (FileLoader)
- Zod plugin (withZod)

**Key files**:
- `src/dotted-json.ts` - Core class
- `src/expression-evaluator.ts` - Expression engine
- `src/variant-resolver.ts` - Variant system
- `src/plugins/zod.ts` - Zod validation

**Tests**: 190+ unit + integration tests

### @orb-zone/surrounded (packages/surrounded/)

**Version**: v1.0.0 (new package, framework)  
**Bundle limit**: 75 kB total with dotted (constitutional)  
**Dependencies**: `@orb-zone/dotted@workspace:^2.0.0`  
**Peer deps**: `surrealdb`, `vue`, `pinia`, `@pinia/colada`

**Public API**:
- `SurrealDBLoader` - Database loader
- `useSurrounded` - Vue 3 composable
- SurrealDB plugin (withSurrealDB)
- Pinia integration (withPiniaColada)
- LIVE query support

**Key files**:
- `src/loaders/surrealdb.ts` - SurrealDB loader
- `src/plugins/surrealdb.ts` - SurrealDB plugin
- `src/composables/` - Vue composables (NEW)
- `src/types/storage.ts` - Type definitions

**Tests**: 35+ unit + integration tests

## Workspace Configuration

### Bun Workspaces

**Why Bun?**
- Fast, native TypeScript support
- Simple workspace configuration
- Excellent monorepo performance
- Better than npm/yarn for this scale

**Configuration**: `bunfig.toml` + `package.json` workspaces field

```json
{
  "workspaces": ["packages/*"]
}
```

### Workspace Protocol

**Internal dependencies** use `workspace:` protocol:

```json
{
  "dependencies": {
    "@orb-zone/dotted": "workspace:^2.0.0"
  }
}
```

Benefits:
- Development: Direct source file linking
- Production: Replaced with version number at publish time
- No circular dependencies (dotted → surrounded, never reverse)

### Shared Configuration

**Inherited from root**:
- `tsconfig.json` - Shared TypeScript config
- `package.json` scripts (via --filter)
- DevDependencies (TypeScript, ESLint, etc.)

**Per-package overrides**:
- `packages/dotted/package.json` - Dotted-specific deps
- `packages/surrounded/package.json` - Surrounded-specific deps

## Code Standards

### Same as jsön (Inherited)

This project inherits all standards from the v1 project:

**TypeScript**:
- 2-space indentation (EditorConfig)
- Strict mode enabled
- ESM with `.js` extensions
- camelCase variables, PascalCase types
- No implicit `any`

**Testing**:
- 100% test pass rate (non-negotiable)
- TDD workflow: RED → GREEN → REFACTOR
- Unit tests in `test/unit/`
- Integration tests in `test/integration/`

**Documentation**:
- JSDoc for public APIs
- README.md per package
- Migration guide (v1→v2)
- Constitutional alignment

### Monorepo-Specific

**Package boundaries**:
- Core (`dotted`) has no SurrealDB dependencies
- Framework (`surrounded`) depends on core only
- No circular dependencies allowed
- Independent test suites per package

**Bundle management**:
- Monitor per-package size
- Tree-shaking verification
- Separate build outputs per package

## Specialist Agents

### Available Specialists

Inherited from jsön (`.specify/agents/`):

1. **architecture-specialist** - Monorepo structure, boundaries, build optimization
2. **surrealdb-expert** - SurrealDB schemas, loaders, LIVE queries
3. **zod-integration-specialist** - Schema validation, type inference
4. **testing-specialist** - TDD workflows, integration testing
5. **i18n-specialist** - Variant systems, translation, FileLoader
6. **performance-auditor** - Bundle size, optimization, caching
7. **documentation-curator** - API docs, migration guides, READMEs

### When to Use Specialist Agents

**Use for**:
- Complex monorepo decisions (→ architecture-specialist)
- SurrealDB integration design (→ surrealdb-expert)
- Performance optimization (→ performance-auditor)
- Testing strategy (→ testing-specialist)
- Bundle size issues (→ performance-auditor)

**Skip for**:
- Simple bug fixes
- Obvious refactoring
- Minor doc updates
- Single-file changes

### Invocation Pattern

```bash
/task "Optimize bundle size" \
  --agent performance-auditor \
  --context "web-craft monorepo, measure per-package"
```

## Development Workflow

### Adding a Feature

1. **Plan**: Determine which package (dotted or surrounded)?
2. **TDD**: Write test first, implement, refactor
3. **Build**: `bun run build` - verify output
4. **Validate**: Run `bun run lint` + `bun run typecheck`
5. **Changeset**: `bun run changeset:add` - document changes
6. **Commit**: Follow conventional commits

### Testing Strategy

**Unit tests** (`test/unit/`):
- Fast, isolated, no external deps
- Run with `bun test test/unit`

**Integration tests** (`test/integration/`):
- Real dependencies (databases, etc.)
- Run with `bun test test/integration`

**Workspace tests**:
- Run all: `bun test` (from root)
- Per-package: `cd packages/dotted && bun test`

### Build & Validation

```bash
# Full validation
bun run build              # Build all packages
bun test                   # Run all tests
bun run lint              # Lint everything
bun run typecheck         # TypeScript check

# Per-package
cd packages/dotted
bun run build             # Build dotted only
bun test                  # Test dotted only
bun run lint              # Lint dotted only
```

### Release Process

1. **Create changesets** (during development):
   ```bash
   bun run changeset:add
   ```

2. **Version packages** (when ready):
   ```bash
   bun run changeset:version
   ```

3. **Publish** (automated via GitHub Actions):
   - GitHub Action triggers on version commit
   - Runs final tests
   - Publishes to JSR and npm

## Migration Context

### From jsön (v1.x) to web-craft (v2.x)

**What moved**:
- Core dotted-json engine → `packages/dotted/`
- SurrealDB code → `packages/surrounded/`
- All tests (WITH their code)
- Specialist agents (`.specify/agents/`)

**What stayed in jsön**:
- v1.x codebase (reference)
- v1.x examples (marked deprecated)
- Old design docs (marked "for reference")

**What's new**:
- Bun workspace
- Vue 3 composables in surrounded
- Monorepo-specific tooling
- Independent package versioning

**Breaking changes**:
- Package name: `dotted-json` → `dotted`
- Import paths updated
- v2.0.0 major release

### Migration Guide

See [MIGRATION.md](./MIGRATION.md) for detailed v1→v2 upgrade steps.

## Constitutional Alignment

All development **must** comply with core principles:

### Bundle Size Constraints

- `@orb-zone/dotted`: < 25 kB (core limit)
- `@orb-zone/surrounded`: +30-50 kB (75 kB total with dotted)

**Monitoring**: Automated CI checks, measured per-package

### Security Model

- Schemas from **trusted sources only** (application code)
- No user input in expressions
- Resolver validation required
- Monthly dependency audits
- No sensitive data in error messages

### TDD Requirement

- 100% test pass rate before ANY commit
- Tests migrate WITH code (never leave tests behind)
- Feature parity maintained during migration
- Performance regression tests for critical paths

### Framework Agnostic Core

- `@orb-zone/dotted` has **zero framework dependencies**
- Framework code isolated in `@orb-zone/surrounded`
- Vue 3 composables optional (peer dep)

## Memory & Documentation

### Key Files (Read These)

| File | Purpose | Location |
|------|---------|----------|
| Constitution | Core principles | `.specify/memory/constitution.md` |
| Migration Plan | v2 architecture | `.specify/memory/active/monorepo-migration-plan.md` |
| Migration Tasks | Implementation steps | `.specify/memory/active/monorepo-migration-tasks.md` |
| Session Context | Current work | `.specify/memory/active/current-session.md` |

### Design Documents

Located in `.specify/memory/`:

- `variant-system-design.md` - How variants work
- `storage-providers-design.md` - Loader abstraction
- `permissions-and-zod-integration.md` - Permission model
- `surrealdb-vue-vision.md` - Grand vision doc

### When to Add Documentation

**Add new design doc** for:
- Significant architectural decisions
- New patterns or conventions
- Breaking changes with migration needs
- Performance optimizations with measurable impact

## Common Tasks

### Adding a Feature to Dotted

1. Add test in `packages/dotted/test/`
2. Implement in `packages/dotted/src/`
3. Update exports in `packages/dotted/src/index.ts`
4. Update docs
5. Verify bundle size: `bun run build`
6. Create changeset: `bun run changeset:add`

### Adding a Feature to Surrounded

1. Add test in `packages/surrounded/test/`
2. Implement in `packages/surrounded/src/`
3. Update exports in `packages/surrounded/src/index.ts`
4. Update docs
5. Verify bundle size
6. Create changeset: `bun run changeset:add`

### Migrating Code from jsön

1. Understand code in jsön (reference)
2. Determine target: dotted or surrounded?
3. Copy code + tests together
4. Update imports for workspace structure
5. Verify tests pass: `bun test`
6. Document changes
7. Create changeset

### Troubleshooting

**Issue**: Tests in one package fail when importing other package

**Solution**: Check `workspace:` protocol in package.json and tsconfig paths

**Issue**: Build size exceeds limit

**Solution**: Run `bun run build`, measure dist/ size, check tree-shaking

**Issue**: Circular dependency detected

**Solution**: Verify only surrounded → dotted, never reverse. Check imports.

## Supporting Resources

### In This Repository

- **README.md** - Monorepo overview
- **[packages/dotted/README.md](./packages/dotted/README.md)** - Core library docs
- **[packages/surrounded/README.md](./packages/surrounded/README.md)** - Framework docs
- **[MIGRATION.md](./MIGRATION.md)** - v1→v2 upgrade guide
- **.specify/** - AI infrastructure & memory
- **.claude/** - AI command workflows

### From jsön (Reference)

- **jsön/AGENTS.md** - Detailed project guidelines
- **jsön/.specify/agents/** - Specialist agent definitions
- **jsön/.specify/memory/constitution.md** - Core principles

### External

- **Bun Docs**: https://bun.sh/docs
- **TypeScript**: https://www.typescriptlang.org/
- **Changesets**: https://github.com/changesets/changesets

## Session Checklist

Start every session with:

- [ ] Confirm working directory (`web-craft` or `jsön`?)
- [ ] Read this file (project AGENTS.md)
- [ ] Check `.specify/memory/active/current-session.md`
- [ ] Understand scope: which package(s)?
- [ ] Review specialist agents needed
- [ ] Verify constitutional compliance
- [ ] Confirm bundle size strategy

## Support

Use `/help` in OpenCode for:
- Tool documentation
- OpenCode commands
- Bug reporting

---

**Last Updated**: 2025-10-20  
**Part of**: @OZ namespace (see `/Users/trave/Code/@OZ/AGENTS.md`)  
**Related**:
- jsön project: `/Users/trave/Code/@OZ/jsön/AGENTS.md`
- Namespace guidelines: `/Users/trave/Code/@OZ/AGENTS.md`
