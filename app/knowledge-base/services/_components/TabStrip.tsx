'use client';

import { useRouter, usePathname } from 'next/navigation';
import styles from '../page.module.css';

const TABS = [
  { slug: 'modules', label: 'Modules' },
  { slug: 'service-lines', label: 'Service Lines' },
  { slug: 'deal-usps', label: 'Deal USPs' },
] as const;

type TabSlug = (typeof TABS)[number]['slug'];

interface TabStripProps {
  activeTab: string;
  counts: { modules: number; serviceLines: number; dealUsps: number };
}

const COUNT_MAP: Record<TabSlug, keyof TabStripProps['counts']> = {
  modules: 'modules',
  'service-lines': 'serviceLines',
  'deal-usps': 'dealUsps',
};

export default function TabStrip({ activeTab, counts }: TabStripProps) {
  const router = useRouter();
  const pathname = usePathname();

  function handleTab(slug: string) {
    router.push(`${pathname}?tab=${slug}`);
  }

  return (
    <div className={styles.tabStrip}>
      {TABS.map(({ slug, label }) => {
        const isActive = activeTab === slug;
        return (
          <button
            key={slug}
            className={`${styles.tab}${isActive ? ` ${styles.tabActive}` : ''}`}
            onClick={() => handleTab(slug)}
          >
            {label}
            <span className={styles.tabCount}>{counts[COUNT_MAP[slug]]}</span>
          </button>
        );
      })}
    </div>
  );
}
