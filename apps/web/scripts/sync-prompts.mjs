#!/usr/bin/env node
// Copies VibeKit prompt files from the repo root into web/ so the build can
// embed them even when deployed from web/ as the project root directory.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const repoRoot = path.resolve(webRoot, "..");

const filesToSync = ["CLAUDE_PROMPT.md", "pre-deploy-review.md"];

let copied = 0;
for (const file of filesToSync) {
  const source = path.join(repoRoot, file);
  const dest = path.join(webRoot, file);
  if (fs.existsSync(source)) {
    fs.copyFileSync(source, dest);
    copied++;
    console.log(`  ✓ synced ${file}`);
  } else {
    console.warn(`  ! missing ${file} at ${source}`);
  }
}

console.log(`Synced ${copied}/${filesToSync.length} prompt file(s) into web/`);
