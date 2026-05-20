'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Module, DemandRole } from '@/data/services/types';
import styles from '../page.module.css';

const ROLE_OPTIONS: { value: DemandRole | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'demand-creation', label: 'Demand Creation' },
  { value: 'demand-conversion', label: 'Demand Conversion' },
  { value: 'consolidation', label: 'Consolidation' },
];

const DEMAND_ROLE_CLASS: Record<DemandRole, string> = {
  'demand-creation': styles.demandCreation,
  'demand-conversion': styles.demandConversion,
  consolidation: styles.consolidation,
};

const DEMAND_ROLE_LABEL: Record<DemandRole, string> = {
  'demand-creation': 'Demand Creation',
  'demand-conversion': 'Demand Conversion',
  consolidation: 'Consolidation',
};

export default function ModulesTab({ modules }: { modules: Module[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const roleFilter = (searchParams.get('role') as DemandRole | 'all') || 'all';

  function setRole(role: string) {
    const params = new URLSearchParams({ tab: 'modules' });
    if (role !== 'all') params.set('role', role);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filtered =
    roleFilter === 'all' ? modules : modules.filter((m) => m.demandRole === roleFilter);

  return (
    <div>
      <div className={styles.filtersRow}>
        <div className={styles.filterGroup}>
          {ROLE_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.filterChip}${roleFilter === value ? ` ${styles.filterChipActive}` : ''}`}
              onClick={() => setRole(value)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      <div className={styles.cardGrid}>
        {filtered.map((m) => (
          <a
            key={m.slug}
            href={`/knowledge-base/services/${m.slug}`}
            className={styles.card}
          >
            <div className={styles.cardHeader}>
              <div className={styles.cardHeaderLeft}>
                <span className={styles.pillarId}>{m.pillarId}</span>
                <span className={`${styles.demandRolePill} ${DEMAND_ROLE_CLASS[m.demandRole]}`}>
                  {DEMAND_ROLE_LABEL[m.demandRole]}
                </span>
              </div>
              <div className={styles.cardHeaderRight}>
                <span className={styles.statusActive}>Active</span>
              </div>
            </div>
            <p className={styles.cardTitle}>{m.name}</p>
            <p className={styles.cardOneLiner}>{m.oneLiner}</p>
            <div className={styles.cardMeta}>
              <span className={styles.cardMetaItem}>
                {m.serviceLineSlugs.length} Service Lines
              </span>
              <span className={styles.cardMetaItem}>
                <span className={styles.cardMetaLabel}>ICP fit:</span>
                {m.relevantIcpSlugs.length} ICPs
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
