# Missing GitHub Workflows (Pre-Release Checklist)

**Status:** Identified but not yet implemented  
**Priority:** High (blocking release)  
**Effort:** 1-2 hours

---

## What's Missing from jsön v1

jsön has 4 workflows, web-craft currently has 1:

### ❌ Missing Workflows

1. **changesets-release.yml** (Release automation)
   - Runs on push to main
   - Manages versioning with changesets
   - Auto-creates version PRs
   - Updates changelogs
   - **Purpose:** Automate semantic versioning

2. **publish-jsr.yml** (JSR publishing)
   - Runs when PR with "version packages" title is merged
   - Publishes to JSR registry
   - Handles OIDC authentication
   - **Purpose:** Auto-publish to JSR on version bump

3. **release.yml** (GitHub release)
   - Runs on git tags (v*)
   - Creates GitHub releases
   - Generates release notes
   - **Purpose:** Create releases when version tags are pushed

### ✅ Existing Workflow

1. **ci.yml** (Testing & Building) - Already implemented

---

## Implementation Plan

### Phase 5 + (Pre-Release Sprint)

#### Step 1: Add Changesets Configuration (30 min)
- Install @changesets/cli
- Create .changeset/config.json
- Add changeset scripts to package.json
- Document workflow

#### Step 2: Implement changesets-release.yml (30 min)
- Copy from jsön v1 and adapt for web-craft
- Test locally with `bun changeset add`
- Verify version bump logic

#### Step 3: Implement publish-jsr.yml (20 min)
- Add JSR package names to package.json
- Configure OIDC authentication
- Test with dummy JSR account (if available)

#### Step 4: Implement release.yml (20 min)
- Set up GitHub release creation
- Generate changelog from commits
- Test with version tag

#### Step 5: Documentation (20 min)
- Document release workflow
- Add to CONTRIBUTING.md
- Add to release checklist

**Total: ~2 hours**

---

## Why These Matter

### changesets-release.yml
- **What:** Automates version bumping based on changesets
- **Why:** Semantic versioning without manual version edits
- **When:** PR merges to main with changeset files
- **Flow:**
  1. Developer: `bun changeset add` when making changes
  2. CI: Creates "Version Packages" PR
  3. Maintainer: Merges PR
  4. CI: Updates versions in package.json + CHANGELOG.md

### publish-jsr.yml
- **What:** Auto-publishes to JSR registry
- **Why:** Distribute packages to JSR (alternative to npm)
- **When:** After version PR is merged
- **Requirements:**
  - JSR account created (@orb-zone namespace)
  - OIDC token configured in GitHub
  - Packages configured in jsr.json

### release.yml
- **What:** Creates GitHub release with notes
- **Why:** Formal release tracking and communication
- **When:** When version tag is pushed (v2.0.0, etc)
- **Output:** GitHub Release page with changelog

---

## How It Flows Together

```
Developer Action:
  1. Make changes
  2. Run: bun changeset add
  3. Commit changeset file
  
Push to main:
  CI triggers changesets-release.yml
  ├─ Creates "Version Packages vX.Y.Z" PR
  └─ Updates package.json versions

Maintainer Action:
  4. Review & merge Version PR
  
After Merge:
  CI triggers publish-jsr.yml
  ├─ Publishes to JSR
  └─ Creates git tag
  
Tag Push Triggers:
  CI triggers release.yml
  ├─ Creates GitHub Release
  └─ Adds release notes
```

---

## Configuration Needed

### 1. Changesets Config

```json
// .changeset/config.json
{
  "changelog": "@changesets/cli/changelog",
  "commit": false,
  "fixed": [],
  "linked": [],
  "access": "public",
  "baseBranch": "main",
  "updateInternalDependencies": "patch",
  "ignore": []
}
```

### 2. JSR Configuration

```json
// jsr.json (in each package)
{
  "name": "@orb-zone/dotted",
  "version": "2.0.0",
  "exports": {
    ".": "./dist/index.js"
  }
}
```

### 3. Package.json Scripts

```json
"scripts": {
  "changeset:add": "bunx @changesets/cli add",
  "changeset:version": "bunx @changesets/cli version",
  "changeset:publish": "bunx @changesets/cli publish"
}
```

---

## Testing Before Release

1. ✅ Local changesets test: `bun changeset add`
2. ✅ Version bump verification
3. ✅ JSR account setup
4. ✅ OIDC token configuration
5. ✅ Mock release tag creation
6. ✅ GitHub release generation

---

## Pre-Release Checklist Item

- [ ] changesets-release.yml implemented
- [ ] publish-jsr.yml implemented  
- [ ] release.yml implemented
- [ ] Changesets CLI configured
- [ ] JSR accounts created
- [ ] OIDC tokens configured
- [ ] Release workflow tested
- [ ] Documentation updated

---

## Notes

- These workflows enable **fully automated releases**
- No manual version bumping needed
- Supports multiple packages in monorepo
- Integrates with npm/JSR/GitHub seamlessly
- Must be in place BEFORE first release

---

**Next Action:** Implement these workflows after Phase 5.2-5.4 complete
