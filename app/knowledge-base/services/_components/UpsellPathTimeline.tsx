import type { ServiceLine } from '@/data/services/types';
import styles from '../page.module.css';

const POSITION_LABELS: Record<number, string> = {
  1: 'Month 1',
  2: 'Month 2',
  3: 'Month 3',
  4: 'Month 4-5',
  5: 'Month 6+',
};

export default function UpsellPathTimeline({ serviceLines }: { serviceLines: ServiceLine[] }) {
  const byPosition: Record<number, ServiceLine[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] };
  for (const sl of serviceLines) {
    if (sl.upsellPosition !== null && sl.upsellPosition in byPosition) {
      byPosition[sl.upsellPosition].push(sl);
    }
  }

  return (
    <section className={styles.upsellTimeline}>
      <div className={styles.upsellTimelineHeader}>
        <span className={styles.upsellTimelineEyebrow}>Universal Upsell Path</span>
        <span className={styles.upsellTimelineCaption}>
          How brands typically progress through Ecomobi&apos;s services
        </span>
      </div>
      <div className={styles.upsellTrack}>
        {([1, 2, 3, 4, 5] as const).map((pos) => {
          const lines = byPosition[pos];
          return (
            <div key={pos} className={styles.upsellNode}>
              <span className={styles.upsellNodeMonth}>{POSITION_LABELS[pos]}</span>
              <div className={styles.upsellNodeLines}>
                {lines.length > 0 ? (
                  lines.map((sl) => (
                    <a
                      key={sl.slug}
                      href={`/knowledge-base/services/lines/${sl.slug}`}
                      className={styles.upsellNodeLine}
                      title={sl.name}
                    >
                      {sl.name}
                    </a>
                  ))
                ) : (
                  <span className={styles.upsellNodeEmpty}>—</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
