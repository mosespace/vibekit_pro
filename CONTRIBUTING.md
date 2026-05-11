# Contributing to create-vibekit-app

Thanks for wanting to help. This is early software there are untested providers, untested operating systems, edge cases in the CLI flow, and plenty of room to improve. **All contributions are welcome.**

This guide covers the main ways you can contribute.

---

> **Before you start:** This repo contains both the `create-vibekit-app` CLI (the thing we're actively building) and the original VibeKit framework docs at the root (the planning prompts, master prompt, guides). The CLI lives in `packages/create-vibekit-app/`. Most contributions will be in there.

---

## Table of contents

1. [Reporting bugs](#reporting-bugs)
2. [Contributing code](#contributing-code)
3. [Adding a new provider](#adding-a-new-provider)
4. [Improving the planning prompts](#improving-the-planning-prompts)
5. [Adding a component to the JB registry](#adding-a-component-to-the-jb-registry)
6. [Code of conduct](#code-of-conduct)

---

## Reporting bugs

If something breaks, open an [issue](https://github.com/mosespace/vibekit_pro/issues/new?template=bug-report.md). Include:

- Your OS and Node version
- Which provider you were using
- The exact command you ran
- What you expected vs what happened
- Any error output

Since this is early and tested on a small number of configurations, **any reproducible bug report is genuinely useful** don't worry about whether the issue is "worth reporting."

---

## Contributing code

### Setup

```bash
git clone https://github.com/mosespace/vibekit_pro.git
cd vibekit
pnpm install
```

The CLI lives at `packages/create-vibekit-app/`. Run it locally with:

```bash
cd packages/create-vibekit-app
pnpm dev my-test-app
```

TypeScript is checked with:

```bash
npx tsc --noEmit
```

### Workflow

1. Fork the repo and create a branch: `git checkout -b fix/your-description`
2. Make your change
3. Run `npx tsc --noEmit` to confirm no type errors
4. Open a PR describe what you changed and why

No tests exist yet. Manual testing against a real provider is sufficient for now.

### What's in scope

- Bug fixes in any of the CLI steps
- UX improvements to the clack terminal flow
- New provider support
- Better auth detection (finding credential file paths on different OSes)
- Windows / macOS / Linux compatibility fixes
- Improvements to the planning prompt templates
- Docs corrections

---

## Adding a new provider

Each provider is a single file in `packages/create-vibekit-app/src/providers/`. Adding one takes about 15 minutes.

### 1. Create the provider file

Add `packages/create-vibekit-app/src/providers/<name>.ts` or just add a `makeProvider({...})` call to `src/providers/index.ts` directly. The provider needs:

- `id` lowercase string identifier
- `name` display name shown in the CLI
- `binaries` array of binary names to search for (e.g. `["claude"]`)
- `promptFile` path inside `templates/planning-prompts/` for this provider
- `contextFile` file the agent auto-reads (e.g. `CLAUDE.md`, `AGENTS.md`, `GEMINI.md`)
- `authHint` message shown to user if auth check fails
- `checkAuth()` returns `Promise<boolean>`, checks env vars or credential files

### 2. Add a planning prompt template

Copy `packages/create-vibekit-app/templates/planning-prompts/claude-code.md` to a new file named after your provider. Change the header line and the `contextFile` reference (`CLAUDE.md` → `AGENTS.md` etc.). The rest of the content is the same.

### 3. Test it

Run `pnpm dev my-test-app` and select your provider. Note anything that doesn't work and document it in the PR.

### 4. Open the PR

Describe which provider you added, what OS you tested on, and anything that's still rough.

---

## Improving the planning prompts

The planning prompts live in `packages/create-vibekit-app/templates/planning-prompts/`. They are based on the original `CLAUDE_PROMPT.md` framework prompt by JB.

If you find that the AI skips the interview, generates incomplete files, misses a tech stack detail, or produces a poor `prompt.md`, the fix is usually in the prompt template.

Changes to the prompts are welcome. Keep the original structure intact the 4-file output, the interview process, the confirmation step before writing and note in your PR what specific behavior you were trying to fix or improve.

The `base.md` file in that folder is the raw, unchanged `CLAUDE_PROMPT.md` from the original framework. Keep it as the source of truth; the provider-specific variants are the ones the CLI actually uses.

---

## Adding a component to the JB registry

The JB Component Registry is JB's original work. Components are listed in `apps/web/src/lib/components-data.ts` and appear at `vibekit.desishub.com/components/<slug>`.

A VibeKit component is **production-ready, self-contained, and reusable** across Next.js projects. It installs with one command and aligns with the standard stack (Next.js 16, TypeScript, Tailwind v4, Prisma v7, shadcn/ui).

### Contribution workflow

1. **Build and host the component** at a public shadcn-compatible registry URL:

   ```bash
   # Verify it works on a fresh project
   pnpm dlx shadcn@latest add https://your-registry.com/r/your-component.json
   ```

2. **Write a doc page** anywhere accessible (your blog, GitHub README, Notion).

3. **Open a PR** with your schema entry appended to `apps/web/src/lib/components-data.ts`:
   ```ts
   {
     slug: "my-component",
     name: "My Component",
     tagline: "One sentence  what it does and who it's for.",
     category: "data", // auth | marketing | data | commerce | files | content | api | forms
     categoryLabel: "Data",
     install: "pnpm dlx shadcn@latest add https://your-registry.com/r/my-component.json",
     blogUrl: "https://your-docs-url.com",
     prerequisites: ["Next.js 16 + shadcn/ui"],
     envVars: [
       { name: "MY_API_KEY", description: "Get from your service dashboard" },
     ],
     features: [
       "What it does (a capability, not marketing)",
       "Another capability",
     ],
     whenToUse: "One sentence.",
     whenNotToUse: "One sentence.",
     filesAdded: [
       "components/my-component.tsx",
       "/api/my-endpoint",
     ],
   }
   ```

### Component checklist

- [ ] Works end-to-end on a fresh Next.js 16 project
- [ ] Schema entry is complete no empty fields
- [ ] `filesAdded` lists every file and route the install creates
- [ ] Doc page exists and is publicly accessible
- [ ] Does not duplicate an existing JB component

---

## Code of conduct

Be direct, be honest, be helpful. No spam. No vague "would be nice if" issues without context. No marketing copy in PR descriptions.

This is a small project. We're not optimizing for a large contributor count we're optimizing for things that actually work and help people ship.

---

## Questions?

Open an issue or start a [Discussion](https://github.com/mosespace/vibekit_pro/discussions).

Thanks for shipping with us.
