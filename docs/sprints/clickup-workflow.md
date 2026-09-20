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

- Só existem estes tipos na conta: `milestone`, `meeting_note`, `form_response`, `workflow` etc. **Não existem** Feature/Bug. Não tente criar outros.
- **Título do filho:** `[papel · idcurto] verbo + objeto`. Papéis: `orquestrador`, `implementador`, `revisor`, `corretor`, `investigador`. `idcurto` = 8 primeiros caracteres do id do subagente; o orquestrador não usa id.
- **Todo agente que atua no projeto tem seu próprio card filho.** Nada de trabalho sem card.
- Relatório de um card: descrição com **Agente**, **Escopo**, **Arquivos que pode tocar**, **Critério de pronto**. Ao concluir, um comentário com resultado, commit e evidência (saída dos testes).

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

**Enquanto não existir:** o papel e o id do agente já vão no título (`[papel · idcurto]`) e na linha `**Agente:**` da descrição. Isso é a fonte da verdade e será migrado para o campo depois.

## Protocolo em tempo real

Quem faz cada ação de ClickUp:

1. **Orquestrador (sessão principal), ANTES de despachar um subagente:**
   - cria o card filho (`pendente` → `em progresso`), com escopo, arquivos permitidos e critério de pronto;
   - passa o **id do card** no prompt do subagente.
2. **Subagente, ao começar:** carrega as ferramentas com `ToolSearch` (`select:mcp__claude_ai_ClickUp__clickup_create_comment,mcp__claude_ai_ClickUp__clickup_update_task`) e comenta no seu card `Iniciando: <o que vai fazer>`.
   - A cada marco (RED confirmado, implementação pronta, testes verdes, commit) um comentário curto no card.
   - Se as ferramentas do ClickUp não estiverem disponíveis para ele, **avisa no relatório final** e o orquestrador registra os marcos.
3. **Subagente, ao terminar:** comentário final (resultado, commit, saída dos testes) e devolve ao orquestrador.
4. **Orquestrador, depois do retorno:** confere a evidência, move o card ao próximo status do fluxo (`code review`, `qa testing`, `aguardando aceite`, `concluído`) e só então despacha o próximo passo.
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
- [ ] Se preciso de decisão, publiquei o alerta com @Allan e parei?
- [ ] Meu comentário final tem resultado + evidência?
