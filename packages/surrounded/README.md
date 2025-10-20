# @orb-zone/surrounded

SurrealDB integration framework with Vue 3 composables, built on @orb-zone/dotted.

**Version**: v1.0.0 (new package, SurrealDB + Vue 3 integration)

## Features

- **SurrealDB Loader**: Automatic type inference and data loading
- **Vue 3 Composables**: `useSurrounded`, `useSurroundedQuery`, `useSurroundedMutation`
- **LIVE Queries**: Real-time data synchronization
- **Pinia Integration**: State management with Colada
- **Type-safe**: Full TypeScript support with Zod
- **Framework integration**: Works seamlessly with Pinia, Vue Router
- **Bundle optimized**: Tree-shaking, lazy loading

## Installation

```bash
bun add @orb-zone/surrounded
npm install @orb-zone/surrounded
```

### Peer Dependencies

Surrounded works with:

```bash
# Core
bun add @orb-zone/dotted

# SurrealDB
bun add surrealdb

# Vue 3 (required)
bun add vue pinia

# Optional: Real-time queries
bun add @pinia/colada

# Optional: Schema validation
bun add zod
```

## Quick Start

### Basic Setup

```typescript
import { DottedJson } from "@orb-zone/dotted";
import { SurrealDBLoader } from "@orb-zone/surrounded";
import Surreal from "surrealdb";

const db = new Surreal();
await db.connect("ws://localhost:8000/rpc");

const loader = new SurrealDBLoader(db);
const data = await loader.load("SELECT * FROM users");

const dotted = new DottedJson(data);
```

### Vue 3 Composables

```typescript
import { useSurrounded } from "@orb-zone/surrounded";

export default {
  setup() {
    const { data, loading, error } = useSurrounded("users", {
      live: true,
      schema: userSchema
    });

    return { data, loading, error };
  }
};
```

### LIVE Queries

```typescript
const { data, unsubscribe } = await loader.live("SELECT * FROM users");

// React to changes in real-time
data.on("update", (record) => {
  console.log("Updated:", record);
});

// Stop listening
await unsubscribe();
```

## API Reference

### SurrealDBLoader

```typescript
new SurrealDBLoader(db, options?)
```

**Methods**:

#### load(query: string, params?: Record<string, any>)

Execute query and return results.

```typescript
const users = await loader.load("SELECT * FROM users WHERE active = true");
```

#### live(query: string, params?: Record<string, any>)

Subscribe to LIVE query updates.

```typescript
const subscription = await loader.live("LIVE SELECT * FROM users");
```

### Vue Composables

#### useSurrounded(table: string, options?)

Main composable for table access.

```typescript
const { data, loading, error, refetch } = useSurrounded("users", {
  live: true,
  schema: userSchema,
  filters: { active: true }
});
```

Returns:
- `data` - Reactive data array
- `loading` - Loading state
- `error` - Error state
- `refetch` - Manual refresh function

#### useSurroundedQuery(query: string, options?)

Execute custom query.

```typescript
const { data, loading } = useSurroundedQuery(
  "SELECT * FROM users WHERE role = $role",
  { role: "admin" }
);
```

#### useSurroundedMutation(mutation: string)

Execute mutations (CREATE, UPDATE, DELETE).

```typescript
const { execute, loading } = useSurroundedMutation(
  "CREATE users CONTENT { name: $name }"
);

await execute({ name: "Alice" });
```

## Architecture

### Core Modules

| Module | Purpose |
|--------|---------|
| `loaders/surrealdb.ts` | SurrealDB data loader |
| `plugins/surrealdb.ts` | SurrealDB plugin for dotted |
| `composables/useSurrounded.ts` | Main Vue composable |
| `types/storage.ts` | Type definitions |

### Integration

Surrounded builds on dotted's plugin system:

```typescript
import { DottedJson } from "@orb-zone/dotted";
import { withSurrealDB } from "@orb-zone/surrounded";

const dotted = new DottedJson(data, {
  plugins: [withSurrealDB(db)]
});
```

## Examples

See `examples/` directory:

- `surrealdb-auto-discovery.ts` - Type inference from schema
- `realtime-config-manager.ts` - LIVE queries for config
- `complete-workflow.ts` - End-to-end integration
- `vue-example.vue` - Vue component integration

## Bundle Size

**Current**: ~50-60 kB (with dotted)  
**Limit**: 75 kB total (constitutional)

Measured with: `bun run build && du -sh dist/`

## Testing

```bash
# All tests
bun test

# Unit tests only
bun test test/unit

# Integration tests (requires SurrealDB)
bun test test/integration

# Watch mode
bun test --watch
```

## Security

### Trust Model

⚠️ Surrounded assumes **trusted schemas and queries**

- SurrealDB connection strings: ✅ From app config
- Query parameters: ✅ Safe (parameterized)
- User-provided schemas: ❌ DANGER - validate with Zod first

### Best Practices

1. **Use Zod validation**: Always validate external schemas
2. **Parameterize queries**: Never interpolate user input
3. **Limit SurrealDB permissions**: Principle of least privilege
4. **Audit LIVE subscriptions**: Monitor real-time data flows
5. **Sanitize errors**: Don't expose database structure in errors

## Performance

### Optimization Tips

1. **Enable query caching** - Avoid redundant queries
2. **Use LIVE queries** - More efficient than polling
3. **Batch mutations** - Combine multiple updates
4. **Lazy load composables** - Load on demand
5. **Use Colada** - For advanced caching

## Integration Patterns

### With Pinia

```typescript
import { defineStore } from "pinia";
import { useSurrounded } from "@orb-zone/surrounded";

export const useUserStore = defineStore("users", () => {
  const { data: users, loading } = useSurrounded("users", { live: true });

  return { users, loading };
});
```

### With Vue Router

```typescript
// In route guard
const route = useRoute();
const { data } = useSurrounded(`users/${route.params.id}`);
```

### With Zod Validation

```typescript
import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email()
});

const { data } = useSurrounded("users", {
  schema: userSchema
});
```

## Migration Notes

### From jsön v1.x

If you're migrating from v1.x single package:

```typescript
// ❌ Before (v1.x)
import { SurrealDBLoader } from "@orb-zone/dotted-json";

// ✅ After (v2.x)
import { SurrealDBLoader } from "@orb-zone/surrounded";
```

Other changes minimal - API is backward compatible.

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

See [MIGRATION.md](../../MIGRATION.md) for full upgrade guide.

## Contributing

Surrounding is a modern framework. Feature contributions welcome.

See `.specify/memory/constitution.md` for project principles.

## License

Apache License 2.0

## See Also

- **@orb-zone/dotted** - Core library that surrounded depends on
- **SurrealDB**: https://surrealdb.com
- **Vue 3**: https://vuejs.org
- **Pinia**: https://pinia.vuejs.org

---

**Part of**: @orb-zone/web-craft monorepo  
**Updated**: 2025-10-20
