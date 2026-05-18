import Link from 'next/link';

const cards = [
  {
    tag: 'TOKENS',
    title: 'General Tokens',
    desc: 'Colors, typography, iconography, spacing, and component specs.',
    placeholder: 'General Tokens',
    href: '/knowledge-base/brand-system/design-guidelines/general-tokens',
  },
  {
    tag: 'WEB',
    title: 'Website Guidelines',
    desc: 'Layout, components, and interaction patterns for web.',
    placeholder: 'Website',
    href: '/knowledge-base/brand-system/design-guidelines/website',
  },
  {
    tag: 'TOOL',
    title: 'Tool Design',
    desc: 'Interface guidelines for internal tools and dashboards.',
    placeholder: 'Tool',
    href: '/knowledge-base/brand-system/design-guidelines/tool',
  },
  {
    tag: 'APP',
    title: 'Applications',
    desc: 'Social posts, reports, presentations, and deck templates.',
    placeholder: 'Applications',
    href: '/knowledge-base/brand-system/design-guidelines/applications',
  },
];

export default function DesignGuidelinesPage() {
  return (
    <>
      <div className="kb-header">
        <p className="kb-label">DESIGN GUIDELINES</p>
        <h1 className="kb-title">Design Specifications</h1>
        <p className="kb-subtitle">
          Platform-specific guidelines for building on-brand experiences across all surfaces.
        </p>
      </div>
      <div className="kb-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} className="kb-card">
            <div className="kb-card__image">
              <span className="kb-card__image-label">{card.placeholder}</span>
            </div>
            <div className="kb-card__body">
              <p className="kb-card__tag">{card.tag}</p>
              <h2 className="kb-card__title">{card.title}</h2>
              <p className="kb-card__desc">{card.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}
