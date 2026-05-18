import Link from 'next/link';

const cards = [
  {
    tag: 'BRAND',
    title: 'Brand Foundation',
    desc: 'Core brand positioning, essence, USP, and persona layers.',
    placeholder: 'Brand Foundation',
    href: '/knowledge-base/brand-system/brand-foundation',
  },
  {
    tag: 'DESIGN',
    title: 'Design Guidelines',
    desc: 'Tokens, components, and platform-specific design specs.',
    placeholder: 'Design System',
    href: '/knowledge-base/brand-system/design-guidelines',
  },
  {
    tag: 'COPY',
    title: 'Copywriting Guidelines',
    desc: 'Tone of voice, messaging frameworks, and writing rules.',
    placeholder: 'Copywriting',
    href: '/knowledge-base/brand-system/copywriting',
  },
  {
    tag: 'BRAND',
    title: 'Brand System & Assets',
    desc: 'All brand assets, guidelines, and references in one place.',
    placeholder: 'Assets',
    href: '/knowledge-base/brand-system',
  },
];

export default function KnowledgeBasePage() {
  return (
    <>
      <div className="kb-header">
        <p className="kb-label">KNOWLEDGE BASE</p>
        <h1 className="kb-title">What do you need to find?</h1>
        <p className="kb-subtitle">
          Browse by category or use the search to find brand guidelines, services, ICPs, and marketing assets.
        </p>
      </div>
      <div className="kb-grid">
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
