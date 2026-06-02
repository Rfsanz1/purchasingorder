# RfsanzERP PHASE 2 - IMPORT CHANGES REFERENCE

**Status**: Reference document for Phase 2 execution  
**Purpose**: Comprehensive list of all import paths that will change

---

## OVERVIEW

When Phase 2 refactoring is executed, the following import paths will need to be updated:

- `apps/backend` → `apps/api`
- `apps/backend/prisma` → `database/prisma`
- Package names may be standardized (already OK with @gm/*)

This document tracks all expected changes.

---

## SECTION 1: PRISMA IMPORT CHANGES

### affected File Groups

**Backend Main File**: `apps/backend/src/main.ts`
- No import changes (uses env var for DB path)

**Backend Package.json Scripts**: `apps/backend/package.json`

**FROM** (current):
```json
{
  "scripts": {
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "node --loader ts-node/esm prisma/seed.ts"
  }
}
```

**TO** (after Phase 2):
```json
{
  "scripts": {
    "prisma:generate": "cd ../../database && prisma generate",
    "prisma:migrate": "cd ../../database && prisma migrate dev",
    "prisma:seed": "cd ../../database && node --loader ts-node/esm seed.ts"
  }
}
```

---

## SECTION 2: ENVIRONMENT VARIABLE CHANGES

### DATABASE_URL Environment Variable

**Context**: When Prisma schema moves from `apps/backend/prisma/schema.prisma` to `database/prisma/schema.prisma`, the path reference in env vars may need adjustment.

**Current Setup**:
- DATABASE_URL used in apps/backend/.env or docker-compose
- Prisma auto-discovers schema at `prisma/schema.prisma` (relative to package root)

**After Phase 2**:
- DATABASE_URL remains the same (it's just a connection string)
- Prisma needs to know where schema is

**Solution** (Prisma handles this automatically):
- Prisma looks for `prisma/schema.prisma` by default
- Can also be configured in `prisma.generateClient` with `schema` path
- Docker/deployment configs may need updates to point to new location

**Example Update** (if needed in docker-compose):

**BEFORE**:
```yaml
services:
  api:
    build:
      context: apps/backend
      dockerfile: Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/erp
```

**AFTER**:
```yaml
services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile  # or apps/api/Dockerfile
    environment:
      DATABASE_URL: postgresql://user:pass@db:5432/erp
      PRISMA_SCHEMA_ENGINE_BINARY: /app/node_modules/.bin/prisma
```

---

## SECTION 3: APP-TO-APP IMPORT CHANGES

### If apps/frontend is split into modular apps

**Current** (monolithic apps/frontend):
```typescript
// apps/frontend/app/sales/page.tsx
import { useApi } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';
import type { Order } from '@/types';
```

**After Phase 2** (if modularized):
```typescript
// apps/sales/app/page.tsx
import { useApi } from '@gm/utils';
import { Button } from '@gm/ui';
import { formatCurrency } from '@gm/utils';
import type { Order } from '@gm/types';
```

### Changes by Module (Example: Sales)

**Location Change**:
```
FROM: apps/frontend/app/sales/
TO:   apps/sales/app/
      (or apps/sales-app remains as is)
```

**Package.json Change**:
```json
// BEFORE (if consolidated to monolithic)
{
  "name": "@erp-modern/frontend",
  "dependencies": {
    "axios": "^1.8.5",
    "zustand": "^4.4.0"
  }
}

// AFTER (if modular)
{
  "name": "@gm/sales",
  "dependencies": {
    "@gm/types": "workspace:*",
    "@gm/ui": "workspace:*",
    "@gm/utils": "workspace:*",
    "axios": "^1.8.5",
    "zustand": "^4.4.0"
  }
}
```

---

## SECTION 4: TSCONFIG PATH UPDATES

### Root tsconfig.base.json (if changes needed)

**Current** (if exists):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@gm/*": ["packages/*/src"],
      "@erp-modern/*": ["apps/*/src"]
    }
  }
}
```

**After Phase 2**:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@gm/*": ["packages/*/src"],
      "@erp-modern/*": ["apps/*/src", "database/src"]
    }
  }
}
```

### Individual App tsconfig.json

**Current** (apps/web/tsconfig.json - should be template):
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

**After Phase 2** (consistent across all apps):
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

---

## SECTION 5: NPM SCRIPT CHANGES

### Root package.json Changes

**BEFORE (Phase 1)**:
```json
{
  "scripts": {
    "dev:backend": "pnpm --filter @erp-modern/backend start:dev",
    "dev:admin": "pnpm --filter @gm/web dev",
    "dev:sales": "pnpm --filter @gm/sales-app dev",
    "dev:gudang": "pnpm --filter @gm/gudang-app dev",
    "dev:pos": "pnpm --filter @gm/pos-app dev",
    "dev:driver": "pnpm --filter @gm/driver-app dev",
    "dev": "concurrently \"pnpm dev:backend\" \"pnpm dev:admin\" \"pnpm dev:sales\" \"pnpm dev:gudang\" \"pnpm dev:pos\" \"pnpm dev:driver\"",
    
    "build:backend": "pnpm --filter @erp-modern/backend build",
    "build:admin": "pnpm --filter @gm/web build",
    "build:sales": "pnpm --filter @gm/sales-app build",
    "build:gudang": "pnpm --filter @gm/gudang-app build",
    "build:pos": "pnpm --filter @gm/pos-app build",
    "build:driver": "pnpm --filter @gm/driver-app build",
    "build:all": "pnpm build:backend && pnpm build:admin && pnpm build:sales && pnpm build:gudang && pnpm build:pos && pnpm build:driver"
  }
}
```

**AFTER Phase 2A** (just renamed backend → api):
```json
{
  "scripts": {
    "dev:api": "pnpm --filter @erp-modern/api start:dev",           // CHANGED
    "dev:admin": "pnpm --filter @gm/web dev",
    "dev:sales": "pnpm --filter @gm/sales-app dev",
    "dev:gudang": "pnpm --filter @gm/gudang-app dev",
    "dev:pos": "pnpm --filter @gm/pos-app dev",
    "dev:driver": "pnpm --filter @gm/driver-app dev",
    "dev": "concurrently \"pnpm dev:api\" \"pnpm dev:admin\" \"pnpm dev:sales\" \"pnpm dev:gudang\" \"pnpm dev:pos\" \"pnpm dev:driver\"",   // CHANGED
    
    "build:api": "pnpm --filter @erp-modern/api build",             // CHANGED
    "build:admin": "pnpm --filter @gm/web build",
    "build:sales": "pnpm --filter @gm/sales-app build",
    "build:gudang": "pnpm --filter @gm/gudang-app build",
    "build:pos": "pnpm --filter @gm/pos-app build",
    "build:driver": "pnpm --filter @gm/driver-app build",
    "build:all": "pnpm build:api && pnpm build:admin && pnpm build:sales && pnpm build:gudang && pnpm build:pos && pnpm build:driver"  // CHANGED
  }
}
```

**AFTER Phase 2C** (if modular approach - add new apps):
```json
{
  "scripts": {
    "dev:api": "pnpm --filter @erp-modern/api start:dev",
    "dev:web": "pnpm --filter @gm/web dev",
    "dev:dashboard": "pnpm --filter @gm/dashboard dev",             // NEW
    "dev:sales": "pnpm --filter @gm/sales dev",                     // RENAMED (or keep sales-app)
    "dev:pos": "pnpm --filter @gm/pos dev",                         // RENAMED
    "dev:driver": "pnpm --filter @gm/driver dev",                   // RENAMED
    "dev:warehouse": "pnpm --filter @gm/warehouse dev",             // RENAMED
    "dev:purchasing": "pnpm --filter @gm/purchasing dev",           // NEW
    "dev:inventory": "pnpm --filter @gm/inventory dev",             // NEW
    "dev": "concurrently \"pnpm dev:api\" \"pnpm dev:web\" \"pnpm dev:dashboard\" \"pnpm dev:sales\" \"pnpm dev:pos\" \"pnpm dev:driver\" \"pnpm dev:warehouse\"",
    
    "build:api": "pnpm --filter @erp-modern/api build",
    "build:web": "pnpm --filter @gm/web build",
    "build:dashboard": "pnpm --filter @gm/dashboard build",
    "build:sales": "pnpm --filter @gm/sales build",
    "build:pos": "pnpm --filter @gm/pos build",
    "build:driver": "pnpm --filter @gm/driver build",
    "build:warehouse": "pnpm --filter @gm/warehouse build",
    "build:purchasing": "pnpm --filter @gm/purchasing build",
    "build:inventory": "pnpm --filter @gm/inventory build",
    "build:all": "pnpm build:api && pnpm build:web && pnpm build:dashboard && pnpm build:sales && pnpm build:pos && pnpm build:driver && pnpm build:warehouse && pnpm build:purchasing && pnpm build:inventory"
  }
}
```

---

## SECTION 6: DOCKERFILE/CI-CD CHANGES

### Docker Build Context

**BEFORE**:
```dockerfile
# Dockerfile for backend
FROM node:20

WORKDIR /app

COPY apps/backend ./apps/backend
COPY packages ./packages
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @erp-modern/backend build

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

**AFTER**:
```dockerfile
# Dockerfile for api (moved from apps/backend)
FROM node:20

WORKDIR /app

COPY apps/api ./apps/api
COPY database ./database
COPY packages ./packages
COPY pnpm-lock.yaml pnpm-workspace.yaml ./

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @erp-modern/api build

EXPOSE 4000

CMD ["node", "dist/main.js"]
```

### Docker Compose

**BEFORE**:
```yaml
version: '3.8'

services:
  backend:
    build:
      context: .
      dockerfile: apps/backend/Dockerfile
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/erp
```

**AFTER**:
```yaml
version: '3.8'

services:
  api:
    build:
      context: .
      dockerfile: apps/api/Dockerfile
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://user:password@postgres:5432/erp
```

---

## SECTION 7: GIT CONFIGURATION

### .gitignore Updates (if needed)

**ADD THESE** (to exclude archive folder build artifacts):
```gitignore
# Archive legacy applications
archive/node_modules/
archive/**/.next/
archive/**/.vite/
archive/**/dist/
archive/**/build/
archive/**/.turbo/

# Keep archive source files in git for history reference
!archive/**/*.ts
!archive/**/*.tsx
!archive/**/*.json
!archive/**/package.json
```

### .gitattributes

No changes needed typically. Ensure text files are properly detected.

---

## SECTION 8: IDE/EDITOR CONFIGURATIONS

### VS Code settings.json Updates

**If using TypeScript path aliases, verify**:

`.vscode/settings.json`:
```json
{
  "typescript.tsserver.experimental.enableProjectDiagnostics": true,
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "[typescript]": {
    "editor.defaultFormatter": "esbenp.prettier-vscode",
    "editor.formatOnSave": true
  }
}
```

### launch.json (debugging)

**BEFORE**:
```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Backend Debug",
      "program": "${workspaceFolder}/apps/backend/dist/main.js",
      "cwd": "${workspaceFolder}/apps/backend"
    }
  ]
}
```

**AFTER**:
```json
{
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "API Debug",
      "program": "${workspaceFolder}/apps/api/dist/main.js",
      "cwd": "${workspaceFolder}/apps/api"
    }
  ]
}
```

---

## SECTION 9: WORKFLOW FILES (.github/workflows)

### CI/CD Pipeline

**BEFORE** (if exists at `.github/workflows/build.yml`):
```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm --filter @erp-modern/backend build
      - run: pnpm --filter @gm/web build
```

**AFTER**:
```yaml
name: Build

on: [push, pull_request]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - run: pnpm install
      - run: pnpm --filter @erp-modern/api build
      - run: pnpm --filter @gm/web build
```

---

## SECTION 10: DOCUMENTATION FILES

### README.md Updates

**PROJECT_ROOT/README.md** - Update backend reference:

**BEFORE**:
```markdown
## Quick Start

### Backend
cd apps/backend
pnpm dev

### Frontend
cd apps/web
pnpm dev
```

**AFTER**:
```markdown
## Quick Start

### Backend API
cd apps/api
pnpm dev

### Frontend
cd apps/web
pnpm dev
```

### docs/ Files

Create `docs/ARCHITECTURE.md`:
```markdown
# Architecture

## Apps Structure

- **apps/api**: NestJS backend (formerly apps/backend)
- **apps/web**: Admin portal
- **apps/pos**: POS system
- **apps/driver**: Driver mobile app
- **apps/sales**: Sales management
- **apps/warehouse**: Warehouse management

## Database

- **database/prisma**: Prisma schema (moved from apps/backend/prisma)

## Shared Packages

- **packages/types**: TypeScript types
- **packages/ui**: React components
- **packages/utils**: Shared utilities
```

---

## SECTION 11: ENVIRONMENT FILES

### .env Files

**apps/api/.env** (formerly apps/backend/.env):

**BEFORE**:
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/erp
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
RATE_LIMIT_MAX=1000
```

**AFTER** (same, just in new location):
```env
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/erp
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000,http://localhost:5000
RATE_LIMIT_MAX=1000
```

### .env.example

Update to match new structure:
```env
# API Server
NODE_ENV=development
DATABASE_URL=postgresql://user:password@localhost:5432/erp_dev
JWT_SECRET=change-me-in-production
JWT_EXPIRATION=24h

# CORS
CORS_ORIGIN=http://localhost:3000,http://localhost:5000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=1000

# Logging
LOG_LEVEL=debug
```

---

## SECTION 12: MONOREPO TOOLS

### Rush / Turborepo (if used)

**Note**: This project uses pnpm workspace, not Rush or Turborepo. No changes needed.

### pnpm-workspace.yaml

**BEFORE**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'frontend/artifacts/pos-app'
  - 'frontend/artifacts/mockup-sandbox'
```

**AFTER**:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'database'
```

---

## IMPORT PATH CHANGE CHECKLIST

### Files to Update (Search & Replace)

| Pattern | Find | Replace |
|---------|------|---------|
| Package imports | `@erp-modern/backend` | `@erp-modern/api` |
| Path imports | `apps/backend` | `apps/api` |
| Prisma commands | `prisma/` (in scripts) | `../../database/prisma/` |
| Database path | `./prisma/` | `../../database/prisma/` |

### Search & Replace Commands (for reference)

```bash
# Find all references to apps/backend
grep -r "apps/backend" --include="*.ts" --include="*.tsx" --include="*.json" --include="*.yml" --include="*.yaml"

# Find all references to @erp-modern/backend
grep -r "@erp-modern/backend" --include="*.ts" --include="*.tsx" --include="*.json"

# Find all references to prisma/
grep -r "prisma/" --include="*.ts" --include="*.tsx" --include="*.json" --exclude-dir=node_modules
```

---

## VERIFICATION CHECKLIST

After all imports are updated:

- [ ] `pnpm install` runs without errors
- [ ] `pnpm typecheck` passes (no TS errors)
- [ ] `pnpm lint` passes
- [ ] `pnpm build:api` builds successfully
- [ ] `pnpm build:all` builds all apps
- [ ] `pnpm dev` starts all services on correct ports
- [ ] Backend available at http://localhost:4000
- [ ] Frontend available at http://localhost:5000 (web)
- [ ] POS available at http://localhost:3001
- [ ] Driver available at http://localhost:3000
- [ ] Sales available at http://localhost:3002
- [ ] Warehouse available at http://localhost:3003
- [ ] No broken imports in compiled code
- [ ] Git history preserved (no force push)

---

## ROLLBACK PROCEDURE

If something breaks:

```bash
# 1. Check git status
git status

# 2. List recent commits
git log --oneline -10

# 3. Revert all changes to a specific commit
git revert HEAD --no-edit

# 4. OR checkout previous branch
git checkout [backup-branch-name]

# 5. Reinstall dependencies
pnpm install

# 6. Verify everything works
pnpm build:all
pnpm dev
```

---

## AUTOMATION SCRIPT (Optional)

Create `scripts/refactor-phase2.sh` (post-decision, pre-execution):

```bash
#!/bin/bash

echo "RfsanzERP Phase 2 Refactoring Automation"

# Step 1: Archive legacy
echo "Step 1: Archiving legacy applications..."
mkdir -p archive/legacy
mv frontend/artifacts/* archive/legacy/ 2>/dev/null
mv frontend/lib archive/legacy/ 2>/dev/null
echo "✓ Legacy archived"

# Step 2: Rename backend to api
echo "Step 2: Renaming backend to api..."
mv apps/backend apps/api
echo "✓ Backend renamed to api"

# Step 3: Move prisma
echo "Step 3: Moving prisma schema..."
mkdir -p database/prisma
mv apps/api/prisma/* database/prisma/
echo "✓ Prisma schema moved"

# Step 4: Update imports
echo "Step 4: Updating import paths..."
find . -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" \) \
  ! -path "./node_modules/*" \
  ! -path "./.next/*" \
  ! -path "./archive/*" \
  -exec sed -i "s/@erp-modern\/backend/@erp-modern/api/g" {} \;
echo "✓ Imports updated"

# Step 5: Reinstall
echo "Step 5: Reinstalling dependencies..."
pnpm install
echo "✓ Dependencies installed"

# Step 6: Verify
echo "Step 6: Verifying builds..."
pnpm typecheck
pnpm build:all
echo "✓ All builds successful"

echo ""
echo "✅ Phase 2 refactoring complete!"
echo ""
echo "Next steps:"
echo "1. Review changes: git diff --stat"
echo "2. Test locally: pnpm dev"
echo "3. Commit: git commit -m 'refactor: Phase 2 restructuring'"
echo "4. Deploy: follow deployment procedure"
```

---

## COMMON MISTAKES TO AVOID

❌ **WRONG**: Leave @erp-modern/backend references in CI/CD  
✅ **RIGHT**: Update all references to @erp-modern/api

❌ **WRONG**: Delete archived files immediately  
✅ **RIGHT**: Archive with git history preserved

❌ **WRONG**: Update only some import paths  
✅ **RIGHT**: Use find & replace to update all occurrences

❌ **WRONG**: Forget to update pnpm-workspace.yaml  
✅ **RIGHT**: Verify workspace configuration after changes

❌ **WRONG**: Run builds before `pnpm install`  
✅ **RIGHT**: Always `pnpm install` after structural changes

❌ **WRONG**: Don't update .env files  
✅ **RIGHT**: Update paths if any env configs reference old locations

---

## FINAL CHECKLIST

- [ ] All search & replace patterns identified
- [ ] Import change automation script prepared (optional)
- [ ] Rollback procedure documented
- [ ] Team trained on new structure
- [ ] CI/CD pipelines reviewed and updated
- [ ] Documentation updated
- [ ] Verification steps prepared
- [ ] Stakeholders notified of schedule
- [ ] Time blocked for Phase 2 execution
- [ ] Ready to execute!

---

**Document Status**: Ready for Phase 2 execution

**Questions**: Review PHASE2_ROADMAP.md for more details

