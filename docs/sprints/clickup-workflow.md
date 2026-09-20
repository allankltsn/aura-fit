# Processo de trabalho no ClickUp (obrigatório para todos os agentes)

O Allan não enxerga o que os subagentes fazem no terminal. **O ClickUp é a visão oficial do andamento.**
Regra de ouro: **o card muda ANTES da ação, nunca depois.** Se o card não diz, para o Allan não aconteceu.

## Onde

- Workspace `90171547867` → Space "Espaço da equipe" (`90177635925`) → Folder **Aura Fit** (`901711448391`)
- Lista da sprint atual: **Sprint 1 — Fundação e Keycloak** (`901717186702`)
  https://app.clickup.com/90171547867/v/l/li/901717186702
- Cada sprint nova ganha uma lista nova no folder, com o mesmo padrão.
- Allan: user id **`81487793`**. Toda decisão e todo alerta são atribuídos e mencionados a ele.

## Estrutura dos cards

| Nível | Tipo (`task_type`) | O que é | Exemplo |
|---|---|---|---|
| Pai | `milestone` | uma Task do plano (docs/superpowers/plans) | `Task 3 — IdentityProviderPort…` |
| Filho | Task (padrão, omitir `task_type`) | trabalho de **um agente** nessa Task (implementar, revisar, re-revisar, corrigir) | `[implementador · a1b2c3d4] Implementar Task 3` |
| Neto | Task (subtarefa do filho) | **um checkpoint lógico** do agente (uma capacidade ou entregável verificável) | `[implementador · a1b2c3d4] CP2 — CRUD de roles e permissões` |

- Só existem estes tipos na conta: `milestone`, `meeting_note`, `form_response`, `workflow` etc. **Não existem** Feature/Bug. Não tente criar outros.
- **Título do filho:** `[papel · idcurto] verbo + objeto`. Papéis: `orquestrador`, `implementador`, `revisor`, `corretor`, `investigador`. `idcurto` = 8 primeiros caracteres do id do subagente; o orquestrador não usa id.
- **Todo agente que atua no projeto tem seu próprio card filho.** Nada de trabalho sem card.
- Card do agente e cada checkpoint dele: descrição com **Agente**, **Escopo**, **Arquivos que pode tocar**, **Critério de pronto**. Ao concluir, um comentário com resultado, commit e evidência (saída dos testes).

## Colunas (status)

Fluxo de um card de Task (milestone) e dos cards de agente. **A API não cria status: o Allan os cria na UI** (Configurações da lista → Status). Nomes exatos, nesta ordem:

| # | Status | Tipo no ClickUp | Significado | Quem move |
|---|---|---|---|---|
| 1 | `backlog` | Aberto | previsto no plano, sem sprint | orquestrador |
| 2 | `pendente` | Aberto | na sprint, pronto para começar (brief pronto) | orquestrador |
| 3 | `em progresso` | Ativo | um agente implementa **agora** | orquestrador, antes de despachar |
| 4 | `aguardando decisão` | Ativo | precisa de resposta do Allan | quem levanta a dúvida |
| 5 | `bloqueado` | Ativo | impedimento externo (permissão, infra, ferramenta) | quem detecta |
| 6 | `code review` | Ativo | revisão de conformidade com plano/spec **e** de qualidade | orquestrador |
| 7 | `qa testing` | Ativo | testes de contrato/integração/e2e, verificação com evidência | orquestrador |
| 8 | `qa bugs` | Ativo | QA achou defeito; corretor trabalhando | orquestrador |
| 9 | `aguardando aceite` | Ativo | pronto; espera o aceite do Allan (Sprint Review) | orquestrador |
| 10 | `concluído` | Fechado | aceito e **verificado** (evidência no comentário) | orquestrador |

Caminho normal: `backlog → pendente → em progresso → code review → qa testing → aguardando aceite → concluído`.
Desvios: `code review` com achados → volta a `em progresso` (corretor); `qa testing` com defeito → `qa bugs` → volta a `qa testing`; qualquer estado → `aguardando decisão` ou `bloqueado` e retorna ao anterior.

Regras por status:
- `code review`: o card **do revisor** (filho) nasce aqui; achados Critical/Important voltam o pai a `em progresso`. Minor vira lista no comentário.
- `qa testing`: evidência obrigatória (comando, saída, contagem de testes). Defeito encontrado = **novo card filho** tipo Task no status `qa bugs`, com passos para reproduzir.
- `qa bugs`: só sai quando o teste que reproduzia o defeito passa e o pai volta a `qa testing`.
- `aguardando aceite`: usado na Sprint Review; só o Allan move para `concluído` (ou o orquestrador após o aceite dele por comentário).
- Cards filhos de agente: usam o subconjunto `pendente → em progresso → concluído` (e `bloqueado`/`aguardando decisão` quando couber).

> **Enquanto as colunas novas não existirem:** só há `pendente`, `em progresso` e `concluído`. Mantenha `em progresso` e prefixe o título com `❓ DECISÃO:`, `⛔ BLOQUEADO:`, `🔍 CODE REVIEW:`, `🧪 QA:` ou `🐞 QA BUGS:`. Remova o prefixo ao trocar de fase.

## Campo personalizado "Agente"

A API do conector **não cria campos personalizados**.

> **Ação manual do Allan (uma vez, na UI):** criar no folder **Aura Fit** o campo **Agente** (tipo Dropdown ou Texto). Opções sugeridas: `orquestrador`, `implementador`, `revisor`, `corretor`, `investigador`.
> Ao existir, use `clickup_get_custom_fields` (com `list_id`) para pegar o id do campo e preencha em **todo** card, no `create_task`/`update_task` via `custom_fields`.

**Qual campo informa o subagente hoje?** Nenhum campo dedicado ainda (o campo **Agente** só existe depois que o Allan o criar na UI). Até lá, a identificação está em **dois lugares**: o **título** `[papel · idcurto]` e a linha `**Agente:**` da descrição (papel, tipo, modelo e id completo). O *Responsável* (assignee) do ClickUp **não** serve para isso: ele é sempre o Allan. Quando o campo existir, ele é o campo oficial, preenchido no card do agente **e em todos os seus checkpoints (netos)**.

## Diário de bordo (obrigatório, por checkpoint)

Objetivo: o Allan consegue reconstruir **o caminho, a evolução, a metodologia e as escolhas técnicas** de cada agente lendo só o ClickUp.

**Regra:** o trabalho de cada agente é dividido em **checkpoints lógicos e determinísticos** (o "grão" é o **entregável ou a capacidade**, não a ação técnica). Cada checkpoint é uma **subtarefa (neto)** do card do agente, criada **antes** de começar e movida `pendente → em progresso → concluído` em tempo real.

**O que é um checkpoint (e o que não é):**
- É um **resultado verificável**: alguém consegue dizer "está pronto ou não está" por um critério objetivo (testes verdes, comando que passa, artefato existente).
- É nomeado pela **capacidade entregue**, nunca pelo detalhe de implementação.
- **Quantidade:** de **3 a 8 por card de agente**. Menos de 3 = grão grosso demais; mais de 8 = grão fino demais, reagrupe.
- **Ordem determinística:** os checkpoints seguem uma sequência previsível e são **definidos no card do agente antes de começar** (o orquestrador os lista no brief; o agente só ajusta se justificar).
- Um checkpoint tem **critério de pronto** escrito na descrição.

| ✅ Grão certo (checkpoint) | ❌ Grão fino demais (não criar) |
|---|---|
| `CRUD de usuários` | `criar rota /users/{id}` |
| `CRUD de roles e permissões` | `adicionar DTO de role` |
| `Configurações de segurança (guards, headers, rate limit)` | `importar helmet` |
| `Schema Prisma e migração inicial` | `escrever model User` |
| `Testes de contrato do provedor` | `rodar vitest uma vez` |
| Revisor: `Conformidade com a spec` / `Qualidade de código` | `ler o arquivo X` |

**Checkpoints por papel (modelos):**
- **Implementador:** um por capacidade do escopo da Task, mais `Testes verdes e evidência` e `Commit` no fim. Ex. Task 2: `Schema Prisma e migração` → `Seed RBAC idempotente` → `Testes verdes` → `Commit`.
- **Revisor:** `Conformidade com plano/spec` → `Qualidade de código` → `Veredito e achados por severidade`.
- **Corretor:** `Reproduzir o defeito (teste que falha)` → `Correção` → `Regressão verde`.
- **Investigador:** `Levantamento de evidências` → `Causa raiz` → `Recomendação`.
- **Orquestrador:** um por fase (ex.: `Brief e escopo`, `Despacho`, `Verificação`, `Daily`).

**Detalhe técnico fino** (arquivos, comandos, rota a rota) **não vira card**: vai dentro do comentário do checkpoint, no campo `Caminho`.

**Cada checkpoint tem um comentário no formato fixo**, escrito ao iniciar (o plano) e completado ao terminar:

```
🧭 CHECKPOINT <n> — <capacidade entregue>
Objetivo: <o que este checkpoint prova ou entrega>
Caminho: <o que foi feito, em ordem, com arquivos/comandos relevantes>
Metodologia: <TDD (RED→GREEN), leitura do brief, revisão em 2 etapas, bisect, etc. e por que>
Escolhas técnicas: <decisão tomada> | Alternativas descartadas: <quais> | Motivo: <trade-off>
Riscos/dúvidas: <o que pode dar errado ou ficou em aberto; se exigir o Allan, vira decisão>
Evidência: <comando + saída resumida, commit, contagem de testes>
Resultado: ✅ ok | ⚠️ com ressalva | ❌ falhou (e o que muda no próximo checkpoint)
```

- **Ao iniciar o checkpoint:** move para `em progresso` e comenta `Objetivo`, `Metodologia` e a intenção de `Caminho`. (Os checkpoints do card já existem como subtarefas `pendente` desde o brief; assim o Allan vê o plano inteiro antes do trabalho.)
- **Ao terminar:** completa `Caminho` real (se divergiu do plano, diga por quê), `Escolhas técnicas`, `Evidência`, `Resultado` e move para `concluído`.
- **Escolha técnica não trivial** (biblioteca, modelagem, desvio do plano/spec): registrar **antes** de aplicar. Se afeta o escopo, custo ou segurança, é **decisão para o Allan** (ver "Alertas e decisões").
- **Erro ou desvio:** checkpoint novo `Corrigir: <o quê>` com a causa raiz. Nunca reescrever o checkpoint falho; o histórico fica.
- O card do agente (filho) recebe no fim um **resumo** de 5 linhas: checkpoints, principais escolhas, desvios, evidências, commit.
- Vale para **todos** os papéis: orquestrador, implementador, revisor, corretor, investigador. Revisor: um checkpoint por eixo (conformidade com a spec, qualidade), com os achados e a severidade em `Evidência`.

## Evidência de pronto (obrigatória antes de marcar como pronto)

Nenhum agente move um card (nem checkpoint final) para `concluído`, `code review`, `qa testing` ou `aguardando aceite` sem antes **anexar um arquivo de evidência** com dados **válidos e verdadeiros** que justifiquem por que considera a tarefa pronta.

**Regras de veracidade (valem para todos):**
1. **Gerada, nunca escrita de memória.** O conteúdo vem da **execução real** (saída bruta de comando, relatório de ferramenta, captura). Não parafrasear, não resumir números, não "limpar" falhas.
2. **Reproduzível:** o arquivo traz o **comando exato**, o **diretório**, o **commit** (`git rev-parse HEAD`), a **data/hora** e o **código de saída**. Outra pessoa consegue repetir.
3. **Completa, inclusive o negativo:** falhas, avisos e itens **não verificados** aparecem. Se algo não foi testado, o arquivo diz "NÃO VERIFICADO: <o quê e por quê>". Omitir é falsificar.
4. **Rastreável ao critério de pronto:** cada critério da descrição do card aparece com `✅ atendido (prova: <trecho/linha>)`, `⚠️ parcial` ou `❌ não atendido`. Só o card com todos `✅` (ou ressalvas aprovadas pelo Allan) vai para `concluído`.
5. **Sem segredos:** nunca incluir tokens, senhas, `.env`, conteúdo de `secrets/`. Mascarar antes de salvar.
6. Se a evidência **não pôde ser produzida**, o card **não** avança: vai para `bloqueado` ou `aguardando decisão` com o motivo.

**Formato do arquivo, por papel (o que for mais lógico para o nicho):**

| Papel | Arquivo | Conteúdo mínimo |
|---|---|---|
| Implementador (código) | `evidence-<card>.md` + `test-output.txt` (saída bruta) | comando(s), saída bruta dos testes (contagem passou/falhou), `git log -1` e `git diff --stat`, checklist dos critérios de pronto |
| Implementador (infra) | `evidence-<card>.md` + `compose-ps.txt` | `docker compose ps` (saúde), saída do script de verificação, logs relevantes |
| Implementador (banco) | `evidence-<card>.md` + `migration-check.txt` | migração aplicada, tabelas/colunas conferidas (`\dt`, `select`), seed rodado duas vezes |
| Revisor | `review-<card>.md` | escopo revisado (commits), achados com severidade (Critical/Important/Minor), arquivo:linha, veredito |
| QA | `qa-report-<card>.md` + `qa-output.txt` | casos executados, resultado de cada um, defeitos abertos (link dos cards), o que ficou fora |
| Segurança | `security-<card>.md` | checagens feitas, achados com severidade, o que não foi coberto |
| Corretor | `fix-<card>.md` + saída do teste | teste que **falhava** (saída antes) e **passa** (saída depois) |
| Investigador | `findings-<card>.md` | evidências citadas (arquivo:linha, log, transcrito), causa raiz, grau de confiança |
| Orquestrador | `verification-<card>.md` | conferência independente dos arquivos acima (ver "Verificação") |

Modelo de cabeçalho de todo `evidence-*.md`:

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

**Onde ficam:**
- **No ClickUp:** anexado ao card do agente (`clickup_attach_task_file`) **e** referenciado no comentário final com o caminho.
- **No repositório:** `docs/sprints/evidence/sprint-XX/<card>/…` (sem segredos), versionado no mesmo commit ou no seguinte, para virar histórico auditável.

**Verificação (o orquestrador não confia às cegas):** antes de mover o card, o orquestrador **reexecuta ao menos um comando** citado na evidência (por exemplo a suíte de testes) e confere o commit. Divergência = o card volta para `em progresso`, com comentário citando a diferença. O resultado fica em `verification-<card>.md`.

## Protocolo em tempo real

Quem faz cada ação de ClickUp:

1. **Orquestrador (sessão principal), ANTES de despachar um subagente:**
   - cria o card filho (`pendente` → `em progresso`), com escopo, arquivos permitidos e critério de pronto;
   - passa o **id do card** no prompt do subagente.
2. **Subagente, ao começar:** carrega as ferramentas com `ToolSearch` (`select:mcp__claude_ai_ClickUp__clickup_create_comment,mcp__claude_ai_ClickUp__clickup_update_task`) e comenta no seu card `Iniciando: <o que vai fazer>`.
   - A cada marco (RED confirmado, implementação pronta, testes verdes, commit) um comentário curto no card.
   - Se as ferramentas do ClickUp não estiverem disponíveis para ele, **avisa no relatório final** e o orquestrador registra os marcos.
3. **Subagente, ao terminar:** gera e **anexa o arquivo de evidência** (ver "Evidência de pronto"), comenta o resultado final (resultado, commit, caminho da evidência) e devolve ao orquestrador.
4. **Orquestrador, depois do retorno:** confere a evidência, move o card ao próximo status do fluxo (`code review`, `qa testing`, `aguardando aceite`, `concluído`) e só então despacha o próximo agente.
5. **Antes de despachar um revisor:** o orquestrador cria o card do revisor; o do implementador já foi movido antes.
6. Mudar de status **antes** de mudar a ação (ex.: mover para `em progresso` antes de rodar). Nunca mover retroativamente. Só cards de histórico (Tasks 0–2 desta sprint) foram criados retroativamente, e dizem isso na descrição.

## Alertas e decisões (Allan responde pelo ClickUp)

Quando qualquer agente precisar de uma decisão do Allan:

1. **Não perguntar só no terminal.** Registrar no ClickUp:
   - card atribuído ao Allan (`assignees: ["81487793"]`) e movido para `aguardando decisão` (ou título `❓ DECISÃO:`); o status anterior vai no comentário para saber para onde voltar;
   - comentário com **@menção** para gerar notificação: `[@Allan](#user_mention#81487793)`, com `notify_all: true`;
   - comentário no formato:

     ```
     ❓ DECISÃO NECESSÁRIA
     Contexto: <2 linhas>
     Opções:
       A) <opção> — prós/contras
       B) <opção> — prós/contras
     Recomendação: <A ou B e por quê>
     O que acontece se não responder: <o trabalho fica parado em X>
     Responda neste comentário com A, B ou outra instrução.
     ```
   - lembrete opcional (`clickup_create_reminder`) para decisões urgentes.
2. Um subagente que precisa de decisão **para de trabalhar**, escreve o card e retorna ao orquestrador com `NEEDS_DECISION` + id do card. O orquestrador confirma que o alerta foi publicado.
3. **O orquestrador lê as respostas do Allan** com `clickup_get_task_comments` antes de retomar (sempre no começo de cada turno de trabalho e antes de despachar o próximo agente). Ao aplicar, comenta `Decisão aplicada: <resumo>`, remove o prefixo/coluna de decisão e volta o card a `em progresso`.
4. **Limitação:** o orquestrador só consegue ler o ClickUp enquanto a sessão está ativa. Se o Allan responder com a sessão parada, a resposta é lida na próxima interação. Para decisões urgentes, o Allan também pode mandar um "continue" na sessão.

## Falhas e travamentos

- Agente sem atividade por mais de ~10 min: o orquestrador comenta `⚠️ Sem atividade desde HH:MM`, investiga o transcrito (`~/.claude/projects/<projeto>/<sessão>/subagents/*.jsonl` + `.meta.json`) e registra a causa no card.
- Pedido de permissão pendente: mover para `bloqueado` (ou `⛔`) e alertar o Allan como decisão.
- Subagente **não** amplia permissões nem edita fora do escopo do card. Precisa de algo fora dele? Vira decisão.

## Escopo de arquivos (para não atrapalhar outros agentes)

- Cada card filho lista os **únicos caminhos** que o agente pode alterar. Fora disso: proibido.
- `.claude/worktrees/rbac-auth/.claude/settings.local.json` aplica isso como permissões (allow/deny). Não edite esse arquivo.
- Tarefas em paralelo só rodam se os escopos de arquivo forem **disjuntos**. Caso contrário, em sequência.
- Migrações, `pnpm-lock.yaml`, `docker-compose.yml` e `package.json` da raiz têm **um dono por vez** (o card que os edita diz isso).

## Checklist de cada agente

- [ ] Meu card existe, com meu papel e escopo?
- [ ] Ele está `em progresso` **antes** de eu começar?
- [ ] Comentei os marcos (início, RED, verde, commit)?
- [ ] Anexei o arquivo de evidência (gerado por execução real, com comando, commit e ressalvas) **antes** de marcar como pronto?
- [ ] Se preciso de decisão, publiquei o alerta com @Allan e parei?
- [ ] Meu comentário final tem resultado + evidência?
