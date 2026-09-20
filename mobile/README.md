# aura-fit — mobile UI kit

React Native + Expo (Expo Router, TypeScript) with NativeWind, implementing
the design system from the aura-fit UI kit artifact as a real, running app:
one codebase for iOS, Android and web.

## Stack

- Expo SDK 57 / React Native 0.86 / React 19, TypeScript, Expo Router
  (file-based routing, `app/`)
- NativeWind 4 (Tailwind classes on native + web) — tokens in
  `tailwind.config.js`
- `react-native-svg` for the icon set and charts, `react-native-reanimated`
  for the switch/skeleton animations
- Inter (400/500/600/700) via `@expo-google-fonts/inter`

## Getting started

```sh
npm install
npm run start       # then press i / a / w, or scan the QR code with Expo Go
npm run web         # web dev server directly
npm run typecheck
npm run lint        # npm run lint:fix to auto-fix
npm run format      # npm run format:check in CI
```

## Structure

```
app/                     Expo Router routes (file-based)
  (auth)/                 login, signup, forgot-password, check-email, select-role
  (app)/(tabs)/            Início, Treinos, Progresso, Chat — bottom tab app
  (app)/workout/[id]       workout detail
  (app)/exercise/[id]      set-by-set exercise execution
  +not-found, maintenance, access-denied, session-expired

src/
  theme/tokens.ts          colors, spacing, radius, shadows, avatar tones —
                            JS-side mirror of tailwind.config.js for spots
                            NativeWind classNames can't reach
  components/icons/        Icon.tsx + paths.ts — the kit's 34-icon set,
                            ported 1:1 from its SVG symbol defs
  components/brand/        Logo (live text, not an image), LogoMark (app-icon
                            tile), AuthBackground (dark gradient hero)
  components/ui/           Button, Input, Checkbox/Radio/Switch, Chip,
                            StatusBadge, Avatar, Card (+ KPICard, ExerciseRow,
                            PlanCard), Segmented, Tabs, ProgressBar/Ring,
                            LineChart, Stepper, Alert, Toast, ConfirmModal,
                            EmptyState, Skeleton
  components/navigation/   AppHeader, TopBar, Sidebar (web/tablet dashboard
                            shell), Breadcrumb, Pagination
  lib/mockData.ts          placeholder content for the screens above — swap
                            for real API data
  lib/cn.ts                clsx + tailwind-merge className helper
  lib/validation.ts        zod schemas + a getFieldErrors() helper shared by
                            every form
  lib/secureStorage.ts     token storage (SecureStore on native, in-memory
                            on web — see "Security" below)
  lib/openExternalUrl.ts   scheme-checked wrapper around Linking.openURL

assets/brand/             SVG sources for the wordmark, the app-icon mark,
                           and the 1024×1024 masters app.json's icon/splash/
                           android-icon-* files were rendered from — see
                           assets/brand/README.md to regenerate them
```

## What's implemented vs. scaffolded

Fully built against the UI kit artifact's exact spec (colors, spacing,
typography, component states): the design tokens, the full component
library, the icon set, the brand assets, the student-facing app screens
(splash/login, treinos, treino detail, execução de série, chat), the auth
flow (login/signup/forgot-password with real client-side validation), and a
first pass at the trainer-facing dashboard (home, gestão de alunos,
financeiro, perfil, biblioteca de exercícios, permissões) built on a shared
`DataTable` and a responsive `(dashboard)` shell.

Screens that go past "UI kit + representative flow" — the AI exercise
generator, full RBAC editing, payment provider integration — are left as
`EmptyState` placeholders inside otherwise-real navigation: the shell and
list/detail patterns are there for whoever builds that logic next.

## Security

This is a client app that will eventually talk to the NestJS/Cognito
backend described in the repo's root `CLAUDE.md` — the same document's
"never log tokens" rule and least-privilege stance apply here too. Concretely:

- **CSP.** `app/+html.tsx` sets a restrictive Content-Security-Policy meta
  tag on the web build (`script-src 'self'`, no `unsafe-eval`); `vercel.json`
  and `public/_headers` carry the stronger header-based version (adds
  `frame-ancestors 'none'`, HSTS, `X-Frame-Options`) for hosts that read
  them. `style-src` allows `'unsafe-inline'` deliberately — that's how
  React Native Web applies styles — everything else stays locked down.
- **No `dangerouslySetInnerHTML` / raw HTML.** `eslint.config.js` enforces
  `react/no-danger` and `react/jsx-no-target-blank`, and blocks
  `eval`/`new Function`/`javascript:` URLs at lint time.
- **Token storage.** `lib/secureStorage.ts` never touches
  `localStorage`/`sessionStorage` for secrets — Keychain/Keystore via
  `expo-secure-store` on native, in-memory (cleared on reload) on web. Real
  persistent web sessions should come from an httpOnly cookie the backend
  sets, not client-side storage.
- **External links.** `lib/openExternalUrl.ts` allowlists `https:`/
  `mailto:`/`tel:` before calling `Linking.openURL`, so a URL sourced from
  anything other than a string literal (chat content, API data) can't smuggle
  a `javascript:`/`data:` payload through.
- **Input validation.** Every form (`app/(auth)/*`) validates with `zod`
  before submit and surfaces errors per field — a UX/robustness layer, not a
  trust boundary; the API must re-validate everything regardless.
- **Lint + format are wired up** (`npm run lint`, `npm run format:check`) so
  these stay enforced as the codebase grows, not just true on day one.
