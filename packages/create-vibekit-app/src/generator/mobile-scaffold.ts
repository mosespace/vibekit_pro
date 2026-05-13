import fs from "fs";
import path from "path";

export async function scaffoldMobileApp(dest: string): Promise<void> {
  // Create app.json for Expo
  const appJsonPath = path.join(dest, "app.json");
  fs.writeFileSync(
    appJsonPath,
    JSON.stringify(
      {
        expo: {
          name: "VibeKit Native App",
          slug: "vibekit-app",
          version: "1.0.0",
          scheme: "vibekit",
          web: {
            favicon: "./assets/favicon.png",
          },
          plugins: [
            [
              "expo-router",
              {
                origin: "http://localhost:8081",
              },
            ],
            ["expo-secure-store"],
            ["@sentry/react-native/expo"],
          ],
          ios: {
            bundleIdentifier: "com.vibekit.app",
            supportsTabletMode: true,
            infoPlist: {
              NSFaceIDUsageDescription:
                "We use Face ID to keep your account secure.",
            },
          },
          android: {
            package: "com.vibekit.app",
            permissions: [
              "android.permission.INTERNET",
              "android.permission.CAMERA",
              "android.permission.READ_EXTERNAL_STORAGE",
            ],
          },
          extra: {
            router: {
              origin: "http://localhost:8081",
            },
            apiUrl: process.env.EXPO_PUBLIC_API_URL || "http://localhost:8081",
          },
        },
      },
      null,
      2,
    ),
  );

  // Create eas.json
  const easJsonPath = path.join(dest, "eas.json");
  fs.writeFileSync(
    easJsonPath,
    JSON.stringify(
      {
        cli: {
          version: ">= 13.0.0",
          appVersionSource: "remote",
        },
        build: {
          development: {
            developmentClient: true,
            distribution: "internal",
            ios: {
              simulator: true,
            },
            android: {
              buildType: "apk",
            },
          },
          preview: {
            distribution: "internal",
            ios: {
              simulator: false,
            },
            android: {
              buildType: "apk",
            },
            channel: "preview",
          },
          production: {
            autoIncrement: true,
            channel: "production",
          },
        },
        submit: {
          production: {
            ios: {
              appleId: "you@example.com",
              ascAppId: "123456789",
              appleTeamId: "XXXXXXXXXX",
            },
            android: {
              serviceAccountKeyPath: "./google-play-service-account.json",
            },
          },
        },
      },
      null,
      2,
    ),
  );

  // Create Prisma schema file (referenced by both web and mobile)
  const prismaDir = path.join(dest, "prisma");
  if (!fs.existsSync(prismaDir)) fs.mkdirSync(prismaDir, { recursive: true });

  const schemaPrismaPath = path.join(prismaDir, "schema.prisma");
  fs.writeFileSync(
    schemaPrismaPath,
    `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider        = "prisma-client"
  output          = "../node_modules/.prisma/client"
  previewFeatures = ["driverAdapters"]
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  emailVerified Boolean   @default(false)
  image         String?
  role          String    @default("USER")
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  sessions Session[]
  accounts Account[]
}

model Session {
  id        String   @id
  userId    String
  expiresAt DateTime
  token     String   @unique
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Account {
  id                   String   @id
  userId               String
  accountId            String
  providerId           String
  accessToken          String?
  refreshToken         String?
  idToken              String?
  accessTokenExpiresAt DateTime?
  refreshTokenExpiresAt DateTime?
  scope                String?
  password             String?
  user                 User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
}

model Verification {
  id        String   @id
  identifier String
  value     String
  expiresAt DateTime
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
`,
  );

  // Create directory structure for src/components
  const srcDir = path.join(dest, "src");
  const componentsDir = path.join(srcDir, "components");
  const libDir = path.join(srcDir, "lib");

  for (const dir of [srcDir, componentsDir, libDir]) {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  // Create basic lib/theme.ts for NativeWind
  const themePath = path.join(libDir, "theme.ts");
  fs.writeFileSync(
    themePath,
    `export const colors = {
  bg: "#0A0A0A",
  bgSubtle: "#121212",
  bgElevated: "#1A1A1A",
  bgHover: "#222222",
  textPrimary: "#FFFFFF",
  textSecondary: "#A0A0A0",
  textTertiary: "#666666",
  textInverse: "#0A0A0A",
  border: "#2A2A2A",
  borderStrong: "#333333",
  accent: "#6366F1",
  accentLight: "#1E1B4B",
  accentMuted: "#2D2A5E",
  success: "#22C55E",
  successLight: "#052E16",
  warning: "#F59E0B",
  warningLight: "#451A03",
  error: "#EF4444",
  errorLight: "#450A0A",
  info: "#3B82F6",
  infoLight: "#0C1929",
} as const;
`,
  );

  // Create babel.config.js
  const babelPath = path.join(dest, "babel.config.js");
  fs.writeFileSync(
    babelPath,
    `module.exports = function (api) {
  api.cache(true);
  return {
    presets: [["babel-preset-expo", { jsxImportSource: "nativewind" }], "nativewind/babel"],
  };
};
`,
  );

  // Create metro.config.js
  const metroPath = path.join(dest, "metro.config.js");
  fs.writeFileSync(
    metroPath,
    `const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

module.exports = config;
`,
  );

  // Create tailwind.config.js
  const tailwindPath = path.join(dest, "tailwind.config.js");
  fs.writeFileSync(
    tailwindPath,
    `import { colors } from "./src/lib/theme";

module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        bg: colors.bg,
        bgSubtle: colors.bgSubtle,
        bgElevated: colors.bgElevated,
        bgHover: colors.bgHover,
        textPrimary: colors.textPrimary,
        textSecondary: colors.textSecondary,
        textTertiary: colors.textTertiary,
        textInverse: colors.textInverse,
        border: colors.border,
        borderStrong: colors.borderStrong,
        accent: colors.accent,
        accentLight: colors.accentLight,
        accentMuted: colors.accentMuted,
        success: colors.success,
        successLight: colors.successLight,
        warning: colors.warning,
        warningLight: colors.warningLight,
        error: colors.error,
        errorLight: colors.errorLight,
        info: colors.info,
        infoLight: colors.infoLight,
      },
    },
  },
};
`,
  );

  // Create global.css
  const globalCssPath = path.join(dest, "global.css");
  fs.writeFileSync(
    globalCssPath,
    `@tailwind base;
@tailwind components;
@tailwind utilities;
`,
  );

  // Create .env.example for mobile
  const envExamplePath = path.join(dest, ".env.example");
  fs.writeFileSync(
    envExamplePath,
    `# Database (server-side, NEVER ship to mobile)
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require

# Better Auth (server-side)
BETTER_AUTH_SECRET=your-secret-here
BETTER_AUTH_URL=http://localhost:8081
APP_URL=http://localhost:8081

# Mobile app config (safe to bundle — prefix EXPO_PUBLIC_)
EXPO_PUBLIC_API_URL=http://localhost:8081
EXPO_PUBLIC_APP_SCHEME=vibekit

# OAuth providers (server-side)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
APPLE_CLIENT_ID=your-apple-client-id
APPLE_CLIENT_SECRET=your-apple-client-secret

# Sentry (DSN safe to ship)
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/123456
SENTRY_AUTH_TOKEN=your-sentry-auth-token
`,
  );
}
