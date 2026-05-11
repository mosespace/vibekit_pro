import fs from "node:fs";
import path from "node:path";

/**
 * Reads a markdown file from the VibeKit repo root at build time.
 * Tries multiple candidate paths so it works whether build cwd is web/ or the repo root.
 */
export function readPrompt(filename: string): string {
  const candidates = [
    path.resolve(process.cwd(), filename),             // synced into web/ by prebuild
    path.resolve(process.cwd(), "..", filename),       // build run from web/, files at repo root
    path.resolve(process.cwd(), "..", "..", filename), // nested deploy contexts
  ];

  for (const p of candidates) {
    try {
      const content = fs.readFileSync(p, "utf-8");
      if (content) return content;
    } catch {
      // try next candidate
    }
  }

  // Fallback: return a stub so the page builds even if files are missing.
  return `# ${filename}\n\nCould not load this file at build time. View it on GitHub: https://github.com/MUKE-coder/vibekit/blob/main/${filename}`;
}
