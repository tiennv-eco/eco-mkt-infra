import { db } from '@/lib/db';
import { decrypt } from '@/lib/encryption';

export async function getAnthropicKey(): Promise<string> {
  const settings = await db.appSettings.findUnique({ where: { id: 'singleton' } });
  if (!settings?.anthropicKeyEnc || !settings.anthropicKeyIv || !settings.anthropicKeyTag) {
    throw new Error('Anthropic API key not configured. Add it in Account Settings.');
  }
  return decrypt(settings.anthropicKeyEnc, settings.anthropicKeyIv, settings.anthropicKeyTag);
}
