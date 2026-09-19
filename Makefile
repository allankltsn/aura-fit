DC = docker compose
sh = $(DC) run --rm workspace

up:      ; $(DC) up -d --wait postgres redis keycloak otel-collector
down:    ; $(DC) down
sh:      ; $(sh) sh -c "$(CMD)"
test:    ; $(sh) pnpm test
migrate: ; $(sh) pnpm --filter @aura/identity-service prisma migrate deploy
gen:     ; $(sh) pnpm --filter @aura/contracts generate
