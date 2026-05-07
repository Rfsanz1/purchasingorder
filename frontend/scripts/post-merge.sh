#!/bin/bash
set -e

# Jalankan dari direktori frontend/
SCRIPT_DIR="$(cd "$(dirname "$0")/.." && pwd)"
cd "$SCRIPT_DIR"

pnpm install --frozen-lockfile
pnpm --filter @workspace/db run push
