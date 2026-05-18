'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './account.module.css';

export default function ApiKeySection() {
  const [hasKey, setHasKey] = useState(false);
  const [maskedKey, setMaskedKey] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [testMsg, setTestMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch('/api/settings/api-key');
      if (res.ok) {
        const data = await res.json();
        setHasKey(data.hasKey);
        setMaskedKey(data.maskedKey);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  async function handleSave() {
    if (!keyInput.startsWith('sk-ant-')) {
      setSaveMsg({ ok: false, text: 'Key must start with sk-ant-' });
      return;
    }
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch('/api/settings/api-key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: keyInput }),
      });
      const data = await res.json();
      if (res.ok) {
        setHasKey(true);
        setMaskedKey(data.maskedKey);
        setShowForm(false);
        setKeyInput('');
        setSaveMsg({ ok: true, text: 'API key saved and encrypted successfully.' });
      } else {
        setSaveMsg({ ok: false, text: data.error ?? 'Failed to save key.' });
      }
    } catch {
      setSaveMsg({ ok: false, text: 'Network error. Please try again.' });
    } finally {
      setSaving(false);
    }
  }

  async function handleRemove() {
    if (!confirm('Remove the API key? AI features will stop working until a new key is added.')) return;
    const res = await fetch('/api/settings/api-key', { method: 'DELETE' });
    if (res.ok) {
      setHasKey(false);
      setMaskedKey(null);
      setShowForm(true);
      setSaveMsg(null);
    }
  }

  async function handleTest() {
    setTesting(true);
    setTestMsg(null);
    try {
      const res = await fetch('/api/settings/api-key/test', { method: 'POST' });
      const data = await res.json();
      setTestMsg({ ok: data.success, text: data.success ? 'Connection verified' : (data.error ?? 'Connection failed') });
    } catch {
      setTestMsg({ ok: false, text: 'Network error.' });
    } finally {
      setTesting(false);
    }
  }

  if (loading) return <p style={{ fontSize: 12, color: 'var(--gray-400)' }}>Loading…</p>;

  return (
    <div>
      <p className={styles.apiSectionEyebrow}>AI Integration</p>
      <p className={styles.apiSectionDesc}>
        The Anthropic API key used for all AI features in this tool. Only admins can view or update
        this. The key is encrypted at rest and never exposed to the client.
      </p>

      {/* Status row */}
      <div className={styles.keyStatusRow}>
        {hasKey ? (
          <>
            <span className={styles.statusPillConnected}>● Connected</span>
            {maskedKey && <span className={styles.maskedKeyDisplay}>{maskedKey}</span>}
            <button className={styles.btnSecondary} onClick={() => setShowForm(f => !f)}>
              Update key
            </button>
            <button className={styles.removeLink} onClick={handleRemove}>Remove</button>
          </>
        ) : (
          <span className={styles.statusPillNone}>○ Not configured</span>
        )}
      </div>

      {!hasKey && (
        <div className={styles.warnMsg}>
          AI features are disabled until an API key is configured.
        </div>
      )}

      {/* Key input form */}
      {(showForm || !hasKey) && (
        <div>
          <hr className={styles.keyFormDivider} />
          <div className={styles.fieldGroup}>
            <label className={styles.label}>Anthropic API Key</label>
            <div className={styles.inputWrap}>
              <input
                type={showKey ? 'text' : 'password'}
                className={styles.input}
                style={{ paddingRight: 52 }}
                placeholder="sk-ant-api03-..."
                value={keyInput}
                onChange={e => setKeyInput(e.target.value)}
                autoComplete="off"
              />
              <button
                type="button"
                className={styles.inputEyeBtn}
                onClick={() => setShowKey(v => !v)}
                tabIndex={-1}
              >
                {showKey ? 'Hide' : 'Show'}
              </button>
            </div>
            <p className={styles.inputHint}>
              Paste your Anthropic API key. It will be encrypted and masked immediately after saving.
            </p>
          </div>
          <div className={styles.btnRow} style={{ marginTop: 4 }}>
            <button className={styles.btnPrimary} onClick={handleSave} disabled={saving || !keyInput}>
              {saving && <span className={styles.spinner} />}
              {saving ? 'Saving…' : 'Save key'}
            </button>
            {hasKey && (
              <button className={styles.btnSecondary} onClick={() => { setShowForm(false); setKeyInput(''); setSaveMsg(null); }}>
                Cancel
              </button>
            )}
          </div>
          {saveMsg && (
            <p className={saveMsg.ok ? styles.successMsg : styles.errorMsg} style={{ marginTop: 10 }}>
              {saveMsg.text}
            </p>
          )}
        </div>
      )}

      {saveMsg && !showForm && (
        <p className={saveMsg.ok ? styles.successMsg : styles.errorMsg} style={{ marginTop: 10 }}>
          {saveMsg.text}
        </p>
      )}

      {/* Test connection */}
      {hasKey && (
        <>
          <hr className={styles.keyFormDivider} />
          <div className={styles.btnRow}>
            <button className={styles.btnSecondary} onClick={handleTest} disabled={testing}>
              {testing ? 'Testing…' : 'Test connection'}
            </button>
            {testMsg && (
              <span className={testMsg.ok ? styles.testResultOk : styles.testResultErr}>
                {testMsg.ok ? '✓ ' : ''}{testMsg.text}
              </span>
            )}
          </div>
        </>
      )}
    </div>
  );
}
