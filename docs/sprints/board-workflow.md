# Quadro Kanban local — como todo agente trabalha (leia este primeiro)

**Este documento é a fonte oficial do andamento e vale mais que o `clickup-workflow.md` onde os dois divergirem.** O ClickUp é só um espelho, atualizado pelo orquestrador em marcos (ver orçamento no `clickup-workflow.md`). O Allan acompanha o trabalho pelo quadro do VS Code (extensão *Kanban Markdown*). **Se o card não diz, para o Allan não aconteceu.**

## 1. Onde está e o que você pode tocar

| O quê | Caminho | Quem escreve |
|---|---|---|
| Cards da sprint | `E:\allan\aura-fit\docs\sprints\board\sprint-XX\<id>.md` (arquivos soltos, **sem subpastas**) | todos os agentes |
| Configuração do quadro | `E:\allan\aura-fit\.vscode\settings.json` (`kanban-markdown.*`) | **só o orquestrador** |
| Todo o resto (código, evidências, logs) | dentro do worktree `E:\allan\aura-fit\.claude\worktrees\rbac-auth` | conforme o escopo do seu card |

Regra do Allan: você lê, cria, edita e apaga arquivos **somente dentro do worktree**, com **uma única exceção**: a pasta `docs/sprints/board/` da raiz. Ação prejudicial ou antiética não se executa; se detectar algo perigoso, registre no card com `🚨 CRITICIDADE` (ação, risco, decisão do grupo) e avise o orquestrador, que notifica o Allan.

## 2. Formato do card (cabeçalho YAML **exato**)

A extensão regrava o cabeçalho com estes campos e **apaga qualquer campo extra**. Nunca crie campos novos.

```markdown
---
id: "task-5-impl"
status: "in-progress"
priority: "medium"
assignee: "implementador · a1b2c3d4"
epic: "Task 5"
dueDate: null
created: "2026-09-22T12:00:00.000Z"
modified: "2026-09-22T12:00:00.000Z"
completedAt: null
labels: ["role:implementador", "task-5"]
order: "a0"
---
# [implementador · a1b2c3d4] Implementar Task 5

**Subtarefa de:** task-5 · **Próximo responsável:** QA

## Critérios
- [ ] RED real visto antes da implementação
- [ ] Testes verdes (comando exato e contagem)
- [ ] Commit com trailer Co-Authored-By

## Tempo
_(preencher ao concluir, em minutos)_

## Evidência
_(caminho de docs/sprints/evidence/sprint-XX/<card>/…)_

## Decisões, problemas e soluções
_(post mortem: problema, causa, solução que funcionou)_
```

| Campo | Como usar |
|---|---|
| `id` e nome do arquivo | iguais: `task-N`, `task-N-impl`, `task-N-impl-cp1`, `task-N-review`, `task-N-qa`, `task-N-fix` |
| `status` | um dos ids da tabela abaixo (**é o que define a coluna**) |
| `assignee` | agente responsável: `papel · idcurto` (idcurto = 8 primeiros caracteres do id do subagente) |
| `epic` | a Task pai (`Task 5`): cada Task vira uma raia no quadro |
| `labels` | `role:<papel>`, `task-N`, `checkpoint` (subtarefa), `retroativo`, `abandonado` |
| `created`/`modified`/`completedAt` | ISO 8601 em UTC; atualize `modified` a cada edição e `completedAt` ao concluir |

Checklist, tempo, evidência, ids externos e post mortem ficam **no corpo** (o cabeçalho não comporta).

## 3. Status (coluna = campo `status`, sem mover arquivo)

`open` → `pending` → `in-progress` → `in-review` → `completed` → `accepted` → `closed`; desvios: `rejected` (QA/revisão achou defeito), `blocked` (impedimento ou decisão pendente).

| Status | Significa | Quem move para cá |
|---|---|---|
| `open` | previsto, sem sprint | orquestrador |
| `pending` | pronto para começar (brief pronto) | orquestrador |
| `in-progress` | um agente trabalha agora | o agente, **antes** de agir |
| `in-review` | QA ou revisão em andamento | o agente de QA/revisão ao começar |
| `rejected` | defeito achado; volta ao corretor | QA ou revisor |
| `blocked` | impedimento ou decisão do Allan (prefixo `❓ DECISÃO:` ou `⛔ BLOQUEADO:` no título) | quem detecta |
| `completed` | pronto **e verificado com evidência**; espera o aceite | orquestrador (após reexecutar ao menos 1 comando) |
| `accepted` | aceito pelo Allan | Allan (ou orquestrador, após o aceite por escrito) |
| `closed` | encerrado na Sprint Review (ou abandonado, com a etiqueta `abandonado`) | orquestrador |

**Regras:** o status muda **antes** da ação, nunca depois. Um subagente **nunca** move o próprio card para além de `in-review`: quem valida e leva a `completed` é o orquestrador. Não use o id `done`.

## 4. Passo a passo por papel

Toda Task percorre a mesma esteira: **desenvolvimento → QA → revisão (conformidade, depois qualidade) → verificação do orquestrador → aceite do Allan.**

1. **Orquestrador, antes de despachar:** cria o card da Task (`task-N`, milestone) se não existir e o card do agente com escopo, arquivos permitidos e critério de pronto; põe em `in-progress`; passa o **caminho do card** no prompt.
2. **Você, ao começar:** abre o seu card, confirma escopo e critérios, e edita `Próximo responsável`.
3. **Subtarefas (checkpoints):** crie de 3 a 8 cards `task-N-<papel>-cpK` (label `checkpoint`, mesmo `epic`), cada um com critérios como checklist; marque `in-progress` ao começar e conclua marcando os `- [x]`, com `completedAt`. Um checkpoint é uma **capacidade verificável**, nunca um micro-passo.
4. **Ao terminar:** grave a evidência em `docs/sprints/evidence/sprint-XX/<card>/` **(execução real: comando exato, commit, data/hora, código de saída, saída bruta, itens NÃO VERIFICADOS, sem segredos)**, preencha `Tempo`, `Evidência` e `Decisões, problemas e soluções` no card e devolva ao orquestrador.
5. **Revisor e QA:** cada um tem o seu card (`task-N-review`, `task-N-qa`), criado antes de agir. Achados por severidade (Critical/Important/Minor); defeito Critical/Important → card `task-N-fix` em `rejected`.
6. **Orquestrador, ao receber:** reexecuta ao menos um comando da evidência, confere o commit e só então move para `completed`.

## 5. Registros obrigatórios

- **Post mortem:** todo erro, problema ou decisão + a solução que funcionou vai para a seção `Decisões, problemas e soluções` do **card da Task** (pai). É a base de conhecimento futura.
- **Log de eventos:** o orquestrador consolida em `docs/sprints/logs/sprint-XX/` (agente, data e hora, tipo, mensagem). Ao fechar a Task, o resumo agrupado vai como **um** comentário no ClickUp.
- **Decisão do Allan:** card do agente em `blocked` com prefixo `❓ DECISÃO:` e um bloco `Contexto / Opções / Recomendação / O que acontece se não responder`; **pare** e retorne `NEEDS_DECISION` ao orquestrador, que avisa o Allan.
- **Tempo:** minutos por card, no corpo.

## 6. Não faça

- Não crie campos extras no cabeçalho, nem subpastas de status dentro do quadro.
- Não edite `.vscode/settings.json` nem arquivos fora do worktree e da pasta do quadro.
- Não chame o ClickUp (só o orquestrador, com orçamento de chamadas).
- Não use `Glob`/`Grep` na raiz do worktree nem em `node_modules`, nem `Get-ChildItem -Recurse` (travou o VSCode). Use caminhos explícitos.
- Não marque nada como pronto sem evidência gerada por execução real.
