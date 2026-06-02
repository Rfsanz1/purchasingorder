# RfsanzERP PHASE 2 - REFACTORING ROADMAP & FILE MAPPING

**Status**: PLANNING (based on Phase 1 audit)  
**Mode**: Strategy document for Phase 2 execution

---

## OVERVIEW

This document outlines the detailed refactoring strategy for Phase 2, including:
- File migration mappings
- Import path updates
- Configuration changes
- Build verification steps

**Note**: Phase 2 should only proceed after confirming the recommendations in AUDIT_REPORT_PHASE1.md

---

## PHASE 2A: ARCHIVE LEGACY APPLICATIONS

### Action: Archive frontend/artifacts/*

**Goal**: Move all legacy applications to /archive/ directory for preservation and documentation.

**Files to Move**:

```
OLD PATH                                    → NEW PATH
==========================================================================================================
frontend/artifacts/pos-app/                 → archive/legacy/pos-app-vite-old/
frontend/artifacts/driver-app/              → archive/legacy/driver-app-vite-old/
frontend/artifacts/api-server/              → archive/legacy/api-server-express-old/
frontend/artifacts/pos-backend/             → archive/legacy/pos-backend-old/
frontend/artifacts/laravel-api/             → archive/legacy/laravel-api-old/
frontend/artifacts/event-registration/      → archive/legacy/event-registration-old/
frontend/artifacts/mockup-sandbox/          → archive/legacy/mockup-sandbox-old/
frontend/lib/                               → archive/legacy/lib-orphaned/

laravel (root SQLite file)                  → archive/legacy/laravel-legacy.db
package-lock.json (root)                    → DELETE (after verifying pnpm setup)
```

### Documentation to Create

Create `/archive/README_LEGACY.md`:

```markdown
# Legacy Applications Archive

This directory contains deprecated applications that have been replaced by modern equivalents.

## Applications

### 1. pos-app-vite-old/
- **Original Location**: frontend/artifacts/pos-app/
- **Status**: DEPRECATED
- **Replaced By**: apps/pos-app (Next.js)
- **Technology**: Vite 6.0.5 + React 18.3 + React Router 7.1.3
- **Reason Archived**: Technology stack migration to Next.js
- **Archive Date**: 2026-06-02
- **Notes**: Full POS system implementation in old stack. Reference for patterns.

### 2. driver-app-vite-old/
- **Original Location**: frontend/artifacts/driver-app/
- **Status**: DEPRECATED
- **Replaced By**: apps/driver-app (Next.js)
- **Technology**: Vite 6.0.5 + React 18.3
- **Reason Archived**: Technology stack migration to Next.js
- **Archive Date**: 2026-06-02
- **Notes**: Driver app implementation. Reference for patterns.

### 3. api-server-express-old/
- **Original Location**: frontend/artifacts/api-server/
- **Status**: DEPRECATED
- **Replaced By**: apps/backend (NestJS)
- **Technology**: Express 5.0 + Drizzle ORM
- **Reason Archived**: Technology stack migration to NestJS + Prisma
- **Archive Date**: 2026-06-02
- **Notes**: Express-based API. Patterns can be referenced.

### 4. pos-backend-old/
- **Original Location**: frontend/artifacts/pos-backend/
- **Status**: DEPRECATED
- **Merged Into**: apps/backend (NestJS)
- **Technology**: Express 4.21.2 (simple backend)
- **Reason Archived**: Technology stack migration, functionality merged into main backend
- **Archive Date**: 2026-06-02

### 5. laravel-api-old/
- **Original Location**: frontend/artifacts/laravel-api/
- **Status**: DEPRECATED
- **Reason Archived**: Complete migration from Laravel to Node.js stack
- **Technology**: Laravel (PHP)
- **Archive Date**: 2026-06-02

### 6. event-registration-old/
- **Original Location**: frontend/artifacts/event-registration/
- **Status**: UNKNOWN (orphaned)
- **Reason Archived**: Not referenced in current build scripts
- **Archive Date**: 2026-06-02

### 7. mockup-sandbox-old/
- **Original Location**: frontend/artifacts/mockup-sandbox/
- **Status**: DEVELOPMENT ARTIFACT
- **Reason Archived**: Not needed for production
- **Archive Date**: 2026-06-02

### 8. lib-orphaned/
- **Original Location**: frontend/lib/
- **Status**: ORPHANED WORKSPACE
- **Reason Archived**: Not included in main workspace, duplicates functionality
- **Libraries Archived**:
  - api-client-react/ (React Query wrapper)
  - api-spec/ (Orval OpenAPI codegen)
  - api-zod/ (Zod schemas)
  - db/ (Drizzle ORM - replaced by Prisma)
- **Archive Date**: 2026-06-02

### 9. laravel-legacy.db
- **Original Location**: /laravel (root)
- **Type**: SQLite database file
- **Status**: LEGACY (purpose unknown)
- **Size**: ~211 KB
- **Reason Archived**: Not used in current system, unclear contents
- **Archive Date**: 2026-06-02
- **Note**: Backup/reference only. Do not restore without understanding contents.

## How to Access

All archives are kept in version control (git) for historical reference.

If you need to resurrect functionality from these archives:

1. Reference the patterns and code structures
2. DO NOT revert to old technology stack
3. Implement functionality using modern stack (Next.js, NestJS, Prisma)
4. Contact architecture team for design review

## Migration Checklist

- [x] All legacy apps copied to /archive/
- [x] Original git history preserved
- [x] Documentation created
- [ ] Team notification sent
- [ ] Update CI/CD to ignore /archive/
- [ ] Update deployment scripts
```

### Workspace Configuration Update

**File: pnpm-workspace.yaml**

```yaml
# BEFORE (Phase 1):
packages:
  - 'apps/*'
  - 'packages/*'
  - 'frontend/artifacts/pos-app'
  - 'frontend/artifacts/mockup-sandbox'

# AFTER (Phase 2A):
packages:
  - 'apps/*'
  - 'packages/*'
  # Removed legacy:
  # - 'frontend/artifacts/pos-app'
  # - 'frontend/artifacts/mockup-sandbox'
```

### .gitignore Update

Add entries for archived folder (optional - to keep git history):

```
# If archiving with git
archive/node_modules/
archive/**/.next/
archive/**/.vite/
archive/**/dist/
archive/**/build/
```

---

## PHASE 2B: CONSOLIDATE LIBRARIES

### Action: Evaluate frontend/lib/* packages

**Status**: Each package needs decision

#### Decision Tree for Each Library

```
├── frontend/lib/api-client-react/
│   ├── Current: React Query wrapper
│   ├── Used By: None (orphaned)
│   ├── Decision Option 1: REMOVE
│   │   └── Action: Archive if needed, delete if not
│   ├── Decision Option 2: INTEGRATE
│   │   └── Action: Merge into packages/utils as React hook
│   └── RECOMMENDATION: REMOVE (packages/utils sufficient)
│
├── frontend/lib/api-spec/
│   ├── Current: Orval OpenAPI code generation
│   ├── Used By: None (orphaned)
│   ├── Decision Option 1: REMOVE
│   │   └── Action: Archive
│   ├── Decision Option 2: INTEGRATE
│   │   └── Action: Implement OpenAPI code generation (Phase 3+)
│   └── RECOMMENDATION: REMOVE for now, revisit Phase 3
│
├── frontend/lib/api-zod/
│   ├── Current: Zod validation schemas
│   ├── Used By: None (orphaned, was used by frontend/artifacts/api-server)
│   ├── Decision Option 1: REMOVE
│   │   └── Action: Archive
│   ├── Decision Option 2: INTEGRATE
│   │   └── Action: Migrate to Prisma-based validation (ts-rest)
│   └── RECOMMENDATION: REMOVE (use Prisma schema)
│
└── frontend/lib/db/
    ├── Current: Drizzle ORM database layer
    ├── Used By: frontend/artifacts/api-server (legacy, archived)
    ├── Duplicate: Prisma schema (apps/backend/prisma/schema.prisma)
    ├── Decision Option 1: REMOVE
    │   └── Action: Archive (Prisma is canonical)
    ├── Decision Option 2: INTEGRATE
    │   └── Action: Not recommended, Prisma is source of truth
    └── RECOMMENDATION: REMOVE (Prisma is canonical)
```

**Phase 2B Decision**: Remove all frontend/lib/* packages (they don't add value).

### Execution

```bash
# After decision approval:
1. Create archive/legacy/lib-orphaned/ folder
2. Move frontend/lib/* to archive/
3. Remove frontend/lib/ from pnpm-workspace.yaml
4. Update .gitignore to exclude old pnpm-lock.yaml if needed
5. Verify pnpm install still works
6. Run builds to verify no breakage
```

---

## PHASE 2C: MAKE ARCHITECTURAL DECISION

### Decision: Monolithic vs. Modular Frontend

**This is the most important decision for long-term success.**

#### Option A: Keep Monolithic (apps/frontend)
- Consolidate all feature into one Next.js app
- Merge apps/web, apps/pos-app, apps/driver-app, apps/sales-app, apps/gudang-app into apps/frontend
- Single deployment artifact

**If choosing Option A**:
- Rename apps/frontend → apps/main-eup (or similar)
- Delete apps/web, apps/pos-app, apps/driver-app, apps/sales-app, apps/gudang-app
- Update all imports
- Migrate to use packages/types, packages/ui, packages/utils

#### Option B: Convert to Modular (Recommended)
- Keep separate domain apps (pos-app, driver-app, sales-app, gudang-app, etc.)
- Split apps/frontend into separate domain modules
- Keep apps/web as meta-admin/dashboard
- Each app uses shared packages/types, packages/ui, packages/utils

**If choosing Option B**:
- Extract modules from apps/frontend into separate apps
- Create new apps per domain:
  - apps/dashboard (central dashboard)
  - apps/sales (sales module)
  - apps/purchasing (purchasing module)
  - apps/inventory (inventory module)
  - apps/warehouse (warehouse module - may merge with apps/gudang-app)
  - apps/accounting (accounting module)
  - apps/crm (CRM module)
  - apps/hr (HR module)
  - apps/pos (POS - may use existing apps/pos-app)
  - etc.
- Consolidate apps/web into apps/dashboard or keep as separate admin portal
- Update pnpm-workspace.yaml
- Ensure all new apps depend on shared packages
- Implement shared authentication/session mechanism

**Recommended**: Option B (modular approach)

---

## PHASE 2D: REFACTOR FILE STRUCTURE

### Proposed Target Structure (assuming Option B - Modular)

```
RfsanzERP/
├── apps/
│   ├── api/                           # RENAMED from apps/backend
│   │   ├── src/
│   │   ├── prisma/                    # WILL BE MOVED to database/prisma
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   └── tsconfig.build.json
│   │
│   ├── web/                           # Admin portal (keep as is)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── dashboard/                     # NEW (split from apps/frontend)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── sales/                         # NEW (extracted or keep apps/sales-app)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── pos/                           # RENAME from apps/pos-app
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── driver/                        # RENAME from apps/driver-app
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── warehouse/                     # RENAME from apps/gudang-app
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── purchasing/                    # NEW (split from apps/frontend)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── inventory/                     # NEW (split from apps/frontend)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── accounting/                    # NEW (split from apps/frontend)
│   │   ├── app/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── ... (additional domain modules)
│
├── packages/
│   ├── types/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── ui/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   ├── utils/
│   │   ├── src/
│   │   ├── package.json
│   │   └── tsconfig.json
│   │
│   └── config/                        # NEW (Phase 3+)
│       └── (shared configuration)
│
├── database/
│   ├── prisma/                        # MOVED from apps/backend/prisma
│   │   ├── schema.prisma
│   │   ├── migrations/
│   │   ├── seed/
│   │   └── seed.ts
│   │
│   └── package.json                   # NEW (database only workspace)
│
├── infrastructure/                    # NEW (Phase 3+)
│   ├── docker/
│   └── kubernetes/
│
├── docs/                              # NEW
│   ├── ARCHITECTURE.md
│   ├── API.md
│   └── CONTRIBUTING.md
│
├── scripts/                           # NEW
│   ├── setup.sh
│   ├── build-all.sh
│   └── deploy.sh
│
├── tests/                             # NEW (Phase 3+)
│   ├── e2e/
│   └── integration/
│
├── archive/                           # CREATED in Phase 2A
│   ├── legacy/
│   └── README_LEGACY.md
│
├── pnpm-workspace.yaml                # UPDATED
├── tsconfig.base.json                 # UPDATED
├── package.json                       # UPDATED
└── .github/
    └── workflows/                     # CI/CD workflows
```

### File Mapping Detail

#### Step 1: Move Database Schema

```
FROM: apps/backend/prisma/
TO:   database/prisma/

AFFECTED FILES:
  - apps/backend/package.json          → UPDATE prisma script paths
  - apps/backend/src/main.ts           → NO CHANGE (schema path in env)
  - database/package.json              → NEW (if separate)
  - pnpm-workspace.yaml                → UPDATE (add database/ if separate)
```

**Import Updates in apps/backend/package.json**:
```json
{
  "scripts": {
    // BEFORE:
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "node --loader ts-node/esm prisma/seed.ts",
    
    // AFTER:
    "prisma:generate": "cd ../../database && prisma generate",
    "prisma:migrate": "cd ../../database && prisma migrate dev",
    "prisma:seed": "cd ../../database && node --loader ts-node/esm seed.ts"
  }
}
```

#### Step 2: Rename Backend

```
FROM: apps/backend/
TO:   apps/api/

NO IMPORT CHANGES (self-contained module)
UPDATE:
  - pnpm-workspace.yaml                → apps/api/
  - Root package.json scripts          → dev:api instead of dev:backend
  - Docker compose                     → service name api instead of backend
```

**Update Root package.json**:
```json
{
  "scripts": {
    // BEFORE:
    "dev:backend": "pnpm --filter @erp-modern/backend start:dev",
    "build:backend": "pnpm --filter @erp-modern/backend build",
    
    // AFTER:
    "dev:api": "pnpm --filter @erp-modern/api start:dev",
    "build:api": "pnpm --filter @erp-modern/api build"
  }
}
```

#### Step 3: Refactor Frontend Apps

If choosing **Option B (Modular)**:

```
KEEP AS IS:
  apps/pos-app (@gm/pos-app)          → renamed to apps/pos
  apps/driver-app (@gm/driver-app)    → renamed to apps/driver
  apps/sales-app (@gm/sales-app)      → renamed to apps/sales
  apps/gudang-app (@gm/gudang-app)    → renamed to apps/warehouse

EXTRACT FROM apps/frontend:
  - Dashboard/Admin                    → apps/dashboard
  - Sales module                       → apps/sales (merge with existing)
  - Purchasing module                  → apps/purchasing
  - Inventory module                   → apps/inventory
  - Warehouse module                   → apps/warehouse (merge with existing)
  - Accounting module                  → apps/accounting
  - CRM module                         → apps/crm
  - HR module                          → apps/hr
  - Marketplace module                 → apps/marketplace
  - Automation module                  → apps/automation
  - etc.

DELETE (merged into specific apps):
  apps/frontend                        → SPLIT/DELETE
  apps/web                             → MERGE into apps/dashboard
```

### Import Path Updates (Example)

**Current (Monolithic)**:
```typescript
// apps/frontend/app/sales/page.tsx
import { useApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import type { Order } from '@/types';
```

**After Refactoring (Modular)**:
```typescript
// apps/sales/app/page.tsx
import { useApi } from '@gm/utils';
import { Button } from '@gm/ui';
import type { Order } from '@gm/types';
```

### tsconfig Updates

**Before (apps/web/tsconfig.json - current)**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@gm/*": ["../../packages/*/src"],
      "@/*": ["./"]
    }
  }
}
```

**After (all apps should follow same pattern)**:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@gm/*": ["../../packages/*/src"],
      "@/*": ["./src"]
    }
  }
}
```

### pnpm-workspace.yaml Update

**Before (Phase 1)**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'frontend/artifacts/pos-app'
  - 'frontend/artifacts/mockup-sandbox'
```

**After (Phase 2D - assuming modular approach)**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'database'

catalog:
  # All dependencies listed here for consistency
```

---

## PHASE 2E: VERIFY BUILD & ROLLBACK PLAN

### Build Verification Checklist

```bash
# 1. Clean and reinstall
pnpm install --frozen-lockfile
pnpm install                           # Should report no changes

# 2. Type checking
pnpm typecheck                         # All packages
pnpm run typecheck                     # Root

# 3. Build backend/api
cd apps/api
pnpm build
# Expected: dist/ folder created with compiled JS

# 4. Build all frontends
pnpm run build:all
# Or individually:
pnpm --filter @gm/web build
pnpm --filter @gm/pos build
pnpm --filter @gm/driver build
pnpm --filter @gm/sales build
pnpm --filter @gm/warehouse build
# Expected: .next/ folders created

# 5. Lint
pnpm run lint                          # Should pass

# 6. Start dev server
pnpm dev                               # All services start on designated ports
```

### Rollback Plan

If Phase 2 refactoring causes build failures:

```
Option 1: Revert git commits
  git log --oneline                    # Find last working commit
  git revert [commit-hash]

Option 2: Restore from staging branch
  git checkout [backup-branch]

Option 3: Restore from docker snapshot (if deployed)
  docker ps -a | grep rfsanzerp
  docker commit [container-id] rfsanzerp-backup
```

---

## PHASE 2 CHECKLIST & TIMELINE

### Day 1-2: Archive & Cleanup
- [ ] Create /archive/ directory structure
- [ ] Move frontend/artifacts/* to /archive/
- [ ] Move frontend/lib/* to /archive/
- [ ] Create /archive/README_LEGACY.md
- [ ] Remove archived packages from pnpm-workspace.yaml
- [ ] Verify `pnpm install` still works
- [ ] Commit to git with message: "refactor: archive legacy applications"

### Day 3: Architecture Decision
- [ ] Team review of AUDIT_REPORT_PHASE1.md
- [ ] Decide: Monolithic vs. Modular
- [ ] Document decision in ADR (Architecture Decision Record)
- [ ] Plan extraction strategy (if modular)

### Day 4-6: File Refactoring
- [ ] Move apps/backend → apps/api
- [ ] Move apps/backend/prisma → database/prisma
- [ ] Update all scripts and imports
- [ ] Update pnpm-workspace.yaml
- [ ] Update tsconfig paths
- [ ] Verify builds

### Day 7: Final Verification
- [ ] Full build test: `pnpm build:all`
- [ ] Lint check: `pnpm lint`
- [ ] TypeScript check: `pnpm typecheck`
- [ ] Dev server test: `pnpm dev`
- [ ] Document any issues
- [ ] Commit all changes

### Day 8: Deployment Prep
- [ ] Update Docker/deployment configs
- [ ] Update CI/CD pipelines
- [ ] Update team documentation
- [ ] Training if needed

---

## RISK MITIGATION

### Risk 1: Import Path Breaking
**Mitigation**:
- Use find-and-replace with regex
- Test builds frequently
- Rollback available

### Risk 2: Database Migration
**Mitigation**:
- Move only schema file, not migrations
- Test prisma commands work from new location
- Ensure DATABASE_URL env var points to correct location

### Risk 3: Workspace Lock Issues
**Mitigation**:
- Backup pnpm-lock.yaml before making changes
- Use `pnpm install --frozen-lockfile` to verify no unexpected deps
- Delete node_modules and reinstall if needed

### Risk 4: Package Name Conflicts
**Mitigation**:
- All packages already use @gm/* namespace
- No conflicts expected
- Test workspace resolution

---

## SUCCESS CRITERIA

Phase 2 is complete when:

- [x] All legacy apps archived
- [x] All orphaned libraries removed or migrated
- [x] Backend renamed to api
- [x] Prisma schema moved to database/
- [x] All imports updated
- [x] pnpm-workspace.yaml corrected
- [x] Full build succeeds (`pnpm build:all`)
- [x] No TypeScript errors
- [x] No lint errors
- [x] Dev server starts (`pnpm dev`)
- [x] All apps run on correct ports
- [x] Git history preserved
- [x] Documentation updated

---

## NEXT PHASE

After Phase 2 is complete, Phase 3 would focus on:
- [ ] Split monolithic apps into domain modules (if Option B chosen)
- [ ] Implement OpenAPI code generation (optional)
- [ ] Add shared configuration package
- [ ] Add infrastructure-as-code (Docker, Kubernetes)
- [ ] Add E2E and integration tests
- [ ] Implement monitoring and logging

---

**Document Status**: Ready for Phase 2 execution  
**Last Updated**: 2026-06-02  
**Next Review**: After Phase 2 architecture decision

