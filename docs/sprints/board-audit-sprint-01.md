# Auditoria do quadro Sprint 1 — 2026-09-21

Fontes: `logs/board-snapshot-2026-09-21.md`, `clickup-workflow.md`, `sprint-01.md`, ledger `.superpowers/sdd/2026-09-19-rbac-auth/progress.md`, `logs/sprint-01/task-3-4.log.md`, `evidence/sprint-01/**`, `git log`/`git show --stat`. Nenhuma chamada ao ClickUp; o snapshot é a única fonte do estado atual dos cards. Árvore git limpa (só o snapshot não rastreado).

## 1. Cards existentes

| id | Status atual | Status CORRETO | Prova | Próximo responsável | Ação |
|---|---|---|---|---|---|
| 86e3bccpk Task 0 (milestone) | Closed | Closed | 88237ae + b3a68c1; ledger "Task 0: complete (review clean)"; Allan tratou T0–T2 como concluídas por handoff | — | nada |
| 86e3bccq5 Impl. Task 0 | Closed | Closed | 88237ae, b3a68c1 | — | nada |
| 86e3bccq7, 86e3bccqb Revisar / Re-revisar Task 0 | Closed | Closed | ledger: 1 Important achado e corrigido; re-revisão limpa | — | nada |
| 86e3bccpn Task 1 (milestone) | Closed | Closed | 732b1c9; ledger "review clean" | — | nada |
| 86e3bccqc, 86e3bccqg Impl./Revisar Task 1 | Closed | Closed | 732b1c9; ledger "spec OK, quality approved" | — | nada |
| 86e3bccpp Task 2 (milestone) | Closed | Closed | 871599a; ledger "complete, per user handoff" | — | nada (ver lacuna: sem revisor) |
| 86e3bccqk Impl. Task 2 INTERROMPIDO | Closed | Closed | ledger: linhas perdidas, reconstruído do git; título registra a interrupção | — | nada |
| 86e3bccqt Orquestrador Task 2 (inline) | Closed | Closed | 871599a (autor Allan Teotonio, trailer do orquestrador) | — | nada |
| **86e3bccpt Task 3 (milestone)** | Closed | **completed** | 38e6cc5 + review-86e3bcqd5.md (0 Critical/Important) + verification-tasks-3-4.md (8/8). `pending-clickup.md` linha 7 e `sprint-01.md` ("aguardando aprovação") mostram que o aceite do Allan NÃO ocorreu. Closed antes do aceite viola a coluna `accepted`/`Closed` do workflow | orquestrador (reverter) → Allan (aceite) | mover Closed → completed |
| **86e3bcqd5 Impl. Task 3 (título cita a2daa612)** | Closed | **completed** | mesma evidência; `evidence-86e3bcqd5.md`; log linhas 5–9 mostram que a2daa612 morreu (00:02) e quem entregou foi impl3 | orquestrador | mover para completed + renomear para `[implementador · a4413da3] Implementar Task 3` (id vem só do snapshot; conferir no transcrito) |
| 86e3bcqfj CP1 a2daa612 (órfã) | in progress | Closed (ou apagar) | log linha 5: agente parou sem entregar; snapshot: "nunca executada". `in progress` afirma trabalho em curso que não existe | Allan decide (pending-clickup.md linha 6) | Allan escolhe: apagar (recomendo, 4 calls) ou fechar |
| 86e3bcqgw / 86e3bcqjp / 86e3bcqm0 CP2–4 a2daa612 (órfãs) | Open | Closed (ou apagar) | idem; nunca executadas | Allan decide | idem |
| 86e3bd9x7 / 86e3bd9y8 / 86e3bd9zt [impl3] CP1–3 | completed | completed | commit 38e6cc5; test-output.txt 8/8 | Allan (aceite via pai) | nada (título fora do padrão, ver 2) |
| **86e3bccpy Task 4 (milestone)** | completed | completed, com ressalva | 738c73a; review-86e3bdg21.md aprovado; verification-tasks-3-4.md (KC 8/8, in-memory 8/8). Ressalva: a verificação é de HEAD 738c73a, anterior a 32a2bfb e 7390c4f (ver 3); não houve QA | orquestrador (fechar lacunas de evidência) → Allan (aceite) | manter; criar cards faltantes; comentar |
| 86e3bdg21 [implementador · impl4] Task 4 | completed | completed | 738c73a; evidence-86e3bdg21.md | idem | nada (idcurto é alias, ver 2) |
| 86e3bdg56 / 86e3bdg5e / 86e3bdg5u [impl4] CP1–3 | completed | completed | evidence-86e3bdg21.md critérios [x] | — | nada (título fora do padrão) |

Sobre "Task 3 fechada antes do aceite": Closed exige Sprint Review após o aceite (workflow, tabela Colunas). Tasks 0–2 têm aceite por handoff; Task 3 não. Correção: `completed`.

## 2. Inconsistências de título
- 86e3bcqd5 cita a2daa612 (agente que parou); entregou impl3 (snapshot cita a4413da3; ledger e log só dizem "impl3"). Regra do workflow: idcurto = 8 primeiros caracteres do id do subagente.
- CPs 86e3bd9x7/y8/zt usam `[impl3]`: faltam papel e idcurto (`[implementador · a4413da3] CPn — …`).
- 86e3bdg21 e 86e3bdg56/5e/5u usam `impl4` como idcurto (alias, não 8 caracteres).
- Descrições dos cards retroativos devem dizer que foram criados retroativamente (workflow, Protocolo item 6). Não verificável pelo snapshot.

## 3. Lacunas de fluxo e divergências de evidência
- Sem card de revisor para Task 3 e Task 4 (revisões existem: review-86e3bcqd5.md, review-86e3bdg21.md; log linhas 11 e 18).
- Sem card de revisor para Task 2 (ledger não registra revisão; 871599a entregue por handoff).
- Sem QA para nenhuma Task. O que existiu foi verificação do orquestrador (verification-tasks-3-4.md). Ficaram NÃO VERIFICADOS (verification-tasks-3-4.md linhas 18-23; evidence-86e3bdg21.md): e-mails no Mailpit, ramo `email_verified=false`, brute-force, login social, turbo build/lint.
- Correção do timeout (32a2bfb) foi feita pelo orquestrador (log linha 19) sem card, sem `fix-<card>.md` e sem arquivo de verificação: `verification-tasks-3-4.md` está no HEAD 738c73a. O log diz 02:00 e o commit é 01:47:09 (mesmo instante de 7390c4f): horário do log inconsistente.
- 7390c4f (realm + Mailpit, decisão R15 do ledger, feito pelo orquestrador) sem card. O review de Task 4 (linha 9) o viu não commitado; foi commitado depois, sem nova verificação em arquivo.
- Important nº 1 do revisor (senha fraca vira 500) foi rebaixado a Minor pelo orquestrador com base no plano (log linha 19); o revisor pediu conferir. Registrar como decisão.
- Não há evidence dir para Tasks 0–2 (regra de evidência é de b8c4980, posterior; não exigível retroativamente).

## 4. Cards que FALTAM (todos retroativos, status `completed`, descrição diz "criado retroativamente")
| Título sugerido | Pai | Prova |
|---|---|---|
| `[revisor · a definir] Revisar Task 3` | 86e3bccpt | review-86e3bcqd5.md; log 01:25 |
| `[revisor · a definir] Revisar Task 4` | 86e3bccpy | review-86e3bdg21.md; log 01:40 |
| `[revisor · a definir] Revisar Task 2` (só se existir revisão; ledger não mostra) | 86e3bccpp | verificar antes de criar |
| `[orquestrador] Verificar Tasks 3 e 4 (reexecução dos testes)` | 86e3bccpy | verification-tasks-3-4.md |
| `[corretor] Corrigir timeout em toda requisição Keycloak` (executado pelo orquestrador) | 86e3bccpy | 32a2bfb; log linha 19 |
| `[orquestrador] Configurar realm Keycloak e Mailpit` | 86e3bccpy | 7390c4f; ledger R15; log linhas 12-13 |
| `[QA · a definir] Executar QA da Task 4 (Mailpit, brute-force, ramo não verificado)` — status `pending`, NÃO retroativo | 86e3bccpy | NÃO VERIFICADO em verification-tasks-3-4.md |
Ids de agente revisor não constam nos arquivos lidos; obter do transcrito antes de criar. Checkpoints (3–8) desses cards: dívida, não cabem no orçamento.

## 5. Custo em chamadas ClickUp e prioridade (limite 25; teto operacional do orçamento é 60/dia)
| # | Ação | Calls |
|---|---|---|
| 1 | 86e3bccpt Closed → completed | 1 |
| 2 | 86e3bcqd5: renomear + status completed (mesma chamada) | 1 |
| 3 | Comentário no 86e3bccpt: fechada antes do aceite, revertida; pedir aceite (@Allan) | 1 |
| 4 | Comentário no 86e3bccpy: lacunas 3, aceite pendente, decisão órfãs (@Allan) | 1 |
| 5 | Criar Revisar Task 3 e Revisar Task 4 | 2 |
| 6 | Criar Corrigir timeout, Configurar realm/Mailpit, Verificar Tasks 3 e 4 | 3 |
| 7 | Criar QA Task 4 (pending) | 1 |
| 8 | Órfãs (após decisão do Allan): apagar ou fechar as 4 | 4 |
| 9 | Criar Revisar Task 2 (se houver revisão) | 1 |
| 10 | Retitular [impl3] CP1–3 e [impl4] card+CP1–3 | 7 |
| **Total** | | **22** |

Ordem: 1, 2, 3, 4 (corrige estado e avisa o Allan) → 5, 6 → 8 (quando o Allan decidir) → 7 → 9 → 10. Se faltar cota, cortar 10 e 9 (total 14 a 15). Sem nenhum ClickUp: atualizar `pending-clickup.md` e criar `verification-tasks-3-4` adendo para HEAD 7390c4f (reexecutar 8/8 KC e in-memory).
