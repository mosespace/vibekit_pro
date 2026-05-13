import path from "path";
import fs from "fs";
import { note, log } from "@clack/prompts";
import pc from "picocolors";
import type { Provider } from "../providers";
import type { PlatformSelection } from "./02-platform-select";

const IDEA_PLACEHOLDER =
  "[The user will describe their idea here, or they will type it after Claude Code opens.]";

export async function handoffToAgent(
  provider: Provider,
  dest: string,
  authed: boolean,
  appIdea: string,
  platform: PlatformSelection,
): Promise<void> {
  const templatesRoot = path.resolve(__dirname, "..", "..", "templates");
  const sourcePrompt = path.join(templatesRoot, provider.promptFile);

  if (!fs.existsSync(sourcePrompt)) {
    log.warn(`Planning prompt template not found: ${sourcePrompt}`);
    return;
  }

  // Inject the user's app idea into the planning prompt
  let promptContent = fs.readFileSync(sourcePrompt, "utf8");
  promptContent = promptContent.replace(IDEA_PLACEHOLDER, appIdea);

  // Inject platform information
  const platformInfo = `
<!-- Platform Configuration -->
Platform selection: ${platform.hasMobile && platform.hasWeb ? "BOTH (Web + Mobile)" : platform.hasMobile ? "MOBILE ONLY (Expo)" : "WEB ONLY (Next.js)"}
${platform.hasMobile && platform.hasWeb ? `Monorepo type: ${platform.monorepoType}` : ""}
`;
  promptContent = promptContent.replace(
    IDEA_PLACEHOLDER,
    appIdea + platformInfo,
  );

  // Write to the provider's context file so it's auto-read on launch
  const contextTarget = path.join(dest, provider.contextFile);
  fs.writeFileSync(contextTarget, promptContent, "utf8");

  // Write platform-specific master prompt files
  writePlatformPrompts(dest, platform, templatesRoot);

  log.success(
    `Planning prompt written to ${pc.bold(provider.contextFile)} with your app idea and platform config.`,
  );

  if (!authed) {
    note(
      `Authenticate first:\n  ${pc.cyan(provider.authHint)}\n\nThen cd into the project and run ${pc.bold(path.basename(provider.binaries[0]))} manually.`,
      pc.yellow("Launch skipped  not authenticated"),
    );
    return;
  }

  const binary = await provider.findBinary();
  if (!binary) {
    note(
      `Could not find the ${pc.bold(provider.name)} binary.\nInstall it, then run it inside:\n  ${pc.cyan(dest)}`,
      pc.yellow("Manual launch required"),
    );
    return;
  }

  log.info(
    `${pc.bold("Session 1  Planning")}  ${pc.dim(`${provider.name} will interview you and generate 4 project files.`)}`,
  );
  log.info(
    pc.dim(
      `When planning is complete, close ${provider.name} (Ctrl+C or /exit) to return here and start the build session.`,
    ),
  );

  // Launch session 1  blocks until the user closes the provider
  provider.launch(
    dest,
    binary,
    "Begin the VibeKit planning session. Read CLAUDE.md for the full instructions. Start by acknowledging the framework and my app idea, then proceed with the interview or generation.",
  );
}

function writePlatformPrompts(
  dest: string,
  platform: PlatformSelection,
  templatesRoot: string,
): void {
  // Write master_prompt.md based on platform
  let masterPromptContent = "";

  if (platform.hasMobile && platform.hasWeb) {
    // Full-stack master prompt for monorepo
    masterPromptContent = `# VibeKit — Full-Stack Master Prompt (Web + Mobile)

You are building a Turbo monorepo with:
- **apps/web** — Next.js web app
- **apps/mobile** — Expo/React Native mobile (iOS + Android)
- **Shared backend** — Expo API Routes (same origin, called by both apps)
- **Shared database** — Neon Postgres with Prisma v7
- **Shared auth** — Better Auth (web: cookies, mobile: secure storage)

This is a **unified full-stack application**. Code sharing occurs at:
- Prisma schema (root-level)
- Better Auth config
- Zod schemas (packages/schemas)
- API routes (both apps call the same routes)
- TypeScript types (packages/types)

Read the individual tech stack rules below for web and mobile specifics.

[Web stack section from master_prompt.md]
[Mobile stack section from master_prompt.md]
[Expo API Routes section from master_prompt.md]
[Better Auth section from master_prompt.md]
`;
  } else if (platform.hasMobile) {
    // Mobile-only master prompt
    masterPromptContent =
      "# VibeKit Native — Master Prompt\n\nYou are building an **Expo/React Native** mobile app (iOS + Android).\n\n";
    // Read vibekit-native master prompt from templates
    const nativeMasterPath = path.join(
      templatesRoot,
      "vibekit-native-master-prompt.md",
    );
    if (fs.existsSync(nativeMasterPath)) {
      masterPromptContent = fs.readFileSync(nativeMasterPath, "utf8");
    }
  } else {
    // Web-only (existing behavior)
    masterPromptContent =
      "# VibeKit — Master Prompt (Web)\n\nYou are building a **Next.js** web application.\n\n";
  }

  const masterPromptPath = path.join(dest, "master_prompt.md");
  fs.writeFileSync(masterPromptPath, masterPromptContent, "utf8");

  // Write vibekit-native-components.md if mobile
  if (platform.hasMobile) {
    const componentsPath = path.join(
      templatesRoot,
      "vibekit-native-components.md",
    );
    if (fs.existsSync(componentsPath)) {
      const componentsContent = fs.readFileSync(componentsPath, "utf8");
      const destComponentsPath = path.join(
        dest,
        "vibekit-native-components.md",
      );
      fs.writeFileSync(destComponentsPath, componentsContent, "utf8");
    }
  }
}
