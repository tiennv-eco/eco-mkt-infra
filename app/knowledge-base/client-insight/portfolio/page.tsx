import Link from 'next/link';
import { PORTFOLIO_ACCOUNTS } from '@/data/portfolio/accounts';
import { getPortfolioStats, getAccountsByCategory } from '@/data/portfolio/helpers';
import { CATEGORY_LABELS, CATEGORY_ORDER } from '@/data/portfolio/types';
import type { ClientCategory } from '@/data/portfolio/types';
import styles from '../portfolio.module.css';

export default function ClientPortfolioPage() {
  const stats = getPortfolioStats();
  const byCategory = getAccountsByCategory();

  const nonEmptyCategories = CATEGORY_ORDER.filter(cat => byCategory[cat]?.length);
  const lastCategory = nonEmptyCategories[nonEmptyCategories.length - 1];
  const lastCategoryAccounts = byCategory[lastCategory] ?? [];
  const gridCols = 3;
  const slotsInLastRow = lastCategoryAccounts.length % gridCols;
  const showEmptyCard = slotsInLastRow !== 0 || lastCategoryAccounts.length === 0;

  return (
    <div className={styles.page}>
      <p className={styles.breadcrumb}>Knowledge Base › Client Insight › Client Portfolio</p>

      <div className={styles.pageHeaderRow}>
        <div className={styles.pageHeaderLeft}>
          <h1 className={styles.pageTitle}>Client Portfolio</h1>
          <p className={styles.pageSubtitle}>
            Locked accounts with verified case studies, extracted patterns, and reference tags —
            structured for AI to cite when matching new accounts to proven plays.
          </p>
        </div>
        <span className={styles.lockedBadge}>
          <span className={`material-icons-round ${styles.lockedBadgeIcon}`}>lock</span>
          Locked {PORTFOLIO_ACCOUNTS[0].version}
        </span>
      </div>

      <div className={styles.statsBanner}>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{stats.totalAccounts}</span>
          <span className={styles.statLabel}>Accounts locked</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{stats.categoryCount}</span>
          <span className={styles.statLabel}>Categories</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{stats.totalProjects}</span>
          <span className={styles.statLabel}>Projects logged</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{stats.totalFullCases}</span>
          <span className={styles.statLabel}>Full cases</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statNum}>{stats.totalPatterns}</span>
          <span className={styles.statLabel}>Patterns extracted</span>
        </div>
      </div>

      <div className={styles.filterRow}>
        <span className={styles.filterLabel}>Filter by</span>
        <span className={`${styles.pill} ${styles['pill--active']}`}>All</span>
        <span className={`${styles.pill} ${styles['pill--inactive']}`}>Industry</span>
        <span className={`${styles.pill} ${styles['pill--inactive']}`}>ICP</span>
        <span className={`${styles.pill} ${styles['pill--inactive']}`}>Service combo</span>
        <span className={`${styles.pill} ${styles['pill--inactive']}`}>Outcome type</span>
        <span className={styles.filterRight}>Sort: Most patterns</span>
      </div>

      {nonEmptyCategories.map(cat => {
        const accounts = byCategory[cat] ?? [];
        const isLast = cat === lastCategory;
        const fullCasesInCat = accounts.reduce(
          (n, a) => n + a.projects.filter(p => p.type === 'full-case').length, 0
        );
        return (
          <div key={cat} className={styles.categorySection}>
            <p className={styles.categoryEyebrow}>{CATEGORY_LABELS[cat as ClientCategory]}</p>
            <p className={styles.categoryMeta}>
              {accounts.length} account{accounts.length !== 1 ? 's' : ''} · {fullCasesInCat} full case{fullCasesInCat !== 1 ? 's' : ''}
            </p>
            <div className={styles.accountGrid}>
              {accounts.map(a => {
                const fullCases = a.projects.filter(p => p.type === 'full-case');
                const allPatterns =
                  fullCases.reduce((n, p) => n + (p.type === 'full-case' ? p.patterns.length : 0), 0) +
                  a.accountPatterns.length;
                const topProject = fullCases[0];
                return (
                  <Link
                    key={a.slug}
                    href={`/knowledge-base/client-insight/portfolio/${a.slug}`}
                    className={styles.acard}
                  >
                    <div className={styles.acardHead}>
                      <div className={styles.acardLogo}>{a.initials}</div>
                      <div className={styles.acardInfo}>
                        <p className={styles.acardName}>{a.name}</p>
                        <p className={styles.acardMeta}>{a.sizeTierLabel} · {a.market}</p>
                      </div>
                      <span className={styles.acardLockPill}>
                        <span className={`material-icons-round ${styles.acardLockIcon}`}>lock</span>
                        {a.version}
                      </span>
                    </div>

                    <p className={styles.acardBrands}>
                      {a.brands.map(b => b.name).join(' · ')}
                    </p>

                    {topProject && (
                      <div className={styles.acardOutcome}>
                        <p className={styles.acardOutcomeLabel}>Top outcome</p>
                        <p className={styles.acardOutcomeText}>{topProject.outcomeHeadline}</p>
                      </div>
                    )}

                    <p className={styles.acardRef}>
                      {a.projects.length} projects ·{' '}
                      <span className={styles.acardRefProjects}>{allPatterns} patterns</span>
                    </p>
                  </Link>
                );
              })}

              {isLast && showEmptyCard && (
                <div className={styles.acardEmpty}>
                  <span className={`material-icons-round ${styles.acardEmptyIcon}`}>archive</span>
                  <span className={styles.acardEmptyText}>Lock new account</span>
                </div>
              )}
            </div>
          </div>
        );
      })}

      <p className={styles.footerNote}>
        + F&amp;B category locking next week · 3 more accounts in review
      </p>
    </div>
  );
}
