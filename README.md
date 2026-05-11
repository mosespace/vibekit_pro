# VIBEKIT CLI

![VibeKit CLI](/assets/screenshots/vibekit-scafforld.png)

> A CLI that automates the [VibeKit Framework](https://github.com/MUKE-coder/vibekit) workflow — plan your app with an AI agent, generate 4 project files, then build Phase 1 automatically.

**Built on top of the VibeKit Framework by [JB (Muke Johnbaptist)](https://jb.desishub.com) · [Desishub Technologies](https://desishub.com)**

---

> **Alpha software.** This CLI has been tested on a small number of devices (Windows 11) and with Claude Code as the primary provider. Other providers (Codex, Gemini CLI, OpenCode) are wired up but largely untested. Expect rough edges, bugs, and missing polish. Contributions and bug reports are very welcome.

---

## What is this?

The [VibeKit Framework](https://github.com/MUKE-coder/vibekit) is a planning + building system for vibe coders using AI agents to build production Next.js apps. The original workflow is manual:

1. Copy `CLAUDE_PROMPT.md` → paste into Claude.ai → answer questions → download 4 planning files
2. Copy framework files into your project root
3. Open Claude Code → paste `prompt.md` → start building

**`create-vibekit-app` automates all of that** into a single command with two guided sessions:

```
npx create-vibekit-app my-app
```

---

## How it works

```
npx create-vibekit-app my-app
```

**Step 1 — CLI collects your idea**

```
┌  create-vibekit-app
│
◇  Project scaffolded
│
╭─ Let's plan your app ──────────────────────────────────╮
│  We'll ask a few questions so we can generate          │
│  your 4 VibeKit project files.                         │
╰────────────────────────────────────────────────────────╯
│
◇  Describe your app idea in 1-3 sentences:
│  A school management system where teachers manage
│  students and parents can pay fees online.
```

**Step 2 — Pick your provider**

```
◇  Which AI provider should build your project?
│  ● Claude Code
│  ○ Codex (OpenAI)   not installed
│  ○ Gemini CLI       not installed
│  ○ OpenCode         not installed
```

**Step 3 — Session 1: Planning**

Your app idea is injected into the full VibeKit planning prompt and written to `CLAUDE.md`. The provider launches and interviews you about your app:

- Features, data model, user roles
- Integrations (auth, payments, file uploads, email)
- Visual design (brand color, typography, dark mode)

Then it generates **4 project files** directly in your project:

| File                     | Purpose                                                         |
| ------------------------ | --------------------------------------------------------------- |
| `project-description.md` | Complete app spec — features, data model, pages, integrations   |
| `project-phases.md`      | Phase-by-phase build blueprint with checkboxes                  |
| `design-style-guide.md`  | Fully customized design system (colors, typography, components) |
| `prompt.md`              | The build prompt for Session 2                                  |

Close the provider when planning is done.

**Step 4 — Session 2: Build**

The CLI detects the generated files and offers to start the build session:

```
◇  Planning files detected
│
◇  Session 2 — Build. Start Claude Code now?
│  Yes
│
●  Claude Code will read prompt.md and start Phase 1.
```

The provider reads `prompt.md` which instructs it to:

1. Read `.vibekit/master_prompt.md` — tech stack rules, Prisma v7 patterns, coding standards
2. Read `design-style-guide.md` — the custom design system
3. Read `.vibekit/jb-components.md` — JB component registry (use these before building from scratch)
4. Read `project-description.md` + `project-phases.md` — the plan
5. Start Phase 1 — Foundation and stop after each phase for confirmation

---

## Installation

```bash
npx create-vibekit-app my-app

# or with a package manager
pnpm dlx create-vibekit-app my-app
```

Node 18+ required.

---

## What gets created

```
my-app/
├── .vibekit/                        <- gitignored, auto-read by agent
│   ├── master_prompt.md             <- tech stack rules + Prisma v7 patterns
│   ├── jb-components.md             <- JB component registry reference
│   ├── pre-deploy-review.md         <- pre-deploy audit checklist
│   ├── database-guide.md            <- Neon + Prisma reference
│   ├── deployment.md                <- Vercel, Cloudflare, DNS
│   ├── environment-variables.md     <- every env var, step by step
│   ├── monetization-guide.md        <- Stripe, webhooks, billing
│   ├── prompt-engineering.md        <- prompting techniques + rescue protocols
│   └── troubleshooting.md           <- symptom -> fix playbook
│
├── .env.example                     <- base env template
├── .gitignore                       <- includes .vibekit/ and .env.local
└── CLAUDE.md                        <- planning prompt with your idea injected
```

After Session 1 completes, the agent also writes:

```
├── project-description.md
├── project-phases.md
├── design-style-guide.md
└── prompt.md
```

---

## Provider support

| Provider       | Detect | Auth check                             | Tested |
| -------------- | ------ | -------------------------------------- | ------ |
| Claude Code    | Yes    | Credential file + `ANTHROPIC_API_KEY`  | Yes    |
| Codex (OpenAI) | Yes    | `OPENAI_API_KEY`                       | No     |
| Gemini CLI     | Yes    | Credential file + `GOOGLE_API_KEY`     | No     |
| OpenCode       | Yes    | `OPENAI_API_KEY` / `ANTHROPIC_API_KEY` | No     |

If you test on a provider that isn't marked Yes, please open an issue or PR with your findings.

---

## The VibeKit standard stack

Every project built with this framework uses:

| Layer         | Technology                  |
| ------------- | --------------------------- |
| Framework     | Next.js 16 (App Router)     |
| Language      | TypeScript 5.9              |
| Database      | Neon Serverless Postgres    |
| ORM           | Prisma v7                   |
| Auth          | Better Auth                 |
| Data fetching | React Query + Fetch API     |
| Validation    | Zod + React Hook Form       |
| Styling       | Tailwind CSS v4 + shadcn/ui |
| PDF           | @react-pdf/renderer         |
| Excel         | xlsx                        |
| Email         | Resend + React Email        |
| Payments      | Stripe                      |
| File storage  | Cloudflare R2 / UploadThing |
| Deployment    | Vercel + Cloudflare         |
| Components    | JB Component Registry       |

---

## Credits

This CLI is built on top of the **VibeKit Framework** created by [JB (Muke Johnbaptist)](https://jb.desishub.com) of [Desishub Technologies](https://desishub.com).

- Original framework: [github.com/MUKE-coder/vibekit](https://github.com/MUKE-coder/vibekit)
- JB Component Registry: [jb.desishub.com/blog/jb-component-registry-complete-reference](https://jb.desishub.com/blog/jb-component-registry-complete-reference)
- Framework docs site: [vibekit.desishub.com](https://vibekit.desishub.com)

The planning prompts, master prompt, tech stack decisions, design system approach, and JB component registry are all JB's original work. This repo wraps them in a CLI so you don't have to copy-paste anything manually.

---

## Contributing

This is early software. It works, but it has rough edges, untested paths, and provider-specific quirks that haven't been hit yet. Contributions are very welcome.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for the full guide.

Quick ways to help:

- **Found a bug?** [Open an issue](https://github.com/MUKE-coder/vibekit/issues/new?template=bug-report.md)
- **Tested on an unsupported provider or OS?** Open an issue with your findings
- **Fixed something?** Open a PR — no ceremony required for bug fixes
- **New provider support?** Add a file to `packages/create-vibekit-app/src/providers/` and open a PR

---

## License

MIT — use freely, build boldly.

---

_VibeKit Framework by [JB (Muke Johnbaptist)](https://jb.desishub.com) · CLI by the community_
