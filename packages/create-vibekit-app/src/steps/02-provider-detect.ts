import { spinner, log } from "@clack/prompts";
import pc from "picocolors";
import { providers, type Provider } from "../providers";

export interface DetectedProvider {
  provider: Provider;
  binary: string | null;
}

export async function detectProviders(): Promise<DetectedProvider[]> {
  const s = spinner();
  s.start("Detecting installed AI providers...");

  const results = await Promise.all(
    providers.map(async (p) => ({
      provider: p,
      binary: await p.findBinary(),
    })),
  );

  s.stop("Provider detection complete.");

  for (const r of results) {
    if (r.binary) {
      log.success(`${pc.bold(r.provider.name)} ${pc.dim(`→ ${r.binary}`)}`);
    } else {
      log.warn(`${pc.bold(r.provider.name)} ${pc.dim("→ not found")}`);
    }
  }

  return results;
}
