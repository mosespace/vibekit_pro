import path from "path";
import fs from "fs";
import { confirm, isCancel, cancel, note, log } from "@clack/prompts";
import pc from "picocolors";
import type { Provider } from "../providers";

export async function handoffToAgent(
  provider: Provider,
  dest: string,
  authed: boolean,
): Promise<void> {
  const templatesRoot = path.resolve(__dirname, "..", "..", "templates");

  // Copy provider planning prompt into the project directory
  const sourcePrompt = path.join(templatesRoot, provider.promptFile);
  const promptDir = path.join(dest, path.dirname(provider.promptFile));
  fs.mkdirSync(promptDir, { recursive: true });

  if (fs.existsSync(sourcePrompt)) {
    const promptTarget = path.join(dest, provider.promptFile);
    fs.copyFileSync(sourcePrompt, promptTarget);

    // Write the planning prompt into the agent's context file (e.g. CLAUDE.md)
    const contextTarget = path.join(dest, provider.contextFile);
    fs.copyFileSync(sourcePrompt, contextTarget);

    log.success(
      `Planning prompt written to ${pc.bold(provider.contextFile)} in your project.`,
    );
  } else {
    log.warn(`Provider prompt template not found at ${sourcePrompt} — skipping.`);
  }

  // Find the binary for launching
  const binary = await provider.findBinary();
  if (!binary) {
    note(
      `Could not find the ${pc.bold(provider.name)} binary.\nInstall it and run it manually in:\n  ${pc.cyan(dest)}`,
      pc.yellow("Manual launch required"),
    );
    return;
  }

  if (!authed) {
    note(
      `Authenticate first:\n  ${pc.cyan(provider.authHint)}\n\nThen run ${pc.bold(provider.name)} inside:\n  ${pc.cyan(dest)}`,
      pc.yellow("Launch skipped — not authenticated"),
    );
    return;
  }

  const shouldLaunch = await confirm({
    message: `Launch ${pc.bold(provider.name)} in the new project now?`,
    initialValue: true,
  });

  if (isCancel(shouldLaunch)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  if (shouldLaunch) {
    log.info(
      `Launching ${pc.bold(provider.name)} in ${pc.cyan(dest)} — the planning prompt is already loaded in ${pc.bold(provider.contextFile)}.`,
    );
    provider.launch(dest, binary);
  } else {
    note(
      `cd ${pc.cyan(dest)}\n${pc.cyan(path.basename(binary))}`,
      "Run manually when ready",
    );
  }
}
