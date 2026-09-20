# Revisao Task 4 (86e3bdg21) - KeycloakProvider + realm + Mailpit

Commit revisado: 738c73a (base 38e6cc5) + edicoes nao commitadas em `docker-compose.yml` e `infra/keycloak/realm-aura.json`.

## Escopo
- O commit toca somente `keycloak.provider.ts` e `keycloak.provider.test.ts` (173 linhas adicionadas).
- Somente `keycloak.provider*.ts` e o `identity-provider.port.ts` (apenas o tipo) mencionam Keycloak em `apps/identity-service/src`. Nenhum outro arquivo importa o provider.
- Trailer `Co-Authored-By` presente.
- `docker-compose.yml` e `realm-aura.json` ainda NAO estao commitados (o orquestrador precisa incluir no commit). O git status tambem mostra `docs/sprints/clickup-workflow.md` modificado e `docs/sprints/evidence/` nao rastreado, fora do escopo desta task.

## Etapa 1 - Conformidade: APROVADA
- `realm-aura.json` e o trecho do compose sao identicos ao brief (mailpit v1.21 em 127.0.0.1:8025, `keycloak.depends_on.mailpit`).
- Provider e teste seguem o brief mais o R4, com estes desvios legitimos:
  - `authenticate` mapeia `invalid_grant` com "not fully set up" para `EmailNotVerifiedError`.
  - Se o token vier com `email_verified=false`, tambem lanca `EmailNotVerifiedError`.
  - O teste passa de 7 para 8 casos.
- A mensagem do commit difere da sugerida no brief, o que e aceitavel porque o commit contem so o provider.
- R4 tem evidencia real. O probe mostra:
  - conta nao verificada com senha certa: 400 "Account is not fully set up";
  - conta nao verificada com senha errada: 401 "Invalid user credentials";
  - usuario inexistente: 401 "Invalid user credentials".
- R5 (nao implementado): a justificativa PROCEDE.
  - O contrato inclui o caso "rotates refresh tokens and revokes the family on reuse" (`provider.contract.ts:48-56`).
  - Ele exige que, apos reusar o refresh antigo, o refresh novo tambem seja rejeitado.
  - O teste passou 8/8 contra o Keycloak real ("green1", EXIT=0).
  - O resultado depende de `revokeRefreshToken:true` e `refreshTokenMaxReuse:0` no realm, que estao no JSON.
  - Registrar essa dependencia como premissa: se alguem mudar essas chaves, a garantia some.
  - A saida verbose so lista 2 dos 8 nomes de teste. A conclusao de que o caso de reuso passou vem de "8 passed (8)".

## Etapa 2 - Qualidade/seguranca: APROVADA com ressalvas

### Critical
Nenhum.

### Important
1. `keycloak.provider.ts:31-46,59` - Politica de senha `length(10)` faz o createUser retornar 400. O provider lanca `Error('keycloak_create_user_failed:400')`, que chega ao cliente como 500. Nao existe erro de dominio para senha fraca no port. Conferir se o Zod do Task 6/7 impoe min 10 antes do provider. Se sim, e so defesa em profundidade e cai para Minor.
2. Todas as chamadas `fetch` (`:24,32,73,91,...`) nao tem timeout (`AbortSignal.timeout`). Um Keycloak lento pendura login e refresh indefinidamente. Falha de rede vira `TypeError` e chega como 500 (aceitavel, sem vazamento).

### Minor
- `:52` - `res.headers.get('location')!.split('/').pop()!` lanca `TypeError` se o header faltar. Preferir validar e lancar erro explicito.
- `:38` - `name.split(' ')` com espacos duplos gera lastName com espaco inicial. Nome vazio gera firstName vazio. Usar `split(/\s+/)`.
- `:56,101-103,106-108` - `deleteUser` e `sendVerificationEmail` ignoram `res.ok`. `sendPasswordReset` ignora o resultado do `execute-actions-email` (falha de SMTP e silenciosa). Isso e desejavel para o reset (resposta generica, sem enumeracao), mas a falha do reset deveria ser logada sem PII. O compensating `deleteUser` que falha em silencio deixa conta orfa. Logar.
- `:104-106` - `sendPasswordReset`: se o admin devolver erro (nao-array), `users[0]` e `undefined` e o codigo retorna sem sinal. Se `res.json()` lancar (corpo nao-JSON), o erro so ocorre quando o Keycloak falha, nao por existencia do usuario. Ha diferenca de tempo entre usuario existente (chamada extra) e inexistente. O Task 6 ja preve rate limit, mas registrar o risco.
- `:63-70` - A deteccao de `EmailNotVerifiedError` depende do texto "not fully set up" (Keycloak 26.0 e locale). O fallback por `email_verified=false` nao cobre esse caso, porque nesse caso o Keycloak nao emite token. Fixar a versao da imagem (ja fixada em 26.0) e manter o teste 'unverified' no contrato como guarda de regressao.
- `:64-66` - Nao ha vazamento de existencia: usuario inexistente e senha errada produzem ambos `InvalidCredentialsError`. O estado "nao verificado" so aparece com senha correta, que e o comportamento decidido no R4.
- `:80-88` - `revokeSession` nao lanca em status HTTP de erro (conforme o brief), mas lanca em falha de rede. Logout silencioso com sessao ainda viva e possivel. Decidir se o caller trata (try/catch no Task 7).
- `:90-99` - `exchangeAuthorizationCode` converte qualquer falha (inclusive 5xx e erro de rede nao, apenas `!res.ok`) em `InvalidCredentialsError`, mascarando indisponibilidade como credencial invalida.
- `:24-31` - `adminToken` faz uma ida ao Keycloak em cada chamada admin, sem cache. Custo extra de latencia. Nao bloqueante.
- `:122-125` - `toTokenSet` faz `JSON.parse` sem validar claims (sub/sid/email ausentes viram `undefined`). O comentario esta presente e correto: back-channel direto do Keycloak, sem verificar a assinatura, e a verificacao e do BFF. Aceitavel.
- `:56` - `externalId` interpolado no path sem `encodeURIComponent`. E valor interno, risco baixo.
- Segredos: erros carregam so o status HTTP e nao incluem tokens, senha nem corpo de resposta. Nenhum log no arquivo. Sem achados.

### Realm e compose
- Bom: `registrationAllowed:false`, `bruteForceProtected:true` com `failureFactor:5` (demais parametros de espera nos defaults do Keycloak), `revokeRefreshToken:true`, `accessTokenLifespan:600`, `passwordPolicy` com `notUsername` (username=email), `duplicateEmailsAllowed:false`, `aura-web` publico com PKCE S256 e sem direct grant, Mailpit so em 127.0.0.1.
- Minor: `sslRequired:"external"` e adequado para dev. Em producao usar `"all"` via realm de producao.
- Minor: `redirectUris` (`http://localhost:5173/*`, `aurafit://*`) sao curingas de dev. Em producao restringir ao path exato.
- Minor: `smtpServer` aponta para `mailpit:1025` sem TLS nem auth. Vale para dev; producao precisa de override.
- Minor: o segredo `dev-client-secret-change-me` esta versionado no realm e em `.env.example`, com nome que o marca como dev. Aceitavel. `assertProductionSafe` (Task 9) deve barrar esse valor.
- A politica de senha nao exige complexidade, apenas comprimento e `notUsername` (conforme o brief).
- Nota do grant `password`: o risco e aceito pelo brief e mitigado por `bruteForceProtected` no realm mais rate limit no Task 6. `directAccessGrantsEnabled` esta somente no `aura-identity` (cliente confidencial). Migrar para Authorization Code + PKCE em entrega futura.
- A service account tem `manage-users` e `view-users`, minimo suficiente para as chamadas admin usadas.

## Veredito
- Etapa 1 (conformidade): APROVADA. R5 corretamente omitido.
- Etapa 2 (qualidade/seguranca): APROVADA com ressalvas. Nenhum Critical, 2 Important (mapeamento 400 de senha fraca, ausencia de timeout) e varios Minor. Nenhum bloqueia a task.
- Pendencia de processo: commitar `docker-compose.yml` e `infra/keycloak/realm-aura.json` junto da task.
