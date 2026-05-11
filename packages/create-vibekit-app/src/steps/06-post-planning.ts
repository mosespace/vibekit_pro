import fs from "fs";
import path from "path";
import { log } from "@clack/prompts";
import pc from "picocolors";

export async function postPlanning(dest: string): Promise<void> {
  const prismaPath = path.join(dest, "prisma", "schema.prisma");
  if (fs.existsSync(prismaPath)) {
    log.info(
      `Prisma schema detected — after the agent runs, execute:\n  ${pc.cyan("pnpm install && pnpm prisma generate")}`,
    );
  }
}
