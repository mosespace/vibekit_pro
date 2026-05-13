import fs from "fs";
import path from "path";

export async function scaffoldMonorepo(
  dest: string,
  type: "root-api" | "monorepo-both",
): Promise<void> {
  // Create turbo.json at root
  const turboJsonPath = path.join(dest, "turbo.json");
  fs.writeFileSync(
    turboJsonPath,
    JSON.stringify(
      {
        $schema: "https://turbo.build/schema.json",
        globalDependencies: ["**/.env.local"],
        globalEnv: [
          "DATABASE_URL",
          "BETTER_AUTH_SECRET",
          "BETTER_AUTH_URL",
          "EXPO_PUBLIC_API_URL",
          "EXPO_PUBLIC_APP_SCHEME",
          "GOOGLE_CLIENT_ID",
          "GOOGLE_CLIENT_SECRET",
        ],
        tasks: {
          build: {
            outputs: [".next/**", "dist/**", ".expo/**"],
            cache: false,
          },
          "build:expo": {
            outputs: [".expo/**"],
          },
          dev: {
            cache: false,
            persistent: true,
          },
          type: {
            cache: false,
          },
          lint: {
            cache: false,
          },
          test: {
            cache: false,
          },
        },
      },
      null,
      2,
    ),
  );

  // Create pnpm-workspace.yaml
  const workspacePath = path.join(dest, "pnpm-workspace.yaml");
  fs.writeFileSync(
    workspacePath,
    `packages:
  - "apps/*"
  - "packages/*"
`,
  );

  // Create shared packages directories
  const packagesDir = path.join(dest, "packages");
  if (!fs.existsSync(packagesDir)) {
    fs.mkdirSync(packagesDir, { recursive: true });
  }

  // Create packages/types
  const typesDir = path.join(packagesDir, "types");
  fs.mkdirSync(typesDir, { recursive: true });
  fs.writeFileSync(
    path.join(typesDir, "package.json"),
    JSON.stringify(
      {
        name: "@vibekit/types",
        version: "0.0.1",
        description: "Shared TypeScript types",
        private: true,
        exports: {
          ".": "./src/index.ts",
        },
        typesVersions: {
          "*": {
            "*": ["src/index.ts"],
          },
        },
      },
      null,
      2,
    ),
  );

  const typesSrcDir = path.join(typesDir, "src");
  fs.mkdirSync(typesSrcDir, { recursive: true });
  fs.writeFileSync(
    path.join(typesSrcDir, "index.ts"),
    `export type * from './user';
export type * from './auth';
`,
  );
  fs.writeFileSync(
    path.join(typesSrcDir, "user.ts"),
    `export interface User {
  id: string;
  email: string;
  name: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  createdAt: Date;
  updatedAt: Date;
}
`,
  );
  fs.writeFileSync(
    path.join(typesSrcDir, "auth.ts"),
    `export interface Session {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  role: "USER" | "ADMIN";
}
`,
  );

  // Create packages/schemas
  const schemasDir = path.join(packagesDir, "schemas");
  fs.mkdirSync(schemasDir, { recursive: true });
  fs.writeFileSync(
    path.join(schemasDir, "package.json"),
    JSON.stringify(
      {
        name: "@vibekit/schemas",
        version: "0.0.1",
        description: "Shared Zod schemas for validation",
        private: true,
        dependencies: {
          zod: "^3.22.0",
        },
        exports: {
          ".": "./src/index.ts",
        },
      },
      null,
      2,
    ),
  );

  const schemasSrcDir = path.join(schemasDir, "src");
  fs.mkdirSync(schemasSrcDir, { recursive: true });
  fs.writeFileSync(
    path.join(schemasSrcDir, "index.ts"),
    `export * from './user';
export * from './auth';
`,
  );
  fs.writeFileSync(
    path.join(schemasSrcDir, "user.ts"),
    `import { z } from 'zod';

export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().nullable(),
  image: z.string().nullable(),
  role: z.enum(['USER', 'ADMIN']),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const CreateUserSchema = z.object({
  email: z.string().email(),
  name: z.string().optional(),
  password: z.string().min(8),
});

export type User = z.infer<typeof UserSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;
`,
  );
  fs.writeFileSync(
    path.join(schemasSrcDir, "auth.ts"),
    `import { z } from 'zod';

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const SignUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export type SignIn = z.infer<typeof SignInSchema>;
export type SignUp = z.infer<typeof SignUpSchema>;
`,
  );

  // Create apps directory
  const appsDir = path.join(dest, "apps");
  if (!fs.existsSync(appsDir)) {
    fs.mkdirSync(appsDir, { recursive: true });
  }

  // Create apps/web placeholder
  const webDir = path.join(appsDir, "web");
  fs.mkdirSync(webDir, { recursive: true });
  fs.writeFileSync(
    path.join(webDir, "package.json"),
    JSON.stringify(
      {
        name: "@vibekit/web",
        version: "0.0.1",
        private: true,
        scripts: {
          dev: "next dev",
          build: "next build",
          lint: "next lint",
        },
        dependencies: {
          react: "^19.0.0",
          "react-dom": "^19.0.0",
          next: "^15.0.0",
          "@vibekit/types": "*",
          "@vibekit/schemas": "*",
        },
      },
      null,
      2,
    ),
  );

  // Create apps/mobile placeholder
  const mobileDir = path.join(appsDir, "mobile");
  fs.mkdirSync(mobileDir, { recursive: true });
  fs.writeFileSync(
    path.join(mobileDir, "package.json"),
    JSON.stringify(
      {
        name: "@vibekit/mobile",
        version: "0.0.1",
        private: true,
        main: "expo-router/entry",
        scripts: {
          dev: "expo start",
          build: "eas build",
          submit: "eas submit",
          lint: "eslint .",
        },
        dependencies: {
          react: "^19.0.0",
          "react-native": "^0.83.0",
          expo: "~55.0.0",
          "expo-router": "~4.1.0",
          "@vibekit/types": "*",
          "@vibekit/schemas": "*",
        },
      },
      null,
      2,
    ),
  );

  // Create root .env.example for monorepo
  const rootEnvExamplePath = path.join(dest, ".env.example");
  fs.writeFileSync(
    rootEnvExamplePath,
    `# Shared environment for Turbo monorepo with web + mobile + shared backend

# Database (server-side, NEVER ship to either app)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Better Auth (server-side, shared between web API and Expo API Routes)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:3000
APP_URL=http://localhost:3000

# Web app
NEXT_PUBLIC_API_URL=http://localhost:3000

# Mobile app config (safe to bundle — prefix EXPO_PUBLIC_)
EXPO_PUBLIC_API_URL=http://localhost:8081
EXPO_PUBLIC_APP_SCHEME=vibekit

# OAuth providers (server-side)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Sentry (DSN safe to ship)
SENTRY_AUTH_TOKEN=your-sentry-auth-token
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456
`,
  );

  // Create README.md for monorepo
  const readmePath = path.join(dest, "README.md");
  fs.writeFileSync(
    readmePath,
    `# VibeKit Monorepo - Web + Mobile + Shared Backend

This is a Turbo monorepo containing:

- **apps/web** — Next.js web application
- **apps/mobile** — Expo/React Native mobile app (iOS + Android)
- **packages/types** — Shared TypeScript types
- **packages/schemas** — Shared Zod validation schemas

## Getting Started

\`\`\`bash
pnpm install
pnpm run dev
\`\`\`

This will start:
- Web app on \`http://localhost:3000\`
- Mobile app on \`http://localhost:8081\` (Expo)

## Architecture

### Shared Backend
Both apps call the same API routes. For mobile, these are Expo API Routes (\`app/api/**/+api.ts\`).
For web, consider using Next.js API routes or pointing to a separate backend.

### Database
Single Neon Postgres database with Prisma v7 ORM. Schema is at the repo root in \`prisma/\`.

### Authentication
Better Auth handles both web (session cookies) and mobile (secure token storage via expo-secure-store).

## Development

Start with \`pnpm run dev\` from the root.

Read \`CLAUDE.md\`, \`project-description.md\`, and \`project-phases.md\` in each app for build specifics.
`,
  );
}
