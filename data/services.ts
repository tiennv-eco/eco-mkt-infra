import type { ServiceId, ClientCategory } from './types';

export const SERVICES: Record<ServiceId, string> = {
  p1: 'Livestream Commerce',
  p2: 'UGC & Content Production',
  p3: 'TikTok Shop Partner',
  p4: 'Performance Media',
  p5: 'Affiliate & Creator Network',
  p6: 'Technology & Data Platform',
  p7: 'Service Seven',
};

export const SERVICES_SHORT: Record<ServiceId, string> = {
  p1: 'Livestream',
  p2: 'UGC',
  p3: 'TikTok Shop',
  p4: 'Performance',
  p5: 'Affiliate',
  p6: 'Tech & Data',
  p7: 'P7',
};

export const CATEGORY_LABELS: Record<ClientCategory, string> = {
  beauty: 'Beauty & Personal Care',
  fashion: 'Fashion & Apparel',
  fmcg: 'FMCG',
  tech: 'Technology',
  lifestyle: 'Lifestyle',
  'food-beverage': 'Food & Beverage',
};
