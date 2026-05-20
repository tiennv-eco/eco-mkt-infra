import styles from '../page.module.css';

interface StatsProps {
  moduleCount: number;
  serviceLineCount: number;
  uspCount: number;
  bundleCount: number;
  proposedCount: number;
}

export default function StatsStrip({ stats }: { stats: StatsProps }) {
  const cells: { value: number; label: string }[] = [
    { value: stats.moduleCount, label: 'Modules' },
    { value: stats.serviceLineCount, label: 'Service Lines' },
    { value: stats.bundleCount, label: 'Bundles' },
    { value: stats.proposedCount, label: 'Proposed' },
    { value: stats.uspCount, label: 'Deal USPs' },
  ];

  return (
    <div className={styles.statsStrip}>
      {cells.map(({ value, label }) => (
        <div key={label} className={styles.statCell}>
          <span className={styles.statValue}>{value}</span>
          <span className={styles.statLabel}>{label}</span>
        </div>
      ))}
    </div>
  );
}
