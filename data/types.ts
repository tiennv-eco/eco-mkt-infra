export type ServiceId = 'p1' | 'p2' | 'p3' | 'p4' | 'p5' | 'p6' | 'p7';
export type ClientCategory = 'beauty' | 'fashion' | 'fmcg' | 'tech' | 'lifestyle' | 'food-beverage';
export type EngagementStatus = 'active' | 'paused' | 'onboarding';
export type Market = 'vn' | 'th' | 'id' | 'ph' | 'my' | 'sg';

export interface KeyContact {
  name: string;
  title: string;
  email?: string;
}

export interface Metric {
  label: string;
  value: string;
  delta?: string;
  deltaPositive?: boolean;
}

export interface CampaignResult {
  campaignName: string;
  period: string;
  services: ServiceId[];
  highlights: string[];
}

export interface CrossSellOpportunity {
  serviceId: ServiceId;
  rationale: string;
  priority: 'high' | 'medium' | 'low';
}

export interface IcpFit {
  dimension: string;
  score: number; // 1–5
  note?: string;
}

export interface Client {
  slug: string;
  name: string;
  initials: string; // 2 chars
  category: ClientCategory;
  market: Market;
  status: EngagementStatus;
  since: string; // e.g. "2024-Q1"
  tagline: string;
  activeServices: ServiceId[];
  crossSellOpportunities: CrossSellOpportunity[];
  keyContacts: KeyContact[];
  metrics: Metric[];
  campaignResults: CampaignResult[];
  icpFit: IcpFit[];
  notes?: string;
}
