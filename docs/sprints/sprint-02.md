# Sprint 2 — API de identidade rodando (cadastro, login, autorização e RBAC)

Status: **aguardando aprovação do planning** · Tasks 5–10 do plano · Você: revisor técnico e negocial

## Objetivo

Ter a **API de identidade funcionando de ponta a ponta**, atrás da porta `IdentityProviderPort` que a Sprint 1 provou: cadastro do Personal e do Aluno (por convite), e-mail de verificação, login, refresh e logout, seleção de perfil, resolução do **contexto de autorização** (papéis e permissões), API de RBAC para o admin, headers/erros seguros e um serviço que sobe no `docker compose`. O admin nunca se cadastra pela API: é criado por CLI.

Ao fim da sprint você vê isso rodando por um **script de demo reproduzível**. Ainda não há tela nem BFF (isso é a Sprint 3).

## Escopo (o que cada task entrega)

| Task | Entrega | Prova |
|---|---|---|
| 5 | `@aura/internal-context`: contexto assinado (HMAC-SHA256, TTL de 60 s), `AuthContextGuard`, `@Public()`, `@RequirePermission()`, `@CurrentContext()` | testes de assinatura e de guard (adulteração, expiração, permissão ausente) |
| 6 | Cadastro do Personal e do Aluno por convite, `AuditService`, validação Zod compartilhada em `@aura/schemas`, versão dos termos | testes do `AccountsService` (convite inválido/usado/expirado devolve o mesmo erro genérico; e-mail duplicado não vaza) |
| 7 | Login, refresh, logout, seleção de perfil, reenvio de verificação e "esqueci a senha"; **throttle de login** (429), `KeyValueStore` (memória e Redis), `ServiceKeyGuard` | testes do `SessionsService`, incl. login com e-mail não verificado → 403 `email_not_verified` (ruling R4) |
| 8 | `AuthorizationService.resolve` (ok / precisa selecionar perfil / negado), API de RBAC (`/roles`, `/permissions`, `/users`), `/me`, versão de autorização (`AuthzVersion.bump`) | testes de resolução e regras protegidas (`protected_permission`, `cannot_suspend_self`) |
| 9 | `@aura/http-security`: headers, Host, CORS sem `*`, HTTPS em produção, correlation-id validado, filtro de exceções `{ code, message, correlationId }`, `assertProductionSafe`, Swagger só fora de produção | testes HTTP (`supertest`) |
| 10 | Bootstrap do `identity-service`, OpenTelemetry (`@aura/observability`), `identity-migrate` e `identity-service` no compose, **CLI de criação do admin** e `scripts/demo-identity.sh` | e2e do serviço (5) + observability (2) e `identity-service` *healthy* |

## Critérios de aceite

**Técnico**
- Cada task: teste escrito antes e visto falhando; depois passando; tudo via `docker compose`; um commit por task com a mensagem do plano.
- Cada task percorre o ciclo **desenvolvimento → QA → revisão (conformidade, depois qualidade) → verificação do orquestrador → seu aceite** (ver `clickup-workflow.md`, "Ciclo de handoff").
- `docker compose up -d --wait identity-service` deixa o serviço saudável; a porta 3001 **não** é publicada no host.
- O `identity-service` não importa Keycloak diretamente (só a porta). Nenhuma senha no nosso banco; nenhum segredo versionado.
- Respostas de erro padronizadas, sem stack trace nem detalhe interno, com `correlationId`.
- **D3 aplicado (opção A, sua decisão):** depois do logout, a resolução de autorização daquela sessão passa a responder `denied` (ver "Decisão D3" abaixo).

**Negocial**
- O Personal se cadastra sozinho; o Aluno **só** com convite válido de um Personal; o Admin **nunca** pela API.
- Login com e-mail não verificado é recusado com uma mensagem que leva o usuário à verificação, sem revelar se o e-mail existe em outros casos.
- O admin consegue mudar as permissões de um papel e a mudança passa a valer no contexto resolvido (versão de autorização), com trilha de auditoria.

## Decisão D3 aplicada (opção A) — o que muda no plano

**Problema.** No plano original, `logout` só revoga a sessão no Keycloak, e `resolve` continua devolvendo `ok` enquanto existir a chave de perfil da sessão no KV. O BFF (Sprint 3) checaria a sessão nas rotas sensíveis, mas hoje não há o que checar.

**Proposta (ruling R16, precisa do seu OK):**
1. **Task 7:** `SessionsService.logout` decodifica o `sid` do refresh token apresentado, grava `session:{sid}:revoked` no KV com TTL de 600 s (a vida do access token) e apaga `session:{sid}:membership`.
2. **Task 8:** `AuthorizationService.resolve` devolve `denied` se `session:{sid}:revoked` existir.
3. Um teste novo em cada task: "após o logout, `resolve` da mesma sessão devolve `denied`".
4. Sprint 3 (BFF): rotas de papéis e admin chamam `resolve` **sem cache**; as demais mantêm o cache normal e o token de 600 s.

Custo: pequeno (duas chaves de KV e dois testes). Risco: nenhum para o que já foi aceito, pois não altera a porta nem o `KeycloakProvider`. O `sid` vem de um token que o próprio cliente apresenta e a chave é só de negação, então forjar um `sid` não dá acesso a nada.

## Ordem de execução e dependências

`5 → 6 → 7 → 8 → 9 → 10`. As Tasks 6, 7 e 8 dependem uma da anterior; a 9 é independente, mas **`pnpm-lock.yaml`, `docker-compose.yml` e as migrações têm um dono por vez**, então executo **em sequência**. Uma exceção segura: a revisão/QA da Task N pode rodar enquanto a Task N+1 começa, quando os arquivos permitidos forem disjuntos e o lockfile não estiver em uso.

Rulings já decididos que esta sprint aplica: **R2** (`@aura/config` como devDependency), **R3** (build das dependências antes dos testes), **R4** (`EmailNotVerifiedError` → 403 na Task 7), **R6** (teste do correlation-id sem CR/LF, Task 9), **R7** (e2e lê os segredos do env do container, Task 10).

## Roteiro de demo (Sprint Review)

1. `docker compose up -d --wait identity-service` e `docker compose ps` (tudo *healthy*; porta 3001 sem publicação no host).
2. Rodar `scripts/demo-identity.sh` no `workspace`. Ele mostra, em ordem: cadastro do Personal → login **recusado** antes de verificar (403) → e-mail de verificação no Mailpit → login depois da verificação → contexto de autorização resolvido → senha errada e e-mail inexistente com a **mesma** resposta → convite e cadastro do Aluno.
3. Criar o admin por CLI (`make admin` ou o equivalente `docker compose run …`) e mostrar que a API **não** cria admin.
4. Como admin: mudar as permissões de um papel e ver a versão de autorização subir, o `AuditLog` registrar a ação e o contexto resolvido refletir a mudança.
5. Logout e prova do D3: o `resolve` da mesma sessão passa a `denied`.
6. Mostrar erros seguros (sem stack trace, com `correlationId`) e headers (`curl -i`).
7. Rodar as suítes (`test`) de cada pacote; a suíte de contrato do provedor continua 8/8 no Keycloak real e em memória.

## Riscos e como tratamos

| Risco | Tratamento |
|---|---|
| Task 10 é a mais pesada (compose, migração, OTel, e2e, CLI, demo) | Um checkpoint por capacidade; `docker-compose.yml` com dono único; QA obrigatório antes do seu aceite |
| Lockfile e migrações em disputa | Execução em sequência; um dono por vez |
| pnpm sobre bind mount no Windows é lento e já travou a sessão | Proibido `Glob`/`Grep` na raiz e em `node_modules`; caminhos explícitos; se ficar lento, `node_modules` em volume |
| Enumeração de contas (cadastro, login, reset, reenvio) | Respostas genéricas idênticas e testes que comparam corpo e status |
| Força bruta no login | Throttle por e-mail+IP (429) na Task 7, mais o bloqueio do Keycloak; o QA mede o comportamento (achado D5 da Sprint 1) |
| E-mail que falha em silêncio (achado D1 da Sprint 1) | Proposta de ruling **R17**: na Task 7, falha no envio é **registrada** (log + auditoria) sem mudar a resposta genérica; corrige o `res.ok` ignorado no provider |
| Cota do ClickUp (100 chamadas/dia) | Ver "Visibilidade e orçamento" abaixo |
| Limitações da demo (login não verificado é simulado marcando o e-mail no Keycloak) | O QA da Task 7 clica no link real de verificação do Mailpit e registra a evidência |

## Visibilidade e orçamento do ClickUp

- Uma lista nova **"Sprint 2 — API de identidade"** no folder Aura Fit, com um milestone por Task e um card por agente (desenvolvimento, QA, revisão), no modelo Scrum já em uso.
- **Estimativa:** cerca de 12 chamadas por Task, ou ~75 para a sprint, contra o teto operacional de 60 por dia. A sprint então passa por **mais de um dia**; o log local (`docs/sprints/logs/sprint-02/`) cobre o intervalo e o comentário agrupado sobe quando cada milestone fecha.
- Só o orquestrador chama o ClickUp; decisões e alertas de ação perigosa vão direto, com você mencionado.

## Fora desta sprint

BFF, cookies/CSRF, telas (Sprint 3 e 4), app mobile, login com Google (Task 19), CI, imagens de produção e os overrides de produção do realm (`sslRequired`, `redirectUris`, SMTP com TLS, segredo de dev). Os itens menores das Sprints 0 a 1 continuam no ledger, exceto D1 (R17).

## Pré-requisitos já verificados

Sprint 1 aceita (Tasks 3 e 4 em `accepted`); Keycloak 26.0 e Mailpit saudáveis; suíte de contrato 8/8 no Keycloak real e em memória; `PENDENCIAS.md` sem bloqueios; D3 decidido (opção A).

## Preparação para executar (após o seu OK)

1. Criar a lista da Sprint 2 no ClickUp e os 6 milestones (7 chamadas).
2. Registrar R16 e R17 no ledger e ajustar o plano (Tasks 7 e 8) com os testes novos.
3. Começar pela Task 5, com o cartão do implementador criado **antes** de despachar.

**O que preciso de você para começar:** o "OK do planning" e a resposta às duas propostas (R16 e R17), que recomendo aprovar.

---

## Daily log

_(a preencher: um daily por task concluída e a cada sessão, no formato Progresso · Hoje · Dificuldades · Pendências)_

## Review

_(preenchida no fim: demo, artefatos, feedback do revisor, ajustes para a Sprint 3)_
