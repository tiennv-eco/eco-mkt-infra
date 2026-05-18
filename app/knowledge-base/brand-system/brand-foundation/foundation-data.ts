/* ── TYPES ─────────────────────────────────────────────────── */

export type VariantTier = 'overarching' | 'localized';

// kebab-case values; display via AUDIENCE_LABELS
export type Audience = 'brands' | 'creators' | 'employer-branding';

// lowercase values; display via MARKET_LABELS
export type Market = 'vn' | 'th' | 'id' | 'ph' | 'my' | 'sg';

export type DiffState = 'unchanged' | 'modified' | 'added' | 'removed';

// which scope this layer was authored for (independent of variant tier)
export type LayerScope = 'universal' | 'audience' | 'market';

export interface BrandLayer {
  id: string;
  layerNumber: string;
  layerName: string;
  title: string;
  body: string;
  scope: LayerScope;
  diffState?: DiffState;
}

export interface FoundationVariant {
  tier: VariantTier;
  audience: Audience;
  market?: Market;        // only for tier === 'localized'
  status: 'locked' | 'draft' | 'empty';
  version?: string;
  layers: BrandLayer[];
}

export interface ContextToken {
  id: string;
  category: 'market' | 'audience' | 'channel' | 'objective';
  label: string;
  value: string;
  defaultActive: boolean;
}

export interface Metric {
  number: string;
  label: string;
}

export interface AspirationalQuote {
  primary: string;
  secondary: string;
  eyebrow: string;
}

/* ── DISPLAY MAPS ──────────────────────────────────────────── */

export const AUDIENCE_LABELS: Record<Audience, string> = {
  'brands': 'Brand',
  'creators': 'Creator',
  'employer-branding': 'Employer Branding',
};

export const MARKET_LABELS: Record<Market, string> = {
  'vn': 'VN',
  'th': 'TH',
  'id': 'ID',
  'ph': 'PH',
  'my': 'MY',
  'sg': 'SG',
};

/* ── SEED DATA: BRAND OVERARCHING (locked) ─────────────────── */

const overarchingBrandsLayers: BrandLayer[] = [
  {
    id: 'ob-01',
    layerNumber: '01',
    layerName: 'Core Truth',
    title: 'Creator commerce is a systems problem, not a campaign problem.',
    body: "Only a full-stack connected system produces compounding results. Four vendors, zero system — that's why most brands fail.",
    scope: 'universal',
  },
  {
    id: 'ob-02',
    layerNumber: '02',
    layerName: 'Brand Essence',
    title: 'Authentic Commerce Intent — real purchase desire through creator trust.',
    body: "Creating intent for SEA's most iconic brands — not manufactured through paid placement or generic content.",
    scope: 'universal',
  },
  {
    id: 'ob-03',
    layerNumber: '03',
    layerName: 'Core USP',
    title: 'Social Commerce Velocity — speed, scale, and compounding momentum.',
    body: "The only affiliate-rooted, full-stack creator commerce operation in SEA. No competitor can shortcut what took years to build.",
    scope: 'universal',
  },
  {
    id: 'ob-04',
    layerNumber: '04',
    layerName: 'Brand Persona',
    title: 'Content Commerce Catalyst — not an operator, a catalyst.',
    body: "We create the conditions for demand. The momentum compounds long after any campaign ends — that's catalysis, not service delivery.",
    scope: 'universal',
  },
];

/* ── ALL VARIANTS ──────────────────────────────────────────── */

const ALL_AUDIENCES: Audience[] = ['brands', 'creators', 'employer-branding'];
const ALL_MARKETS: Market[] = ['vn', 'th', 'id', 'ph', 'my', 'sg'];

export const variants: FoundationVariant[] = [
  // ── 1 locked overarching ──
  {
    tier: 'overarching',
    audience: 'brands',
    status: 'locked',
    version: 'v2026',
    layers: overarchingBrandsLayers,
  },
  // ── 2 empty overarching ──
  { tier: 'overarching', audience: 'creators', status: 'empty', layers: [] },
  { tier: 'overarching', audience: 'employer-branding', status: 'empty', layers: [] },
  // ── 18 empty localized (3 audiences × 6 markets) ──
  ...ALL_AUDIENCES.flatMap((audience) =>
    ALL_MARKETS.map((market) => ({
      tier: 'localized' as VariantTier,
      audience,
      market,
      status: 'empty' as const,
      layers: [],
    })),
  ),
];

/* ── HELPER ────────────────────────────────────────────────── */

export function getVariant(
  tier: VariantTier,
  audience: Audience,
  market?: Market,
): FoundationVariant {
  const found = variants.find(
    (v) =>
      v.tier === tier &&
      v.audience === audience &&
      (tier === 'localized' ? v.market === market : true),
  );
  return found ?? { tier, audience, market, status: 'empty', layers: [] };
}

/* ── METRICS ───────────────────────────────────────────────── */

export const metrics: Metric[] = [
  { number: '1M+', label: 'Creators' },
  { number: '6', label: 'SEA Markets' },
  { number: '$40M', label: 'Monthly GMV' },
  { number: '80+', label: 'Studios' },
];

/* ── ASPIRATIONAL QUOTE ────────────────────────────────────── */

export const aspirationalQuote: AspirationalQuote = {
  eyebrow: 'Ecomobi — Brand Foundation 2026',
  primary: "We don't run campaigns.\nWe build momentum.",
  secondary:
    "Authentic commerce intent, delivered at social commerce velocity, by Southeast Asia's content commerce catalyst.",
};

/* ── CONTEXT TOKENS ────────────────────────────────────────── */

export const contextTokens: ContextToken[] = [
  // Market
  { id: 'mk-vn', category: 'market', label: 'Vietnam', value: 'Vietnam market: TikTok-dominant, strong livestream culture, price-sensitive mid-market', defaultActive: true },
  { id: 'mk-th', category: 'market', label: 'Thailand', value: 'Thailand market: premium-skewing, strong brand loyalty, Line and TikTok mix', defaultActive: false },
  { id: 'mk-id', category: 'market', label: 'Indonesia', value: 'Indonesia market: largest SEA population, Tokopedia/Shopee dominant, diverse regional cultures', defaultActive: false },
  { id: 'mk-ph', category: 'market', label: 'Philippines', value: 'Philippines market: high English fluency, Facebook-dominant, strong OFW gifting economy', defaultActive: false },
  { id: 'mk-my', category: 'market', label: 'Malaysia', value: 'Malaysia market: bilingual audience (EN/BM), premium and halal-conscious segments', defaultActive: false },
  { id: 'mk-sg', category: 'market', label: 'Singapore', value: 'Singapore market: regional HQ clients, B2B-skewing, premium positioning only', defaultActive: false },
  // Audience
  { id: 'aud-brands', category: 'audience', label: 'Brand CMO', value: 'Audience: Brand-side marketing decision maker — CMO or Head of Ecommerce. Cares about GMV attribution, CAC, brand safety', defaultActive: true },
  { id: 'aud-creators', category: 'audience', label: 'Creator', value: 'Audience: Independent content creator or KOL — values income stability, content freedom, brand matching', defaultActive: false },
  { id: 'aud-employer-branding', category: 'audience', label: 'Employer Branding', value: 'Audience: Employer branding — positioning Ecomobi as a destination for talent, emphasising culture, growth, and mission', defaultActive: false },
  // Channel
  { id: 'ch-tiktok', category: 'channel', label: 'TikTok Shop', value: 'Channel: TikTok Shop — short-video + livestream, algorithm-driven discovery, affiliate-native', defaultActive: true },
  { id: 'ch-shopee', category: 'channel', label: 'Shopee Affiliate', value: 'Channel: Shopee Affiliate — price-sensitive, voucher-heavy, high conversion intent', defaultActive: false },
  { id: 'ch-b2b', category: 'channel', label: 'B2B Deck', value: 'Channel: B2B pitch deck or proposal — formal tone, data-heavy, boardroom-ready', defaultActive: false },
  // Objective
  { id: 'obj-scale', category: 'objective', label: 'Scale GMV', value: 'Objective: Scale GMV — emphasise velocity, creator network density, and operational throughput', defaultActive: true },
  { id: 'obj-trust', category: 'objective', label: 'Build Trust', value: 'Objective: Build brand trust — emphasise authenticity, creator vetting, long-term brand safety', defaultActive: false },
  { id: 'obj-enter', category: 'objective', label: 'Market Entry', value: 'Objective: Market entry — emphasise local network depth, regulatory know-how, and market-specific proof', defaultActive: false },
];
