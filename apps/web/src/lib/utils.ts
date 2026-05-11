import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const SITE = {
  name: "VibeKit",
  fullName: "VibeKit Framework",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://vibekit.desishub.com",
  tagline: "Ship production apps with Claude Code",
  description:
    "VibeKit is a structured framework for vibe coders building production-grade Next.js apps with Claude Code or any agent — without burning tokens, shipping broken auth, or getting stuck.",
  twitter: "@mosespace",
  github: "https://github.com/mosespace/vibekit_pro",
  upstreamGithub: "https://github.com/MUKE-coder/vibekit",
  community: "https://chat.whatsapp.com/LKQUiM0dExJ60EiBDgoqRq",
  // Fork maintainer
  author: "Moses Kisakye",
  authorUrl: "https://github.com/mosespace",
  authorAvatar: "https://github.com/mosespace.png",
  // Original creator
  originalAuthor: "JB (Muke Johnbaptist) · Desishub Technologies",
  originalAuthorUrl: "https://jb.desishub.com",
  originalAuthorAvatar: "https://avatars.githubusercontent.com/u/64189841?v=4",
} as const;
