import os from "os";
import fs from "fs";
import path from "path";
import { spawnSync } from "child_process";
import { findBinary } from "../utils/detect-binary";

export interface Provider {
  id: string;
  name: string;
  binaries: string[];
  promptFile: string;
  /** File to inject the planning prompt into (relative to project root) */
  contextFile: string;
  authHint: string;
  findBinary(): Promise<string | null>;
  checkAuth(): Promise<boolean>;
  launch(projectDir: string, binary: string, initialMessage: string): void;
}

function makeProvider(opts: {
  id: string;
  name: string;
  binaries: string[];
  promptFile: string;
  contextFile: string;
  authHint: string;
  checkAuth(): Promise<boolean>;
}): Provider {
  return {
    ...opts,
    async findBinary() {
      for (const b of opts.binaries) {
        const p = await findBinary(b);
        if (p) return p;
      }
      return null;
    },
    launch(projectDir, binary, initialMessage) {
      spawnSync(binary, [initialMessage], {
        cwd: projectDir,
        stdio: "inherit",
        shell: process.platform === "win32",
      });
    },
  };
}

export const providers: Provider[] = [
  makeProvider({
    id: "claude",
    name: "Claude Code",
    binaries: ["claude"],
    promptFile: "planning-prompts/claude-code.md",
    contextFile: "CLAUDE.md",
    authHint:
      "Run `claude` once to authenticate via browser OAuth, or set ANTHROPIC_API_KEY.",
    async checkAuth() {
      if (process.env["ANTHROPIC_API_KEY"]) return true;
      if (process.env["CLAUDE_API_KEY"]) return true;
      const credPaths = [
        path.join(os.homedir(), ".claude", ".credentials.json"),
        path.join(os.homedir(), ".claude", "credentials.json"),
        process.env["APPDATA"]
          ? path.join(process.env["APPDATA"]!, "Claude", "credentials.json")
          : "",
        process.env["LOCALAPPDATA"]
          ? path.join(
              process.env["LOCALAPPDATA"]!,
              "Claude",
              "credentials.json",
            )
          : "",
      ].filter(Boolean);
      return credPaths.some((p) => fs.existsSync(p));
    },
  }),

  makeProvider({
    id: "codex",
    name: "Codex (OpenAI)",
    binaries: ["codex"],
    promptFile: "planning-prompts/codex.md",
    contextFile: "AGENTS.md",
    authHint: "Set the OPENAI_API_KEY environment variable.",
    async checkAuth() {
      return Boolean(process.env["OPENAI_API_KEY"]);
    },
  }),

  makeProvider({
    id: "gemini",
    name: "Gemini CLI",
    binaries: ["gemini"],
    promptFile: "planning-prompts/gemini.md",
    contextFile: "GEMINI.md",
    authHint: "Run `gemini auth login` or set GOOGLE_API_KEY / GEMINI_API_KEY.",
    async checkAuth() {
      if (process.env["GOOGLE_API_KEY"]) return true;
      if (process.env["GEMINI_API_KEY"]) return true;
      return fs.existsSync(path.join(os.homedir(), ".gemini", "credentials.json"));
    },
  }),

  makeProvider({
    id: "opencode",
    name: "OpenCode",
    binaries: ["opencode"],
    promptFile: "planning-prompts/opencode.md",
    contextFile: "OPENCODE.md",
    authHint: "Set OPENAI_API_KEY or ANTHROPIC_API_KEY for OpenCode.",
    async checkAuth() {
      return (
        Boolean(process.env["OPENAI_API_KEY"]) ||
        Boolean(process.env["ANTHROPIC_API_KEY"])
      );
    },
  }),
];
