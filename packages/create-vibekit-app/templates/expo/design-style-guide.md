# VibeKit Native — Design Style Guide (Template)

> **This file is a template.** The VibeKit Native Planning Assistant (`CLAUDE_PROMPT.md`) tailors it per-project — swapping the accent color, typography pairings, app name, and component specs based on your interview answers and visual reference. Replace `{{TOKENS}}` with the values your planning conversation produced.
>
> Single source of truth for every visual + interaction decision in **{{APP_NAME}}**. Reference this file before writing any UI code. It overrides the generic design rules in `master_prompt.md` where they differ.

---

## 1. Design Philosophy

{{APP_NAME}} is a {{APP_KIND}} (e.g., "social messaging app", "field-service POS", "B2B logistics tracker") for {{PRIMARY_USER}}. The UI must feel **{{AESTHETIC_TRAITS}}** (e.g., "fast, native, and quiet" / "playful but professional" / "minimal and trustworthy").

**Three core principles:**

1. **Native-first feel** — Respects iOS Human Interface Guidelines and Android Material 3 conventions where they matter (back-gesture, swipe-to-dismiss, haptic feedback). Doesn't try to look like a web app shrunk to a phone.
2. **{{ACCENT}} as the hero** — One bold accent color. Every CTA, every active state, every "this is the action" cue uses this color. No rainbow gradients, no AI-slop purple-pink-orange. Other surfaces stay quiet (neutral grays, near-black backgrounds).
3. **Quiet confidence at 60 fps** — Smooth scrolling, smooth animations, instant haptics. The phone is in the user's hand — every micro-delay is felt. Performance budget is design, not engineering.

**Visual reference:** {{REFERENCE_LINK}} (Dribbble shot, app screenshot, competitor app — pasted by the user during planning).

---

## 2. Color Palette

VibeKit Native ships **dark-by-default**. Light mode is optional and requires a per-screen variant — pick it deliberately only if `project-description.md` → "Dark mode: Both" is set.

### Core tokens (`src/components/lib/theme.ts`)

```ts
export const colors = {
  // Backgrounds (darkest → most-elevated)
  bg: "{{BG}}", // e.g., '#0A0A0A' — base screen background
  bgSubtle: "{{BG_SUBTLE}}", // e.g., '#121212' — section dividers, list rows
  bgElevated: "{{BG_ELEVATED}}", // e.g., '#1A1A1A' — cards, sheets, modals
  bgHover: "{{BG_HOVER}}", // e.g., '#222222' — pressed / hover state

  // Text
  textPrimary: "{{TEXT_PRIMARY}}", // e.g., '#FFFFFF' — headlines, body
  textSecondary: "{{TEXT_SECONDARY}}", // e.g., '#A0A0A0' — supporting copy
  textTertiary: "{{TEXT_TERTIARY}}", // e.g., '#666666' — captions, placeholders, metadata
  textInverse: "{{TEXT_INVERSE}}", // e.g., '#0A0A0A' — text on accent buttons

  // Borders (1px always — never 2px unless selected)
  border: "{{BORDER}}", // e.g., '#2A2A2A' — default
  borderStrong: "{{BORDER_STRONG}}", // e.g., '#333333' — hover / focused

  // Accent (the ONE hero color)
  accent: "{{ACCENT}}", // e.g., '#6366F1' — solid CTAs, active states
  accentLight: "{{ACCENT_LIGHT}}", // e.g., '#1E1B4B' — selected backgrounds (10% accent on dark)
  accentMuted: "{{ACCENT_MUTED}}", // e.g., '#2D2A5E' — hover on accent surfaces

  // Semantic (status feedback only — never as decoration)
  success: "#22C55E",
  successLight: "#052E16",
  warning: "#F59E0B",
  warningLight: "#451A03",
  error: "#EF4444",
  errorLight: "#450A0A",
  info: "#3B82F6",
  infoLight: "#0C1929",
} as const;
```

### Picking an accent

- **One color per project.** No "primary + secondary + tertiary." That's a brand-style-guide trap.
- **Contrast against `bg`:** the accent must hit WCAG AA 4.5:1 on the base background for text-on-accent buttons.
- **Test on dim screens.** Mobile users use phones in bright sun. A subtle accent disappears outdoors.
- **Default if undecided:** Indigo `#6366F1` (high contrast, brand-neutral, works in every category).

### NativeWind config (`tailwind.config.js`)

```js
import { colors } from "./src/components/lib/theme";

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        bgSubtle: colors.bgSubtle,
        bgElevated: colors.bgElevated,
        bgHover: colors.bgHover,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        textTertiary: colors.textTertiary,
        textInverse: colors.textInverse,
        border: colors.border,
        borderStrong: colors.borderStrong,
        accent: colors.accent,
        accentLight: colors.accentLight,
        accentMuted: colors.accentMuted,
        success: colors.success,
        successLight: colors.successLight,
        warning: colors.warning,
        warningLight: colors.warningLight,
        error: colors.error,
        errorLight: colors.errorLight,
        info: colors.info,
        infoLight: colors.infoLight,
      },
    },
  },
};
```

Now every component can use `text-textPrimary`, `bg-bgElevated`, `border-border`, `bg-accent` etc.

---

## 3. Typography

Phone screens are smaller than laptops. The web's 14–18pt body scale doesn't transfer — we use a **slightly larger base** for thumb-friendly reading.

### Font families (`expo-font`)

```ts
// app/_layout.tsx
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { JetBrainsMono_400Regular } from "@expo-google-fonts/jetbrains-mono";
```

| Role                                   | Font                                              | Why                                                                 |
| -------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------- |
| **UI / body**                          | **{{SANS_FONT}}** (default: Inter)                | High legibility at every size, native-feeling on both iOS + Android |
| **Numbers / monospace / code**         | **{{MONO_FONT}}** (default: JetBrains Mono)       | Tabular numerals for prices, counts, timestamps                     |
| **Optional display / brand headlines** | **{{DISPLAY_FONT}}** (e.g., Geist, Onest, system) | Use sparingly — only marketing screens, onboarding                  |

### Type scale (mobile-tuned)

```ts
// src/components/lib/theme.ts (continued)
export const typography = {
  // Headlines (sparing on mobile — too much vertical real estate)
  display: { fontSize: 32, lineHeight: 38, fontWeight: "700" }, // onboarding, hero
  h1: { fontSize: 28, lineHeight: 34, fontWeight: "700" }, // screen title
  h2: { fontSize: 22, lineHeight: 28, fontWeight: "600" }, // section header
  h3: { fontSize: 18, lineHeight: 24, fontWeight: "600" }, // card title

  // Body
  bodyLg: { fontSize: 17, lineHeight: 24, fontWeight: "400" }, // hero copy, first paragraph
  body: { fontSize: 15, lineHeight: 22, fontWeight: "400" }, // default body
  bodySm: { fontSize: 13.5, lineHeight: 20, fontWeight: "400" }, // secondary

  // Meta
  caption: { fontSize: 12, lineHeight: 16, fontWeight: "500" }, // timestamps, badges
  micro: { fontSize: 11, lineHeight: 14, fontWeight: "600" }, // uppercase eyebrows

  // Numbers (tabular)
  numLg: { fontSize: 28, lineHeight: 32, fontVariant: ["tabular-nums"] }, // stat cards
  numMd: { fontSize: 18, lineHeight: 22, fontVariant: ["tabular-nums"] }, // prices
} as const;
```

### NativeWind utility classes

Use Tailwind size classes (`text-[15px] leading-[22px]`) for one-off cases; for repeated patterns, build a typed `<Text>` wrapper:

```tsx
// src/components/ui/typography.tsx
export const Heading = ({
  children,
  level = 1,
  className,
  ...rest
}: { level?: 1 | 2 | 3 } & TextProps) => {
  const cls = {
    1: "text-[28px] leading-[34px] font-bold text-textPrimary",
    2: "text-[22px] leading-[28px] font-semibold text-textPrimary",
    3: "text-[18px] leading-[24px] font-semibold text-textPrimary",
  }[level];
  return (
    <Text className={cn(cls, className)} {...rest}>
      {children}
    </Text>
  );
};
```

### Rules

- **iOS allows dynamic type** — respect it. Set `maxFontSizeMultiplier={1.4}` on hero text, `maxFontSizeMultiplier={1.2}` on dense UI.
- **Line height ≥ 1.3× font size.** Mobile reading distance is shorter; cramped lines feel claustrophobic.
- **Truncate, don't wrap, in dense lists.** `numberOfLines={1} ellipsizeMode="tail"`.
- **NEVER use `<Text>` without a wrapper** for repeated patterns. Type tokens come from the theme.

---

## 4. Spacing

8pt grid — same as iOS HIG and Material 3 — but ALWAYS rounded to a multiple-of-4. Mobile uses tighter spacing than web because screens are smaller.

```ts
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16, // default gap between unrelated elements
  lg: 20,
  xl: 24,
  "2xl": 32,
  "3xl": 48,
  "4xl": 64,
} as const;
```

### Common spacings

| Context                       | Spacing                                           |
| ----------------------------- | ------------------------------------------------- |
| Screen edge padding (default) | `px-4` (16)                                       |
| Section vertical padding      | `py-6` (24)                                       |
| Card internal padding         | `p-5` (20) — `p-6` for hero cards                 |
| Form field gap (vertical)     | `gap-4` (16)                                      |
| List item padding             | `px-4 py-3` (16 × 12)                             |
| Tap target minimum            | 44 × 44 (use `hitSlop` if visual size is smaller) |
| Bottom tab bar padding        | `py-2 px-1` (safe-area handles the rest)          |

---

## 5. Radius

Mobile lives in rounded corners. iOS leans larger (16–20pt for cards), Android slightly flatter (8–12pt). VibeKit Native picks a **single rounded language** and uses it consistently on both platforms.

```ts
export const radius = {
  none: 0,
  sm: 6, // chips, badges
  md: 8, // inputs, small buttons
  lg: 12, // cards, list items
  xl: 16, // hero cards, modal sheets
  "2xl": 20, // bottom sheets
  "3xl": 24, // floating action surfaces
  full: 9999, // pill chips, circular buttons, avatars
} as const;
```

NativeWind: `rounded` (4), `rounded-md` (6), `rounded-lg` (8), `rounded-xl` (12), `rounded-2xl` (16), `rounded-3xl` (24), `rounded-full`.

### Card anatomy

```tsx
<View className="rounded-xl bg-bgElevated border border-border p-5">...</View>
```

`rounded-xl` (12pt) is the default for cards. Hero cards / payment cards / onboarding cards use `rounded-2xl` (16pt). Bottom sheets use `rounded-3xl` (24pt) at the TOP only — `rounded-t-3xl`.

---

## 6. Component Specs

### Buttons

| Size           | Height | Horizontal padding | Font size |
| -------------- | ------ | ------------------ | --------- |
| `sm`           | 36     | 12                 | 13        |
| `md` (default) | 48     | 20                 | 15        |
| `lg`           | 56     | 24                 | 16        |

Variants:

- **Primary**: `bg-accent` text-white — the hero CTA. ONE per screen.
- **Secondary**: `bg-transparent border border-borderStrong text-textPrimary` — supporting actions.
- **Ghost**: `bg-transparent text-textSecondary` — tertiary actions.
- **Destructive**: `bg-error text-white` — irreversible actions (delete, cancel subscription).
- **Text**: `bg-transparent text-accent` — inline link-style actions.

All buttons: `rounded-lg` (md+) or `rounded-md` (sm), `flex-row items-center justify-center gap-2`, `active:opacity-95` for press feedback.

### Inputs

| Variant    | Height | Radius           |
| ---------- | ------ | ---------------- |
| `standard` | 52     | `rounded-lg` (8) |
| `search`   | 44     | `rounded-full`   |

Padding: `px-4` (16). Border: `border border-border` default, `border-accent` on focus, `border-error` on error. Label sits above input (`text-textSecondary text-[14px] mb-1.5`).

### Cards (variants)

| Variant   | Class                                                                        |
| --------- | ---------------------------------------------------------------------------- |
| Default   | `rounded-xl bg-bgElevated border border-border p-5`                          |
| Pressable | + `active:opacity-95`, `android_ripple={{ color: colors.bgHover }}`          |
| Selected  | swap `border border-border` → `border-2 border-accent`, add `bg-accentLight` |
| Hero      | swap radius to `rounded-2xl`, padding to `p-6`                               |

### Lists

- `FlashList` always (never `FlatList` for >50 items)
- `estimatedItemSize` is required — measure your tallest item
- `ItemSeparatorComponent` for divider lines: `<View className="h-px bg-border" />`
- Pull-to-refresh `<RefreshControl tintColor={colors.accent} />`
- Empty state: registry `<EmptyState />` component
- Item layout: `flex-row items-center gap-3 px-4 py-3` minimum

### Sheets + modals

- Bottom sheet: registry `<BottomSheet />` — `rounded-t-3xl bg-bgElevated`, drag handle at top
- Full modal: `<Modal animationType="slide" />` + `<SafeAreaView>`
- Backdrop: `bg-black/60` for sheets, `bg-black/80` for full modals

### Tab bar

- Custom: registry `<BottomTabs />` — 5 tabs max
- Icon: 22pt, outline when inactive, filled when active
- Label: 11pt, font-semibold when active

---

## 7. Iconography

`@expo/vector-icons` (Ionicons). Bundled with Expo, zero linking, ~10,000 icons.

```tsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="home-outline" size={22} color={colors.textTertiary} />
<Ionicons name="home" size={22} color={colors.accent} />  // active state
```

### Rules

- **Outline for inactive, filled for active.** Tab bars, toggles, selection indicators all follow this rule.
- **Icon sizing scale:** 14 (inline with text), 16 (input affordance), 20 (button), 22 (tab bar / nav), 24 (large action), 32 (empty-state hero).
- **Color = inherit from text.** `color={colors.textPrimary}` for body, `colors.textSecondary` for muted, `colors.accent` for active.
- **NEVER decorative icon walls.** Image-first: 80% custom illustration / photo, 20% icons (see Imagery below).

---

## 8. Motion

`react-native-reanimated` 3 + `react-native-gesture-handler` + Moti. NEVER `Animated` from `react-native` (JS thread, janky).

### Standard timings + easings

```ts
export const motion = {
  // Durations
  fast: 150, // press feedback (Pressable's built-in active state)
  base: 250, // state transitions (tab swap, toggle, sheet snap)
  slow: 400, // entrance (screen mount, list item appear)
  slower: 600, // hero entrance, onboarding card flip

  // Easings (Reanimated)
  easeOut: [0.16, 1.0, 0.3, 1.0] as const, // entrance default
  easeIn: [0.42, 0.0, 1.0, 1.0] as const, // exit
  spring: { damping: 18, stiffness: 220 }, // bouncy elements
} as const;
```

### Patterns

```tsx
import Animated, {
  FadeIn,
  FadeOut,
  Layout,
  useReducedMotion,
} from "react-native-reanimated";

const reduce = useReducedMotion();

<Animated.View
  entering={reduce ? undefined : FadeIn.duration(400).easing(motion.easeOut)}
  exiting={reduce ? undefined : FadeOut.duration(200)}
  layout={Layout.springify()}
>
  ...
</Animated.View>;
```

### Rules

- **Always respect `useReducedMotion()`.** Wrap entering/exiting in a ternary that returns `undefined` when reduce is on.
- **No more than ONE entrance animation per screen.** Don't stagger the list items AND animate the header AND fade in the bottom sheet. Pick one.
- **Haptics pair with motion.** `Haptics.impactAsync(ImpactFeedbackStyle.Light)` on every primary press, `NotificationFeedbackType.Success` after form submit.
- **60fps non-negotiable.** Open the React DevTools FPS counter on every animation. If it dips below 55, reduce work — fewer particles, lower blur, simpler shadow.

---

## 9. Imagery

**Image-first, 80/20 ratio.** Images outnumber icons roughly 80% to 20% across the app. Use `expo-image` (NEVER `Image` from `react-native`).

```tsx
import { Image } from "expo-image";

<Image
  source={{ uri: post.imageUrl }}
  style={{ width: "100%", aspectRatio: 16 / 9, borderRadius: 12 }}
  contentFit="cover"
  transition={200}
  placeholder={{ blurhash: post.blurhash }}
/>;
```

### Where IMAGES go (not icons)

- Empty states (illustration, not bare icon)
- Onboarding cards
- Hero sections on home tab
- Stat cards (background pattern or illustration)
- Reward / loyalty cards
- Marketing banners
- Profile headers
- Product cards in commerce

### Sourcing

- **Custom illustrations:** Commission once, use everywhere. Match the accent color.
- **Stock photos:** Unsplash / Pexels — pick photos with breathing room around the subject so they crop well on different aspect ratios.
- **App icons / logos:** SVG via `react-native-svg`. Bake into the binary; never load over the network.
- **User-generated content:** Always set `placeholder={{ blurhash }}` to avoid layout shift.
- **Asset CDN:** Cloudinary (transforms, auto-format, auto-quality) or Cloudflare R2 + Workers.

---

## 10. Selected / Active States (LOUD)

When a card, radio, tab, filter chip, or option is selected, the contrast must be obvious at a glance from 2 metres away on a phone.

| State         | Border                         | Background                            | Indicator                                           |
| ------------- | ------------------------------ | ------------------------------------- | --------------------------------------------------- |
| Unselected    | `border border-border` (1px)   | `bg-bgElevated`                       | empty circle / outline icon                         |
| Selected      | `border-2 border-accent` (2px) | `bg-accentLight` (10% accent opacity) | filled circle / filled icon `text-accent`           |
| Hover / press | `border border-borderStrong`   | `bg-bgHover`                          | (mobile rarely uses hover; use `active:opacity-95`) |

Example:

```tsx
<Pressable
  className={cn(
    "rounded-xl p-4",
    selected
      ? "border-2 border-accent bg-accentLight"
      : "border border-border bg-bgElevated",
  )}
>
  ...
</Pressable>
```

---

## 11. Accessibility

Mobile a11y is non-negotiable — it's a store-review checklist item, and 20–30% of users have some accessibility need.

### Touch targets

44 × 44 minimum (Apple HIG, Material). If visual size is smaller, add `hitSlop`:

```tsx
<Pressable hitSlop={{ top: 8, right: 8, bottom: 8, left: 8 }}>
  <Ionicons name="close" size={20} />
</Pressable>
```

### Labels

Every `Pressable`, every icon button, every form field has an `accessibilityLabel`. If the visible label is descriptive enough, that suffices.

```tsx
<Pressable accessibilityRole="button" accessibilityLabel="Delete order">
  <Ionicons name="trash" size={20} />
</Pressable>
```

### Roles + states

- Buttons: `accessibilityRole="button"`
- Toggles: `accessibilityRole="switch"` + `accessibilityState={{ checked }}`
- Selected items: `accessibilityState={{ selected: true }}`
- Disabled: `accessibilityState={{ disabled: true }}`

### Color contrast

- Body text: WCAG AA 4.5:1 minimum against background
- Large text (≥18pt): 3:1 minimum
- Use https://webaim.org/resources/contrastchecker/ to verify accent vs `textInverse`

### VoiceOver + TalkBack testing

Test EVERY new screen with:

- **iOS:** Settings → Accessibility → VoiceOver → On (or triple-click home)
- **Android:** Settings → Accessibility → TalkBack → On

Walk through every interactive element. Every one must announce a label + role.

---

## 12. Safe Area + Status Bar

Always use `react-native-safe-area-context` (NEVER from `react-native`).

```tsx
import { SafeAreaView } from 'react-native-safe-area-context';

// Screen with its own header
<SafeAreaView edges={['top']} className="flex-1 bg-bg">
  ...
</SafeAreaView>

// Full-bleed screen (no header)
<SafeAreaView edges={['top', 'bottom']} className="flex-1 bg-bg">
  ...
</SafeAreaView>
```

Status bar:

```tsx
// app/_layout.tsx
import { StatusBar } from "expo-status-bar";

<StatusBar style="light" />; // light text on dark bg (default for dark-only apps)
```

For Android edge-to-edge: set `"androidStatusBar": { "translucent": true }` in `app.json`.

---

## 13. Platform-Specific Notes

| Concern           | iOS                                               | Android                                                               |
| ----------------- | ------------------------------------------------- | --------------------------------------------------------------------- |
| **Back gesture**  | Swipe from left edge                              | System back button or swipe (Android 10+)                             |
| **Modal dismiss** | Swipe down on sheet                               | Hardware back button or swipe down                                    |
| **Haptics**       | Strong — use freely                               | Weaker — still useful, especially `selectionAsync` for picker scrolls |
| **Date picker**   | `display="spinner"` inside `BottomSheet`          | Native dialog from `@react-native-community/datetimepicker`           |
| **Tab bar**       | Bottom-rounded, blur background works well        | Flat, opaque background; consider Material-style elevation            |
| **Status bar**    | Notch + Dynamic Island — leave 44pt top safe area | Notification icons on left; can be translucent                        |
| **Default font**  | San Francisco                                     | Roboto                                                                |
| **Splash screen** | Single image, fades to app                        | `splash` config + `adaptiveIcon` for Android-12+                      |

The rule: **don't reinvent platform conventions for fun.** A swipe-from-left back gesture on iOS works because iOS users learned it; replacing it with a custom thing breaks muscle memory.

---

## 14. Splash Screen + App Icon + Adaptive Icon

Required assets (all PNG, no transparency on `icon.png`):

| Asset                      | Size                | Notes                                                                                |
| -------------------------- | ------------------- | ------------------------------------------------------------------------------------ |
| `assets/icon.png`          | 1024 × 1024         | App icon (iOS + Android fallback)                                                    |
| `assets/splash.png`        | 1284 × 2778 minimum | Full-screen splash; auto-letterboxed on smaller screens                              |
| `assets/adaptive-icon.png` | 1024 × 1024         | Android 8+ adaptive icon foreground (108dp visual safe zone in the centre 432×432px) |
| `assets/favicon.png`       | 48 × 48             | Web-build only                                                                       |

`app.json`:

```json
{
  "expo": {
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "{{BG}}"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "{{BG}}"
      }
    }
  }
}
```

Splash screen logic: pre-load via `expo-splash-screen`, hide once the auth gate has resolved the session.

```tsx
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

// ...later, once session is resolved:
SplashScreen.hideAsync();
```

---

## 15. Empty States + Skeletons + Error States

Every list / detail screen needs all three.

### Empty state

Registry `<EmptyState />` component. Always includes:

- An illustration (not just an icon — image-first rule)
- A short headline (4–8 words)
- A 1–2 sentence supportive description
- A primary CTA when one is possible

### Skeleton loader

Registry `<Skeleton />` component. Pulse animation (`useSharedValue` driving `opacity` between 0.4 and 1). One skeleton per item type — match the real card's silhouette, not generic rectangles.

### Error state

A dedicated component with:

- A friendly headline ("Something went wrong loading your orders")
- The error code only in dev (`__DEV__ && <Text>{error.message}</Text>`)
- A "Try again" button that re-triggers the query
- Sentry already captured the error — no need to write to the user about it

---

## 16. Do's and Don'ts

### Do

- One accent color across the app.
- 1px borders, soft shadows (or no shadows on mobile — they cost performance).
- Image-first 80/20.
- `react-native-reanimated` for every animation.
- 44pt minimum touch targets.
- Respect `useReducedMotion()` everywhere.
- Test VoiceOver + TalkBack before shipping.
- `expo-image`, not `Image` from `react-native`.
- `FlashList`, not `FlatList`.
- `react-native-safe-area-context`, not `react-native`'s `SafeAreaView`.

### Don't

- Multi-color gradient buttons (purple → pink → orange = AI slop).
- Multi-color gradient backgrounds.
- More than ONE entrance animation per screen.
- Decorative shadows (`shadow-2xl` for no reason).
- `border-2` unless the element is selected.
- Multiple radii inside a single card.
- Native `<Picker>` for any list (use `searchable-select`).
- Raw `Text` strings without a `<Text>` wrapper.
- Skip safe area handling — that bottom 34pt notch is a real device.
- Use Lucide / Heroicons / Phosphor on mobile (use `@expo/vector-icons` — bundled with Expo).
- Build a "marketing landing page" as the app root — the root is an auth gate.
