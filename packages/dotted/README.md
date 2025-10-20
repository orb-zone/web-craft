# @orb-zone/dotted

Core JSON dotted path library with expression evaluation, variant system, and i18n support.

**Version**: v2.0.0 (major release from @orb-zone/dotted-json@1.x)

## Features

- **Dotted path access**: Navigate JSON with dot notation
- **Expression evaluation**: Dynamic value resolution
- **Variant system**: Multi-language/configuration variants
- **i18n support**: Translation and pluralization
- **Type-safe**: Full TypeScript support with Zod integration
- **Framework agnostic**: Zero framework dependencies
- **Compact**: < 25 kB bundle size

## Installation

```bash
bun add @orb-zone/dotted
npm install @orb-zone/dotted
```

## Quick Start

### Basic Usage

```typescript
import { DottedJson } from "@orb-zone/dotted";

const config = {
  app: {
    name: "MyApp",
    version: "1.0.0",
    features: {
      auth: true,
      api: true
    }
  }
};

const dotted = new DottedJson(config);

// Access nested values
console.log(dotted.get("app.name"));           // "MyApp"
console.log(dotted.get("app.features.auth"));  // true

// Set nested values
dotted.set("app.version", "1.1.0");

// Delete values
dotted.delete("app.features.api");
```

### Expressions

```typescript
const data = {
  user: {
    name: "Alice",
    role: "admin"
  },
  permissions: {
    admin: ["read", "write", "delete"],
    user: ["read"]
  }
};

const dotted = new DottedJson(data);

// Resolve expressions
const perms = dotted.resolve("permissions.${user.role}");
// → ["read", "write", "delete"]
```

### Variants (i18n)

```typescript
const messages = {
  en: {
    greeting: "Hello, {name}!",
    items: {
      singular: "You have {count} item",
      plural: "You have {count} items"
    }
  },
  es: {
    greeting: "¡Hola, {name}!",
    items: {
      singular: "Tienes {count} elemento",
      plural: "Tienes {count} elementos"
    }
  }
};

const dotted = new DottedJson(messages, {
  variant: "es"  // Use Spanish variant
});

console.log(dotted.get("greeting"));  // Uses es.greeting
```

### Schema Validation with Zod

```typescript
import { DottedJson, withZod } from "@orb-zone/dotted/zod";
import { z } from "zod";

const schema = z.object({
  app: z.object({
    name: z.string(),
    version: z.string().regex(/^\d+\.\d+\.\d+$/)
  })
});

const dotted = new DottedJson(config, {
  plugins: [withZod(schema)]
});

// Validates on access
const version = dotted.get("app.version"); // Type-safe!
```

## API Reference

### Constructor

```typescript
new DottedJson(data, options?)
```

**Options**:
- `variant?: string | string[]` - Active variant(s)
- `plugins?: Plugin[]` - Enable plugins
- `separator?: string` - Path separator (default: ".")

### Methods

#### get(path: string, defaultValue?: any)

Retrieve value at path.

```typescript
const value = dotted.get("user.email", "default@example.com");
```

#### set(path: string, value: any)

Set value at path.

```typescript
dotted.set("user.role", "admin");
```

#### delete(path: string)

Delete value at path.

```typescript
dotted.delete("user.temporary");
```

#### has(path: string)

Check if path exists.

```typescript
if (dotted.has("user.verified")) {
  // ...
}
```

#### resolve(expression: string)

Evaluate expression (uses `${}` syntax for interpolation).

```typescript
const result = dotted.resolve("Hello, ${user.name}!");
```

#### allKeys(path?: string)

Get all keys at path.

```typescript
const keys = dotted.allKeys("user");
// → ["name", "email", "role"]
```

## Architecture

### Core Modules

| Module | Purpose |
|--------|---------|
| `dotted-json.ts` | Main DottedJson class |
| `expression-evaluator.ts` | Expression parsing & evaluation |
| `variant-resolver.ts` | Variant selection logic |
| `pronouns.ts` | i18n helpers (pluralization, etc.) |
| `helpers/type-coercion.ts` | Type conversion utilities |

### Loaders

| Loader | Purpose |
|--------|---------|
| `loaders/file.ts` | Load from .jsön files |

### Plugins

| Plugin | Purpose |
|--------|---------|
| `plugins/zod.ts` | Schema validation (optional) |

## Bundle Size

**Current**: ~18-20 kB (minified)  
**Limit**: 25 kB (constitutional)

Measured with: `bun run build && ls -lh dist/index.js`

## Migration from v1.x

If you're upgrading from `@orb-zone/dotted-json@1.x`:

### Breaking Changes

1. **Package name**: `@orb-zone/dotted-json` → `@orb-zone/dotted`
2. **Version**: v1.x → v2.0.0
3. Import updates (see below)

### Migration Steps

#### 1. Update imports

```typescript
// ❌ Before (v1.x)
import { DottedJson } from "@orb-zone/dotted-json";

// ✅ After (v2.0.0)
import { DottedJson } from "@orb-zone/dotted";
```

#### 2. Update zod plugin imports

```typescript
// ❌ Before
import { withZod } from "@orb-zone/dotted-json/zod";

// ✅ After
import { withZod } from "@orb-zone/dotted/zod";
```

#### 3. Verify file loaders

FileLoader API unchanged but import path updated:

```typescript
import { FileLoader } from "@orb-zone/dotted";

// Same usage as v1.x
const loader = new FileLoader();
const data = await loader.load("./config.jsön");
```

See [MIGRATION.md](../../MIGRATION.md) for detailed upgrade guide.

## Performance

### Optimization Tips

1. **Use variants selector** - Avoid loading all variants
2. **Cache DottedJson instances** - Don't recreate for each access
3. **Use expressions** - More efficient than manual path construction
4. **Enable tree-shaking** - Unused plugins excluded from bundle

### Benchmarks

Access operations: ~1 million ops/sec (dotted vs dot-prop overhead minimal)

## Security

### Trust Model

⚠️ **Important**: DottedJson assumes **trusted input only**

- Data from your application code: ✅ Safe
- Data from user input: ❌ DANGER - validate first
- Expressions are not sandboxed - evaluate trusted expressions only

### Best Practices

1. **Validate before loading**: Use Zod or similar
2. **No user expressions**: Don't allow users to write expressions
3. **Sanitize error messages**: Don't expose sensitive paths in errors
4. **Keep expressions simple**: Easier to audit, harder to exploit

## Examples

See `examples/` directory:

- `basic-usage.ts` - Simple dotted path access
- `file-loader-i18n.ts` - Loading variants from files
- `with-zod-validation.ts` - Schema validation example

## Testing

```bash
# All tests
bun test

# Unit tests only
bun test test/unit

# Watch mode
bun test --watch

# Coverage
bun test --coverage
```

**Coverage target**: > 95% on core modules

## Contributing

This is a stable core library. Major breaking changes require RFC.

See `.specify/memory/constitution.md` for project principles.

## License

Apache License 2.0

## See Also

- **@orb-zone/surrounded** - SurrealDB + Vue integration built on dotted
- **Original v1.x**: https://github.com/orb-zone/dotted-json
- **Monorepo**: https://github.com/orb-zone/web-craft

---

**Part of**: @orb-zone/web-craft monorepo  
**Updated**: 2025-10-20
