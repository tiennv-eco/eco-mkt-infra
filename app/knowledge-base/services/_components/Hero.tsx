import styles from '../page.module.css';

export default function Hero() {
  return (
    <header className={styles.hero}>
      <nav className={styles.breadcrumb} aria-label="Breadcrumb">
        <a href="/knowledge-base">Knowledge Base</a>
        {' › '}
        <span>Services</span>
      </nav>
      <h1 className={styles.h1}>Services</h1>
      <p className={styles.subtitle}>
        Three lenses on what Ecomobi sells: <strong>Modules</strong> are the strategic frames
        (how each capability is positioned to buyers); <strong>Service Lines</strong> are the
        operational tiers (what gets contracted); <strong>Deal USPs</strong> are the commercial
        closers (the pitch lines that win deals). Organised around demand creation versus demand
        conversion, with content commerce as the consolidation destination.
      </p>
    </header>
  );
}
