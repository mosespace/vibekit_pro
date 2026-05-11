export type ComponentCategory =
  | "auth"
  | "marketing"
  | "data"
  | "commerce"
  | "files"
  | "content"
  | "api"
  | "forms";

export type JBComponent = {
  slug: string;
  name: string;
  tagline: string;
  category: ComponentCategory;
  categoryLabel: string;
  install: string;
  blogUrl: string;
  prerequisites?: string[];
  envVars?: { name: string; description: string }[];
  features: string[];
  whenToUse: string;
  whenNotToUse: string;
  filesAdded: string[];
};

export const components: JBComponent[] = [
  {
    slug: "better-auth-ui",
    name: "JB Better Auth UI",
    tagline: "Production-ready authentication — sign-in, sign-up, OAuth, password reset.",
    category: "auth",
    categoryLabel: "Authentication",
    install: "pnpm dlx shadcn@latest add https://better-auth-ui.desishub.com/r/auth-components.json",
    blogUrl: "https://jb.desishub.com/components/jb-better-auth-ui-components",
    prerequisites: ["Next.js 16 + shadcn/ui", "PostgreSQL (Neon / Supabase)", "Resend account"],
    envVars: [
      { name: "BETTER_AUTH_SECRET", description: "Random 32+ char string" },
      { name: "BETTER_AUTH_URL", description: "Full app URL (e.g. http://localhost:3000)" },
      { name: "DATABASE_URL", description: "PostgreSQL connection string" },
      { name: "RESEND_FROM_EMAIL", description: "Verified sender (e.g. noreply@yourdomain.com)" },
      { name: "RESEND_API_KEY", description: "From Resend dashboard" },
      { name: "GOOGLE_CLIENT_ID", description: "Optional — Google OAuth" },
      { name: "GOOGLE_CLIENT_SECRET", description: "Optional — Google OAuth" },
      { name: "GITHUB_CLIENT_ID", description: "Optional — GitHub OAuth" },
      { name: "GITHUB_CLIENT_SECRET", description: "Optional — GitHub OAuth" },
    ],
    features: [
      "8 auth components (SignIn, SignUp, VerifyEmail, ForgetPassword, ResetPassword, ChangePassword, Profile, LogoutButton)",
      "OTP-based email verification and password reset",
      "Includes Prisma schema, validation schemas, API route handlers",
      "OAuth integration with Google and GitHub",
      "Email templates and env var configuration",
    ],
    whenToUse: "Every project that needs authentication. This is the default auth solution.",
    whenNotToUse: "Non-PostgreSQL databases, or projects needing custom auth logic outside this structure.",
    filesAdded: [
      "/auth/sign-in",
      "/auth/sign-up",
      "/auth/verify-email",
      "/auth/forgot-password",
      "/auth/reset-password",
      "/auth/change-password",
      "/auth/profile",
      "/dashboard",
      "/api/auth/[...all]/route.ts",
      "Prisma schema additions",
    ],
  },
  {
    slug: "website-ui",
    name: "Website UI",
    tagline: "Complete Next.js marketing scaffold — landing, pricing, docs, and more.",
    category: "marketing",
    categoryLabel: "Marketing",
    install: "pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/website-ui.json",
    blogUrl: "https://jb.desishub.com/components/website-ui-component",
    prerequisites: ["Initialized Next.js project"],
    features: [
      "10 pre-built pages (home, pricing, docs, changelog, developers, help, contact, hire-expert, 404)",
      "Responsive navbar with dark mode toggle and language switcher",
      "Built-in i18n via next-intl (EN/FR translations)",
      "SEO features: OpenGraph, Twitter cards, sitemap.xml, robots.txt",
      "Auto-installs next-intl, lucide-react, class-variance-authority, clsx, tailwind-merge",
    ],
    whenToUse: "SaaS landing pages, startup websites, portfolios, product docs, agency templates, OSS homepages.",
    whenNotToUse: "Projects needing highly custom layouts from scratch or non-standard content structures.",
    filesAdded: [
      "/, /pricing, /docs, /developers, /help, /contact, /hire-expert, /404",
      "components/navbar.tsx, footer.tsx, structured-data.tsx",
      "config/site.ts, i18n/request.ts",
      "messages/en.json, messages/fr.json",
    ],
  },
  {
    slug: "stripe-ui",
    name: "Stripe UI",
    tagline: "Production-ready Stripe checkout with Payment Element + order management.",
    category: "commerce",
    categoryLabel: "Commerce",
    install: "pnpm dlx shadcn@latest add https://stripe-ui-component.desishub.com/r/stripe-ui-component.json",
    blogUrl: "https://jb.desishub.com/components/stripe-ui-component",
    prerequisites: [
      "shadcn/ui initialized",
      "JB Better Auth UI installed",
      "Zustand Cart installed",
      "PostgreSQL database",
      "Stripe API keys",
    ],
    envVars: [
      { name: "STRIPE_SECRET_KEY", description: "Server-side key (sk_test_ or sk_live_)" },
      { name: "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY", description: "Client-side key (pk_test_ or pk_live_)" },
    ],
    features: [
      "Embedded Stripe Payment Element with multi-method support and 3D Secure",
      "Complete checkout: order summary, shipping, payment processing",
      "Order management with history tracking and verification",
      "Server-side API routes for secure payment intent creation",
      "Responsive product grid integrated with Zustand cart",
    ],
    whenToUse: "E-commerce platforms, SaaS payment systems, digital product stores needing full Stripe checkout flows.",
    whenNotToUse: "Simple donations, subscription-only products (use Stripe subscriptions directly), or markets needing Mobile Money (use DGateway).",
    filesAdded: [
      "/products, /checkout, /order-confirmation, /dashboard/orders, /dashboard/orders/[id]",
      "/api/stripe/create-payment-intent, /api/stripe/verify-payment",
      "Prisma: Category, Product, Order, OrderItem models",
    ],
  },
  {
    slug: "data-table",
    name: "Data Table",
    tagline: "TanStack-powered table with search, sort, pagination, column visibility.",
    category: "data",
    categoryLabel: "Data",
    install: "pnpm dlx shadcn@latest add https://jb.desishub.com/r/data-table.json",
    blogUrl: "https://jb.desishub.com/components/data-table-component",
    prerequisites: ["TanStack React Table", "shadcn/ui"],
    features: [
      "Search and filter table data",
      "Column sorting with directional indicators",
      "Pagination for large datasets",
      "Toggleable column visibility preferences",
      "Row selection functionality",
      "Pre-built column helpers (SortableColumn, DateColumn, ImageColumn, StatusColumn, ActionColumn)",
    ],
    whenToUse: "Any page displaying lists of records (users, orders, products, invoices, contacts). Default table for dashboards.",
    whenNotToUse: "Simple static tables (under 5 rows) or non-interactive data displays.",
    filesAdded: ["data-table.tsx + column helpers (location depends on shadcn install target)"],
  },
  {
    slug: "file-storage",
    name: "File Storage UI",
    tagline: "Drag-drop file uploads with S3 + R2 support, presigned URLs, and management.",
    category: "files",
    categoryLabel: "File storage",
    install: "pnpm dlx shadcn@latest add https://file-storage-registry.vercel.app/r/file-storage.json",
    blogUrl: "https://jb.desishub.com/components/file-storage-ui",
    prerequisites: [
      "Next.js with shadcn/ui",
      "Prisma ORM",
      "AWS S3 OR Cloudflare R2 bucket with credentials",
    ],
    envVars: [
      { name: "DATABASE_URL", description: "Database connection string" },
      { name: "AWS_S3_REGION", description: "Required if using S3" },
      { name: "AWS_S3_BUCKET_NAME", description: "Required if using S3" },
      { name: "AWS_S3_ACCESS_KEY_ID", description: "Required if using S3" },
      { name: "AWS_S3_SECRET_ACCESS_KEY", description: "Required if using S3" },
      { name: "CLOUDFLARE_R2_ACCESS_KEY_ID", description: "Required if using R2" },
      { name: "CLOUDFLARE_R2_SECRET_ACCESS_KEY", description: "Required if using R2" },
      { name: "CLOUDFLARE_R2_ENDPOINT", description: "Required if using R2" },
      { name: "CLOUDFLARE_R2_BUCKET_NAME", description: "Required if using R2" },
      { name: "CLOUDFLARE_R2_PUBLIC_DEV_URL", description: "Required if using R2" },
    ],
    features: [
      "Multi-provider support: AWS S3 and Cloudflare R2",
      "Drag-and-drop uploads with 5 visual variants",
      "Real-time upload progress tracking via XHR",
      "File management (track, list, delete) with presigned URLs",
      "Full TypeScript support with Prisma DB integration",
    ],
    whenToUse: "Apps requiring secure file uploads, multi-cloud storage, or file management dashboards.",
    whenNotToUse: "Local-only storage, or projects choosing UploadThing (use UploadThing SDK directly).",
    filesAdded: [
      "/categories, /file-storage",
      "/api/s3/upload, /api/s3/delete, /api/r2/upload, /api/r2/delete",
      "/api/v1/categories/*, /api/v1/files, /api/v1/files/stats",
      "Components: Dropzone.tsx, ErrorDisplay.tsx + management UI",
      "Prisma: File, StorageProvider, Category models",
    ],
  },
  {
    slug: "mdx-blog",
    name: "MDX Blog",
    tagline: "File-based blog with MDX, syntax highlighting, and full SEO.",
    category: "content",
    categoryLabel: "Content",
    install: "pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/mdx-blog.json",
    blogUrl: "https://jb.desishub.com/components/mdx-blog-component",
    prerequisites: ["Next.js with Tailwind CSS"],
    features: [
      "/blog listing + /blog/[slug] detail pages with prev/next nav",
      "MDX content rendering with rehype-pretty-code syntax highlighting",
      "Copy-to-clipboard on all code blocks",
      "Auto-generated SEO metadata (OpenGraph, Twitter, JSON-LD) per post",
      "3 sample blog posts as reference material",
    ],
    whenToUse: "Developer portfolios, product blogs, docs sites with code examples, teaching platforms.",
    whenNotToUse: "Projects needing comments, user-generated content, auth-gated content, or a CMS dashboard.",
    filesAdded: [
      "/blog, /blog/[slug]",
      "components/mdx.tsx, copy-button.tsx, post-item.tsx",
      "data/blog.ts, types/blog.ts",
      "content/blog/ — 3 sample .mdx files",
    ],
  },
  {
    slug: "scalar-api-docs",
    name: "Scalar API Docs",
    tagline: "Beautiful, interactive API docs deployed in 30 seconds.",
    category: "api",
    categoryLabel: "API",
    install: "pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/scalar-api-docs.json",
    blogUrl: "https://jb.desishub.com/components/scalar-api-docs-component",
    prerequisites: ["Initialized Next.js project"],
    features: [
      "3 REST endpoints (Products, Categories, Users) with GET all + GET by ID",
      "Full OpenAPI 3.0.3 spec with schemas, examples, descriptions",
      "Scalar API Reference UI deployed at /api-docs",
      "Dummy data for immediate testing",
      "Auto-installs @scalar/nextjs-api-reference and openapi-types",
    ],
    whenToUse: "API prototyping, frontend dev with working endpoints, learning REST, hackathons, client demos.",
    whenNotToUse: "Custom auth schemes or non-REST APIs (GraphQL, tRPC).",
    filesAdded: [
      "app/api-docs/route.ts (Scalar UI)",
      "app/api/openapi/route.ts (OpenAPI JSON)",
      "app/api/products/, /categories/, /users/ — list + detail",
      "data/openapi.ts, data/dummy.ts",
    ],
  },
  {
    slug: "dgateway-shop",
    name: "DGateway Shop",
    tagline: "E-commerce + Mobile Money + Stripe — built for African markets.",
    category: "commerce",
    categoryLabel: "Commerce",
    install: "pnpm dlx shadcn@latest add https://ui-components.desishub.com/r/dgateway-shop.json",
    blogUrl: "https://jb.desishub.com/components/dgateway-shop-component",
    prerequisites: ["Next.js App Router", "DGateway account with API credentials"],
    envVars: [
      { name: "DGATEWAY_API_URL", description: "DGateway API endpoint (e.g. https://dgatewayapi.desispay.com)" },
      { name: "DGATEWAY_API_KEY", description: "API auth key from DGateway Dashboard" },
    ],
    features: [
      "Product catalog at /shop with sample products",
      "Cart with persistent localStorage and floating cart drawer",
      "Two payment methods: Mobile Money (UGX) + Stripe (USD)",
      "Real-time payment status polling with success/failure screens",
      "Auto-installs zustand, @stripe/react-stripe-js, @stripe/stripe-js",
    ],
    whenToUse: "African market payments, multi-currency (UGX + USD), marketplaces targeting mobile money users.",
    whenNotToUse: "Complex inventory, subscriptions, or Stripe-only markets (use Stripe UI instead).",
    filesAdded: [
      "/shop, /checkout",
      "/api/checkout (POST), /api/checkout/status (POST)",
      "components/cart-drawer.tsx",
      "lib/dgateway.ts, lib/cart-store.ts",
      "data/shop-products.ts",
    ],
  },
  {
    slug: "searchable-select",
    name: "Searchable Select",
    tagline: "Filterable dropdown with type-to-search and optional descriptions.",
    category: "forms",
    categoryLabel: "Forms",
    install: "pnpm dlx shadcn@latest add https://jb.desishub.com/r/searchable-select.json",
    blogUrl: "https://jb.desishub.com/components/searchable-select-component",
    prerequisites: ["React", "shadcn/ui"],
    features: [
      "Searchable dropdown to filter through options",
      "Clear button to reset selected value",
      "Optional description text per option",
      "Type-to-search and filter available choices",
      "Handles value selection and change callbacks",
    ],
    whenToUse: "Selects with 10+ options or where users benefit from type-to-filter (countries, tags, lookups).",
    whenNotToUse: "Simple 2–3 item selects (use shadcn Select), or multi-select scenarios.",
    filesAdded: ["searchable-select.tsx (location depends on install target)"],
  },
  {
    slug: "zustand-cart",
    name: "Zustand Cart",
    tagline: "Client-side cart with localStorage persistence and drawer UI.",
    category: "commerce",
    categoryLabel: "Commerce",
    install: "pnpm dlx shadcn@latest add https://jb.desishub.com/r/zustand-cart.json",
    blogUrl: "https://jb.desishub.com/components/zustand-cart-component",
    prerequisites: ["React/Next.js with Tailwind", "shadcn/ui Button", "lucide-react"],
    features: [
      "Responsive product grid with images, descriptions, pricing",
      "Cart state with add/remove/quantity adjustment",
      "Floating cart panel with totals and checkout options",
      "Auto-persists cart to localStorage",
      "Reusable sub-components: ProductCard, ProductListing, Cart",
    ],
    whenToUse: "E-commerce sites needing client-side cart management with persistent storage. Install BEFORE Stripe UI.",
    whenNotToUse: "Server-side carts requiring real-time inventory sync or cross-device cart sharing.",
    filesAdded: [
      "use-cart-store.ts (Zustand hook)",
      "product-card.tsx, product-listing.tsx, cart.tsx",
      "zustand-cart.tsx (wrapper)",
      "index.ts (barrel export)",
    ],
  },
];

export const categories: { value: ComponentCategory | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "auth", label: "Auth" },
  { value: "marketing", label: "Marketing" },
  { value: "data", label: "Data" },
  { value: "commerce", label: "Commerce" },
  { value: "files", label: "Files" },
  { value: "content", label: "Content" },
  { value: "api", label: "API" },
  { value: "forms", label: "Forms" },
];

export function getComponentBySlug(slug: string): JBComponent | undefined {
  return components.find((c) => c.slug === slug);
}

export function getAllComponentSlugs(): string[] {
  return components.map((c) => c.slug);
}
