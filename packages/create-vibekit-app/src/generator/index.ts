import fs from "fs";
import path from "path";

// Folders inside templates/ that are CLI-internal and must NOT be copied to the new project
const SKIP_DIRS = new Set(["planning-prompts"]);

export async function copyTemplates(srcRoot: string, destRoot: string) {
  if (!fs.existsSync(srcRoot)) {
    throw new Error(`Templates root not found: ${srcRoot}`);
  }
  copyDirRecursive(srcRoot, destRoot);
}

function copyDirRecursive(src: string, dest: string) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const ent of entries) {
    if (ent.isDirectory() && SKIP_DIRS.has(ent.name)) continue;
    const srcPath = path.join(src, ent.name);
    const destPath = path.join(dest, ent.name);
    if (ent.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}
