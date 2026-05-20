import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  getAllModules,
  getModuleBySlug,
  getServiceLinesByModule,
  getDealUspsByModule,
} from '@/data/services/helpers';
import { getIcpBySlug } from '@/data/icps/helpers';
import { getPersonaBySlug } from '@/data/personas/helpers';
import type { ServiceLine, DemandRole, ServiceStatus } from '@/data/services/types';
import styles from './page.module.css';

/* ── Static params ──────────────────────────────────────── */

export async function generateStaticParams() {
  return getAllModules().map((m) => ({ moduleSlug: m.slug }));
}

/* ── Label maps ─────────────────────────────────────────── */

const DEMAND_LABELS: Record<DemandRole, string> = {
  'demand-creation': 'Demand Creation',
  'demand-conversion': 'Demand Conversion',
  consolidation: 'Consolidation',
};

const DEMAND_CLASS: Record<DemandRole, string> = {
  'demand-creation': styles.demandCreation,
  'demand-conversion': styles.demandConversion,
  consolidation: styles.demandConsolidation,
};

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

export default async function ModuleDetailPage({
  params,
}: {
  params: Promise<{ moduleSlug: string }>;
}) {
  const { moduleSlug } = await params;
  const module = getModuleBySlug(moduleSlug);
  if (!module) notFound();

  const serviceLines = getServiceLinesByModule(moduleSlug);
  const dealUsps = getDealUspsByModule(moduleSlug);
  const icps = module.relevantIcpSlugs.map(getIcpBySlug).filter(Boolean);
  const personas = module.decisionMakerPersonaSlugs.map(getPersonaBySlug).filter(Boolean);

  const bundles = serviceLines.filter(
    (sl): sl is ServiceLine & { composedOf: string[] } =>
      sl.composedOf !== undefined && sl.composedOf.length > 0
  );

  return (
    <div className={styles.page}>

      {/* ── Breadcrumb ── */}
      <p className={styles.breadcrumb}>
        Knowledge Base ›{' '}
        <Link href="/knowledge-base/services" style={{ color: 'inherit', textDecoration: 'none' }}>
          Services
        </Link>{' '}
        › {module.name}
      </p>

      {/* ── Hero ── */}
      <div className={styles.hero}>
        <div className={styles.heroLeft}>
          <p className={styles.heroEyebrow}>
            <span className={styles.pillarChip}>{module.pillarId}</span>
            &nbsp;SERVICE MODULE
          </p>
          <h1 className={styles.heroH1}>{module.name}</h1>
          <p className={styles.heroMeta}>
            {module.slug} · First defined {module.firstDefined}
          </p>
        </div>
        <div className={styles.heroRight}>
          <span className={`${styles.statusPill} ${STATUS_CLASS[module.status]}`}>
            {STATUS_LABELS[module.status]}
          </span>
          <span className={`${styles.demandPill} ${DEMAND_CLASS[module.demandRole]}`}>
            {DEMAND_LABELS[module.demandRole]}
          </span>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className={styles.statsStrip}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{serviceLines.length}</span>
          <span className={styles.statLabel}>Service Lines</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{bundles.length}</span>
          <span className={styles.statLabel}>Bundles</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{icps.length}</span>
          <span className={styles.statLabel}>Relevant ICPs</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{dealUsps.length}</span>
          <span className={styles.statLabel}>Deal USPs</span>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP A · IDENTITY
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP A · IDENTITY" />

      {/* §01 — Module Profile */}
      <div className={styles.section}>
        <SectionHeader num="01" title="MODULE PROFILE" />
        <div className={styles.profileCard}>
          <FieldRow label="MODULE ID">{module.pillarId} — {module.name}</FieldRow>
          <FieldRow label="SLUG">{module.slug}</FieldRow>
          <FieldRow label="DEMAND ROLE">
            <span className={`${styles.demandPill} ${DEMAND_CLASS[module.demandRole]}`}>
              {DEMAND_LABELS[module.demandRole]}
            </span>
          </FieldRow>
          <FieldRow label="STATUS">
            <span className={`${styles.statusPill} ${STATUS_CLASS[module.status]}`}>
              {STATUS_LABELS[module.status]}
            </span>
          </FieldRow>
          <FieldRow label="FIRST DEFINED">{module.firstDefined}</FieldRow>
        </div>
      </div>

      {/* §02 — One-Liner & Core Promise */}
      <div className={styles.section}>
        <SectionHeader num="02" title="ONE-LINER & CORE PROMISE" />
        <div className={styles.profileCard}>
          <FieldRow label="ONE-LINER">
            {module.oneLiner ? module.oneLiner : <Muted />}
          </FieldRow>
          <FieldRow label="CORE PROMISE">
            {module.corePromise ? module.corePromise : <Muted />}
          </FieldRow>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP B · STRATEGIC FRAME
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP B · STRATEGIC FRAME" />

      {/* §03 — Strategic Positioning */}
      <div className={styles.section}>
        <SectionHeader num="03" title="STRATEGIC POSITIONING" />
        {module.strategicPositioning ? (
          <p className={styles.proseParagraph}>{module.strategicPositioning}</p>
        ) : (
          <p className={styles.proseParagraph}><Muted /></p>
        )}
      </div>

      {/* §04 — What It's For */}
      <div className={styles.section}>
        <SectionHeader num="04" title="WHAT IT'S FOR" />
        {module.whatItsFor ? (
          <p className={styles.proseParagraph}>{module.whatItsFor}</p>
        ) : (
          <p className={styles.proseParagraph}><Muted /></p>
        )}
      </div>

      {/* §05 — Audience Pain Points */}
      <div className={styles.section}>
        <SectionHeader num="05" title="AUDIENCE PAIN POINTS" />
        {module.audiencePainPoints ? (
          <p className={styles.proseParagraph}>{module.audiencePainPoints}</p>
        ) : (
          <p className={styles.proseParagraph}><Muted /></p>
        )}
      </div>

      {/* §06 — Differentiators */}
      <div className={styles.section}>
        <SectionHeader num="06" title="DIFFERENTIATORS" />
        {module.differentiators ? (
          <p className={styles.proseParagraph}>{module.differentiators}</p>
        ) : (
          <p className={styles.proseParagraph}><Muted /></p>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP C · SERVICE LINES
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP C · SERVICE LINES" />

      {/* §07 — Service Lines Inside This Module */}
      <div className={styles.section}>
        <SectionHeader num="07" title="SERVICE LINES INSIDE THIS MODULE" />
        {serviceLines.length > 0 ? (
          <div className={styles.lineGrid}>
            {serviceLines.map((sl) => {
              const isBundle = sl.composedOf !== undefined && sl.composedOf.length > 0;
              return (
                <Link
                  key={sl.slug}
                  href={`/knowledge-base/services/lines/${sl.slug}`}
                  className={styles.lineCard}
                >
                  <div className={styles.lineCardTop}>
                    <span className={styles.lineCardEyebrow}>{sl.tierLevel}</span>
                    {isBundle && <span className={styles.bundleBadge}>Bundle</span>}
                  </div>
                  <p className={styles.lineCardName}>{sl.name}</p>
                  {sl.oneLiner && (
                    <p className={styles.lineCardOneLiner}>{sl.oneLiner}</p>
                  )}
                  <div className={styles.lineCardMeta}>
                    <span className={`${styles.statusPill} ${STATUS_CLASS[sl.status]}`}>
                      {STATUS_LABELS[sl.status]}
                    </span>
                    {sl.upsellPosition !== null && sl.upsellPosition !== undefined && (
                      <span className={styles.lineCardEyebrow}>
                        {POSITION_MONTH[sl.upsellPosition]}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <GhostCards count={3} />
        )}
      </div>

      {/* ══════════════════════════════════════════════════════
          GROUP D · BUYERS & CONTEXT
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP D · BUYERS & CONTEXT" />

      {/* §08 — ICPs That Buy This Module */}
      <div className={styles.section}>
        <SectionHeader num="08" title="ICPS THAT BUY THIS MODULE" />
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

      {/* §09 — Decision-Maker Personas */}
      <div className={styles.section}>
        <SectionHeader num="09" title="DECISION-MAKER PERSONAS" />
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

      {/* ══════════════════════════════════════════════════════
          GROUP E · COMMERCIAL TOOLBOX
      ══════════════════════════════════════════════════════ */}
      <GroupDivider label="GROUP E · COMMERCIAL TOOLBOX" />

      {/* §10 — Deal USPs */}
      <div className={styles.section}>
        <SectionHeader num="10" title="DEAL USPS" />
        {dealUsps.length > 0 ? (
          <div className={styles.uspGrid}>
            {dealUsps.map((usp) => (
              <div key={usp.slug} className={styles.uspCard}>
                <span className={styles.uspIcon}>{usp.icon}</span>
                <p className={styles.uspName}>{usp.name}</p>
                <p className={styles.uspFrame}>{usp.commercialFrame}</p>
                <p className={styles.uspWhen}>
                  <span className={styles.uspWhenLabel}>When to deploy:</span>
                  {usp.whenToDeploy}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <GhostCards count={2} />
        )}
      </div>

      {/* §11 — Tone & Style Guide */}
      <div className={styles.section}>
        <SectionHeader num="11" title="TONE & STYLE GUIDE" />
        {module.toneAndStyle ? (
          <p className={styles.proseParagraph}>{module.toneAndStyle}</p>
        ) : (
          <p className={styles.proseParagraph}><Muted /></p>
        )}
      </div>

    </div>
  );
}
