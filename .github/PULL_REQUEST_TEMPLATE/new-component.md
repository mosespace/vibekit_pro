---
name: New JB component
about: Add a new component to the VibeKit JB Component Registry
title: "component: Add <Component Name>"
labels: component, contribution
---

## Component info

- **Name:**
- **Slug:** (lowercase, hyphens — becomes `/components/<slug>`)
- **Category:** `auth | marketing | data | commerce | files | content | api | forms`
- **Doc page URL:**
- **Tested on:** (Node version, Next.js version, OS)

## What does it do?

<!-- 2-4 sentences. What problem does it solve? Who is it for? -->

## Schema entry

<!-- Paste your full entry from apps/web/src/lib/components-data.ts -->

```ts
{
  slug: "...",
  name: "...",
  tagline: "...",
  category: "...",
  categoryLabel: "...",
  install: "...",
  blogUrl: "...",
  prerequisites: [...],
  envVars: [...],
  features: [...],
  whenToUse: "...",
  whenNotToUse: "...",
  filesAdded: [...],
}
```

## Checklist

- [ ] Component is production-ready (not a prototype)
- [ ] Install command works end-to-end on a fresh Next.js 16 project
- [ ] All schema fields are filled in — no empty strings
- [ ] `filesAdded` lists every file, route, and schema change the install creates
- [ ] Doc page is publicly accessible
- [ ] Does not duplicate an existing JB component

## How to review

1. Check out this branch
2. `cd apps/web && pnpm install && pnpm dev`
3. Navigate to `/components/<slug>` — verify the detail page renders correctly
4. Run the install command in a fresh Next.js 16 project

## Anything reviewers should know?

<!-- Edge cases, known limitations, related work, anything that affects review -->
