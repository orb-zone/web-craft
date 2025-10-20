# @orb-zone/dotted v2.0 Examples

Demonstrating core features of @orb-zone/dotted v2.0 migration from jsön v1.

## Running Examples

```bash
# Run all examples
bun run examples:all

# Or individual examples:
bun examples/basic-usage.ts
bun examples/variants-i18n.ts
bun examples/file-loader-i18n.ts
bun examples/complete-workflow.ts
bun examples/realtime-config-manager.ts
bun examples/settings-form.ts
bun examples/data-transformation.ts
```

## Examples Included (7/10 Complete)

### 1. **basic-usage.ts** - Getting Started
- Simple expression evaluation
- Resolver functions for dynamic data
- Error handling with fallback
- Nested expressions
- Parent references (v2 feature)

### 2. **variants-i18n.ts** - Internationalization
- Language variants (en/es/fr/de)
- Gender-aware pronouns (m/f/x)
- Combined language + gender variants
- Custom variant dimensions
- Variant fallback and cascading

### 3. **file-loader-i18n.ts** - File-Based Translations
- Loading JSON files with variant support
- Language-specific translation files
- Formal/casual variants
- Saving new translations
- Combining with dotted expressions

### 4. **complete-workflow.ts** - E-Commerce Order Processing
- User profile with gender variants
- Order processing with calculations
- Shipping with variants
- Invoice with type coercion
- Order summarization

### 5. **realtime-config-manager.ts** - Configuration Management
- Environment-based config (dev/staging/prod)
- Feature flags and toggles
- Database configuration
- Rate limiting setup
- Configuration validation

### 6. **settings-form.ts** - Form & User Settings
- User settings with defaults
- Nested form sections
- Privacy and notification preferences
- Form validation
- Settings updates

### 7. **data-transformation.ts** - Data Processing
- CSV row transformation
- Data aggregation and statistics
- Type conversion
- Batch record processing
- Nested structure analysis

## Migration Status

✅ **Complete (7/10)**
- basic-usage
- variants-i18n
- file-loader-i18n
- complete-workflow
- realtime-config-manager
- settings-form
- data-transformation

⏳ **TODO (3 remaining)**
- feature-flag-manager (requires Pinia/SurrealDB)
- surrealdb-auto-discovery (requires SurrealDB running)
- i18n-translation-editor (requires file infrastructure)

## Feature Coverage

All examples demonstrate:
- ✅ Expression evaluation & template literals
- ✅ Resolver functions (async & sync)
- ✅ Variant system (lang, gender, form, custom)
- ✅ Gender-aware pronouns
- ✅ Type coercion (int, float, bool, json)
- ✅ File loading & i18n
- ✅ Error handling & fallbacks
- ✅ Parent references & context
- ✅ Data transformation & aggregation
- ✅ Form validation & settings
- ✅ Configuration management
