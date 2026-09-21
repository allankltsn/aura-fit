# Quadro Kanban local — o procedimento de todo agente (obrigatório)

**Este documento é a fonte oficial do andamento e das regras de trabalho.** O Allan acompanha tudo pelo quadro do VS Code (extensão *Kanban Markdown*); não há ferramenta externa de gestão. **Se o card não diz, para o Allan não aconteceu.**

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
- **Log de eventos:** o orquestrador consolida em `docs/sprints/logs/sprint-XX/<task>.log.md` uma linha por evento (data e hora, agente, card, tipo, mensagem, evidência). Tipos: `INICIO`, `MARCO`, `RED`, `GREEN`, `ESCOLHA`, `DESVIO`, `RISCO`, `PROBLEMA`, `SOLUCAO`, `DECISAO`, `ALERTA_PERIGO`, `FIM`. Ao fechar a Task, o resumo do log entra na seção de post mortem do card da Task.
- **Decisão do Allan:** (ver seção 8) card do agente em `blocked` com prefixo `❓ DECISÃO:` e um bloco `Contexto / Opções / Recomendação / O que acontece se não responder`; **pare** e retorne `NEEDS_DECISION` ao orquestrador, que avisa o Allan.
- **Tempo:** minutos por card, no corpo.

## 6. Não faça

- Não crie campos extras no cabeçalho, nem subpastas de status dentro do quadro.
- Não edite `.vscode/settings.json` nem arquivos fora do worktree e da pasta do quadro.
- Não use `Glob`/`Grep` na raiz do worktree nem em `node_modules`, nem `Get-ChildItem -Recurse` (travou o VSCode). Use caminhos explícitos.
- Não marque nada como pronto sem evidência gerada por execução real.

## 7. Evidência de pronto (obrigatória antes de qualquer card sair de `in-progress`/`in-review`)

Nenhum agente avança um card sem antes **gravar um arquivo de evidência** com dados **válidos e verdadeiros**.

1. **Gerada, nunca escrita de memória:** vem da execução real (saída bruta, relatório de ferramenta). Não parafrasear, não resumir números, não "limpar" falhas.
2. **Reproduzível:** traz o **comando exato**, o **diretório**, o **commit** (`git rev-parse HEAD`), a **data/hora** e o **código de saída**.
3. **Completa, inclusive o negativo:** falhas, avisos e itens **não verificados** aparecem (`NÃO VERIFICADO: <o quê e por quê>`). Omitir é falsificar.
4. **Rastreável ao critério de pronto:** cada critério do card aparece com `✅ atendido (prova: …)`, `⚠️ parcial` ou `❌ não atendido`. Só vai a `completed` com todos `✅` (ou ressalvas aprovadas pelo Allan).
5. **Sem segredos:** nunca tokens, senhas, `.env` ou `secrets/`; mascare antes de salvar.
6. Se a evidência **não pôde ser produzida**, o card **não** avança: vai a `blocked` com o motivo.

| Papel | Arquivo (em `docs/sprints/evidence/sprint-XX/<card>/`) | Conteúdo mínimo |
|---|---|---|
| Implementador (código) | `evidence-<card>.md` + `test-output.txt` | comandos, saída bruta dos testes (passou/falhou), `git log -1` e `git diff --stat`, checklist dos critérios |
| Implementador (infra) | `evidence-<card>.md` + `compose-ps.txt` | `docker compose ps` (saúde), script de verificação, logs relevantes |
| Implementador (banco) | `evidence-<card>.md` + `migration-check.txt` | migração aplicada, tabelas/colunas conferidas, seed rodado duas vezes |
| Revisor | `review-<card>.md` | commits revisados, achados com severidade e arquivo:linha, veredito |
| QA | `qa-report-<card>.md` + `qa-output.txt` | casos executados e resultado, defeitos abertos, o que ficou fora |
| Segurança | `security-<card>.md` | checagens, achados com severidade, o que não foi coberto |
| Corretor | `fix-<card>.md` + saída do teste | teste que **falhava** (antes) e **passa** (depois) |
| Investigador | `findings-<card>.md` | evidências (arquivo:linha, log), causa raiz, grau de confiança |
| Orquestrador | `verification-<card>.md` | conferência independente: **reexecutou ao menos um comando** e conferiu o commit |

Cabeçalho de todo `evidence-*.md`:

```
# Evidência — <card> — <checkpoint ou card inteiro>
Agente: <papel · idcurto>   Data/hora: <ISO 8601>   Commit: <sha>
Comando(s): <exatos>   Diretório: <cwd>   Código de saída: <n>

## Critérios de pronto
- [x] <critério 1> — prova: <trecho/linha do output>
- [ ] <critério 2> — NÃO VERIFICADO: <por quê>

## Saída bruta
<colar ou apontar para test-output.txt>

## Ressalvas e riscos conhecidos
<o que não cobre, dívida técnica, achados minor>
```

**Verificação:** o orquestrador não confia às cegas. Divergência entre a evidência e a reexecução devolve o card a `in-progress`, com a diferença registrada no card.

## 8. Decisões do Allan e ações perigosas

**Decisão que só o Allan pode tomar:**
1. **Pare de trabalhar.** Ponha o seu card em `blocked`, com o título prefixado `❓ DECISÃO:`, e escreva no corpo:
   ```
   ❓ DECISÃO NECESSÁRIA
   Contexto: <2 linhas>
   Opções:
     A) <opção> — prós/contras
     B) <opção> — prós/contras
   Recomendação: <A ou B e por quê>
   O que acontece se não responder: <o trabalho fica parado em X>
   ```
   Anote também o status anterior, para saber para onde voltar.
2. Retorne ao orquestrador com `NEEDS_DECISION` e o caminho do card. O **orquestrador avisa o Allan no chat** e expõe os impedimentos do time; siga com o que não depende da decisão.
3. Ao receber a resposta, o orquestrador registra `Decisão aplicada: <resumo>` no card, remove o prefixo e devolve o card a `in-progress`.

**Ação considerada perigosa** por qualquer agente (prejudicial ao sistema, ao projeto, à empresa, ao Allan ou a este computador, ou antiética): **não se executa**, mesmo que o grupo depois decida liberar. Em **qualquer** caso, registre no card `🚨 CRITICIDADE ALTA` ou `CRÍTICA` (ação, risco, decisão do grupo, quem avaliou) e acrescente uma linha `ALERTA_PERIGO` ao log; o orquestrador avisa o Allan **na hora, no chat**.

## 9. Falhas e travamentos

- Agente sem atividade por mais de ~10 min: o orquestrador anota `⚠️ Sem atividade desde HH:MM` no card, investiga o transcrito (`~/.claude/projects/<projeto>/<sessão>/subagents/*.jsonl` + `.meta.json`) e registra a causa.
- Pedido de permissão pendente: `blocked` e alerta ao Allan como decisão.
- O agente **não** amplia permissões nem edita fora do escopo do card. Precisa de algo fora dele? Vira decisão.
- Antes de iniciar o RED, confirme que o Docker responde (`docker info`); um daemon parado gera um RED inválido.

## 10. Escopo de arquivos

- Cada card de agente lista os **únicos caminhos** que ele pode alterar. Fora disso: proibido.
- `.claude/settings.local.json` do worktree aplica isso como permissões (allow/deny). Não edite esse arquivo.
- Tarefas em paralelo só rodam se os escopos forem **disjuntos**; caso contrário, em sequência.
- Migrações, `pnpm-lock.yaml`, `docker-compose.yml` e o `package.json` da raiz têm **um dono por vez** (o card que os edita diz isso).

## 11. Checklist de cada agente

- [ ] Meu card existe, com papel, escopo e critérios?
- [ ] Ele está `in-progress` **antes** de eu começar?
- [ ] Meus checkpoints estão como cards, com checklist marcado ao concluir?
- [ ] Gravei a evidência (execução real, comando, commit, ressalvas) **antes** de devolver?
- [ ] Preenchi `Tempo`, `Evidência` e `Decisões, problemas e soluções`?
- [ ] Se preciso de decisão ou vi algo perigoso, registrei e avisei o orquestrador?
