# Services Build Arc — Pre-Implementation Review
_Generated: 2026-05-20_

This report covers the review of the **Services Build Arc Prompt 1 of 5** guide against the
current codebase state. Use this when asking Claude to consolidate or revise the guide.

---

## Summary

The guide is structurally sound and safe to implement with two **blocking decisions** that must
be made before Prompt 2 (seed content) and one **non-blocking cleanup action** that should be
added to the guide. Everything else is clear and ready to build.

| # | Severity | Type | Action needed |
|---|---|---|---|
| C-1 | 🔴 Non-blocking for P1, blocking for P3 | Dead file collision risk | Note `data/services.ts` deletion in Prompt 3 |
| C-2 | 🔴 Blocking for P2 | Ambiguous scope | Decide P7 fate before seeding |
| C-3 | 🟡 Blocking for P5 | Ambiguous migration strategy | Decide ICP cross-link type before P5 |
| C-4 | 🟢 Informational | Naming awareness | No action, just note for future |

---

## C-1 — `data/services.ts` flat file already exists

### What the guide assumes
Prompt 1 creates `data/services/` as a **folder** containing `types.ts`, `modules.ts`,
`service-lines.ts`, `deal-usps.ts`, and `helpers.ts`.

### What currently exists in the codebase
A flat file at `data/services.ts` already exists with this content:

```ts
// data/services.ts
import type { ServiceId, ClientCategory } from './types';

export const SERVICES: Record<ServiceId, string> = {
  p1: 'Livestream Commerce',
  p2: 'UGC & Content Production',
  p3: 'TikTok Shop Partner',
  p4: 'Performance Media',
  p5: 'Affiliate & Creator Network',
  p6: 'Technology & Data Platform',
  p7: 'Service Seven',
};

export const SERVICES_SHORT: Record<ServiceId, string> = { ... };
export const CATEGORY_LABELS: Record<ClientCategory, string> = { ... };
```

### Coexistence verdict
On the filesystem and under `moduleResolution: "bundler"` (confirmed in `tsconfig.json`),
a file named `services.ts` and a folder named `services/` can coexist in the same directory —
they resolve differently:

- `@/data/services` → resolves to `data/services.ts` (the flat file)
- `@/data/services/helpers` → resolves to `data/services/helpers.ts` (the folder)

**No TypeScript error will occur.** The guide can be implemented as written.

### Dead code confirmation
`data/services.ts` is **imported by nothing** in the current codebase. The `SERVICES` and
`SERVICES_SHORT` maps are unused. The `CATEGORY_LABELS` used in portfolio pages comes from
`data/portfolio/types.ts`, not this file.

```
# Verified: zero imports of data/services.ts
grep -rn "SERVICES_SHORT\|from.*data/services'" app/ components/ lib/ → (no results)
```

### Recommended guide addition
Add to **Step 6 (Do Not Touch)** of Prompt 1:

> `data/services.ts` — the legacy flat P-code label map. Currently dead code (zero imports).
> Do NOT delete in Prompt 1. It will be explicitly deleted in Prompt 3 alongside the P1–P7
> stub routes as part of the P-code cleanup. Leave it untouched for now.

---

## C-2 — P7 scope is unresolved (7 stubs → 6 modules)

### What the guide says
- **6 Modules** defined (`pillarId: 'P1' through 'P6'`)
- Prompt 3 will "delete old P1–P7 stub routes"
- The `Module` interface has `pillarId: string` documented as `'P1' through 'P6'`

### What currently exists
The stub routes include `p7-service-seven`:
```
app/knowledge-base/services/
  p1-livestream-commerce/     ← maps to proposed P1 module
  p2-ugc-content/             ← maps to proposed P2 module
  p3-tiktok-shop-partner/     ← maps to proposed P3 module
  p4-performance-media/       ← maps to proposed P4 module
  p5-affiliate-creator-network/  ← maps to proposed P5 module
  p6-technology-platform/     ← maps to proposed P6 module
  p7-service-seven/           ← ??? not in the 6-module architecture
  cross-sell-map/
```

### The conflict
The guide deletes the P7 stub in Prompt 3 but never accounts for what P7 becomes.
This is a seed-content decision (Prompt 2) — you cannot seed 6 modules without knowing
whether P7 is absorbed into one of them or fully dropped.

### Decision required before Prompt 2

Choose one:

**Option A — P7 is fully dropped**
P7 (`Service Seven`) is no longer offered. The stub is deleted in Prompt 3 with no
replacement. ICP data referencing P7 (e.g. `{ pCode: 'P7', whyNot: '...' }`) is removed
or reframed in Prompt 5.

**Option B — P7 becomes a ServiceLine inside an existing Module**
P7's capability is absorbed into one of the 6 Modules as a ServiceLine. For example:
"Technology & Data Platform" (P6) absorbs what was called P7. The stub is deleted but
the content lives on inside a Module's `serviceLineSlugs`.

**Option C — P7 is renamed and promoted to its own Module (making it 7 modules)**
If P7 represents a real, distinct offering, the guide's count is wrong and should say
7 modules. The `pillarId` range would be `'P1' through 'P7'`.

> **Impact:** Prompt 2 (seed content) cannot be fully written without this answer.
> Prompt 3 (delete old stubs) is affected. Prompt 5 (ICP cross-link migration) references
> the `{ pCode: 'P7', whyNot: '...' }` field in ICP data that must be resolved.

---

## C-3 — ICP cross-link migration strategy is unspecified for Prompt 5

### What currently exists in ICP data
`data/icps/icps.ts` uses bare P-code strings for service references:

```ts
// Current shape in data/icps/icps.ts
serviceMix: {
  heroServices: ['P1', 'P3'],
  commonAddOns: ['P2', 'P4'],
  rarelySold: [{ pCode: 'P7', whyNot: 'Standalone tech licensing rarely fits...' }],
  typicalSequencing: 'Phase 1 (months 0-3): Land with P1 livestream commerce...',
},
```

`data/icps/types.ts` types these as `string[]` — no compile-time link to service types.

```ts
// data/icps/types.ts line 77–82
serviceMix?: {
  heroServices?: string[];
  commonAddOns?: string[];
  rarelySold?: Array<{ pCode: string; whyNot: string }>;
  typicalSequencing?: string;
};
```

### The guide's Prompt 5 intent
> "cross-link integration into ICP/Persona/Portfolio pages + migrate existing P-code references"

But it doesn't specify **how** the migration works.

### Decision required before Prompt 5

Choose one:

**Option A — Strongly-typed migration (recommended)**
`heroServices`, `commonAddOns`, and `rarelySold.pCode` become `ModuleSlug[]` from the
new `data/services/types.ts`. `data/icps/types.ts` is updated to import and use
`ModuleSlug`. Compile-time safety: a dead slug fails `tsc`.

```ts
// After Option A migration
import type { ModuleSlug } from '@/data/services/types';

serviceMix?: {
  heroServices?: ModuleSlug[];
  commonAddOns?: ModuleSlug[];
  rarelySold?: Array<{ moduleSlug: ModuleSlug; whyNot: string }>;
  typicalSequencing?: string;
};
```

Data becomes: `heroServices: ['livestream-commerce', 'tiktok-shop-partner']`

**Option B — Loose-typed bridge helper**
Leave `data/icps/types.ts` as `string[]`. Add a helper in `data/services/helpers.ts`
that maps legacy P-codes to module slugs (`'P1' → 'livestream-commerce'`). ICP data
keeps the P-code strings; the UI resolves them at render time.

```ts
// Bridge helper (Option B)
export const PCODE_TO_MODULE_SLUG: Record<string, ModuleSlug> = {
  'P1': 'livestream-commerce',
  'P2': 'ugc-content-production',
  ...
};
```

> **Impact:** Option A is cleaner but requires updating both `data/icps/types.ts` AND all
> ICP data entries in Prompt 5. Option B is less invasive but leaves P-code strings as
> technical debt. Option A is recommended given the codebase already uses strict typing
> for cross-links (ICP → Portfolio uses `portfolioSlug: string[]` keyed to actual slugs).

---

## C-4 — `InfluenceLevel` naming awareness (informational, no action needed)

`data/personas/types.ts` already exports:

```ts
export type InfluenceLevel = 'decider' | 'influencer' | 'gate' | 'executor';
```

The new `data/services/types.ts` does not define `InfluenceLevel`, so there is **no
conflict in Prompt 1**. This is a forward-awareness note: if any future prompt adds an
`InfluenceLevel` type to `data/services/types.ts`, it would name-clash on import if both
are used in the same file. Simply name the services one differently if needed
(e.g. `ServiceInfluenceLevel` or `DealInfluence`).

---

## Current codebase state (reference for guide revision)

### Existing routes that Prompt 3 must handle
```
app/knowledge-base/services/page.tsx              ← stub, will be replaced
app/knowledge-base/services/cross-sell-map/       ← stub, fate unspecified in guide
app/knowledge-base/services/p1-livestream-commerce/  ← stub, delete in P3
app/knowledge-base/services/p2-ugc-content/          ← stub, delete in P3
app/knowledge-base/services/p3-tiktok-shop-partner/  ← stub, delete in P3
app/knowledge-base/services/p4-performance-media/    ← stub, delete in P3
app/knowledge-base/services/p5-affiliate-creator-network/  ← stub, delete in P3
app/knowledge-base/services/p6-technology-platform/  ← stub, delete in P3
app/knowledge-base/services/p7-service-seven/        ← stub, fate depends on C-2 decision
```

> **Note on `cross-sell-map/`:** The guide does not mention this route. It currently renders
> a stub. Decide in Prompt 3 whether it (a) becomes a real page powered by the new data
> layer, (b) remains a stub, or (c) is deleted.

### Existing data with P-code references (all must be resolved in Prompt 5)
```
data/icps/icps.ts
  → mnc-global-fmcg: heroServices ['P1','P3'], commonAddOns ['P2','P4'], rarelySold P7
  → regional-d2c-beauty: heroServices ['P3','P1'], commonAddOns ['P2']
  (other ICPs may have additional references — check before Prompt 5)

data/services.ts (flat file, dead code)
  → SERVICES map: p1–p7 label strings
  → SERVICES_SHORT map: p1–p7 short labels
  → Will be deleted in Prompt 3
```

### Build state at time of review
- Last build: **122 pages**, 0 TypeScript errors
- Prompt 1 impact: **0 new routes** → page count should stay at 122 after Prompt 1

---

## Questions to answer and feed back into the guide

Before asking Claude to revise/consolidate the guide, answer these:

1. **[C-2] What happens to P7?**
   - Dropped / Absorbed as a ServiceLine / Promoted to 7th Module?

2. **[C-2] What is the `cross-sell-map` route's fate in Prompt 3?**
   - Real page / Stays as stub / Deleted?

3. **[C-3] How should ICP `serviceMix` fields be migrated in Prompt 5?**
   - Strongly-typed `ModuleSlug[]` (Option A) / Bridge helper keeps P-code strings (Option B)?

4. **[C-1] Confirm: `data/services.ts` (dead flat file) is deleted in Prompt 3?**
   - Yes / No / Move its content somewhere else?

---

## What is confirmed clean and needs no revision

- All 5 file paths in Prompt 1 are correct and don't conflict with existing files
- All type definitions in `types.ts` are internally consistent
- All helper function signatures are correct and safe on empty arrays
- `moduleResolution: "bundler"` handles the `data/services/` folder correctly
- No Prisma schema changes needed for static TS data (matches D-020 pattern)
- `getServiceStats()` shape is appropriate for listing page stats strips
- The `UpsellPosition = 1 | 2 | 3 | 4 | 5 | null` design handles non-sequenced lines correctly
- Step 6 (Do Not Touch) correctly identifies all files to leave untouched in Prompt 1
- Step 7 (Verify) checklist is complete and runnable
- D-021 decision entry is accurate and well-reasoned
- LAST_BUILD.md update template is correct

---

_End of review. Feed the answers to items 1–4 back to Claude along with this file and the
original guide to get the revised, conflict-free version._
