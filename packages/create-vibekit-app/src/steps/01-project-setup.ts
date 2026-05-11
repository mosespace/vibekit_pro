import path from "path";
import { spinner } from "@clack/prompts";
import { copyTemplates } from "../generator";

export async function projectSetup(dest: string): Promise<void> {
  const templatesRoot = path.resolve(__dirname, "..", "..", "templates");
  const s = spinner();
  s.start("Scaffolding project files...");
  await copyTemplates(templatesRoot, dest);
  s.stop("Project scaffolded.");
}
