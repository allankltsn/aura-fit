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
npm run start   # then press i / a / w, or scan the QR code with Expo Go
npm run web     # web dev server directly
npm run typecheck
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

assets/brand/             SVG sources for the wordmark, the app-icon mark,
                           and the 1024×1024 masters app.json's icon/splash/
                           android-icon-* files were rendered from — see
                           assets/brand/README.md to regenerate them
```

## What's implemented vs. scaffolded

Fully built against the UI kit artifact's exact spec (colors, spacing,
typography, component states): the design tokens, the full component
library, the icon set, the brand assets, and the student-facing app screens
(splash/login, treinos, treino detail, execução de série, chat).

The trainer-facing web dashboard (gestão de alunos, financeiro, prescrição
por IA, RBAC) shown in the team's brainstorm mockups is **not** built out
here — `Sidebar`/`TopBar`/`Pagination`/table-ready `StatusBadge` are ready
for it, but the actual CRUD screens are a separate, larger effort for
whoever owns that part of the build.
