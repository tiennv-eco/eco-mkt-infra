import type { Module, ServiceLine, DealUsp, ModuleSlug, ServiceLineSlug } from './types';
import { SERVICE_MODULES } from './modules';
import { SERVICE_LINES } from './service-lines';
import { DEAL_USPS } from './deal-usps';

export function getAllModules(): Module[] {
  return SERVICE_MODULES;
}

export function getAllServiceLines(): ServiceLine[] {
  return SERVICE_LINES;
}

export function getAllDealUsps(): DealUsp[] {
  return DEAL_USPS;
}

export function getModuleBySlug(slug: string): Module | undefined {
  return SERVICE_MODULES.find((m) => m.slug === slug);
}

export function getServiceLineBySlug(slug: string): ServiceLine | undefined {
  return SERVICE_LINES.find((sl) => sl.slug === slug);
}

export function getServiceLinesByModule(moduleSlug: string): ServiceLine[] {
  return SERVICE_LINES.filter((sl) => sl.moduleSlugs.includes(moduleSlug as ModuleSlug));
}

export function getBundlesForServiceLine(lineSlug: string): ServiceLine[] {
  return SERVICE_LINES.filter(
    (sl) => sl.composedOf !== undefined && sl.composedOf.includes(lineSlug)
  );
}

export function getServiceLinesByStatus(status: ServiceLine['status']): ServiceLine[] {
  return SERVICE_LINES.filter((sl) => sl.status === status);
}

export function getBundles(): ServiceLine[] {
  return SERVICE_LINES.filter((sl) => sl.composedOf !== undefined && sl.composedOf.length > 0);
}

export function getComponentsForBundle(bundleSlug: ServiceLineSlug): ServiceLine[] {
  const bundle = SERVICE_LINES.find((sl) => sl.slug === bundleSlug);
  if (!bundle?.composedOf) return [];
  return SERVICE_LINES.filter((sl) => bundle.composedOf!.includes(sl.slug));
}

export function getModulesForIcp(icpSlug: string): Module[] {
  return SERVICE_MODULES.filter((m) => m.relevantIcpSlugs.includes(icpSlug));
}

export function getServiceLinesForIcp(icpSlug: string): ServiceLine[] {
  return SERVICE_LINES.filter((sl) => sl.relevantIcpSlugs.includes(icpSlug));
}

export function getModulesForPersona(personaSlug: string): Module[] {
  return SERVICE_MODULES.filter((m) => m.decisionMakerPersonaSlugs.includes(personaSlug));
}

export function getServiceLinesForPersona(personaSlug: string): ServiceLine[] {
  return SERVICE_LINES.filter((sl) => sl.decisionMakerPersonaSlugs.includes(personaSlug));
}

export function getDealUspsForPersona(personaSlug: string): DealUsp[] {
  return DEAL_USPS.filter((u) => u.resonatesWithPersonaSlugs.includes(personaSlug));
}

export function getDealUspsByModule(moduleSlug: string): DealUsp[] {
  return DEAL_USPS.filter((u) => u.relevantModuleSlugs.includes(moduleSlug as ModuleSlug));
}

export function getServiceStats(): {
  moduleCount: number;
  serviceLineCount: number;
  uspCount: number;
} {
  return {
    moduleCount: SERVICE_MODULES.length,
    serviceLineCount: SERVICE_LINES.length,
    uspCount: DEAL_USPS.length,
  };
}
