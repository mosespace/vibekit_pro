# create-vibekit-app

[![npm version](https://img.shields.io/npm/v/create-vibekit-app)](https://www.npmjs.com/package/create-vibekit-app)
[![license](https://img.shields.io/npm/l/create-vibekit-app)](../../LICENSE)
[![node](https://img.shields.io/node/v/create-vibekit-app)](https://nodejs.org)

CLI for scaffolding production Next.js apps using the [VibeKit Framework](https://github.com/MUKE-coder/vibekit).

```bash
npx create-vibekit-app my-app
```

---

## Usage

```bash
# with npx (no install)
npx create-vibekit-app my-app

# with pnpm
pnpm dlx create-vibekit-app my-app

# project name is optional  the CLI will prompt if omitted
npx create-vibekit-app
```

Requires **Node 18+**.

---

## What it does

1. Scaffolds a project folder with VibeKit framework files in `.vibekit/`
2. Asks you to describe your app idea in 1-3 sentences
3. Detects installed AI providers (Claude Code, Codex, Gemini CLI, OpenCode)
4. **Session 1 Planning:** launches your chosen provider with the full VibeKit planning prompt + your idea injected. The provider interviews you and writes 4 project files to disk.
5. **Session 2 Build:** after you close the planning session, the CLI detects the generated files and launches a second provider session that reads `prompt.md` and starts building Phase 1.

---

## Package contents

```
packages/create-vibekit-app/
│
├── src/
│   ├── index.ts                    entry point
│   ├── cli.ts                      argument parsing + main orchestration
│   │
│   ├── steps/
│   │   ├── 00-collect-idea.ts      prompt user for their app idea
│   │   ├── 01-project-setup.ts     scaffold project folder + copy templates
│   │   ├── 02-provider-detect.ts   find installed provider binaries
│   │   ├── 03-provider-select.ts   clack select: pick a provider
│   │   ├── 04-provider-auth.ts     check provider authentication
│   │   ├── 05-agent-handoff.ts     inject idea → write CLAUDE.md → launch session 1
│   │   └── 06-post-planning.ts     detect generated files → launch session 2
│   │
│   ├── providers/
│   │   └── index.ts                provider registry (Claude, Codex, Gemini, OpenCode)
│   │
│   ├── generator/
│   │   └── index.ts                copies templates → .vibekit/, writes .gitignore
│   │
│   └── utils/
│       └── detect-binary.ts        which/where wrapper for finding CLI binaries
│
├── templates/                      bundled into the npm package, copied to every new project
│   ├── master_prompt.md            tech stack rules + Prisma v7 patterns
│   ├── jb-components.md            JB component registry reference
│   ├── pre-deploy-review.md        pre-deploy audit checklist
│   ├── env.example                 base .env.example (copied to project root)
│   ├── database-guide.md           Neon + Prisma reference
│   ├── deployment.md               Vercel, Cloudflare, DNS
│   ├── environment-variables.md    env var setup guide
│   ├── monetization-guide.md       Stripe, webhooks, billing
│   ├── prompt-engineering.md       prompting techniques + rescue protocols
│   ├── troubleshooting.md          symptom → fix playbook
│   └── planning-prompts/           provider-specific planning prompts (CLI-internal)
│       ├── base.md                 raw CLAUDE_PROMPT.md (source of truth)
│       ├── claude-code.md          adapted for Claude Code / CLAUDE.md
│       ├── codex.md                adapted for Codex / AGENTS.md
│       ├── gemini.md               adapted for Gemini CLI / GEMINI.md
│       └── opencode.md             adapted for OpenCode / OPENCODE.md
│
├── dist/                           compiled output (git-ignored, built on publish)
├── package.json
└── tsconfig.json
```

---

## Local development

### Prerequisites

- Node 18+
- pnpm 10+

### Setup

```bash
# from the monorepo root
git clone https://github.com/mosespace/vibekit_pro.git
cd vibekit
pnpm install
```

### Running locally

```bash
cd packages/create-vibekit-app

# run against a test project (uses ts-node, no build needed)
pnpm dev my-test-app

# or from the monorepo root
pnpm --filter create-vibekit-app dev my-test-app
```

### Type checking

```bash
# inside the package
npx tsc --noEmit

# from monorepo root
pnpm --filter create-vibekit-app exec npx tsc --noEmit
```

### Building

```bash
pnpm build
# compiles src/ → dist/
```

The `prepublishOnly` script runs `pnpm build` automatically before `npm publish`.

---

## Adding a provider

Each provider is registered in [`src/providers/index.ts`](src/providers/index.ts). To add one:

**1. Add a `makeProvider` entry:**

```ts
makeProvider({
  id: "myprovider",
  name: "My Provider",
  binaries: ["myprovider"],           // binary names to search for
  promptFile: "planning-prompts/myprovider.md",
  contextFile: "MYPROVIDER.md",       // file the agent auto-reads
  authHint: "Set MY_API_KEY env var.",
  async checkAuth() {
    return Boolean(process.env["MY_API_KEY"]);
  },
}),
```

**2. Add a planning prompt template:**

Copy `templates/planning-prompts/claude-code.md` to `templates/planning-prompts/myprovider.md`. Change the title line and the `contextFile` reference (`CLAUDE.md` → `MYPROVIDER.md`).

**3. Test it:**

```bash
pnpm dev my-test-app
# select your provider and walk through the full flow
```

**4. Open a PR** describing which provider, what OS you tested on, and any rough edges.

---

## Syncing framework files

The files in `templates/` are bundled copies of the root-level VibeKit framework docs. When the root docs change (e.g. `master_prompt.md` is updated), sync them into the templates before publishing:

```bash
# from monorepo root  copy updated framework files into CLI templates
cp master_prompt.md packages/create-vibekit-app/templates/master_prompt.md
cp jb-components.md packages/create-vibekit-app/templates/jb-components.md
cp pre-deploy-review.md packages/create-vibekit-app/templates/pre-deploy-review.md
cp prompt-engineering.md packages/create-vibekit-app/templates/prompt-engineering.md
cp troubleshooting.md packages/create-vibekit-app/templates/troubleshooting.md
cp database-guide.md packages/create-vibekit-app/templates/database-guide.md
cp deployment.md packages/create-vibekit-app/templates/deployment.md
cp environment-variables.md packages/create-vibekit-app/templates/environment-variables.md
cp monetization-guide.md packages/create-vibekit-app/templates/monetization-guide.md
```

> The root files are the source of truth. The `templates/` copies are the distribution. Always edit the root, then sync.

---

## Publishing

```bash
cd packages/create-vibekit-app

# preview what will be included in the package
npm pack --dry-run

# publish (builds automatically via prepublishOnly)
npm publish
```

After publishing, push the version tag to GitHub so the release workflow can create a GitHub Release:

```bash
git push origin main --follow-tags
```

The tag created by the publish scripts uses the `create-vibekit-app-v` prefix, so GitHub Actions can match it and publish a release automatically.

### Version bumps

```bash
npm version patch   # bug fix:      1.0.0 → 1.0.1
npm version minor   # new feature:  1.0.0 → 1.1.0
npm version major   # breaking:     1.0.0 → 2.0.0

npm publish
```

---

## Changelog

### 1.0.0

- Two-session flow: Session 1 (planning) + Session 2 (build)
- App idea collected in terminal before launching any provider
- User idea injected into planning prompt → written to provider context file (`CLAUDE.md` etc.)
- Session 2 auto-detects generated files (`project-description.md`, `project-phases.md`, `design-style-guide.md`, `prompt.md`) and launches build session
- Framework files placed in `.vibekit/` (gitignored) instead of project root
- `.gitignore` written automatically on scaffold
- Provider auth check: credential file detection + env var fallback
- `@clack/prompts` terminal UI throughout
- Provider support: Claude Code (tested), Codex / Gemini CLI / OpenCode (wired, untested)

---

## Known limitations

- Tested on **Windows 11** only. macOS and Linux are untested auth credential paths may differ.
- **Claude Code** is the only provider with verified end-to-end testing.
- Session 2 only starts if all 4 planning files are present. If the planning session is cut short, re-run the CLI.
- No watch mode or incremental rebuild run `pnpm build` manually before testing the compiled output.

---

## Credits

Built on the [VibeKit Framework](https://github.com/MUKE-coder/vibekit) by [JB (Muke Johnbaptist)](https://jb.desishub.com) · [Desishub Technologies](https://desishub.com).

MIT License.
