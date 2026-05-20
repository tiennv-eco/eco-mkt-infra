import { Suspense } from 'react';
import type { Metadata } from 'next';
import {
  getAllModules,
  getAllServiceLines,
  getAllDealUsps,
  getServiceStats,
  getBundles,
  getServiceLinesByStatus,
} from '@/data/services/helpers';
import Hero from './_components/Hero';
import DemandArchitectureDiagram from './_components/DemandArchitectureDiagram';
import StatsStrip from './_components/StatsStrip';
import UpsellPathTimeline from './_components/UpsellPathTimeline';
import TabStrip from './_components/TabStrip';
import ModulesTab from './_components/ModulesTab';
import ServiceLinesTab from './_components/ServiceLinesTab';
import DealUspsTab from './_components/DealUspsTab';
import styles from './page.module.css';

export const metadata: Metadata = {
  title: 'Services — Ecomobi Knowledge Base',
};

type SearchParams = { tab?: string; [key: string]: string | string[] | undefined };

export default async function ServicesListingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const activeTab = (params.tab as string) || 'modules';

  const modules = getAllModules();
  const serviceLines = getAllServiceLines();
  const dealUsps = getAllDealUsps();
  const baseStats = getServiceStats();

  const stats = {
    ...baseStats,
    bundleCount: getBundles().length,
    proposedCount: getServiceLinesByStatus('proposed').length,
  };

  return (
    <div className={styles.page}>
      <Hero />
      <DemandArchitectureDiagram modules={modules} />
      <StatsStrip stats={stats} />
      <UpsellPathTimeline serviceLines={serviceLines} />
      <TabStrip
        activeTab={activeTab}
        counts={{
          modules: modules.length,
          serviceLines: serviceLines.length,
          dealUsps: dealUsps.length,
        }}
      />
      <Suspense fallback={<div className={styles.tabLoading}>Loading…</div>}>
        {activeTab === 'modules' && <ModulesTab modules={modules} />}
        {activeTab === 'service-lines' && (
          <ServiceLinesTab serviceLines={serviceLines} modules={modules} />
        )}
        {activeTab === 'deal-usps' && <DealUspsTab dealUsps={dealUsps} modules={modules} />}
      </Suspense>
    </div>
  );
}
