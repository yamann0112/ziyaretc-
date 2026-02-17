# Replit Agent Guide

## Overview

This is a **Visitor Management System** (Güvenlik / Security Panel) built for tracking visitors entering and exiting a facility. The application is a full-stack TypeScript project with a React frontend and Express backend, using PostgreSQL for data storage. All UI text is in Turkish. The system allows security personnel to register visitor entries/exits, search visitor records, and view real-time statistics (total entries, exits, currently inside).

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router) with two main pages: Dashboard (`/`) and Visitors (`/visitors`)
- **State Management**: TanStack React Query for server state (API data fetching, caching, mutations)
- **Forms**: React Hook Form with Zod validation via `@hookform/resolvers`
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives, styled with Tailwind CSS
- **Animations**: Framer Motion for page transitions and component animations
- **Styling**: Tailwind CSS with CSS custom properties for theming (dark theme with gold/amber primary, red accent, black background). Fonts: Outfit for display headings, Inter for body text
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Backend
- **Framework**: Express 5 running on Node.js with TypeScript (executed via `tsx`)
- **API Design**: RESTful JSON API under `/api/` prefix. Routes defined in `server/routes.ts` with shared route definitions in `shared/routes.ts`
- **Key Endpoints**:
  - `GET /api/visitors` - List visitors (with optional `search` and `limit` query params)
  - `GET /api/visitors/:id` - Get specific visitor
  - `POST /api/visitors` - Create visitor entry
  - `PUT /api/visitors/:id` - Update visitor
  - `DELETE /api/visitors/:id` - Delete visitor
  - `POST /api/visitors/:id/exit` - Record visitor exit
  - `GET /api/stats` - Get aggregate statistics (totalEntries, totalExits, currentInside)
- **Validation**: Zod schemas shared between client and server via `shared/` directory. Input validation uses `drizzle-zod` to generate schemas from the database table definition.

### Data Storage
- **Database**: PostgreSQL accessed via `drizzle-orm` with the `node-postgres` driver
- **Schema**: Single `visitors` table defined in `shared/schema.ts` with fields: id (serial), name, surname, company, plate (license plate), entryTime, exitTime, notes, isInside (boolean)
- **Migrations**: Managed by `drizzle-kit` with `db:push` command for schema synchronization
- **Connection**: Uses `DATABASE_URL` environment variable (required)

### Shared Code (`shared/` directory)
- `schema.ts` - Drizzle table definitions, Zod insert schemas, and TypeScript types
- `routes.ts` - API route contract definitions with paths, methods, input schemas, and response schemas. This enables type-safe API usage on both client and server.

### Build & Development
- **Dev**: `npm run dev` runs the Express server with Vite middleware for HMR
- **Build**: `npm run build` runs a custom build script (`script/build.ts`) that builds the client with Vite and bundles the server with esbuild
- **Production**: `npm start` serves the built assets from `dist/`
- **Type checking**: `npm run check` runs TypeScript compiler

### Key Design Decisions
1. **Shared route contracts**: The `shared/routes.ts` file defines API contracts (paths, input/output schemas) used by both frontend hooks and backend handlers, ensuring type safety across the stack.
2. **Database-first schema**: Table schemas are defined with Drizzle and Zod schemas are derived from them using `drizzle-zod`, keeping validation in sync with the database.
3. **Dark theme with gold accents**: The UI uses a custom dark theme designed for security/monitoring contexts with high contrast and clear visual hierarchy.
4. **Turkish locale**: All user-facing text is in Turkish; date formatting uses `date-fns` with the `tr` locale.

## External Dependencies

- **PostgreSQL**: Primary database, connected via `DATABASE_URL` environment variable. Required for the application to start.
- **Google Fonts**: Loads Inter, Outfit, DM Sans, Fira Code, Geist Mono, and Architects Daughter fonts via Google Fonts CDN.
- **Radix UI**: Provides accessible, unstyled UI primitives for all interactive components (dialogs, dropdowns, tooltips, etc.)
- **No authentication**: The application currently has no auth layer — it's designed as an internal tool for security desks.