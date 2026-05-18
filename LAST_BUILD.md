# Last Build — Auth + User Management
_2026-05-18_

## Summary

Added full authentication, user management, and account settings to the Next.js 16 app. NextAuth v5 (beta) with JWT strategy, Prisma 7 + Neon PostgreSQL, AES-256-GCM encrypted API key storage. `npx tsc --noEmit` — clean, 0 errors.

---

## Stack (non-obvious versions)

| Package | Version | Note |
|---|---|---|
| next-auth | beta.31 | v5 API — `auth()`, `handlers`; no `getServerSession` |
| prisma | 7.8.0 | No `url` in schema; requires driver adapter at runtime |
| @prisma/adapter-pg | current | Required for Prisma 7 direct PG connections |
| tsx | current | Replaces ts-node for ESM-compatible seed |

---

## Database schema

```
User        id, name, email, password (bcrypt/12), role (ADMIN|EDITOR|VIEWER), isActive, createdAt, updatedAt
Session     id, sessionToken, userId → User (cascade), expires
AppSettings id="singleton", anthropicKeyEnc, anthropicKeyIv, anthropicKeyTag, updatedAt, updatedBy
```

Prisma client generated at `lib/generated/prisma/` (not `@prisma/client`).
Connection URL provided via `prisma.config.ts` datasource — schema has no `url` field.

---

## Default credentials

| Email | Password | Role |
|---|---|---|
| admin@ecomobi.com | changeme123 | ADMIN |

New users invited via `/settings/users` get `changeme123` as temporary password.

---

## Encryption (API key at rest)

AES-256-GCM via Node.js `crypto`. `ENCRYPTION_KEY` env var must be a 64-char hex string (32 bytes).
Each call produces independent `iv` + `tag` + `ciphertext`, all stored as hex in `AppSettings`. See `lib/encryption.ts`.

---

## Prisma 7 seed

`npx prisma db seed` reads seed command from `prisma.config.ts` → `migrations.seed: 'tsx prisma/seed.ts'`.
The `prisma.seed` field in `package.json` is ignored by Prisma 7.

---

## Auth flow

- NextAuth v5 Credentials provider, JWT strategy
- `middleware.ts` protects all routes except `/api/auth/**` and static assets
- Login at `app/(auth)/login/`: `position: fixed; inset: 0; z-index: 100` covers root-layout sidebar
- `useSession` in `Sidebar.tsx` drives the user bar and admin-only Settings section

---

## TypeScript fixes

- Removed `declare module 'next-auth/jwt'` — that subpath doesn't exist in v5 beta
- JWT callback: `token.role = user.role as Role | undefined`
- Session callback: `session.user.role = token.role as Role | undefined`
- `isAdmin()` helpers typed as `(session: Session | null): boolean`, importing `Session` from `next-auth`

---

## New files

```
lib/auth.ts
lib/db.ts
lib/encryption.ts
lib/get-api-key.ts
middleware.ts
prisma/schema.prisma
prisma/seed.ts
prisma.config.ts
components/SessionProvider.tsx
app/(auth)/layout.tsx
app/(auth)/login/page.tsx
app/(auth)/login/login.module.css
app/account/page.tsx
app/account/AccountClient.tsx
app/account/ApiKeySection.tsx
app/account/account.module.css
app/settings/users/page.tsx
app/settings/users/UsersClient.tsx
app/settings/users/users.module.css
app/api/auth/[...nextauth]/route.ts
app/api/settings/api-key/route.ts
app/api/settings/api-key/test/route.ts
app/api/settings/users/route.ts
app/api/settings/users/[id]/route.ts
app/api/account/profile/route.ts
app/api/account/password/route.ts
.env.example
LAST_BUILD.md
```

## Modified files

```
app/layout.tsx                  — added SessionProvider wrapper
app/api/foundation-lab/route.ts — switched to getAnthropicKey() from DB
components/Sidebar.tsx          — added useSession, user bar, settings nav (admin only)
package.json                    — added auth/prisma/bcrypt deps + devDeps
```
