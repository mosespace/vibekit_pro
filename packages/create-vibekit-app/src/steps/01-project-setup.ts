import path from "path";
import { spinner } from "@clack/prompts";
import {
  copyTemplates,
  scaffoldMobileApp,
  scaffoldMonorepo,
} from "../generator";
import type { PlatformSelection } from "./02-platform-select";

export async function projectSetup(
  dest: string,
  platform: PlatformSelection,
): Promise<void> {
  const templatesRoot = path.resolve(__dirname, "..", "..", "templates");
  const s = spinner();
  s.start("Scaffolding project files...");

  // Copy common templates first
  await copyTemplates(templatesRoot, dest);

  // Then scaffold platform-specific files
  if (platform.hasMobile && platform.hasMobile) {
    // Both web and mobile - create monorepo structure
    await scaffoldMonorepo(dest, platform.monorepoType || "monorepo-both");
  } else if (platform.hasMobile) {
    // Mobile only - Expo structure
    await scaffoldMobileApp(dest);
  }
  // Web-only uses default templates from copyTemplates

  s.stop("Project scaffolded.");
}
