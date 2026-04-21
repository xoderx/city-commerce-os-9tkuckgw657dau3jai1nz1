# City Commerce OS

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/city-commerce-os-explore-st-louis)

A modern full-stack application template powered by Cloudflare Workers, featuring Durable Objects for stateful data management, a React frontend with shadcn/ui, and a responsive design system. This starter kit includes a demo chat application with users, chat boards, and real-time messaging to showcase scalable, edge-deployed architecture.

## Features

- **Serverless Backend**: Cloudflare Workers with Hono routing and automatic API generation.
- **Durable Objects**: Persistent storage for entities like Users and Chats, with indexing for efficient listing.
- **Modern Frontend**: React 18, TypeScript, TanStack Query, and shadcn/ui for accessible, customizable components.
- **Styling**: Tailwind CSS with custom gradients, animations, glassmorphism, and dark mode support.
- **Data Management**: Type-safe APIs shared between frontend and worker, with full CRUD operations.
- **Development Tools**: Hot reload, error reporting, theme toggle, sidebar layout, and sonner toasts.
- **Deployment Ready**: One-command deploy to Cloudflare's global edge network.
- **Responsive & Themed**: Mobile-first design, floating animations, gradients, and professional UI.

## Tech Stack

- **Backend**: Cloudflare Workers, Hono, Durable Objects, TypeScript
- **Frontend**: React 18, TypeScript, Vite, TanStack React Query
- **UI**: shadcn/ui (Radix UI primitives), Tailwind CSS, Lucide icons, Framer Motion
- **State & Forms**: React Hook Form, Zod, Zustand, Immer
- **Utilities**: clsx, Tailwind Merge, date-fns, Sonner, React Router
- **Dev Tools**: Bun, ESLint, TypeScript, Cloudflare Vite Plugin

## Quick Start

### Prerequisites

- [Bun](https://bun.sh/) installed (≥1.0)
- [Cloudflare Account](https://dash.cloudflare.com/sign-up) with Workers enabled
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/install/) (auto-installed via scripts)

### Installation

1. Clone or download the repository.
2. Install dependencies:

   ```bash
   bun install
   ```

3. Generate Cloudflare types (one-time):

   ```bash
   bun run cf-typegen
   ```

### Local Development

Start the development server:

```bash
bun dev
```

- Frontend: http://localhost:3000 (Vite HMR)
- API: http://localhost:8787/api/*
- Durable Objects: Local SQLite simulation

Use `bun run lint` to check code quality.

### Build for Production

```bash
bun run build
```

Preview the built app:

```bash
bun run preview
```

## Usage

### Frontend Customization

- Replace `src/pages/HomePage.tsx` with your app UI.
- Use `AppLayout` from `src/components/layout/AppLayout.tsx` for sidebar layouts.
- Components: All shadcn/ui components are pre-installed (`@/components/ui/*`).
- API Calls: Use `api()` from `@/lib/api-client.ts` for type-safe fetches.

Example API usage:

```tsx
import { api } from '@/lib/api-client';

const users = await api('/api/users');
const newUser = await api('/api/users', {
  method: 'POST',
  body: JSON.stringify({ name: 'John Doe' })
});
```

### Backend Customization

- **Entities**: Extend `IndexedEntity` in `worker/entities.ts` (Users/Chats demo included).
- **Routes**: Add endpoints in `worker/user-routes.ts` (auto-loaded).
- Core utils (`worker/core-utils.ts`) provide `Entity`, `IndexedEntity`, CRUD helpers.

Example entity operations (demo APIs):

```
GET    /api/users              # List users
POST   /api/users              # Create user {name: string}
GET    /api/chats              # List chats
POST   /api/chats/{chatId}/messages  # Send message
DELETE /api/users/{id}         # Delete user
```

### Demo Data

Seed data auto-loads on first request to `/api/users` or `/api/chats`.

## Deployment

Deploy to Cloudflare Workers with one command:

```bash
bun run deploy
```

This builds the frontend, bundles the worker, and deploys via Wrangler.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/xoderx/city-commerce-os-explore-st-louis)

**Post-Deploy**:
- Custom Domain: Update `wrangler.jsonc` and run `bun deploy`.
- Environment Variables: Add via Wrangler dashboard or `wrangler.toml`.
- Durable Objects: Auto-migrated via `wrangler.jsonc`.

## Architecture

```
Frontend (Vite/React) ─── SPA ───> Worker (Hono)
                                ├── API Routes (user-routes.ts)
                                ├── Durable Objects (GlobalDurableObject)
                                └── Entities (IndexedEntity<User>, <Chat>)
```

- **Frontend**: Static assets served via Cloudflare Assets (`assets.run_worker_first`).
- **Backend**: Single Worker handles API + DO storage.
- **Data Flow**: Typed APIs → Entity methods → DO storage (CAS-optimized).

## Contributing

1. Fork and clone.
2. `bun install && bun dev`.
3. Edit files (frontend: `src/`, backend: `worker/`).
4. Test APIs via browser/Postman.
5. Lint: `bun run lint`.
6. PR with clear description.

## Support

- Cloudflare Workers Docs: [developers.cloudflare.com/workers](https://developers.cloudflare.com/workers)
- Issues: Open a GitHub issue.
- Discord: Cloudflare Developers community.

## License

MIT License. See [LICENSE](LICENSE) for details.