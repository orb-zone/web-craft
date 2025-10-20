# Current Session: 2025-10-20

## Active Feature
Feature: monorepo-migration
Status: PLANNING
Target Repo: ~/Code/@OZ/web-craft (NEW REPO)
Source Reference: ~/Code/@OZ/jsön (KEEP AS-IS FOR REFERENCE)

## Context

**Major architectural refactor**: Single package (@orb-zone/dotted-json v0.12.1) → Bun workspace monorepo

**Key decisions**:
- Fresh start in new repo (web-craft)
- Leave jsön repo untouched as reference
- Package rename: @orb-zone/dotted-json → @orb-zone/dotted (v2.0.0)
- Monorepo structure with multiple packages
- Selective migration (not blind copy/paste)

## Constitutional Review
- Bundle size: Each package has own limits (dotted < 25 kB, surrounded < 75 kB total)
- Breaking changes: YES - MAJOR v2.0.0 release
- TDD: All migrated code must have tests
- Security: Same trust model as v1.x

## Target Structure

```
web-craft/
├── packages/
│   ├── dotted/           # Core (@orb-zone/dotted v2.0.0)
│   ├── surrounded/       # Framework (@orb-zone/surrounded v1.0.0)
│   └── create-surrounded/ # CLI scaffolding
├── .claude/              # AI commands (copied from jsön)
├── .specify/             # Project knowledge
└── package.json          # Workspace root
```

## Specialist Consultations
- architecture-specialist: Monorepo structure, package boundaries

## Next Steps
1. Review plan artifacts in .specify/memory/active/
2. User opens NEW OpenCode session in ~/Code/@OZ/web-craft
3. Use this plan as reference for implementation in new repo
4. Keep jsön repo as reference/source

## Notes
- OpenCode session restricted to jsön directory
- Plan created here, execution in web-craft
- Manual file transfer needed for .claude/ and .specify/ directories
