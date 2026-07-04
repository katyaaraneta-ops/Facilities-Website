import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const linkClass =
  'text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900';

const whyShawBullets = [
  'Central corridor connecting Mandaluyong to Ortigas and surrounding districts',
  'Accessible via major roads and public transport',
  'Suitable for a mix of corporate, SME, and operational offices',
  'Strong visibility and accessibility for businesses',
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'Where can I find office space along Shaw Boulevard?',
    a: 'Buildings such as Summit One Tower and Facilities Centre offer office spaces along Shaw Boulevard in Mandaluyong.',
  },
  {
    q: 'Is Shaw Boulevard a good location for an office?',
    a: 'Yes, it provides central access to Ortigas and surrounding business districts, making it suitable for many types of companies.',
  },
  {
    q: 'What types of offices are available along Shaw Boulevard?',
    a: 'Options range from smaller units for SMEs to larger office spaces in high-rise commercial buildings.',
  },
];

export const OfficeSpaceShawBoulevardPage: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
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
            Office Space for Rent Along Shaw Boulevard
          </h1>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Shaw Boulevard is one of Mandaluyong’s key commercial corridors, connecting businesses to Ortigas, Greenhills,
            and nearby Metro Manila districts. This page focuses specifically on office spaces located along Shaw
            Boulevard—an address known for straightforward road access, daily transport convenience, and strong
            street-level visibility for businesses.
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
            Office buildings along Shaw Boulevard
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Summit One Tower</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                High-rise office spaces along Shaw Boulevard, suitable for companies needing a central and accessible location.
              </p>
              <a href="/units/summit-one" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Summit One units →
              </a>
            </article>
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Facilities Centre</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                Commercial office spaces with strong frontage along Shaw Boulevard, ideal for SMEs and operational teams.
              </p>
              <a href="/units/facilities-centre" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Facilities Centre units →
              </a>
            </article>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="why-shaw-heading">
          <h2 id="why-shaw-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Why Shaw Boulevard works for offices
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Teams often choose this corridor for its mix of convenience and frontage—practical for both commuter access
            and customer-facing operations.
          </p>
          <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
            {whyShawBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="rent-context-heading">
          <h2 id="rent-context-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            Office rent context
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office rental rates along Shaw Boulevard vary depending on building type, floor area, and lease terms. As a
            general guide, office spaces in this area may range from approximately ₱600 to ₱1,200 per square meter per
            month. For exact availability and pricing, explore the buildings listed above or enquire directly.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="types-of-office-spaces-heading">
          <h2 id="types-of-office-spaces-heading" className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4">
            What types of office spaces are available along Shaw Boulevard?
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Along Shaw Boulevard, you’ll find smaller suites that can fit SME teams, larger spaces for corporate
            operations, and PEZA-accredited options where eligibility applies. The corridor’s road access and transport
            connections can also make day-to-day commutes and client visits more convenient.
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
            Need help narrowing down options?
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
              <a href="/office-space-near-ortigas" className={linkClass}>
                Office space near Ortigas
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

