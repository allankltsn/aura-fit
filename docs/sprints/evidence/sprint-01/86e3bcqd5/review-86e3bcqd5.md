# Revisão Task 3 (commit 38e6cc5, base b8c4980)

## Escopo revisado
`git diff b8c4980..38e6cc5`: 5 arquivos, todos em `apps/identity-service/src/identity-provider/` (errors.ts, identity-provider.port.ts, in-memory.provider.ts, in-memory.provider.test.ts, provider.contract.ts). Comparado com task-3-brief.md, ruling R4 (progress.md) e spec. Revisão estática; os testes não foram executados (somente leitura).

## Etapa 1 - Conformidade: APROVADO
- Porta, tipos (TokenSet, ProviderUser, SocialProvider=string), IDENTITY_PROVIDER, assinaturas: idênticos ao brief.
- Erros: os 3 do brief + `EmailNotVerifiedError` (R4). Autorizado.
- InMemory: `markEmailVerified`, `sentVerification`, `sentReset` presentes; `authenticate` verifica credencial antes de `emailVerified` (não vaza existência da conta), conforme R4.
- Contrato: 8 casos (login verificado; não verificado -> EmailNotVerifiedError; senha errada/e-mail inexistente; duplicado; rotação/reuso; revokeSession; reset; deleteUser). Casos que fazem login usam `emailVerified: true` e afirmam `emailVerified === true` (R4).
- Escopo restrito ao diretório; sem arquivos extras. Trailer Co-Authored-By presente.
- Nota: o brief ainda diz "7 testes" e o código-base do Step 1/3 anterior ao R4; o commit segue o R4 corretamente (brief desatualizado, não o commit).

## Etapa 2 - Qualidade: APROVADO COM RESSALVAS MINOR (sem Critical/Important)
Corretude verificada:
- Rotação: `issue()` reaproveita a família por sessionId e troca `current`; tokens antigos ficam no `refreshIndex` apontando para a família.
- Reuso: token antigo -> `alive=false` + erro; token atual subsequente também falha (família revogada). Correto.
- revokeSession: invalida a família (mesmo com token antigo). deleteUser: remove conta e índice de e-mail; refresh posterior falha via `accounts.get`. Correto.
- E-mail case-insensitive: lowercase em createUser/authenticate/sendPasswordReset. Correto.
- Suíte reutilizável: importa apenas porta e errors, não depende do InMemory; e-mail único por caso; `make()` por caso.

### Critical
Nenhum.
### Important
Nenhum.
### Minor
1. provider.contract.ts:10 - `uniq()` usa `Date.now()+Math.random()*1e6`; risco (baixo) de colisão em realm compartilhado do Keycloak. `randomUUID()` elimina o risco. Sem impacto no InMemory.
2. provider.contract.ts:12-81 - casos não limpam os usuários criados (`deleteUser` no fim). No Keycloak da Task 4 acumulam usuários no realm de teste; considerar cleanup no adapter/teste da Task 4 (ou try/finally).
3. provider.contract.ts (geral) - nenhum caso cobre e-mail case-insensitive (ex.: criar com maiúsculas, autenticar com minúsculas), embora InMemory implemente e o Keycloak também normalize. Lacuna de cobertura do contrato, não bug.
4. in-memory.provider.ts:29 e :44 - comparação de senha por `!==` (não constant-time). Aceitável em test double; só registrar para não ser copiado para código real.
5. in-memory.provider.ts:15-16,62-63 - `refreshIndex`/`families` nunca são podados (crescimento em processo longo); irrelevante para testes. `Family.sessionId` é redundante com a chave do mapa.
6. in-memory.provider.ts:37 - `markEmailVerified` sem tipo de retorno explícito (`void`); e :69 `exchangeAuthorizationCode()` sempre lança InvalidCredentialsError (stub) - válido, mas vale um comentário indicando que é stub até a Task 10.
7. errors.ts:1-4 - classes em uma linha e sem `this.name`; `instanceof` funciona (target ES2022), mas o nome no stack fica "Error". Legibilidade/diagnóstico apenas.

## Veredito
Etapa 1: APROVADA. Etapa 2: APROVADA (somente Minor). Pode seguir para Task 4.
