import StubPage from '@/components/StubPage';
export default function IncomingRequestsPage() {
  return (
    <StubPage
      breadcrumb="Backlog & Requests › Incoming Requests"
      title="Incoming Requests"
      description="New requests from stakeholders awaiting triage and assignment to the right service."
      phase="phase-3"
      phaseLabel="Phase 3 · Planned"
    />
  );
}
