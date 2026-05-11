import path from "path";
import fs from "fs";
import { note, log } from "@clack/prompts";
import pc from "picocolors";
import type { Provider } from "../providers";

const IDEA_PLACEHOLDER =
  "[The user will describe their idea here, or they will type it after Claude Code opens.]";

export async function handoffToAgent(
  provider: Provider,
  dest: string,
  authed: boolean,
  appIdea: string,
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

  // Write to the provider's context file so it's auto-read on launch
  const contextTarget = path.join(dest, provider.contextFile);
  fs.writeFileSync(contextTarget, promptContent, "utf8");
  log.success(
    `Planning prompt written to ${pc.bold(provider.contextFile)} with your app idea.`,
  );

  if (!authed) {
    note(
      `Authenticate first:\n  ${pc.cyan(provider.authHint)}\n\nThen cd into the project and run ${pc.bold(path.basename(provider.binaries[0]))} manually.`,
      pc.yellow("Launch skipped — not authenticated"),
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
    `${pc.bold("Session 1 — Planning")}  ${pc.dim(`${provider.name} will interview you and generate 4 project files.`)}`,
  );
  log.info(
    pc.dim(
      `When planning is complete, close ${provider.name} (Ctrl+C or /exit) to return here and start the build session.`,
    ),
  );

  // Launch session 1 — blocks until the user closes the provider
  provider.launch(
    dest,
    binary,
    "Begin the VibeKit planning session. Read CLAUDE.md for the full instructions. Start by acknowledging the framework and my app idea, then proceed with the interview or generation.",
  );
}
