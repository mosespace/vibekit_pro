import fs from "fs";
import path from "path";
import { scaffoldMobileApp } from "./mobile-scaffold";
import { scaffoldMonorepo } from "./monorepo-scaffold";

// Folders inside templates/ that are CLI-internal  never copied to the project
const SKIP_DIRS = new Set(["planning-prompts"]);

// Files that stay at the project root (standard project conventions)
const ROOT_FILES = new Set(["env.example"]);

// Hidden folder that holds VibeKit framework files
export const VIBEKIT_DIR = ".vibekit";

export async function copyTemplates(srcRoot: string, destRoot: string) {
  if (!fs.existsSync(srcRoot)) {
    throw new Error(`Templates root not found: ${srcRoot}`);
  }

  const vibkitDest = path.join(destRoot, VIBEKIT_DIR);
  fs.mkdirSync(vibkitDest, { recursive: true });

  const entries = fs.readdirSync(srcRoot, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory() && SKIP_DIRS.has(ent.name)) continue;
    const srcPath = path.join(srcRoot, ent.name);
    if (ent.isDirectory()) {
      copyDirRecursive(srcPath, path.join(vibkitDest, ent.name));
    } else if (ROOT_FILES.has(ent.name)) {
      // .env.example → project root (renamed to standard .env.example)
      fs.copyFileSync(srcPath, path.join(destRoot, ".env.example"));
    } else {
      // All other framework files → .vibekit/
      fs.copyFileSync(srcPath, path.join(vibkitDest, ent.name));
    }
  }

  writeGitignore(destRoot);
}

function copyDirRecursive(src: string, dest: string) {
  fs.mkdirSync(dest, { recursive: true });
  for (const ent of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, ent.name);
    const d = path.join(dest, ent.name);
    ent.isDirectory() ? copyDirRecursive(s, d) : fs.copyFileSync(s, d);
  }
}

function writeGitignore(destRoot: string) {
  const gitignorePath = path.join(destRoot, ".gitignore");
  const entries = [
    "# VibeKit framework files (local only)",
    `${VIBEKIT_DIR}/`,
    "",
    "# Local env  never commit",
    ".env.local",
    ".env*.local",
    "",
    "# Next.js",
    ".next/",
    "out/",
    "",
    "# Dependencies",
    "node_modules/",
  ].join("\n");

  if (fs.existsSync(gitignorePath)) {
    const existing = fs.readFileSync(gitignorePath, "utf8");
    if (!existing.includes(`${VIBEKIT_DIR}/`)) {
      fs.appendFileSync(
        gitignorePath,
        `\n# VibeKit framework files\n${VIBEKIT_DIR}/\n`,
        "utf8",
      );
    }
  } else {
    fs.writeFileSync(gitignorePath, entries, "utf8");
  }
}

// Export platform scaffolders
export { scaffoldMobileApp, scaffoldMonorepo };
