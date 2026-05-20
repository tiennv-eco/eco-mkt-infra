import type { Module } from '@/data/services/types';
import styles from '../page.module.css';

const ZONE_SUBLABELS: Record<string, string> = {
  'demand-creation': 'Creator-led awareness → purchase intent',
  'demand-conversion': 'Commerce infrastructure → GMV',
};

export default function DemandArchitectureDiagram({ modules }: { modules: Module[] }) {
  const creationModules = modules.filter((m) => m.demandRole === 'demand-creation');
  const conversionModules = modules.filter((m) => m.demandRole === 'demand-conversion');
  const consolidationModules = modules.filter((m) => m.demandRole === 'consolidation');

  return (
    <section className={styles.demandDiagram}>
      <div className={styles.demandDiagramHeader}>Demand Architecture</div>
      <div className={styles.demandZones}>
        <div className={styles.demandZone}>
          <div className={styles.demandZoneLabel}>Demand Creation</div>
          <div className={styles.demandZoneSubLabel}>{ZONE_SUBLABELS['demand-creation']}</div>
          <div className={styles.demandModulePills}>
            {creationModules.map((m) => (
              <a
                key={m.slug}
                href={`/knowledge-base/services/${m.slug}`}
                className={styles.demandModulePill}
              >
                {m.pillarId} · {m.name}
              </a>
            ))}
          </div>
        </div>
        <div className={styles.demandZone}>
          <div className={styles.demandZoneLabel}>Demand Conversion</div>
          <div className={styles.demandZoneSubLabel}>{ZONE_SUBLABELS['demand-conversion']}</div>
          <div className={styles.demandModulePills}>
            {conversionModules.map((m) => (
              <a
                key={m.slug}
                href={`/knowledge-base/services/${m.slug}`}
                className={styles.demandModulePill}
              >
                {m.pillarId} · {m.name}
              </a>
            ))}
          </div>
        </div>
      </div>
      {consolidationModules.length > 0 && (
        <div className={styles.consolidationZone}>
          <div className={styles.demandZoneLabel}>Consolidation</div>
          <div className={styles.demandZoneSubLabel}>
            Full-stack convergence — one GMV target, one team
          </div>
          <div className={styles.demandModulePills}>
            {consolidationModules.map((m) => (
              <a
                key={m.slug}
                href={`/knowledge-base/services/${m.slug}`}
                className={styles.demandModulePill}
              >
                {m.pillarId} · {m.name}
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
