import { text, isCancel, cancel, note } from "@clack/prompts";
import pc from "picocolors";

export async function collectIdea(): Promise<string> {
  note(
    "We'll ask a few questions so we can\ngenerate your 4 VibeKit project files.",
    pc.bold("Let's plan your app"),
  );

  const idea = await text({
    message: "Describe your app idea in 1-3 sentences:",
    placeholder:
      "e.g. A school management system where teachers manage students, track attendance, and parents pay fees.",
    validate: (v) =>
      !v.trim() ? "Please describe your app idea before continuing." : undefined,
  });

  if (isCancel(idea)) {
    cancel("Cancelled.");
    process.exit(0);
  }

  return (idea as string).trim();
}
