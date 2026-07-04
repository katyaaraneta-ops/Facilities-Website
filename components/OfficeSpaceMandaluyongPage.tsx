import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const linkClass =
  'text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900';

const whyMandaluyongBullets = [
  'Central location between Ortigas and Makati',
  'Accessible via Shaw Boulevard and EDSA',
  'Suitable for SMEs, BPOs, and corporate offices',
  'Wide range of office space options',
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'Where can I find office space in Mandaluyong?',
    a: 'You can explore buildings such as Summit One Tower and Facilities Centre, which offer office space along Shaw Boulevard and nearby areas.',
  },
  {
    q: 'Is Mandaluyong a good place for an office?',
    a: 'Yes, Mandaluyong offers central access to major business districts and is suitable for a range of companies.',
  },
  {
    q: 'How much does office space cost in Mandaluyong?',
    a: 'Prices vary by building and size, but generally fall within mid-range Metro Manila office rental rates.',
  },
];

export const OfficeSpaceMandaluyongPage: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
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
            Office Space for Rent in Mandaluyong
          </h1>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Mandaluyong is a central business location in Metro Manila, offering convenient access to Ortigas, Makati, and key transport routes. This page provides an overview of office space options in Mandaluyong, helping you explore, compare, and shortlist buildings along Shaw Boulevard and nearby commercial corridors.
          </p>
        </div>

        <section className="space-y-6" aria-labelledby="available-buildings-heading">
          <h2 id="available-buildings-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Available office space in Mandaluyong
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Summit One Tower</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                Premium high-rise offices on Shaw Boulevard, suited to teams that want a flagship address with strong connectivity.
              </p>
              <a href="/units/summit-one" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Summit One units →
              </a>
            </article>
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Facilities Centre</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                Shaw Boulevard offices with flexible sizes—ideal for SMEs and operations that value access and practicality.
              </p>
              <a href="/units/facilities-centre" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Facilities Centre units →
              </a>
            </article>
          </div>
        </section>

        <section className="space-y-6" aria-labelledby="nearby-locations-heading">
          <h2
            id="nearby-locations-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            Explore nearby office locations
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            If you already have a preferred corridor or want to compare location trade-offs, these pages focus on
            specific search intents within the Mandaluyong area.
          </p>
          <ul className="space-y-3 text-lg text-corporate-600 leading-relaxed">
            <li>
              <a href="/office-space-shaw-boulevard" className={linkClass}>
                Office space along Shaw Boulevard
              </a>
            </li>
            <li>
              <a href="/office-space-near-ortigas" className={linkClass}>
                Office space near Ortigas
              </a>
            </li>
            <li>
              <a href="/office-rental-mandaluyong" className={linkClass}>
                Office rental in Mandaluyong
              </a>
            </li>
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="why-mandaluyong-heading">
          <h2 id="why-mandaluyong-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Why choose Mandaluyong
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
            {whyMandaluyongBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="rent-context-heading">
          <h2 id="rent-context-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Office rent context
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office rental rates in Mandaluyong can vary depending on building grade, floor area, and lease terms. As a general guide, office space in this area may range from approximately ₱600 to ₱1,200 per square meter per month. For exact availability and pricing, explore the buildings listed above or enquire directly.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="types-of-office-spaces-heading">
          <h2 id="types-of-office-spaces-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            What types of office spaces are available in Mandaluyong?
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Mandaluyong offers a mix of PEZA-accredited office options (where eligibility applies), smaller units that can suit SMEs, and larger floor plates for growing teams. Many offices are clustered along Shaw Boulevard and nearby commercial corridors, which can be convenient for day-to-day access to Ortigas and surrounding Metro Manila routes.
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
