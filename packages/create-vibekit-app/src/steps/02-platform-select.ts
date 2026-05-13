import { select, isCancel, cancel, note } from "@clack/prompts";
import pc from "picocolors";

export interface PlatformSelection {
  hasWeb: boolean;
  hasMobile: boolean;
  monorepoType?: "root-api" | "monorepo-both"; // Only set if hasMobile && hasWeb
}

export async function selectPlatform(): Promise<PlatformSelection> {
  const options = [
    {
      value: "web",
      label: `${pc.green("●")} ${pc.bold("Web")} ${pc.dim("(Next.js)")}`,
      hint: "SPA with server components",
    },
    {
      value: "mobile",
      label: `${pc.blue("●")} ${pc.bold("Mobile")} ${pc.dim("(Expo)")}`,
      hint: "iOS + Android native",
    },
    {
      value: "both",
      label: `${pc.magenta("●")} ${pc.bold("Both")} ${pc.dim("(Turbo Monorepo)")}`,
      hint: "Connected web + mobile + shared backend",
    },
  ];

  const chosen = await select({
    message: "What would you like to build?",
    options,
    initialValue: "web",
  });

  if (isCancel(chosen)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  if (chosen === "web") {
    return { hasWeb: true, hasMobile: false };
  }

  if (chosen === "mobile") {
    return { hasWeb: false, hasMobile: true };
  }

  if (chosen === "both") {
    // Ask about monorepo structure
    const structureOptions = [
      {
        value: "root-api",
        label: `${pc.green("→")} ${pc.bold("Shared root API")}`,
        hint: "apps/web + apps/mobile + shared app/api/ routes",
      },
      {
        value: "monorepo-both",
        label: `${pc.green("→")} ${pc.bold("Monorepo with packages")}`,
        hint: "apps/web + apps/mobile + packages/ for types/schemas",
      },
    ];

    const structure = await select({
      message: "Which monorepo structure do you prefer?",
      options: structureOptions,
      initialValue: "root-api",
    });

    if (isCancel(structure)) {
      cancel("Cancelled.");
      process.exit(0);
    }

    return {
      hasWeb: true,
      hasMobile: true,
      monorepoType: structure as "root-api" | "monorepo-both",
    };
  }

  cancel("Invalid selection.");
  process.exit(1);
}
