import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const linkClass =
  'text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900';

const whyNearOrtigasBullets = [
  'Close proximity to Ortigas CBD without premium central pricing',
  'Accessible via Shaw Boulevard and major connecting roads',
  'Suitable for businesses that need central Metro Manila access',
  'Flexible options for SMEs, corporate teams, and support offices',
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'Where can I find office space near Ortigas?',
    a: 'You can explore buildings such as Summit One Tower and Facilities Centre, which offer office spaces within close proximity to the Ortigas business district.',
  },
  {
    q: 'Is it better to rent inside Ortigas or nearby?',
    a: 'Many companies choose nearby areas like Mandaluyong to balance accessibility and rental cost while staying close to Ortigas.',
  },
  {
    q: 'How much does office space near Ortigas cost?',
    a: 'Rental rates vary depending on the building and size, but nearby areas generally offer competitive pricing compared to core CBD locations.',
  },
];

export const OfficeSpaceNearOrtigasPage: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-white pt-20 pb-24">
      <div className="max-w-3xl mx-auto px-6 pt-12 space-y-16">
        <div>
          <button
            type="button"
            onClick={onBackHome}
            className="flex items-center text-corporate-500 hover:text-corporate-900 transition-colors mb-8 text-sm font-medium tracking-wide uppercase group"
          >
            <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </button>

          <h1 className="text-4xl md:text-5xl font-serif text-corporate-900 leading-tight mb-6">
            Office Space for Rent Near Ortigas
          </h1>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Ortigas is one of Metro Manila’s major business districts, and many companies prefer to lease just outside
            the CBD to stay close while keeping costs more flexible. This page focuses on office spaces near Ortigas,
            including Shaw Boulevard locations and nearby areas that offer practical access to the Ortigas CBD.
          </p>
          <p className="text-lg text-corporate-600 leading-relaxed mt-6">
            For a broader view of office space options, see our{' '}
            <a href="/office-space-mandaluyong" className={linkClass}>
              office space in Mandaluyong
            </a>
            .
          </p>
        </div>

        <section className="space-y-6" aria-labelledby="available-buildings-heading">
          <h2 id="available-buildings-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Office buildings near Ortigas
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Summit One Tower</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                High-rise office spaces near Ortigas, offering accessibility and proximity to major business hubs.
              </p>
              <a href="/units/summit-one" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Summit One units →
              </a>
            </article>
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Facilities Centre</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                Office spaces along Shaw Boulevard with convenient access to Ortigas, suitable for SMEs and operational
                teams.
              </p>
              <a href="/units/facilities-centre" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Facilities Centre units →
              </a>
            </article>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="why-near-ortigas-heading">
          <h2 id="why-near-ortigas-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Why choose office space near Ortigas
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            For many tenants, “near Ortigas” is a deliberate alternative: you can keep client and partner access to the
            CBD while gaining more options on space size, building mix, and overall lease positioning.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
            {whyNearOrtigasBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="rent-context-heading">
          <h2 id="rent-context-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Office rent context
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office rental rates near Ortigas vary depending on building grade, location, and lease terms. As a general
            guide, office space in nearby areas such as Mandaluyong may range from approximately ₱600 to ₱1,200 per square
            meter per month. For exact availability and pricing, explore the buildings listed above or enquire directly.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="types-of-office-spaces-heading">
          <h2 id="types-of-office-spaces-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            What types of offices are available near Ortigas?
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office spaces near Ortigas include a mix of high-rise commercial buildings and mid-sized office developments.
            Companies can find options suitable for small teams, growing businesses, and larger corporate operations,
            with some buildings offering PEZA-accredited spaces where applicable.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="faq-heading">
          <h2 id="faq-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Frequently asked questions
          </h2>
          <div className="border-t border-corporate-200">
            {faqs.map((item) => (
              <details key={item.q} className="border-b border-corporate-200">
                <summary className="cursor-pointer py-4 text-base font-semibold text-corporate-900 pr-4">
                  {item.q}
                </summary>
                <p className="pb-5 text-base text-corporate-600 leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="next-step-heading">
          <h2 id="next-step-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Need help choosing a building?
          </h2>
          <ul className="space-y-3 text-lg text-corporate-600 leading-relaxed">
            <li>
              <a href="/#projects" className={linkClass}>
                Browse current units
              </a>
            </li>
            <li>
              <a href="/#contact" className={linkClass}>
                Contact Facilities Inc
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="related-searches-heading">
          <h2 id="related-searches-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Explore related office searches
          </h2>
          <ul className="space-y-3 text-lg text-corporate-600 leading-relaxed">
            <li>
              <a href="/office-space-mandaluyong" className={linkClass}>
                Office space in Mandaluyong
              </a>
            </li>
            <li>
              <a href="/office-space-shaw-boulevard" className={linkClass}>
                Office space along Shaw Boulevard
              </a>
            </li>
          </ul>
        </section>

        <p className="text-base text-corporate-600">
          Return to the{' '}
          <a href="/" className={linkClass}>
            Facilities Inc homepage
          </a>{' '}
          for an overview of our buildings and contact options.
        </p>
      </div>
    </div>
  );
};

