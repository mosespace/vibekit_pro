import { select, isCancel, cancel, note } from "@clack/prompts";
import pc from "picocolors";
import type { DetectedProvider } from "./02-provider-detect";
import type { Provider } from "../providers";

export async function selectProvider(
  detected: DetectedProvider[],
): Promise<Provider> {
  const available = detected.filter((d) => d.binary !== null);
  const unavailable = detected.filter((d) => d.binary === null);

  if (available.length === 0) {
    note(
      unavailable.map((d) => `  ${pc.bold(d.provider.name)}`).join("\n") +
        "\n\nInstall one of the providers above and re-run.",
      pc.red("No providers found"),
    );
    process.exit(1);
  }

  const options = [
    ...available.map((d) => ({
      value: d.provider.id,
      label: `${pc.green("●")} ${pc.bold(d.provider.name)}`,
      hint: "installed",
    })),
    ...unavailable.map((d) => ({
      value: d.provider.id,
      label: `${pc.dim("○")} ${pc.dim(d.provider.name)}`,
      hint: "not installed",
    })),
  ];

  const chosen = await select({
    message: "Which AI provider should build your project?",
    options,
    initialValue: available[0].provider.id,
  });

  if (isCancel(chosen)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  const match = detected.find((d) => d.provider.id === chosen);
  if (!match) {
    cancel("Invalid selection.");
    process.exit(1);
  }

  if (!match.binary) {
    note(
      `${pc.bold(match.provider.name)} is not installed.\n${match.provider.authHint}`,
      pc.yellow("Provider unavailable"),
    );
    process.exit(1);
  }

  return match.provider;
}
