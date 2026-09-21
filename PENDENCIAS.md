# Pendências da Sprint 1 — o que falta, por que importa e o que recomendo

Atualizado em 2026-09-21 · branch `feat/rbac-auth` · HEAD no momento da escrita: `a309e11`

## Resumo em 30 segundos

A **entrega técnica da Sprint 1 está pronta** (Tasks 0 a 4): a mesma suíte de 8 testes de contrato passa no provedor em memória e no Keycloak 26.0 real, o realm e o Mailpit sobem saudáveis, houve revisão em duas etapas e um QA. O que resta **não é código pendente**: são 3 decisões suas, 1 aceite e alguns itens menores.

| # | Pendência | Quem resolve | Urgência | Bloqueia a Sprint 2? |
|---|---|---|---|---|
| 1 | Aceite das Tasks 3 e 4 | Você | Alta | Sim (Sprint Review) |
| 2 | Decisão D3: logout e JWT já emitido | Você | Média | Não, mas define o BFF |
| 3 | Órfãs no quadro (4 cards) | Você | Baixa | Não |
| 4 | Ajustes do ClickUp (campo "Agente", títulos) | Você / orquestrador | Baixa | Não |
| 5 | Itens menores adiados (Tasks 0, 1, 3, 4) | Revisão final | Baixa | Não |
| 6 | O que não foi verificado | QA futuro | Média | Não |
| 7 | Adendo de verificação em arquivo | Orquestrador | Baixa | Não |

---

## 1. Aceite das Tasks 3 e 4 (Sprint Review)

**O que é.** As duas Tasks estão em `completed` no ClickUp, que significa "pronto e verificado, aguardando o aceite do Allan". Só você move para `accepted` (e depois `Closed`).

**O que você está aceitando (com prova):**

| Task | Commits | Prova |
|---|---|---|
| 3 — porta, provedor em memória, contrato | `38e6cc5` | 8/8 testes, revisão sem Critical/Important |
| 4 — KeycloakProvider, realm, Mailpit | `738c73a`, `32a2bfb`, `7390c4f` | 8/8 contra o Keycloak real, QA feito |

Para conferir você mesmo, rode e espere `8 passed` nos dois:

```bash
docker compose up -d --wait keycloak mailpit
docker compose run --rm workspace pnpm --filter @aura/identity-service test keycloak
docker compose run --rm workspace pnpm --filter @aura/identity-service test in-memory
```

Evidências: `docs/sprints/evidence/sprint-01/` (evidence, review, QA, verificação). Demo sugerida: `docs/sprints/sprint-01.md`, "Roteiro de demo".

**Recomendação.** Aceitar. Se quiser ressalvas, registre-as como comentário antes de mover o status.

---

## 2. Decisão D3 — logout não derruba um JWT que já foi emitido

**O que é.** O QA mostrou que, depois do logout, o Keycloak já trata o token antigo como inativo. Mas o nosso BFF (Sprint 2) validará o JWT por assinatura e validade. Quem valida só isso continua aceitando o token por até **600 s** (o `accessTokenLifespan` do realm).

**Exemplo.** Um aluno faz logout no celular às 10:00:00. Alguém com o token copiado ainda consegue chamar uma rota protegida até 10:10:00, porque a assinatura e a validade continuam corretas.

**Opções**

| | O que muda | Prós | Contras |
|---|---|---|---|
| A | O BFF checa a sessão (introspect ou chave no Redis) em rotas sensíveis | Revogação imediata onde importa | Uma consulta extra por request sensível |
| B | Reduzir o tempo de vida do token (ex.: 120 s) | Simples | Mais refreshes; a janela diminui mas não some |
| C | Aceitar os 600 s e documentar | Nenhum custo | Risco fica aberto |

**Recomendação: A** nas rotas de papéis e admin, mantendo 600 s nas demais. Se você não responder, eu sigo com A ao planejar as Tasks 5 a 8.

---

## 3. Cards órfãos no ClickUp (4 cards)

**O que é.** Restos do primeiro implementador da Task 3 (`a2daa612`), que parou antes de executar: `86e3bcqfj` (marcado "em progresso" por engano), `86e3bcqgw`, `86e3bcqjp` e `86e3bcqm0` (Open). Nenhum representa trabalho pendente; quem entregou foi outro agente.

**Opções**

| | Ação | Prós | Contras |
|---|---|---|---|
| A | Fechar com a nota "abandonado" | Mantém o rastro no quadro | Ocupam espaço |
| B | Apagar | Quadro limpo; o histórico já está no log, no post mortem e na auditoria | Irreversível no ClickUp |

**Recomendação:** B, já que você os considera lixo. Custo: 4 chamadas ao ClickUp.

---

## 4. Ajustes de processo no ClickUp

| Item | Situação | Recomendação |
|---|---|---|
| Campo personalizado **Agente** | Não existe. A API não cria campos; é uma ação sua na UI (folder Aura Fit, tipo Dropdown ou Texto) | Criar quando puder; hoje o agente aparece no título `[papel · idcurto]` |
| Títulos `[impl3]` e `[impl4]` | Fora do padrão `[papel · idcurto]` (7 cards) | Corrigir só se incomodar: cada retitulação custa 1 chamada |
| Cota do ClickUp | 100 chamadas/dia do plano; hoje foram usadas 24 | Manter o orçamento (`docs/sprints/logs/clickup-budget.md`) |
| QA para Tasks 0 a 3 | Nunca houve QA formal; o QA da Task 4 foi o primeiro | Aceitável: as Tasks 0 a 3 têm testes e revisão. O ciclo novo já exige QA daqui em diante |

---

## 5. Itens menores adiados (nenhum bloqueia; ficam para a revisão final)

Todos estão no ledger (`.superpowers/sdd/2026-09-19-rbac-auth/progress.md`).

**Task 0 (infraestrutura)**
- `check-compose.sh` fixa `psql -U aura` e a senha do Redis em vez de ler o `.env`.
- O script não tem permissão de execução e não limpa (`down`) nem checa portas só em loopback.
- `.gitattributes` poderia ser `* text=auto eol=lf` (o Git já avisa sobre LF/CRLF).
- A senha do Redis vai na linha de comando do healthcheck; o otel-collector não tem healthcheck.

**Task 1 (`@aura/authz`)**
- Falta um teste da matriz papel → permissão (por exemplo, só o admin ter `users:manage`).
- O mapa de exportação não tem condição `default`; `ROLE_PERMISSIONS` não é congelado em tempo de execução.

**Task 3 (contrato e provedor em memória)**
- `uniq()` deveria usar `randomUUID()`; os testes não limpam os usuários criados; falta o caso de e-mail em maiúsculas.
- Detalhes do provedor de teste (comparação de senha, mapas sem poda) e `this.name` nos erros.

**Task 4 (Keycloak) — QA e revisão**

| Item | Exemplo do problema | Gravidade |
|---|---|---|
| D1: e-mails de verificação e reset ignoram falhas | Se o SMTP cair, ninguém é avisado; os dois e-mails têm o mesmo assunto "Update Your Account" | Minor |
| D2: possível diferença de tempo no reset | 86 ms para e-mail existente contra 26 ms para inexistente (1 amostra) | Minor |
| D4: `refresh` não lança `EmailNotVerifiedError` | Só ocorre se um admin marcar o e-mail como não verificado depois do login | Minor |
| D5: bloqueio por brute force parece senha errada | O usuário legítimo bloqueado não sabe que está bloqueado | Minor (UX) |
| Falha de rede/5xx no login social vira "credenciais inválidas" | Um Keycloak fora do ar seria mostrado como senha errada | Minor |
| Produção precisa de override | `sslRequired` deve ser `"all"`, `redirectUris` sem curinga, SMTP com TLS, segredo de dev trocado | Tarefa da Sprint 4 |

**Recomendação.** Tratar os itens de e-mail (D1) e o `sslRequired` de produção antes de expor o sistema; o resto pode esperar a revisão final.

---

## 6. O que ainda não foi verificado

| O quê | Por quê | Quando |
|---|---|---|
| Clicar de verdade nos links de verificação e reset | O QA confirmou a chegada do e-mail, não o clique | Sprint 2 (cadastro e login via API) |
| Duração e desbloqueio do lockout | O QA só verificou o bloqueio | Task 6 (rate limit e lockout) |
| Falha de SMTP | Só por leitura de código | Junto com D1 |
| Login social (Google) | Depende de configuração externa | Task 19, Sprint 4 |
| `pnpm turbo build` e lint completos | Só testes e `tsc` do identity-service | Antes de fechar a Sprint 4 (CI) |

---

## 7. Adendo de verificação em arquivo

**O que é.** O arquivo `verification-tasks-3-4.md` foi escrito no commit `738c73a`, antes da correção de timeout (`32a2bfb`) e do realm (`7390c4f`). Eu reexecutei os testes depois (8/8 nas duas suítes, `tsc` com saída 0), mas isso ficou no log, sem um arquivo próprio. A auditoria apontou isso como lacuna de rastreabilidade.

**Recomendação.** Adicionar um adendo com o commit atual. Custo: zero chamadas ao ClickUp.

---

## Depois disso: a Sprint 2

A Sprint 2 cobre as Tasks 5 a 10 (BFF, contexto de autenticação, cadastro e login via API). Não foi iniciada e só começa com a sua liberação, depois do aceite (pendência 1). A decisão D3 (pendência 2) entra no planejamento das Tasks 5 a 8.
