import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllServiceLines,
  getServiceLineBySlug,
  getModuleBySlug,
  getBundlesForServiceLine,
  getComponentsForBundle,
} from '@/data/services/helpers';
import { getIcpBySlug } from '@/data/icps/helpers';
import { getPersonaBySlug } from '@/data/personas/helpers';
import type { ServiceStatus } from '@/data/services/types';
import styles from './page.module.css';

/* ── Static params ──────────────────────────────────────── */

export async function generateStaticParams() {
  return getAllServiceLines().map((sl) => ({ lineSlug: sl.slug }));
}

/* ── Label maps ─────────────────────────────────────────── */

const STATUS_LABELS: Record<ServiceStatus, string> = {
  active: 'Active',
  proposed: 'Proposed',
  deprecated: 'Sunset',
};

const STATUS_CLASS: Record<ServiceStatus, string> = {
  active: styles.statusActive,
  proposed: styles.statusProposed,
  deprecated: styles.statusDeprecated,
};

const POSITION_MONTH: Record<number, string> = {
  1: 'Month 1',
  2: 'Month 2',
  3: 'Month 3',
  4: 'Month 4-5',
  5: 'Month 6+',
};

/* ── Mini-components ────────────────────────────────────── */

function GroupDivider({ label }: { label: string }) {
  return (
    <div className={styles.groupDivider}>
      <span className={styles.groupEyebrow}>{label}</span>
      <span className={styles.groupLine} />
    </div>
  );
}

function SectionHeader({ num, title }: { num: string; title: string }) {
  return (
    <div className={styles.sectionHeader}>
      <span className={styles.sectionNum}>{num}</span>
      <div className={styles.sectionTitles}>
        <span className={styles.sectionTitle}>{title}</span>
      </div>
    </div>
  );
}

function FieldRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className={styles.fieldRow}>
      <span className={styles.fieldLabel}>{label}</span>
      <div className={styles.fieldValue}>{children}</div>
    </div>
  );
}

function Muted() {
  return <span className={styles.fieldMuted}>Not yet captured</span>;
}

function GhostCards({ count = 2 }: { count?: number }) {
  return (
    <div className={styles.ghostGrid}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.ghostCard}>
          <div className={`${styles.ghostLine} ${styles.ghostLineShort}`} />
          <div className={`${styles.ghostLine} ${styles.ghostLineLong}`} />
          <div className={`${styles.ghostLine} ${styles.ghostLineMed}`} />
        </div>
      ))}
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────── */

export default async function ServiceLineDetailPage({
  params,
}: {
  params: Promise<{ lineSlug: string }>;
}) {
  const { lineSlug } = await params;
  const line = getServiceLineBySlug(lineSlug);
  if (!line) notFound();

  const isBundle = line.composedOf !== undefined && line.composedOf.length > 0;
  const parentModules = line.moduleSlugs.map(getModuleBySlug).filter(Boolean);
  const bundlesIncluding = getBundlesForServiceLine(lineSlug);
  const componentLines = isBundle ? getComponentsForBundle(lineSlug) : [];
  const icps = line.relevantIcpSlugs.map(getIcpBySlug).filter(Boolean);
  const personas = line.decisionMakerPersonaSlugs.map(getPersonaBySlug).filter(Boolean);

  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ── */}
      <p className={styles.breadcrumb}>
        Knowledge Base ›{' '}
        <Link href="/knowledge-base/services" style={{ color: 'inherit', textDecoration: 'none' }}>
          Services
        </Link>{' '}
        › Service Lines › {line.name}
      </p>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>
            SERVICE LINE
            {isBundle && (
              <span className={styles.bundleBadge}>Bundle</span>
            )}
          </p>
          <h1 className={styles.heroH1}>{line.name}</h1>
          <p className={styles.heroMeta}>
            {line.slug} · {line.tierLevel} · First defined {line.firstDefined}
          </p>
        </div>
        <div className={styles.heroRight}>
          <span className={`${styles.statusPill} ${STATUS_CLASS[line.status]}`}>
            {STATUS_LABELS[line.status]}
          </span>
          {line.upsellPosition !== null && line.upsellPosition !== undefined && (
            <span className={styles.positionBadge}>
              {POSITION_MONTH[line.upsellPosition]}
            </span>
          )}
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={styles.statsStrip}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{parentModules.length}</span>
          <span className={styles.statLabel}>Parent Modules</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{isBundle ? componentLines.length : '—'}</span>
          <span className={styles.statLabel}>Composed Of</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{bundlesIncluding.length}</span>
          <span className={styles.statLabel}>In Bundles</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>
            {line.upsellPosition !== null && line.upsellPosition !== undefined
              ? POSITION_MONTH[line.upsellPosition]
              : '—'}
          </span>
          <span className={styles.statLabel}>Upsell Position</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP A · IDENTITY
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP A · IDENTITY" />

      {/* §01 — Line Profile */}
      <div className={styles.section}>
        <SectionHeader num="01" title="LINE PROFILE" />
        <div className={styles.profileCard}>
          <FieldRow label="NAME">{line.name}</FieldRow>
          <FieldRow label="SLUG">{line.slug}</FieldRow>
          <FieldRow label="TIER">{line.tierLevel}</FieldRow>
          <FieldRow label="STATUS">
            <span className={`${styles.statusPill} ${STATUS_CLASS[line.status]}`}>
              {STATUS_LABELS[line.status]}
            </span>
          </FieldRow>
          <FieldRow label="UPSELL POSITION">
            {line.upsellPosition !== null && line.upsellPosition !== undefined
              ? POSITION_MONTH[line.upsellPosition]
              : <Muted />}
          </FieldRow>
          <FieldRow label="PARENT MODULES">
            <div className={styles.modulePillRow}>
              {parentModules.map((m) => (
                <Link
                  key={m!.slug}
                  href={`/knowledge-base/services/${m!.slug}`}
                  className={styles.modulePill}
                >
                  <span className={styles.modulePillId}>{m!.pillarId}</span>
                  <span className={styles.modulePillName}>{m!.name}</span>
                </Link>
              ))}
            </div>
          </FieldRow>
          <FieldRow label="FIRST DEFINED">{line.firstDefined}</FieldRow>
        </div>
      </div>

      {/* §02 — One-Liner */}
      <div className={styles.section}>
        <SectionHeader num="02" title="ONE-LINER" />
        <div className={styles.profileCard}>
          <FieldRow label="ONE-LINER">
            {line.oneLiner ? line.oneLiner : <Muted />}
          </FieldRow>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP B · OPERATIONAL DOSSIER
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP B · OPERATIONAL DOSSIER" />

      {/* §03 — Pricing Model */}
      <div className={styles.section}>
        <SectionHeader num="03" title="PRICING MODEL" />
        <div className={styles.profileCard}>
          <FieldRow label="PRICING MODEL">
            {line.pricingModel ? line.pricingModel : <Muted />}
          </FieldRow>
        </div>
      </div>

      {/* §04 — What Each Side Provides */}
      <div className={styles.section}>
        <SectionHeader num="04" title="WHAT EACH SIDE PROVIDES" />
        <div className={styles.twoCol}>
          <div className={styles.colCard}>
            <p className={styles.colCardLabel}>Ecomobi provides</p>
            <p className={styles.colCardBody}>
              {line.ecomobiProvides ? line.ecomobiProvides : (
                <span className={styles.fieldMuted}>Not yet captured</span>
              )}
            </p>
          </div>
          <div className={styles.colCard}>
            <p className={styles.colCardLabel}>Brand provides</p>
            <p className={styles.colCardBody}>
              {line.brandProvides ? line.brandProvides : (
                <span className={styles.fieldMuted}>Not yet captured</span>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* §05 — Best For & Success Criteria */}
      <div className={styles.section}>
        <SectionHeader num="05" title="BEST FOR & SUCCESS CRITERIA" />
        <div className={styles.profileCard}>
          <FieldRow label="BEST FOR">
            {line.bestFor ? line.bestFor : <Muted />}
          </FieldRow>
          <FieldRow label="SUCCESS CRITERIA">
            {line.successCriteria ? line.successCriteria : <Muted />}
          </FieldRow>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP C · BUNDLE COMPOSITION (bundles only)
      ══════════════════════════════════════════════════════ */}
      {isBundle && (
        <>
          <GroupDivider label="GROUP C · BUNDLE COMPOSITION" />

          {/* §06 — Composed Of */}
          <div className={styles.section}>
            <SectionHeader num="06" title="COMPOSED OF" />
            <div className={styles.bundleGrid}>
              {componentLines.map((comp) => (
                <Link
                  key={comp.slug}
                  href={`/knowledge-base/services/lines/${comp.slug}`}
                  className={styles.bundleItem}
                >
                  <p className={styles.bundleItemEyebrow}>{comp.tierLevel}</p>
                  <p className={styles.bundleItemName}>{comp.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ══════════════════════════════════════════════════════
          GROUP D · CONTEXT & ADD-ONS
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label={isBundle ? 'GROUP D · CONTEXT & ADD-ONS' : 'GROUP C · CONTEXT & ADD-ONS'} />

      {/* §07/08 — Service Add-ons */}
      <div className={styles.section}>
        <SectionHeader num={isBundle ? '07' : '06'} title="SERVICE ADD-ONS" />
        {line.addOns.length > 0 ? (
          <div className={styles.bundleGrid}>
            {line.addOns.map((addOnSlug) => {
              const addOnLine = getAllServiceLines().find((sl) => sl.slug === addOnSlug);
              if (!addOnLine) return null;
              return (
                <Link
                  key={addOnSlug}
                  href={`/knowledge-base/services/lines/${addOnSlug}`}
                  className={styles.bundleItem}
                >
                  <p className={styles.bundleItemEyebrow}>{addOnLine.tierLevel}</p>
                  <p className={styles.bundleItemName}>{addOnLine.name}</p>
                </Link>
              );
            })}
          </div>
        ) : (
          <GhostCards count={2} />
        )}
      </div>

      {/* §08/09 — Bundles That Include This Line */}
      <div className={styles.section}>
        <SectionHeader num={isBundle ? '08' : '07'} title="BUNDLES THAT INCLUDE THIS LINE" />
        {bundlesIncluding.length > 0 ? (
          <div className={styles.bundleGrid}>
            {bundlesIncluding.map((bundle) => (
              <Link
                key={bundle.slug}
                href={`/knowledge-base/services/lines/${bundle.slug}`}
                className={styles.bundleItem}
              >
                <p className={styles.bundleItemEyebrow}>Bundle</p>
                <p className={styles.bundleItemName}>{bundle.name}</p>
              </Link>
            ))}
          </div>
        ) : (
          <p className={styles.fieldMuted} style={{ fontSize: 13 }}>Not included in any bundle</p>
        )}
      </div>

      {/* §09/10 — ICPs */}
      <div className={styles.section}>
        <SectionHeader num={isBundle ? '09' : '08'} title="RELEVANT ICPS" />
        {icps.length > 0 ? (
          <div className={styles.entityGrid}>
            {icps.map((icp) => (
              <Link
                key={icp!.slug}
                href={`/knowledge-base/client-insight/icps/${icp!.slug}`}
                className={styles.entityCard}
              >
                <div className={`${styles.entityAvatar} ${styles.entityAvatarIcp}`}>
                  {icp!.shortCode}
                </div>
                <div>
                  <p className={styles.entityName}>{icp!.name}</p>
                  <p className={styles.entityMeta}>Tier {icp!.tier}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <GhostCards count={2} />
        )}
      </div>

      {/* §10/11 — Personas */}
      <div className={styles.section}>
        <SectionHeader num={isBundle ? '10' : '09'} title="DECISION-MAKER PERSONAS" />
        {personas.length > 0 ? (
          <div className={styles.entityGrid}>
            {personas.map((persona) => (
              <Link
                key={persona!.slug}
                href={`/knowledge-base/client-insight/personas/${persona!.slug}`}
                className={styles.entityCard}
              >
                <div className={styles.entityAvatar}>
                  {persona!.shortCode}
                </div>
                <div>
                  <p className={styles.entityName}>{persona!.name}</p>
                  <p className={styles.entityMeta}>{persona!.seniorityLevel}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <GhostCards count={2} />
        )}
      </div>

    </div>
  );
}
