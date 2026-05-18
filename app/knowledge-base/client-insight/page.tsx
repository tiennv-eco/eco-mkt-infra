import Link from 'next/link';
import { getPortfolioStats } from '@/data/portfolio/helpers';
import styles from './portfolio.module.css';

const HUB_CARDS = [
  {
    href: '/knowledge-base/client-insight/portfolio',
    icon: 'folder_open',
    title: 'Client Portfolio',
    desc: "Locked accounts with case studies and extracted patterns. The AI's reference library for matching new accounts to proven plays.",
    badge: 'live' as const,
  },
  {
    href: '/knowledge-base/client-insight/icps',
    icon: 'manage_accounts',
    title: 'ICPs',
    desc: 'Abstract account profiles — MNC/Global, Local Large, Local Indie. Every portfolio account is tagged to an ICP.',
    badge: 'stub' as const,
  },
  {
    href: '/knowledge-base/client-insight/personas',
    icon: 'badge',
    title: 'Decision-maker Personas',
    desc: 'Real-person archetypes (Lan-SME, Minh-MNC, Hung-Ecom). Every decision-maker links to a persona.',
    badge: 'stub' as const,
  },
];

export default function ClientInsightPage() {
  const stats = getPortfolioStats();

  return (
    <div className={styles.hubPage}>
      <p className={styles.breadcrumb}>Knowledge Base › Client Insight</p>

      <div className={styles.hubHeader}>
        <h1 className={styles.hubTitle}>Client Insight</h1>
        <p className={styles.hubSubtitle}>
          The locked reference layer — who we sell to, the abstract profiles that define them, and the
          patterns extracted from past engagements.
        </p>
      </div>

      <div className={styles.hubMiniStats}>
        <span className={styles.hubStatChip}>
          <strong>{stats.totalAccounts}</strong> accounts
        </span>
        <span className={styles.hubStatDivider} />
        <span className={styles.hubStatChip}>
          <strong>{stats.totalProjects}</strong> projects
        </span>
        <span className={styles.hubStatDivider} />
        <span className={styles.hubStatChip}>
          <strong>{stats.totalPatterns}</strong> patterns extracted
        </span>
      </div>

      <div className={styles.hubGrid}>
        {HUB_CARDS.map(card => (
          <Link key={card.href} href={card.href} className={styles.hubCard}>
            <span className={`${styles.hubCardBadge} ${styles[`hubCardBadge--${card.badge}`]}`}>
              {card.badge === 'live' ? 'Live' : 'Stub'}
            </span>
            <span className={`material-icons-round ${styles.hubCardIcon}`}>{card.icon}</span>
            <p className={styles.hubCardTitle}>{card.title}</p>
            <p className={styles.hubCardDesc}>{card.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
