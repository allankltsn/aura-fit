#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."

docker compose config -q
docker compose up -d --wait postgres redis

dbs=$(docker compose exec -T postgres psql -U aura -tAc "select datname from pg_database")
echo "$dbs" | grep -qx aura_identity || { echo "FAIL: aura_identity ausente"; exit 1; }
echo "$dbs" | grep -qx aura_keycloak || { echo "FAIL: aura_keycloak ausente"; exit 1; }

docker compose exec -T redis redis-cli -a "${REDIS_PASSWORD:-aura_redis}" ping | grep -q PONG \
  || { echo "FAIL: redis"; exit 1; }

docker compose run --rm workspace sh -c 'node -v | grep -q "^v22" && pnpm -v | grep -q "^9"' \
  || { echo "FAIL: workspace toolchain"; exit 1; }

echo "OK"
