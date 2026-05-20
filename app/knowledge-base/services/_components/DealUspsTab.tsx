'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import type { DealUsp, Module } from '@/data/services/types';
import styles from '../page.module.css';

interface Props {
  dealUsps: DealUsp[];
  modules: Module[];
}

export default function DealUspsTab({ dealUsps, modules }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const moduleFilter = searchParams.get('uspModule') || 'all';

  function setModule(value: string) {
    const params = new URLSearchParams({ tab: 'deal-usps' });
    if (value !== 'all') params.set('uspModule', value);
    router.push(`${pathname}?${params.toString()}`);
  }

  const filtered =
    moduleFilter === 'all'
      ? dealUsps
      : dealUsps.filter((u) => u.relevantModuleSlugs.includes(moduleFilter as never));

  function getModule(slug: string): Module | undefined {
    return modules.find((m) => m.slug === slug);
  }

  return (
    <div>
      <div className={styles.filtersRow}>
        <select
          className={styles.filterDropdown}
          value={moduleFilter}
          onChange={(e) => setModule(e.target.value)}
        >
          <option value="all">All Modules</option>
          {modules.map((m) => (
            <option key={m.slug} value={m.slug}>
              {m.pillarId} · {m.name}
            </option>
          ))}
        </select>
      </div>
      <div className={styles.cardGrid}>
        {filtered.map((usp) => {
          const relatedModules = usp.relevantModuleSlugs
            .map(getModule)
            .filter(Boolean) as Module[];
          return (
            <div key={usp.slug} className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardHeaderLeft}>
                  <span className={styles.uspIcon}>{usp.icon}</span>
                  <div className={styles.uspModulePills}>
                    {relatedModules.map((m) => (
                      <span key={m.slug} className={styles.modulePill}>
                        {m.pillarId} · {m.name}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <p className={styles.cardTitle}>{usp.name}</p>
              <p className={styles.cardOneLiner}>{usp.commercialFrame}</p>
              <div className={styles.cardMeta}>
                <div style={{ flex: 1 }}>
                  <p className={styles.uspWhenDeploy}>
                    <span className={styles.uspWhenDeployLabel}>When to deploy:</span>
                    {usp.whenToDeploy}
                  </p>
                  {usp.dealsClosed && (
                    <p className={styles.uspDealsClosed}>Deals closed: {usp.dealsClosed}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
