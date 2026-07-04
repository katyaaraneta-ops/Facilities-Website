import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

const linkClass =
  'text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900';

const whatAffectsRentBullets = [
  'Building grade and facilities',
  'Floor area and layout',
  'Lease terms and contract length',
  'Fit-out condition and readiness',
  'Accessibility and proximity to major business districts',
];

const faqs: { q: string; a: string }[] = [
  {
    q: 'How much does office rental cost in Mandaluyong?',
    a: 'Rental rates vary by building and size, but typically fall within mid-range Metro Manila pricing, often starting around ₱500 per square meter per month.',
  },
  {
    q: 'What factors affect office rent in Mandaluyong?',
    a: 'Rent depends on building quality, size, lease terms, and location within Mandaluyong.',
  },
  {
    q: 'Where can I find office rentals in Mandaluyong?',
    a: 'You can explore buildings such as Summit One Tower and Facilities Centre for available office units.',
  },
];

export const OfficeRentalMandaluyongPage: React.FC<{ onBackHome: () => void }> = ({ onBackHome }) => {
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
            Office Rental in Mandaluyong
          </h1>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Mandaluyong is a strategic location for businesses looking for accessible office space in Metro Manila. This
            page is a pricing and leasing guide focused on office rental rates in Mandaluyong—covering typical costs,
            what drives pricing, and practical lease considerations for teams evaluating space along corridors such as
            Shaw Boulevard.
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
          <h2
            id="available-buildings-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            Available office rentals in Mandaluyong
          </h2>
          <div className="grid gap-6 sm:grid-cols-2">
            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Summit One Tower</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                High-rise office rentals along Shaw Boulevard, suitable for companies seeking a central business
                address.
              </p>
              <a href="/units/summit-one" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Summit One units →
              </a>
            </article>

            <article className="rounded-xl border border-corporate-200 bg-corporate-50/40 p-6 shadow-sm flex flex-col">
              <h3 className="text-xl font-serif text-corporate-900 mb-2">Facilities Centre</h3>
              <p className="text-corporate-600 text-base leading-relaxed flex-1 mb-4">
                Flexible office rental options along Shaw Boulevard, ideal for SMEs and operational teams.
              </p>
              <a href="/units/facilities-centre" className={`${linkClass} text-sm uppercase tracking-wide inline-block`}>
                View Facilities Centre units →
              </a>
            </article>
          </div>
        </section>

        <section className="space-y-4" aria-labelledby="rent-prices-heading">
          <h2
            id="rent-prices-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            Office rent prices in Mandaluyong
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office rental rates in Mandaluyong vary depending on building grade, floor area, location, and lease terms.
            As a general guide, the cost of office space in this area may range from approximately ₱600 to ₱1,200 per
            square meter per month. To estimate your monthly budget, consider fit-out readiness, contract length, and
            inclusions such as association dues or operating hours—these can meaningfully change the effective rate.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="what-affects-rent-heading">
          <h2
            id="what-affects-rent-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            What affects office rent
          </h2>
          <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
            {whatAffectsRentBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-4" aria-labelledby="leasing-considerations-heading">
          <h2
            id="leasing-considerations-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            Leasing considerations
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            When renting office space in Mandaluyong, businesses should consider factors such as lease flexibility,
            fit-out requirements, and accessibility for employees and clients. Buildings along Shaw Boulevard offer
            strong connectivity to Ortigas and surrounding districts, making them a practical choice for many companies.
          </p>
        </section>

        <section className="space-y-4" aria-labelledby="types-of-offices-heading">
          <h2
            id="types-of-offices-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            What types of offices are available
          </h2>
          <p className="text-lg text-corporate-600 leading-relaxed">
            Office spaces in Mandaluyong range from smaller units for startups and SMEs to larger floor plates for
            corporate teams. Some buildings also offer PEZA-accredited office space where applicable, which may be
            relevant for certain business operations.
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
          <h2
            id="next-step-heading"
            className="text-2xl md:text-3xl font-serif text-corporate-900 border-b border-corporate-200 pb-4"
          >
            Explore available office units
          </h2>
          <ul className="space-y-3 text-lg text-corporate-600 leading-relaxed">
            <li>
              <a href="/units/summit-one" className={linkClass}>
                View Summit One Tower office units
              </a>
            </li>
            <li>
              <a href="/units/facilities-centre" className={linkClass}>
                View Facilities Centre office units
              </a>
            </li>
            <li>
              <a href="/#projects" className={linkClass}>
                Browse all projects on the homepage
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

