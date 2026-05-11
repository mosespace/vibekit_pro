import path from "path";
import fs from "fs";
import { intro, outro, text, isCancel, cancel } from "@clack/prompts";
import pc from "picocolors";
import { collectIdea } from "./steps/00-collect-idea";
import { projectSetup } from "./steps/01-project-setup";
import { detectProviders } from "./steps/02-provider-detect";
import { selectProvider } from "./steps/03-provider-select";
import { ensureAuth } from "./steps/04-provider-auth";
import { handoffToAgent } from "./steps/05-agent-handoff";
import { postPlanning } from "./steps/06-post-planning";

export async function run() {
  console.log("");
  intro(pc.bgMagenta(pc.white(" create-vibekit-app ")));

  const argv = process.argv.slice(2);
  let projectName = argv[0]?.trim();

  if (!projectName) {
    const answer = await text({
      message: "What is your project name?",
      placeholder: "my-vibekit-app",
      validate: (v) => (!v.trim() ? "Project name cannot be empty." : undefined),
    });
    if (isCancel(answer)) {
      cancel("Cancelled.");
      process.exit(0);
    }
    projectName = (answer as string).trim();
  }

  const dest = path.resolve(process.cwd(), projectName);
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });

  await projectSetup(dest);

  // Collect the app idea before detecting providers so the UX flows naturally
  const appIdea = await collectIdea();

  const detected = await detectProviders();
  const chosen = await selectProvider(detected);
  const authed = await ensureAuth(chosen);

  // Session 1 — Planning: injects idea into context file, launches provider
  await handoffToAgent(chosen, dest, authed, appIdea);

  // Session 2 — Build: detects generated files, offers to launch the build session
  await postPlanning(dest, chosen);

  outro(pc.green("Done! Your project is ready."));
}
