# Last Build — Ghost Empty-State Refinement
_2026-05-19_

## Summary

Surgical empty-state refinement on the portfolio detail page. Replaced section-level "this section will populate…" placeholder cards with two patterns: **Pattern A** (field sections always render structure with labels + italic muted "Not yet captured" values) and **Pattern B** (list sections render N dashed-border ghost cards mirroring the real card layout). `SectionEmpty` component removed. `FieldMuted` component added. `icpRationale` moved from §01 to §03 exclusively. `npx tsc --noEmit` clean. `npm run build` succeeds (94 pages, 0 errors).

---

## Files modified

```
app/knowledge-base/client-insight/portfolio.module.css
                                 — Ghost utility classes appended:
                                   .fieldMuted (inline italic muted text);
                                   .ghostCard (standalone: dashed border + 55% opacity);
                                   .ghostRow (list rows inside bordered container);
                                   .ghostText (italic muted text override);
                                   .ghostPill (dashed pill badge);
                                   .ghostAvatar (dashed circle avatar);
                                   .ghostDot (dashed small circle dot);
                                   .ghostIconBox (dashed 22×22px rectangle, project icon)

app/knowledge-base/client-insight/portfolio/[accountSlug]/page.tsx
                                 — SectionEmpty component REMOVED;
                                   FieldMuted component added;
                                   §01: icpRationale removed (consolidated to §03);
                                   §03: ghost contact rows (3) when keyContacts empty;
                                         icpRationale added below contact list;
                                   §04: Pattern A — always renders cmiCard,
                                         FieldMuted for missing categorySize/Growth/
                                         marketPosition/keyCompetitors;
                                   §05: Pattern A — always renders audienceCard,
                                         FieldMuted for missing demographic blocks;
                                   §06: Pattern B — ghost listItem rows (3) when
                                         goals/painPoints absent;
                                   §07: Pattern A — always renders solutionBlock,
                                         FieldMuted for missing servicesOverview;
                                   §08: Pattern B — 3 ghost metricCards when metrics absent;
                                         Pattern A — fieldMuted paragraph for missing narrative;
                                   §09: Pattern A for narrative/quotable/uniqueAngles;
                                         Pattern B — 2 ghost timeline items for moments;
                                   §10: Pattern A for creatorProfile fields;
                                         Pattern B — 3 ghost topPerformerCards;
                                   §11: Pattern B — 3 ghost angleCCards;
                                   §12: Pattern B — 3 ghost coPromoRows;
                                   §13: Pattern B — 1 ghost pjCard per brand with 0 projects;
                                         addProjectCard now only shows when project list > 0;
                                   §14: conditional && guard removed — always renders section
```

---

## Empty-state pattern assignments

| Section | Pattern | Ghost count |
|---|---|---|
| §01 Portfolio Profile | A (grid always renders) | — |
| §02 Brand Portfolio | A (cards always render) | — |
| §03 ICP & Persona | B (ghost contact rows) | 3 |
| §04 CMI | A (cmiCard always renders) | — |
| §05 Audience | A (audienceCard always renders) | — |
| §06 The Brief | B (ghost list rows per column) | 3 + 3 |
| §07 Solution | A (solutionBlock always renders) | — |
| §08 Outcomes | B (ghost metric cards) + A (narrative) | 3 |
| §09 Story Capital | A (narrative/quotable/angles) + B (moments) | 2 |
| §10 Creator Match | A (profile fields) + B (top performers) | 3 |
| §11 Content Angles | B (ghost angle cards) | 3 |
| §12 Co-promo | B (ghost co-promo rows) | 3 |
| §13 Projects | B (ghost project card per empty brand) | 1 |
| §14 Reference Index | A (always renders, fieldMuted if empty) | — |

---

## TypeScript

`npx tsc --noEmit` — clean, 0 errors.
`npm run build` — 94 pages, 0 errors.
