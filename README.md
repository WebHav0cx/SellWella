# SellWella

Next.js App Router application with TypeScript, Tailwind CSS, and ESLint.

TypeScript uses the stable 6.x line because the current Next.js ESLint tooling does not support TypeScript 7 yet. Commit `package-lock.json` to keep dependency installation reproducible.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000.

Development uses Webpack to avoid the observed Turbopack hot-reload loop that interrupted sidebar navigation. Production builds continue to use the default Next.js bundler.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The overview, products, inventory, customers, orders, payments, and payment links use Next.js routes. Other navigation destinations retain the supplied placeholder screens. Forms use React Hook Form with Zod validation, and notifications use the shared Sonner toaster. Tailwind utilities and non-hex theme tokens preserve the source design colors.

Data is seeded locally and resets on a full reload. Payments and payment links are demos; no backend or payment provider is connected. Axios is installed for future API integration, but the supplied application has no HTTP data requests to migrate.
