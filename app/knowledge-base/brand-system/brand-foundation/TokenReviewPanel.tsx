'use client';

import { useMemo } from 'react';
import type { ContextToken } from './foundation-data';
import styles from './brand-foundation.module.css';

interface Props {
  tokens: ContextToken[];
  activeIds: Set<string>;
  onToggle: (id: string) => void;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<ContextToken['category'], string> = {
  market: 'Market',
  audience: 'Audience',
  channel: 'Channel',
  objective: 'Objective',
};

const CATEGORY_ORDER: ContextToken['category'][] = ['market', 'audience', 'channel', 'objective'];

export default function TokenReviewPanel({ tokens, activeIds, onToggle, onClose }: Props) {
  const grouped = useMemo(() => {
    const map = new Map<ContextToken['category'], ContextToken[]>();
    for (const cat of CATEGORY_ORDER) map.set(cat, []);
    for (const token of tokens) {
      map.get(token.category)?.push(token);
    }
    return map;
  }, [tokens]);

  return (
    <>
      {/* backdrop */}
      <div className={styles.panelBackdrop} onClick={onClose} />

      {/* panel */}
      <aside className={styles.tokenPanel}>
        <div className={styles.panelHeader}>
          <div className={styles.panelHeaderLeft}>
            <p className={styles.panelTitle}>Context Tokens</p>
            <span className={styles.panelCount}>{activeIds.size} active</span>
          </div>
          <button className={styles.panelClose} onClick={onClose} aria-label="Close panel">
            <span className="material-icons-round">close</span>
          </button>
        </div>

        <p className={styles.panelHint}>
          Active tokens are injected into the AI prompt to shape how the Foundation Lab generates variants.
        </p>

        <div className={styles.panelBody}>
          {CATEGORY_ORDER.map((cat) => {
            const items = grouped.get(cat) ?? [];
            if (items.length === 0) return null;
            return (
              <div key={cat} className={styles.tokenGroup}>
                <p className={styles.tokenGroupLabel}>{CATEGORY_LABELS[cat]}</p>
                <div className={styles.tokenList}>
                  {items.map((token) => {
                    const isActive = activeIds.has(token.id);
                    return (
                      <label key={token.id} className={styles.tokenRow}>
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => onToggle(token.id)}
                          className={styles.tokenCheckbox}
                        />
                        <div className={styles.tokenInfo}>
                          <span className={styles.tokenLabel}>{token.label}</span>
                          <span className={styles.tokenValue}>{token.value}</span>
                        </div>
                      </label>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </aside>
    </>
  );
}
