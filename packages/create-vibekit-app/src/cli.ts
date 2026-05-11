import path from "path";
import fs from "fs";
import { intro, outro, text, isCancel, cancel } from "@clack/prompts";
import pc from "picocolors";
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

  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  await projectSetup(dest);

  const detected = await detectProviders();
  const chosen = await selectProvider(detected);
  const authed = await ensureAuth(chosen);
  await handoffToAgent(chosen, dest, authed);
  await postPlanning(dest);

  outro(pc.green("All done! Open the project folder and follow the next steps above."));
}
