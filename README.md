# @orb-zone/web-craft

Bun workspace monorepo for @orb-zone packages.

## Quick Start

```bash
# Install dependencies
bun install

# Build all packages
bun run build

# Run tests
bun test

# Lint & typecheck
bun run lint
bun run typecheck
```

## Packages

### [@orb-zone/dotted](./packages/dotted)

Core JSON dotted path and expression evaluation library (v2.0.0).

- **Bundle size**: < 25 kB
- **Key features**: Expression engine, variant system, i18n support
- **Dependencies**: `dot-prop`
- **Status**: v2.0.0 (breaking rename from dotted-json)

```bash
bun add @orb-zone/dotted
```

### [@orb-zone/surrounded](./packages/surrounded)

SurrealDB integration framework with Vue 3 composables (v1.0.0).

- **Bundle size**: < 75 kB (with dotted)
- **Key features**: SurrealDB LIVE queries, Vue 3 composables, Pinia integration
- **Peer dependencies**: `surrealdb`, `vue`, `pinia`
- **Status**: v1.0.0 (new package)

```bash
bun add @orb-zone/surrounded
```

## Development

### Project Structure

```
packages/
├── dotted/              # Core library
│   ├── src/
│   ├── test/
│   ├── tools/
│   └── package.json
└── surrounded/          # Framework
    ├── src/
    ├── test/
    ├── tools/
    └── package.json
```

### Workspace Scripts

| Command | Description |
|---------|-------------|
| `bun run build` | Build all packages |
| `bun test` | Run all tests |
| `bun run lint` | Lint all packages |
| `bun run typecheck` | Type-check all packages |
| `bun run changeset:add` | Add changeset entry |

### Per-Package Development

```bash
# Install & test single package
cd packages/dotted
bun test

# Build single package
bun run build

# Run package-specific lint
bun run lint
```

## Migration from v1.x

If you're upgrading from `@orb-zone/dotted-json@1.x`:

- **Package rename**: `@orb-zone/dotted-json` → `@orb-zone/dotted`
- **Version bump**: v1.x → v2.0.0
- **Migration guide**: See [MIGRATION.md](./MIGRATION.md)

### Quick Migration

```typescript
// v1.x
import { DottedJson } from "@orb-zone/dotted-json";

// v2.0.0
import { DottedJson } from "@orb-zone/dotted";
```

## License

Apache License 2.0 - See [LICENSE](./LICENSE)

## Repository

[github.com/orb-zone/web-craft](https://github.com/orb-zone/web-craft)

---

See individual package READMEs for detailed documentation:
- [packages/dotted/README.md](./packages/dotted/README.md)
- [packages/surrounded/README.md](./packages/surrounded/README.md)
