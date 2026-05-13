# VibeKit Native — Pre-Deploy Review Prompt

> **When to use:** Run this prompt in Claude Code as the FINAL task before submitting your Expo app to the App Store or Google Play. It performs a senior-level mobile audit covering performance, native correctness, accessibility, security, and store-listing readiness.

> **How to use:** Open Claude Code in your project root, paste the prompt below, and let it generate the review report. Address every Critical issue before submitting. Address High-priority issues within the first OTA update.

---

## The Prompt — copy everything below

````
I need you to perform a comprehensive senior-level pre-submission review of my
Expo / React Native app. Analyze the code, the Expo config, the EAS config, the
Prisma schema, the API routes, and the production env setup. Identify issues in
every area below.

For each issue:
1. Quote the exact file path + line number
2. Show the offending code
3. Explain why it's a problem (in mobile / store-review / production context)
4. Provide the corrected code
5. Rate severity: 🔴 Critical (blocks submission or causes data loss) /
   🟠 High (degrades UX or fails store review) / 🟡 Medium (improvable) /
   🟢 Low (nice-to-have)

## 1. COLD START + RUNTIME PERFORMANCE

- Measure cold start TTI (time-to-interactive) by reading the root `_layout.tsx`:
  - Are providers (TanStack Query, Sentry, PostHog, StripeProvider, ThemeProvider)
    mounted in series synchronously? Each one adds 30–80ms.
  - Is `SplashScreen.preventAutoHideAsync()` called BEFORE any async work?
  - Is `SplashScreen.hideAsync()` called only AFTER session resolution + fonts loaded?
- Audit JS bundle size: run `npx expo export` and report `dist/_expo/static/js/<platform>/index-*.js` byte size per platform. Flag if any platform exceeds 5 MB uncompressed.
- Are there `require()` calls inside render functions causing repeated module evaluation?
- Are React Context providers re-rendering on every state change? Look for missing
  `useMemo` / `useCallback` on context values.
- Are heavy imports (`recharts`, `lodash`, `moment`, `firebase`) loaded eagerly when
  they could be lazy-imported?

## 2. LIST + SCROLL PERFORMANCE

- Every list uses `@shopify/flash-list` — NEVER `FlatList` for >50 items.
- `FlashList` has `estimatedItemSize` set (required for perf — auto-measure if missing).
- `renderItem` is memoized — wrapped in `React.memo` with a stable `keyExtractor`.
- `getItemType` is set when rows differ in size (e.g., chat with text + image bubbles).
- `onEndReached` + `onEndReachedThreshold={0.5}` for infinite scroll.
- Images inside list rows use `expo-image` with `transition={0}` (no flicker on rapid scroll).
- No inline arrow functions in `renderItem`, no inline objects in props (re-renders).

## 3. IMAGE LOADING

- All images use `expo-image` (NEVER `Image` from `react-native`).
- Every remote image has `placeholder={{ blurhash }}` (or `placeholder={{ thumbhash }}`)
  to prevent layout shift.
- Image source URLs use a CDN that returns the right size for the device (Cloudinary
  transforms or `width=...` query params).
- Static assets are bundled via `require('../assets/...')`, not loaded from network.
- Hero / above-the-fold images are preloaded via `Image.prefetch()` in `_layout.tsx`.

## 4. ANIMATION + JS THREAD HEALTH

- Every animation uses `react-native-reanimated` 3, NEVER `Animated` from `react-native`.
- Every animation respects `useReducedMotion()` from Reanimated.
- Every long-running animation uses `useSharedValue` + `useAnimatedStyle` (UI thread),
  not `setState` + `useEffect` (JS thread).
- No more than ONE entrance animation per screen.
- Skeleton pulses use a single `withRepeat(withTiming(...))`, not a JS-thread interval.

## 5. NATIVE INTEGRATION CORRECTNESS

- `react-native-gesture-handler` imported at the TOP of `_layout.tsx` (must run before any other gesture-handler usage).
- `react-native-reanimated` imported at the TOP of `_layout.tsx` (same reason).
- Babel config includes `react-native-reanimated/plugin` (LAST in the plugins array).
- Metro config includes the NativeWind setup.
- `<GestureHandlerRootView style={{ flex: 1 }}>` wraps the app at the root.
- `<SafeAreaProvider>` wraps the app at the root.
- Every screen uses `SafeAreaView` from `react-native-safe-area-context` (NOT `react-native`).
- Status bar is configured (`<StatusBar style="light" />` for dark apps).
- Android edge-to-edge is configured if used (`androidStatusBar.translucent: true`).

## 6. AUTH (Better Auth + Expo plugin)

- Server config (`src/lib/auth.ts`):
  - `BETTER_AUTH_SECRET` is set and ≥32 bytes (run `openssl rand -base64 32`)
  - `BETTER_AUTH_URL` matches the production EAS Hosting URL
  - `trustedOrigins` includes the mobile app scheme (e.g., `myapp://`)
  - `session.expiresIn` set appropriately (30 days default)
- Mobile client (`src/lib/auth-client.ts`):
  - Uses `expoClient()` plugin
  - Storage is `expo-secure-store` (NEVER `AsyncStorage` for session tokens)
  - `scheme` matches `app.json` → `expo.scheme`
- Every protected API route calls `auth.api.getSession({ headers })` and returns
  401 on missing session, 403 on role mismatch.
- OAuth callback URLs match `EXPO_PUBLIC_APP_SCHEME` in BOTH server config and the
  OAuth provider's dashboard (Google Cloud Console / Apple Developer / GitHub OAuth).

## 7. DATABASE + PRISMA

- `prisma/schema.prisma` uses the v7 `prisma-client` generator (NOT `prisma-client-js`).
- `src/lib/prisma.ts` uses the Neon adapter (`@prisma/adapter-pg` + `@neondatabase/serverless`)
  for serverless HTTP — NOT the default TCP driver.
- A global Prisma client is reused across hot reloads in dev
  (`globalThis.__prisma ?? makeClient()`).
- All migrations are committed to `prisma/migrations/` AND applied to production
  (`pnpm prisma migrate deploy` against the prod `DATABASE_URL`).
- Required indexes exist on every foreign key + every searchable column
  (use `@@index([userId])` etc.).
- Composite indexes for common query patterns (e.g., `@@index([userId, createdAt])`
  for "my posts ordered by date").
- No `prisma.$queryRawUnsafe(...)` with user input — Zod-validate or parametrize.
- Sensitive columns (passwords, tokens) are NOT included in `select { ... }` clauses
  for endpoints that return the user object.
- `prisma/seed.ts` exists with realistic test data, configured in `package.json`
  → `"prisma": { "seed": "tsx prisma/seed.ts" }`.

## 8. API ROUTES (Expo API Routes — app/api/**/+api.ts)

- Every route exports named HTTP methods (`GET`, `POST`, `PATCH`, `DELETE`), NOT a default function.
- Every body-receiving route Zod-validates with `Schema.safeParse(await request.json())`
  before touching the database.
- List routes use SERVER-SIDE cursor pagination (`?cursor=...&limit=20`), NEVER fetch
  the full list.
- No CORS misconfigurations — Expo API Routes default to same-origin; if you need
  cross-origin (e.g., from web), explicitly set headers.
- Error responses use a consistent shape: `{ error: string, issues?: ZodIssue[] }`.
- No PII in error messages returned to the client (no DB column names, no stack
  traces in production).
- Every protected route returns 401 on missing session, 403 on role mismatch.
- File upload routes mint short-lived signed URLs (Cloudinary / R2) — they do NOT
  proxy the upload bytes through the API route.

## 9. WEBHOOKS

- DGateway webhook (`app/api/webhooks/dgateway+api.ts`):
  - Reads RAW body before parsing
  - Verifies HMAC-SHA256 with `crypto.timingSafeEqual(...)` (constant-time comparison)
  - Returns 401 on signature mismatch
  - Idempotent — dedupes by `reference` against a `PaymentEvent` table
  - Returns 200 quickly; downstream work happens after
- Stripe webhook (`app/api/webhooks/stripe+api.ts`):
  - Uses `stripe.webhooks.constructEvent(...)` with the raw body
  - Returns 401 on signature mismatch
  - Idempotent dedupe by `event.id`
- Push notification registration uses an idempotent upsert keyed by `(userId, token)`.

## 10. STATE + DATA FETCHING

- `<ApiProvider>` (TanStack Query) is mounted at the root.
- `queryClient` has mobile-first defaults: `retry: 2`, `refetchOnWindowFocus: true`,
  `staleTime: 60_000`.
- `useInfiniteQuery` is used for paginated lists (NOT `useQuery` + manual concat).
- Mutations call `queryClient.invalidateQueries({ queryKey: [...] })` on success.
- Optimistic updates wrap the mutation in `onMutate` + `onError` rollback.
- TanStack Query persister wired to MMKV for offline-read support.

## 11. STORAGE

- `react-native-mmkv` (via the `storage` lib component) is used for non-sensitive
  preferences, cache, theme prefs, last-seen IDs.
- `expo-secure-store` is used for sensitive data (auth tokens are wired by Better
  Auth automatically — DO NOT also write them to MMKV).
- No `AsyncStorage` imports anywhere in the project.
- Database is the source of truth — never trust local storage as the source.

## 12. FORMS

- Every form uses `react-hook-form` + Zod via `@hookform/resolvers/zod`.
- Zod schemas live in `src/lib/schemas/<resource>.ts` and are imported by BOTH
  the form AND the corresponding API route.
- Currency inputs use the registry `<Input variant="currency">` (auto-formats
  3000 → 3,000 while typing).
- Selects with >5 options use the registry `<SearchableSelect>` (NEVER native `<Picker>`).
- Date inputs use `@react-native-community/datetimepicker` (NEVER plain text input).
- Submit buttons:
  - Disabled when submitting (`loading={submitting}`)
  - Wrap async work in try/finally
  - Haptics on success (`NotificationFeedbackType.Success`) and error (`Error`)
- Inline errors are field-specific (next to the input). Global errors use a `<Toast>`.

## 13. ROOT NAVIGATOR + AUTH GATE

- `app/_layout.tsx` implements the canonical auth gate pattern:
  - Reads `authClient.useSession()`
  - Redirects signed-in users from `(auth)` group to `(tabs)`
  - Redirects signed-out users from anywhere to `(auth)/sign-in`
  - Hides the splash screen once `isPending` is false
- `(tabs)/_layout.tsx` renders the bottom tab navigator.
- `(auth)/_layout.tsx` renders the signed-out stack.
- No marketing landing page at `/` unless `project-description.md` says
  "Public landing page: Yes".

## 14. ACCESSIBILITY

- Every `Pressable`, every icon button, every form field has an `accessibilityLabel`.
- Touch targets are 44 × 44 minimum (use `hitSlop` when visual size is smaller).
- `accessibilityRole` set on buttons, toggles, links, headers, images.
- `accessibilityState` set on selected items, disabled controls, toggles.
- Text colour contrast hits WCAG AA (4.5:1 body, 3:1 large text).
- VoiceOver tested on iOS + TalkBack tested on Android — every screen narrates
  meaningfully.
- Dynamic type respected: hero text `maxFontSizeMultiplier={1.4}`, dense UI `1.2`.

## 15. ENV VARS + SECRETS

- `.env.example` is committed with placeholder values, NO real secrets.
- `.env.local` is gitignored.
- `DATABASE_URL`, `BETTER_AUTH_SECRET`, `DGATEWAY_API_KEY`, `STRIPE_SECRET_KEY`,
  `RESEND_API_KEY`, `CLOUDINARY_URL` — none of these have `EXPO_PUBLIC_` prefix
  (would bundle into the binary).
- Only `EXPO_PUBLIC_*` env vars are read on the mobile side.
- Production env vars are set via `eas secret:create --scope project ...`, NEVER
  committed to the repo.
- Typed env loader (`src/lib/env.ts`) Zod-validates `process.env` at module load.

## 16. SENTRY + OBSERVABILITY

- `@sentry/react-native` is initialised at the top of `_layout.tsx` BEFORE the
  splash screen prevent-auto-hide.
- `Sentry.wrap(RootLayout)` wraps the default export.
- Source maps are uploaded via EAS post-build hook (`eas-build-post-install`).
- `EXPO_PUBLIC_SENTRY_DSN` is set per environment (dev / preview / production).
- Server-side Sentry (`@sentry/node`) is initialised in an `instrumentation.ts`
  file that runs once at server start.
- `tracesSampleRate` is set to 0.2 in production (not 1.0 — that's $$).
- Sensitive data is NOT sent to Sentry — use `beforeSend` to scrub PII.

## 17. PUSH NOTIFICATIONS (if enabled)

- `expo-notifications` permission is requested ONLY after the user signs in (not on
  cold start — Apple rejects apps that demand permission immediately).
- Permission request is preceded by a "soft ask" screen explaining WHY.
- `Device.isDevice` guard prevents asking on simulators.
- Push token is registered with your backend via `POST /api/push/register`.
- Backend dedupes tokens per `(userId, platform)`.
- Notifications include `data` payload for deep linking (not just `title`/`body`).
- `Notifications.setNotificationHandler` is configured to show alerts in foreground.

## 18. DEEP LINKS

- `app.json` → `expo.scheme` is set (e.g., `"myapp"`).
- `app.json` → `ios.associatedDomains` lists your domain (e.g., `applinks:yourdomain.com`).
- `app.json` → `android.intentFilters` configured with `autoVerify: true`.
- `.well-known/apple-app-site-association` is hosted at your domain root (iOS).
- `.well-known/assetlinks.json` is hosted at your domain root (Android).
- `expo-linking` handles incoming URLs and routes to the correct screen.
- OAuth callback URLs work via deep link (test the full sign-in flow with
  Google / Apple / GitHub on a real device).

## 19. STORE-READY ASSETS

- `assets/icon.png` — 1024 × 1024, opaque (no transparency), correct branding.
- `assets/splash.png` — at least 1284 × 2778, app's brand background colour matches
  `app.json` → `splash.backgroundColor`.
- `assets/adaptive-icon.png` — 1024 × 1024 with content in the centre 432 × 432px
  safe zone (Android 8+ adaptive masks).
- `app.json` → `expo.version` is set (e.g., `"1.0.0"`).
- `app.json` → `expo.ios.buildNumber` and `expo.android.versionCode` are set and
  auto-incremented in `eas.json` → `build.production.autoIncrement: true`.
- `app.json` → `expo.runtimeVersion.policy: "appVersion"` (or pinned) so OTA
  updates target the right binary.
- `app.json` → `expo.scheme` is unique (matches your reverse-DNS).
- `app.json` → `expo.ios.bundleIdentifier` and `expo.android.package` are set and
  match your App Store Connect / Play Console entries.

## 20. STORE LISTING

- App name, subtitle, primary category set in `app.json` (or directly in App Store
  Connect / Play Console).
- Short description (170 chars max for Apple, 80 for Google).
- Long description (4000 chars max).
- Screenshots:
  - iPhone 6.7" (1290 × 2796) — at least 3
  - iPhone 6.5" (1242 × 2688) — at least 3
  - iPad 12.9" (2048 × 2732) — only if iPad-supported
  - Android phone (1080 × 1920 minimum) — at least 2
- Promo video (optional but converts well — 30 seconds max)
- Privacy policy URL — REQUIRED for both stores
- Terms of service URL — REQUIRED for both stores
- Apple Privacy Manifest (`PrivacyInfo.xcprivacy`) — required if app uses any of the
  Apple "required reason APIs"
- App Tracking Transparency prompt copy is reviewed if app uses IDFA

## 21. EAS BUILD + SUBMIT

- `eas.json` has `development`, `preview`, `production` profiles.
- Production profile sets `autoIncrement: true`.
- iOS credentials uploaded (`eas credentials`).
- Android upload key + service account JSON in place.
- Production build runs successfully end-to-end (`eas build --profile production --platform all`).
- TestFlight Internal Testing track populated AND tested by 3+ humans before submitting.
- Google Play Internal Testing track populated AND tested by 3+ humans before promoting to production.
- App Store review notes prepared (test account credentials if app requires login).

## 22. EAS UPDATE

- `eas update` channel matches the build profile (`production` channel for production builds).
- `app.json` → `updates.url` is set.
- `app.json` → `runtimeVersion` set (use `policy: "appVersion"` to auto-bump on native changes).
- Test an OTA push to TestFlight before relying on it in production.

## 23. EAS HOSTING (API ROUTES DEPLOYMENT)

- `eas deploy --prod` succeeds and returns a stable URL.
- `EXPO_PUBLIC_API_URL` in `app.json` → `extra.apiUrl` points to the EAS Hosting URL.
- Production database connection pooling is configured (Neon's HTTP driver handles this,
  but verify by checking the Neon dashboard for connection counts).
- All EAS secrets (`DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.) are set via
  `eas secret:create` for the project.

## 24. DOCS THAT MUST EXIST IN THE REPO

- `README.md` — what the app does, how to run it locally, env vars needed
- `.env.example` — every env var with placeholder
- `prisma/seed.ts` — realistic test data
- `LICENSE` — MIT or your chosen license
- A short `DEPLOYMENT.md` covering the EAS Build + Submit + Update flow for the team

---

OUTPUT FORMAT:

For each finding:

🔴 **Critical** (or 🟠 High / 🟡 Medium / 🟢 Low)
**File:** `path/to/file.ts` (line N)
**Issue:** [one-sentence summary]
**Why it matters:** [2–3 sentences on the production impact]
**Current code:**
```ts
// snippet
````

**Fix:**

```ts
// corrected snippet
```

End with a summary table:

| Severity    | Count |
| ----------- | ----- |
| 🔴 Critical | N     |
| 🟠 High     | N     |
| 🟡 Medium   | N     |
| 🟢 Low      | N     |

And a one-paragraph "Ready to ship?" verdict.

```

---

## After the review

- **Critical issues:** Fix before running `eas build --profile production`.
- **High issues:** Fix before promoting to public release. OK to ship to TestFlight / Internal Testing with these open.
- **Medium issues:** Add to a follow-up OTA update within the first week.
- **Low issues:** Backlog. Address in the next minor version.

Use `eas update --branch production --message "<fix description>"` for the OTA after each batch of fixes — your users get the patch on next app open, no store review needed.
```
