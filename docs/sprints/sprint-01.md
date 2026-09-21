# Sprint 1 — Fundação e Keycloak atrás da nossa porta

Status: **aguardando aprovação do planning** · Tasks 0–4 do plano · Você: revisor técnico e negocial

## Objetivo

Subir toda a infraestrutura local com docker-compose e provar que o Keycloak autentica usuários **sem que o resto do sistema dependa dele**, por trás da porta `IdentityProviderPort` (Adapter), para permitir trocar de provedor no futuro.

## Escopo (o que cada task entrega)

| Task | Entrega | Prova |
|---|---|---|
| 0 | Monorepo (pnpm/Turborepo) e `docker-compose.yml` com Postgres, Redis, Keycloak, Otel Collector e o container `workspace` (Node 22 + pnpm) | `scripts/check-compose.sh` passa |
| 1 | `@aura/authz`: catálogo tipado de permissões e mapa papel → permissões (`personal`, `aluno`, `admin`) | 6 testes |
| 2 | `identity-service`: schema Prisma (User, Tenant, Membership, Role, Permission, Invite, AuditLog), migração inicial e seed idempotente do RBAC | 2 testes contra o Postgres |
| 3 | `IdentityProviderPort` + provedor em memória + **suíte de contrato reutilizável** | 8 testes de contrato |
| 4 | `KeycloakProvider` + realm importado (refresh com rotação e detecção de reuso, brute-force, política de senha) + Mailpit para e-mails locais | **os mesmos 8 testes de contrato contra o Keycloak real** |

## Critérios de aceite

**Técnico**
- `docker compose up` sobe tudo saudável; nenhum comando exige Node no host.
- Suíte de contrato passa idêntica no provedor em memória e no Keycloak (é isso que garante a troca fácil).
- Nenhuma senha no nosso banco; nenhum segredo versionado; portas expostas só em `127.0.0.1`.
- Testes de RBAC do seed batem com o catálogo de `@aura/authz`.

**Negocial**
- O modelo de papéis e permissões representa o que você espera para Personal, Aluno e Admin.
- O cadastro do Admin não é público (será por CLI, na Sprint 2).

## Roteiro de demo (Sprint Review)

1. `docker compose up -d --wait postgres redis keycloak mailpit otel-collector` → mostrar `docker compose ps` (tudo *healthy*).
2. Abrir o console do Keycloak em `http://localhost:8081` (realm `aura`: clientes `aura-identity` e `aura-web`, política de senha e refresh rotativo) e a caixa de e-mail local em `http://localhost:8025`.
3. Rodar a suíte de contrato: `docker compose run --rm workspace pnpm --filter @aura/identity-service test keycloak` → verde. Rodar também a do provedor em memória para mostrar que são idênticas.
4. Mostrar as permissões de cada papel no banco (`select` em Role/Permission) e o catálogo em `packages/authz`.
5. Mostrar o diff que troca o provedor: apenas o `KeycloakProvider` implementa a porta (nenhum outro arquivo importa Keycloak).

## Riscos e como tratamos

| Risco | Tratamento |
|---|---|
| `make` não existe no seu Windows | Uso os comandos `docker compose` equivalentes; o Makefile serve o CI/Linux |
| Keycloak demora ~40 s para subir | Healthcheck com `start_period`; a demo espera o *healthy* |
| pnpm + bind mount no Windows (lentidão/symlinks) | Store de pacotes em volume nomeado; se ficar lento, `node_modules` também em volume |
| Porta 8081 (Keycloak) conflita com o Metro do Expo | Metro fica na 8082 (definido no plano) |
| Ruído `ng: exec: node: not found` no seu shell | Inofensivo (wrapper do Angular CLI sem Node no host); ignoramos |

## Fora desta sprint

BFF, telas, cadastro/login via API, tokens no front, segurança HTTP e CI. Login com Google entra na Task 19 (Sprint 4); Apple fica para depois.

## Pré-requisitos já verificados

Docker 26.1 e Compose 2.27 disponíveis (8 CPUs, 16 GB); `secrets/` no `.gitignore` e sem arquivos rastreados; plano e spec revisados.

## Preparação para executar (após o seu OK)

Criar o branch `feat/rbac-auth` (o working tree tem mudanças suas pendentes que não vou tocar), copiar `.env.example` para `.env` e começar pela Task 0.

---

## Daily log

### Daily 1 — após a Task 0

- **Progresso:** Task 0 concluída (`88237ae` + correção `b3a68c1`). `scripts/check-compose.sh` passa em volume novo: Postgres com `aura_identity` e `aura_keycloak`, Redis respondendo, `workspace` com Node 22 e pnpm 9. A revisão aprovou a conformidade e achou 1 problema real, já corrigido: o healthcheck do Postgres podia dar "saudável" antes de o `init.sql` criar os bancos.
- **Hoje:** Task 1 (`@aura/authz`, catálogo de permissões) e, em seguida, Task 2 (Prisma e seed).
- **Dificuldades:** nenhuma bloqueante. A varredura prévia do plano encontrou 11 defeitos, todos resolvidos como *rulings* (ledger): `curl`/`jq` na imagem, `@aura/config` como dependência dos pacotes, build das dependências antes dos testes, `EmailNotVerifiedError` na porta, entre outros.
- **Pendências:** a Task 4 precisa exercitar o healthcheck e o realm do Keycloak (a Task 0 não os iniciou). Cinco itens menores ficaram registrados para a revisão final (robustez do script de check, `.gitattributes`, healthcheck do Redis).

### Daily 2 — após as Tasks 3 e 4

- **Progresso:** Task 3 concluída (`38e6cc5`): `IdentityProviderPort`, provedor em memória e suíte de contrato com 8 casos (7 do plano + `EmailNotVerifiedError`, ruling R4). Task 4 implementada (`738c73a`): `KeycloakProvider` + realm importado + Mailpit; a **mesma suíte de 8 casos passa contra o Keycloak 26.0 real** (reexecutado pelo orquestrador: 8/8 Keycloak, 8/8 em memória). O healthcheck do Keycloak e o import do realm, pendentes desde a Task 0, foram exercitados: ambos saudáveis.
- **Hoje:** revisão em duas etapas da Task 4 e fechamento da Sprint 1 para a sua revisão. Não inicio a Task 5.
- **Dificuldades:** a sessão travou (buscas recursivas em `node_modules` no bind mount) e o Docker ficou parado; depois o limite diário do MCP do ClickUp (100 chamadas) estourou. Nada se perdeu: a evidência está no repositório e as atualizações pendentes estão em `docs/sprints/evidence/sprint-01/pending-clickup.md`.
- **Pendências:** (o ClickUp foi descontinuado em 2026-09-21; o acompanhamento passou ao quadro local); verificar e-mails de verificação/reset no Mailpit (não verificado); minors adiados das Tasks 0, 1 e 3 (ledger). Desvio: R5 (revogar sessão via admin API no reuso de refresh) não foi necessário, porque o Keycloak real já revoga a família.

_(próximos dailies entram abaixo)_

## Review

_(preenchida no fim: demo, artefatos, feedback do revisor, ajustes para a Sprint 2)_
