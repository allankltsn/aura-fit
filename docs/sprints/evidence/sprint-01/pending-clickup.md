# Pendências de registro no ClickUp (limite diário do MCP estourado)

O conector ClickUp respondeu `RATE_LIMIT_EXCEEDED` (100/100 chamadas por dia; reinicia em ~21h a partir de 2026-09-20 01:30-03:00).
Nada abaixo foi perdido: está tudo no repositório. Postar quando o limite reiniciar (uma chamada por item, em lote):

1. Card `86e3bdg21` (agente Task 4): comentário de entrega — commit 738c73a, 8/8 contra Keycloak real, 8/8 in-memory, caminho da evidência `docs/sprints/evidence/sprint-01/86e3bdg21/`, anexo de `evidence-86e3bdg21.md`.
2. Card `86e3bdg21`: `🩺 POST MORTEM` — (a) limite diário do MCP do ClickUp atingido (100/100) com a sessão em pleno uso; solução: orçamento de chamadas, registro em lote; (b) Keycloak real já revoga a família de refresh (`revokeRefreshToken: true`, `refreshTokenMaxReuse: 0`), por isso R5 não foi implementado; (c) login não verificado no Keycloak = 400 `invalid_grant` "Account is not fully set up" → `EmailNotVerifiedError`.
3. Subtarefas `86e3bdg56` (CP1, hoje `em progresso`), `86e3bdg5e` (CP2), `86e3bdg5u` (CP3): mover para `concluído` e lançar tempo.
4. Cards `86e3bdg21` e milestone `86e3bccpy` (Task 4): mover para `concluído` após a revisão (`review-86e3bdg21.md`).
5. Subtarefas do card `86e3bcqd5` (Task 3): `86e3bd9x7`, `86e3bd9y8`, `86e3bd9zt` (impl3) seguem `em progresso`/`pendente` — mover para `concluído`; `86e3bcqfj/gw/jp/m0` (a2daa612) são órfãs e podem ser apagadas ou concluídas.
6. Milestone Task 3 (`86e3bccpt`) e card `86e3bcqd5` já estão `concluído` com comentário de entrega e post mortem.
