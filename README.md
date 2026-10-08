# SellWella

Next.js App Router application with TypeScript, Tailwind CSS, and ESLint.

TypeScript uses the stable 6.x line because the current Next.js ESLint tooling does not support TypeScript 7 yet. Commit `package-lock.json` to keep dependency installation reproducible.

## Development

```sh
npm install
npm run dev
```

Open http://localhost:3000.

The public landing page is at `/`. The merchant overview is at `/app`; existing workspace routes such as `/products` and `/orders` remain available.

The account flow includes `/signup`, `/login`, `/verify-email`, password recovery, and invitation previews. These are browser-only demonstrations: no authentication or email backend is connected, and passwords are never saved in the demo session. The guided setup is at `/onboarding`, with completion at `/onboarding/complete`.

Development uses Webpack to avoid the observed Turbopack hot-reload loop that interrupted sidebar navigation. Production builds continue to use the default Next.js bundler.

## Checks

```sh
npm run lint
npm run typecheck
npm test
npm run build
```

The overview, products, inventory, customers, orders, payments, inbox, point of sale, activity centre, fulfilment, and storefront management use Next.js routes. Other navigation destinations retain their placeholder screens. Forms use React Hook Form with Zod validation, and notifications use Sonner. All screens use the shared light/dark theme.

The public demo store starts at `/store/aminas-fashion`, with product, cart, checkout, and confirmation pages. Onboarding can configure a different demo slug, business name, and brand colour. Its orders share the merchant catalogue, inventory, customers, activities, and fulfilment workflow through one Zustand store. The merchant sidebar lives in `src/components/common/sidebar.tsx`; public branding reuses the same tilted logo asset as the favicon.

Commerce demo data is validated with Zod before restoring it from browser local storage. It survives full reloads and synchronizes between tabs on the same origin. Cart contents last while navigating within the public store. Payments and payment links remain demos; no backend or payment provider is connected. Axios is installed for future API integration.

Use Node.js 24 or newer for the built-in test runner's TypeScript loading. Tests cover commerce actions, form validation, account metadata, and onboarding validation. To verify a production build with the development bundler, run `npm run build -- --webpack`.
