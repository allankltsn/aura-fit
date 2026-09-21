# QA report - Task 86e3bdg21 (KeycloakProvider)

- Agente: QA (tester)
- Data/hora: 2026-09-21 (probe ~13:12, suites ~13:14, relatorio 15:04, -03:00)
- `git rev-parse HEAD`: 85ba4a08b333066635e0c7750b319d58ef513bc0 (branch feat/rbac-auth)
- Ambiente: Keycloak 26.0 + Mailpit v1.21 UP (`docker compose ps`: healthy), realm `aura`
- Evidencia bruta: `qa-output.txt` (probe + suites), `qa-probe-output.txt`, `qa-tests-output.txt`; script: `qa-probe.ts`
- Nenhum codigo de producao/compose/realm alterado; sem commit. Usuarios `qa-<ts>-*@example.com` criados pelo probe: 5, todos apagados (GET pos-delete = 404 x5).

## Comandos (exit code)
1. `docker compose run --rm workspace sh -c "cd apps/identity-service && npx tsx ../../docs/sprints/evidence/sprint-01/86e3bdg21/qa-probe.ts"` -> exit 0
2. `docker compose run --rm workspace pnpm --filter @aura/identity-service test keycloak` -> exit 0
3. `docker compose run --rm workspace pnpm --filter @aura/identity-service test in-memory` -> exit 0

## Resultado por item

| # | Item | Veredito |
|---|------|----------|
| 1 | sendVerificationEmail | OK |
| 2 | sendPasswordReset | OK com ressalva (timing) |
| 3 | Brute force | Atencao (UX) |
| 4 | revokeSession | Atencao (expectativa refutada em parte) |
| 5 | Ramo email_verified=false | Atencao |
| 6 | Suites | OK |

**1. sendVerificationEmail - ✅.** Usuario nao verificado criado; apos a chamada, Mailpit tinha 1 e-mail com To = o e-mail do usuario, Subject "Update Your Account", link `http://keycloak:8080/realms/aura/login-actions/action-token?[MASKED]`.

**2. sendPasswordReset - ✅ (com ressalva ⚠️).** Existente: novo e-mail chegou (2 no total, ambos "Update Your Account"). Inexistente: resolve sem erro, 0 e-mails (delta da caixa = 0). E-mail malformado `a+b@x.com%&`: resolve sem erro. Ressalva: 1 amostra de tempo, existente 86 ms vs inexistente 26 ms (envio SMTP sincrono) - possivel oracle de timing (ver D2).

**3. Brute force - ⚠️.** 6 erradas no provider (#2..#7, mais a #1 crua) -> sempre `InvalidCredentialsError`. Com a senha CORRETA depois de 7 falhas: continua `InvalidCredentialsError` (conta bloqueada), resposta crua do Keycloak identica (`401 invalid_grant "Invalid user credentials"`) a senha errada e a usuario inexistente. Portanto: nao ha enumeracao (bom), mas o usuario legitimo bloqueado nao e distinguivel de senha errada (sem mensagem de "tente mais tarde"); UX ruim, sem risco de seguranca. Realm nao alterado.

**4. revokeSession - ⚠️.** Esperado: access token antigo valido ate expirar. Observado: apos `revokeSession`, `userinfo` com o access token antigo = 401 e `introspect` active=false (Keycloak checa a sessao nesses endpoints); `refresh` -> `InvalidRefreshTokenError`; `revokeSession('garbage')` resolve sem erro. Nao foi provada a validade offline do JWT, mas por ser JWT (expiresIn 600 s) um BFF que valida so assinatura/exp aceitara o token por ate 10 min (ver D3). Nao verificado: essa validacao offline (nao existe BFF ainda).

**5. email_verified=false - ⚠️.** Via `authenticate`, o ramo do token e inalcancavel nos caminhos testados: Keycloak barra antes com `400 invalid_grant "Account is not fully set up"`, tratado pelo primeiro ramo (`EmailNotVerifiedError`, ok). Ramo por claim e defesa em profundidade (nao exercitado). Porem caminho alcancavel: usuario verificado loga, admin marca emailVerified=false, `refresh` retorna 200 com `emailVerified=false` e o provider NAO lanca (so `authenticate` checa) - ver D4. Um novo `authenticate` depois disso lanca `EmailNotVerifiedError` corretamente.

**6. Suites - ✅.** `test keycloak`: 1 arquivo, 8 testes passaram (8/8; 7 casos do contrato + o wrapper). `test in-memory`: 1 arquivo, 8/8 passaram.

## Defeitos / observacoes abertos (nao corrigidos)

- **D1 (Minor)** `sendVerificationEmail`/`sendPasswordReset` nao checam `res.ok` das chamadas admin (leitura de codigo, `keycloak.provider.ts` linhas 115-128). Falha de SMTP/Keycloak (ex.: 500) e engolida silenciosamente; para reset e desejavel resposta generica, mas a falha deveria ao menos ser logada; para verificacao, o chamador nao saberia que o e-mail nao saiu. Repro (nao executado, derivado do codigo): parar o mailpit/SMTP e chamar `sendVerificationEmail` de usuario valido; resolve sem erro. Tambem: assunto "Update Your Account" e o mesmo para verificacao e reset (template padrao do execute-actions-email) e o link aponta para `keycloak:8080` (host interno, config de dev).
- **D2 (Minor)** Timing: reset de e-mail existente ~86 ms vs inexistente ~26 ms. Repro: rodar `qa-probe.ts` (item 2, linha "timing ms"). Mitigar com envio assincrono/fila ou rate limit no BFF. Amostra unica, nao estatistica.
- **D3 (Important, decisao de design)** Logout nao invalida JWT ja emitido para quem valida offline: janela de ate `expiresIn`=600 s. Keycloak userinfo/introspect rejeitam de imediato. Para o BFF: ou introspect/checa sessao em rotas sensiveis, ou reduzir TTL; documentar.
- **D4 (Minor)** `refresh` nao valida `emailVerified` (so `authenticate` valida). Repro: criar usuario verificado, `authenticate`, admin PUT `emailVerified=false`, `refresh` -> retorna TokenSet com `emailVerified=false`. Consumidor deve checar o claim ou o provider deveria lancar `EmailNotVerifiedError`.
- **D5 (Minor, UX)** Conta bloqueada por brute force e indistinguivel de senha errada (item 3).

## O que ficou de fora
- Duracao/desbloqueio do lockout (nao alterei realm nem esperei o wait time).
- Clique real no link de verificacao/reset e conclusao do fluxo no Keycloak; tokens/links mascarados.
- Validacao offline de JWT pelo BFF (inexistente); falha de SMTP (D1 e por leitura de codigo).
- Login social (`buildSocialLoginUrl`/`exchangeAuthorizationCode`): fora do escopo pedido.
