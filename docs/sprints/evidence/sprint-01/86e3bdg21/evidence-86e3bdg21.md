# Evidência — 86e3bdg21 — Task 4 KeycloakProvider (CP1–CP3)
Agente: implementador · impl4   Data/hora: 2026-09-20 (execução ~04:28–04:35 UTC)   Commit base (HEAD antes do commit): 38e6cc5cc16decbdaee108fc65daec5457b6dd9c
Diretório: E:\allan\aura-fit\.claude\worktrees\rbac-auth
Comandos (todos via docker compose, dir acima):
1. RED:   `docker compose run --rm workspace pnpm --filter @aura/identity-service test keycloak` -> exit 1 (módulo ./keycloak.provider ausente)
2. GREEN: mesmo comando, após criar keycloak.provider.ts -> exit 0, 8 passed (8)
3. In-memory: `... test in-memory` -> exit 0, 8 passed (8)
4. Tipagem: `docker compose run --rm workspace pnpm --filter @aura/identity-service exec tsc --noEmit -p tsconfig.json` -> exit 0, sem saída
5. Sonda (arquivo temporário apagado): respostas cruas do Keycloak para login não verificado / senha errada / usuário inexistente.

## Critérios de pronto
- [x] Teste de integração criado e RED real — prova: "Failed to load url ./keycloak.provider" (test-output.txt, seção red)
- [x] 8/8 contra Keycloak real — prova: "Tests 8 passed (8)" (seção green1)
- [x] 8/8 in-memory — prova: seção inmem
- [x] R4 verificado empiricamente — prova: sonda: senha certa + e-mail não verificado = 400 invalid_grant "Account is not fully set up"; senha errada e usuário inexistente = 401 "Invalid user credentials" (indistinguíveis)
- [x] R5 verificado empiricamente — o teste de reuso passou SEM a chamada admin: o Keycloak (revokeRefreshToken=true, refreshTokenMaxReuse=0) invalida a família sozinho; por isso o DELETE /sessions/{sid} NÃO foi implementado (condição do R5 não se cumpriu)
- [x] revokeSession via endpoint /logout invalida o refresh token — prova: caso "revokeSession invalidates the refresh token" verde
- [x] Nenhum outro arquivo importa Keycloak — só keycloak.provider.ts e seu teste
- [x] tsc --noEmit — exit 0

## Desvios do brief
- authenticate: ramo R4 (EmailNotVerifiedError em "Account is not fully set up") e checagem `emailVerified=false` no token; erro 400/401 restante -> InvalidCredentialsError (brief não distinguia).
- R5 não implementado (desnecessário, ver acima).

## NÃO VERIFICADO
- Fluxos sendVerificationEmail/sendPasswordReset (e-mail chegando no Mailpit) e social login/exchangeAuthorizationCode: fora do contrato, não testados.
- Ramo `email_verified=false` no access token: código presente, não exercitado (KC rejeita antes com o 400).
- Não foi verificado o efeito de bruteForce (lockout) sobre o contrato.

## Ressalvas
- Usuários de teste ficam no realm (testes não limpam além do deleteUser). Segredo do client não aparece na saída (filtrado).
