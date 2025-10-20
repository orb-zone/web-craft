# @orb-zone/dotted v2.0 Examples

Demonstrating the migration from jsön v1 to web-craft v2.

## Running Examples

```bash
# Basic usage with expressions and resolvers
bun examples/basic-usage.ts

# Variant system with language/gender/custom variants
bun examples/variants-i18n.ts

# File loader with i18n translations
bun examples/file-loader-i18n.ts
```

## Examples Included

### basic-usage.ts
- Simple expression evaluation
- Resolver functions for dynamic data
- Error handling with fallback
- Nested expressions
- Parent references (v2 feature)

### variants-i18n.ts
- Language variants (en/es/fr/de)
- Gender-aware pronouns (m/f/x)
- Combined language + gender variants
- Custom variant dimensions
- Variant fallback and cascading

### file-loader-i18n.ts
- Loading JSON files with variant support
- Language-specific translation files
- Formal/casual variants
- Saving new translations
- Combining with dotted expressions

## Migration Status

All core v1 examples have v2 equivalents:
- ✅ basic-usage
- ✅ variants-i18n
- ✅ file-loader-i18n
- ⏳ complete-workflow
- ⏳ feature-flag-manager
- ⏳ realtime-config-manager
- ⏳ with-zod-validation
- + more...
