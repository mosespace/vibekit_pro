# VibeKit OG Image — Gemini Prompt

> Paste this into Gemini, Imagen, ChatGPT image gen, or Midjourney. Output dimensions: **1200 × 630**. Save as `web/public/og.png`.

> Reference aesthetic: an "Orbita"-style dark techy hero with a glowing brand symbol on the left, bold sans-serif headline center, satellite geometry top-right, and tech-chip strip bottom-right. Indigo/violet glow on near-black.

---

## Primary prompt — paste this into Gemini

```
Create a 1200x630 social media OG image for "VibeKit" — a developer framework for building Next.js applications with Claude Code AI.

OVERALL FEEL
Dark mode, cinematic, modern, techy. Editorial composition. Premium developer-tool aesthetic — think Vercel + Linear + a touch of cosmic. Heavy contrast. No clutter.

BACKGROUND
- Solid near-black base (#0A0A09).
- A faint blueprint grid pattern across the entire canvas (1px lines, low opacity, indigo-tinted #5B5BD6 at 8% opacity), evenly spaced ~40px apart.
- Scattered tiny constellation dots (1–2px, soft white #FAFAF9 at 40–60% opacity) connected by ultra-thin lines (#5B5BD6 at 15%) forming subtle constellation patterns. Distribute lightly across the negative space — not overwhelming.
- A soft radial glow in violet/indigo (#818CF8) emanating from behind the brand symbol on the left, blurred heavily, fading to transparent. A second smaller glow behind the satellite cluster top-right.

LEFT SIDE — BRAND SYMBOL (vertically centered, ~30% from left edge)
- A circular geometric brand mark, ~280px diameter.
- Concentric orbital rings (3–4 rings, thin glowing #818CF8 strokes) wrapped around a central glowing icosahedron / geodesic shape rendered in violet (#818CF8) with bright inner core (#FAFAF9 highlight).
- The mark glows softly outward. Visible pulse/halo ring around it. Subtle parallax-style depth — looks like a 3D object floating in space.
- Optional: a few orbiting nodes (small violet dots) pinned on the rings to suggest motion.

CENTER-RIGHT — TYPOGRAPHY (vertically centered, right of the brand mark)
- Eyebrow line (top, optional): tiny uppercase tracking-wide monospace text "THE FRAMEWORK FOR VIBE CODERS" in muted gray (#6E6E68), letter-spacing 0.15em, 11–12px.
- Headline: "VibeKit" in a heavy/bold geometric sans-serif (Inter Tight Black, Geist Bold, or similar) — large, ~110–130px tall, weight 800–900, color #FAFAF9 (warm white). Slight letter-spacing tightening (-0.02em).
- Sub-headline (directly below, smaller): "Ship production apps with Claude Code" in lighter weight (Inter Medium 500), ~32px, color soft gray-white (#C4C0B7).
- Sub-sub line: "Next.js 16. Prisma v7. Better Auth. Zero AI slop." in even lighter gray (#8A8A85), 18px, regular weight.

TOP-RIGHT — FLOATING TECH CLUSTERS
- Two small floating clusters of stacked hexagonal/cube shapes in soft violet (#818CF8 at 70%, with subtle inner shadows) — represents components / building blocks.
- Each cluster has thin orbital rings around it, like the brand mark but smaller (60–80px diameter rings).
- A few small connection dots between them, like a network diagram.
- These should feel like "satellites" — minor decorative balance to the brand mark on the left.

BOTTOM-RIGHT — TECH STACK CHIP STRIP
- Four small dark rounded-square chips (~64×64px each, 12px corner radius), each containing a small monochrome/colored tech logo.
- Chips left-to-right: Next.js (white triangle on dark), Prisma (teal/dark), Better Auth (a custom shield or "BA" wordmark), Tailwind CSS (cyan).
- Chips have subtle inner glow and 1px violet border at 30% opacity.
- 8–12px gap between chips.
- Right edge: 40px from the canvas right edge.

BOTTOM-LEFT — DOMAIN
- Small monospace text "vibekit.desishub.com" in muted gray (#6E6E68), 14px, ~32px from bottom-left corner.

COLOR LOCK
- Background: #0A0A09
- Accent (violet/indigo): #818CF8 with deeper variant #5B5BD6
- Headline text: #FAFAF9
- Secondary text: #C4C0B7 / #8A8A85 / #6E6E68
- No other colors except the inherent colors of the four tech logos in the chips.

OUTPUT
- 1200 × 630 PNG, sharp, no compression artifacts, no text spelling errors.
- Crisp typography, no halos or unwanted glows on letterforms.
- Composition feels balanced: brand mark left, typography center, satellites top-right, chip strip bottom-right, domain bottom-left. Negative space breathes.

References this should resemble: the "Orbita — Self-Hosted PaaS" hero image (concentric rings around a central glowing symbol, dark blueprint grid, floating satellite clusters, tech chips in corner). Same energy, but adapted to VibeKit's identity.
```

---

## Light mode variant (Twitter card alt — optional)

```
Same composition as the dark version above, but with these substitutions:
- Background: warm cream (#FAF8F5) with a very subtle violet glow (#4F46E5 at 10% opacity).
- Blueprint grid: violet (#4F46E5) at 6% opacity.
- Brand symbol: violet rings (#4F46E5) around a near-black icosahedron (#0F0F0E) with violet inner glow.
- Headline "VibeKit" in near-black (#0F0F0E), still bold geometric sans.
- Sub-headline in dark gray (#5A5A56). Sub-sub in lighter gray (#8A8A85).
- Tech chips: light gray fill (#F4F1EC), thin violet borders at 30% opacity.
- Same 1200×630.
```

---

## Iteration tips

- If the brand symbol looks too generic, request: **"the central symbol should look like a glowing geodesic icosahedron made of violet wireframe lines, surrounded by 3 concentric thin rings — one horizontal, two tilted at different angles, like atomic orbitals."**
- If "VibeKit" is rendered in a wrong font weight, request: **"render the word 'VibeKit' in a heavy condensed sans like Inter Tight Black or Geist Bold, weight 800+, all lowercase or title case — NOT serif, NOT italic, NOT thin."**
- If the constellation dots feel cluttered, request: **"reduce constellation dots by half, keep only sparse points connected by ultra-thin lines."**
- If the chips look fake, request: **"the four chips bottom-right should each contain a clean recognizable logo: Next.js triangle, Prisma diagonal-bars, Better Auth shield, Tailwind wave."**

Save the final image as `web/public/og.png` (1200×630 PNG, ≤200KB ideally).
