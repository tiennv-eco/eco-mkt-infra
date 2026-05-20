'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { Module, ServiceLine, ServiceStatus } from '@/data/services/types';
import styles from '../page.module.css';

const STATUS_OPTIONS: { value: ServiceStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'proposed', label: 'Proposed' },
  { value: 'deprecated', label: 'Sunset' },
];

const STATUS_CLASS: Record<ServiceStatus, string> = {
  active: styles.statusActive,
  proposed: styles.statusProposed,
  deprecated: styles.statusSunset,
};

const STATUS_LABEL: Record<ServiceStatus, string> = {
  active: 'Active',
  proposed: 'Proposed',
  deprecated: 'Sunset',
};

const POSITION_MONTH: Record<number, string> = {
  1: 'Month 1',
  2: 'Month 2',
  3: 'Month 3',
  4: 'Month 4-5',
  5: 'Month 6+',
};

type SortOption = 'module' | 'tier' | 'name';

interface Props {
  serviceLines: ServiceLine[];
  modules: Module[];
}

export default function ServiceLinesTab({ serviceLines, modules }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const moduleFilter = searchParams.get('module') || 'all';
  const statusFilter = (searchParams.get('status') as ServiceStatus | 'all') || 'all';
  const sort = (searchParams.get('sort') as SortOption) || 'module';

  function updateParams(updates: Record<string, string>) {
    const params = new URLSearchParams({ tab: 'service-lines' });
    if (moduleFilter !== 'all') params.set('module', moduleFilter);
    if (statusFilter !== 'all') params.set('status', statusFilter);
    if (sort !== 'module') params.set('sort', sort);
    Object.entries(updates).forEach(([k, v]) => {
      if (v === 'all' || v === 'module') params.delete(k);
      else params.set(k, v);
    });
    router.push(`${pathname}?${params.toString()}`);
  }

  let filtered = serviceLines;
  if (moduleFilter !== 'all') {
    filtered = filtered.filter((sl) => sl.moduleSlugs.includes(moduleFilter as never));
  }
  if (statusFilter !== 'all') {
    filtered = filtered.filter((sl) => sl.status === statusFilter);
  }

  if (sort === 'name') {
    filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
  } else if (sort === 'tier') {
    filtered = [...filtered].sort((a, b) => a.tierLevel.localeCompare(b.tierLevel));
  }

  function getModule(slug: string): Module | undefined {
    return modules.find((m) => m.slug === slug);
  }

  return (
    <div>
      <div className={styles.filtersRow}>
        <select
          className={styles.filterDropdown}
          value={moduleFilter}
          onChange={(e) => updateParams({ module: e.target.value })}
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.pillarId} · {m.name}
            </option>
          ))}
        </select>
        <div className={styles.filterGroup}>
          {STATUS_OPTIONS.map(({ value, label }) => (
            <button
              key={value}
              className={`${styles.filterChip}${statusFilter === value ? ` ${styles.filterChipActive}` : ''}`}
              onClick={() => updateParams({ status: value })}
            >
              {label}
            </button>
          ))}
        </div>
        <select
          className={styles.filterDropdown}
          value={sort}
          onChange={(e) => updateParams({ sort: e.target.value })}
        >
          <option value="module">Module order</option>
          <option value="tier">Tier</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>
      <div className={styles.cardGrid}>
        {filtered.map((sl) => {
          const isBundle = sl.composedOf !== undefined && sl.composedOf.length > 0;
          const parentModules = sl.moduleSlugs.map(getModule).filter(Boolean) as Module[];
          return (
            <a
              key={sl.slug}
              href={`/knowledge-base/services/lines/${sl.slug}`}
              className={styles.card}
            >
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <span className={styles.cardEyebrow}>{sl.tierLevel}</span>
                  {isBundle && <span className={styles.bundleBadge}>Bundle</span>}
                </div>
                <div className={styles.cardHeaderRight}>
                  <span className={STATUS_CLASS[sl.status]}>{STATUS_LABEL[sl.status]}</span>
                </div>
              </div>
              <p className={styles.cardTitle}>{sl.name}</p>
              {sl.oneLiner && <p className={styles.cardOneLiner}>{sl.oneLiner}</p>}
              <div className={styles.cardMeta}>
                {parentModules.map((m) => (
                  <span key={m.slug} className={styles.modulePill}>
                    {m.pillarId} · {m.name}
                  </span>
                ))}
                {isBundle && (
                  <span className={styles.cardMetaItem}>
                    Composes {sl.composedOf!.length} lines
                  </span>
                )}
                {sl.upsellPosition !== null && (
                  <span className={styles.cardMetaItem}>
                    {POSITION_MONTH[sl.upsellPosition]}
                  </span>
                )}
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}
