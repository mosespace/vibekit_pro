import { spinner, note, log } from "@clack/prompts";
import pc from "picocolors";
import type { Provider } from "../providers";

export async function ensureAuth(provider: Provider): Promise<boolean> {
  const s = spinner();
  s.start(`Checking ${pc.bold(provider.name)} authentication...`);

  const ok = await provider.checkAuth();

  if (ok) {
    s.stop(`${pc.bold(provider.name)} ${pc.green("authenticated")} ✓`);
  } else {
    s.stop(
      `${pc.bold(provider.name)} ${pc.yellow("credentials not detected")}`,
    );
    note(provider.authHint, pc.yellow("Authentication required"));
    log.warn(
      "Continuing anyway  the provider may still work if credentials are loaded in your shell session.",
    );
  }

  return ok;
}
