import fs from "fs";
import path from "path";
import { confirm, isCancel, cancel, note, log } from "@clack/prompts";
import pc from "picocolors";
import type { Provider } from "../providers";

const PLANNING_FILES = [
  "project-description.md",
  "project-phases.md",
  "design-style-guide.md",
];

// Claude generates "prompt.md"; accept either name
const BUILD_PROMPT_CANDIDATES = ["prompt.md", "plan.md", "final_prompt.md"];

export async function postPlanning(
  dest: string,
  provider: Provider,
): Promise<void> {
  const missing = PLANNING_FILES.filter(
    (f) => !fs.existsSync(path.join(dest, f)),
  );

  if (missing.length > 0) {
    note(
      `These files were not found in ${pc.cyan(dest)}:\n` +
        missing.map((f) => `  ${pc.dim(f)}`).join("\n") +
        "\n\nIf the planning session was cut short, re-run the CLI to try again.",
      pc.yellow("Planning files not detected"),
    );
    return;
  }

  const buildPromptFile = BUILD_PROMPT_CANDIDATES.find((f) =>
    fs.existsSync(path.join(dest, f)),
  );

  if (!buildPromptFile) {
    note(
      `No build prompt file found (looked for: ${BUILD_PROMPT_CANDIDATES.join(", ")}).\n` +
        `Ask ${provider.name} to generate it, or create it manually.`,
      pc.yellow("Build prompt missing"),
    );
    return;
  }

  log.success(
    `Planning files detected: ${pc.green("project-description.md")}, ${pc.green("project-phases.md")}, ${pc.green("design-style-guide.md")}, ${pc.green(buildPromptFile)}`,
  );

  const prismaPath = path.join(dest, "prisma", "schema.prisma");
  if (fs.existsSync(prismaPath)) {
    log.info(
      `Prisma schema detected — after Phase 1 completes, run:\n  ${pc.cyan("pnpm install && pnpm prisma generate")}`,
    );
  }

  const shouldBuild = await confirm({
    message: `${pc.bold("Session 2 — Build")}  Start ${pc.bold(provider.name)} now to build Phase 1?`,
    initialValue: true,
  });

  if (isCancel(shouldBuild)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  if (!shouldBuild) {
    note(
      `cd ${pc.cyan(dest)}\n${pc.cyan(path.basename(provider.binaries[0]))} "${pc.dim(`Read ${buildPromptFile} and begin building Phase 1.`)}"`,
      "Run manually when ready",
    );
    return;
  }

  const binary = await provider.findBinary();
  if (!binary) {
    log.warn(`Cannot find ${provider.name} binary — launch it manually.`);
    return;
  }

  log.info(
    `${pc.bold("Session 2 — Build")}  ${pc.dim(`${provider.name} will read ${buildPromptFile} and start Phase 1.`)}`,
  );

  provider.launch(
    dest,
    binary,
    `Read ${buildPromptFile} and begin building the project. Follow the instructions exactly: read master_prompt.md, design-style-guide.md, jb-components.md, project-description.md, and project-phases.md in order. Then start Phase 1 — Foundation.`,
  );
}
