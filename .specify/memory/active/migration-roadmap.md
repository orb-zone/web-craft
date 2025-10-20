# Web-Craft v2.0 Migration Roadmap (Pre-Production)

## Goal: Complete Migration from jsön v1 → web-craft v2.x
**NOT production-ready yet. Focus: Feature parity, automated workflows, build ops.**

## Current Status
✅ Phase 1: Core library (dotted)
✅ Phase 2: SurrealDB integration & Vue composables
⏳ Phase 3: Examples migration
⏳ Phase 4: Build & CI/CD pipelines
⏳ Phase 5: Full feature parity checklist
⏳ Phase 6: Migration validation & tooling

---

## Phase 3: Examples Migration (NEXT)
**Goal:** Migrate all 14 examples from jsön v1 to web-craft v2

### From jsön v1:
- strings-multi-lang.jsön (lang variants)
- profile-gender.jsön (gender variants)  
- settings-form.jsön (nested expressions)
- permissions.jsön (permissions system)
- schema-validation.jsön (Zod integration)
- database-queries.jsön (SurrealDB patterns)
- + 8 more...

### Create in web-craft v2:
- Browser/Node examples using new composables
- TypeScript + ESM
- Test each example thoroughly
- Document migration notes

---

## Phase 4: Build & CI/CD Pipelines
**Goal:** Automated testing, linting, builds

Tasks:
- [ ] GitHub Actions: Build on push
- [ ] Automated test suite (bun test in CI)
- [ ] Type checking (tsc --noEmit)
- [ ] Linting setup (ESLint + Prettier)
- [ ] Bundle size tracking
- [ ] Changesets workflow
- [ ] Auto-changelog generation

---

## Phase 5: Feature Parity Validation
**Goal:** Verify all v1 features exist in v2

Create feature matrix:
- Expression evaluation ✅
- Variant resolution ✅
- Parent references ✅
- Type coercion ✅
- File loading ✅
- Zod integration (TODO)
- Storage providers (TODO)
- Permissions system (TODO)
- SurrealDB integration (partial)
- Vue 3 composables ✅
- Cycle detection (TODO - advanced)
- Evaluation depth limits (TODO - advanced)

---

## Phase 6: Migration Validation Tooling
**Goal:** Tools to help validate migration

Tasks:
- [ ] Migration guide: v1 → v2 API changes
- [ ] Codemod: Auto-convert v1 code to v2
- [ ] Comparison tests: Run v1 & v2 side-by-side
- [ ] Performance benchmarks: v1 vs v2
- [ ] Bundle size comparison

---

## Detailed Phase 3 Plan: Examples

### 1. Strings Multi-Language
**jsön v1:** `examples/strings-multi-lang.jsön`
**web-craft v2:** `examples/strings-multi-lang.ts`

```typescript
import { dotted } from '@orb-zone/dotted'
import { FileLoader } from '@orb-zone/dotted/loaders/file'

// Load from i18n/strings:es.json
// Use variant auto-detection
// Test: Compare output to v1
```

### 2-14. Similar patterns for each example

Each example:
- [ ] Read v1 version
- [ ] Create v2 version (TS + ESM)
- [ ] Add comprehensive tests
- [ ] Document differences
- [ ] Add to test suite

---

## Estimated Effort

Phase 3 (Examples): 2-3 hours
- 14 examples × 10 min average = ~2.5 hours
- Testing & validation

Phase 4 (Pipelines): 1-2 hours
- GitHub Actions setup
- Lint/format config

Phase 5 (Validation): 1-2 hours  
- Feature checklist
- Gap analysis

Phase 6 (Tooling): 2-3 hours
- Migration guide
- Comparison tests

**Total pre-production: ~6-10 hours**

---

## Success Criteria

Before considering "production-ready":
- ✅ All 14 examples working in v2
- ✅ All v1 features migrated (except advanced)
- ✅ CI/CD fully automated
- ✅ Zero bundle size regressions
- ✅ Full API compatibility documented
- ✅ Migration tooling complete
- ✅ Performance >= v1

---

## NOT In Scope (Yet)
- Performance optimizations beyond v1
- New features beyond v1
- Cycle detection (nice-to-have)
- Production deployment
- Version bumping/tagging
