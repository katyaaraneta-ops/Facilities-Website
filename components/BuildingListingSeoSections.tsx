import React from 'react';

export type BuildingListingKey = 'summit-one' | 'facilities-centre';

interface BuildingListingSeoSectionsProps {
  buildingKey: BuildingListingKey;
}

const summitLocationPoints = [
  'Along Shaw Boulevard in Mandaluyong, with strong proximity to the Ortigas CBD.',
  'A practical base for teams that also need access to Makati and wider Mandaluyong business activity.',
  'The property is near MRT Shaw Station (per our published building information), with reach via Shaw and connecting major roads.',
  'Suited to organizations that want a central Metro Manila address on a major corridor.',
];

const summitTenantBullets = [
  'Professional services firms and corporate offices that want a Shaw Boulevard, Mandaluyong address.',
  'Growing teams that need larger floor plates—check each listing for area to confirm fit.',
  'Admin, support, and regional operations groups that prioritize building-grade infrastructure.',
  'Tenants that can use PEZA-accredited office space where eligibility applies.',
];

const facilitiesLocationPoints = [
  'Facilities Centre sits on Shaw Boulevard, Mandaluyong (548 Shaw Blvd in our published listings).',
  'Strong Shaw Boulevard frontage supports visibility and access for office and commercial tenants.',
  'The site is PEZA-accredited and described on our homepage as offering parking, security, and ground-floor retail context.',
  'A practical choice for teams that serve Ortigas, Greenhills, and other Metro Manila catchments reachable from Shaw and connecting roads.',
];

const facilitiesTenantBullets = [
  'SMEs and startups scaling up, especially where published unit sizes match headcount and layout needs.',
  'Professional services firms and satellite teams needing a practical Shaw Boulevard base.',
  'Back-office, admin, and support functions that benefit from on-site security and parking (as described on our homepage).',
  'Companies that can use PEZA-accredited office space where eligibility applies.',
];

const pricingContextParagraph =
  'Office space in this part of Metro Manila can vary significantly depending on building grade, fit-out, floor size, and lease terms. The unit cards above show asking figures from our current inventory where we publish them. For exact availability, out-of-band options, and formal quotations, enquire directly through a unit page or the site contact section.';

const linkClass =
  'text-corporate-900 font-medium underline decoration-corporate-300 underline-offset-4 hover:decoration-corporate-900';

export const BuildingListingSeoSections: React.FC<BuildingListingSeoSectionsProps> = ({ buildingKey }) => {
  const isSummit = buildingKey === 'summit-one';
  const otherBuildingHref = isSummit ? '/units/facilities-centre' : '/units/summit-one';

  const heading = isSummit
    ? 'Office Space for Rent in Mandaluyong – Summit One'
    : 'Office Space for Rent in Mandaluyong – Facilities Centre';

  const introLead = isSummit
    ? 'Summit One is a commercial office building in Mandaluyong, ideal for companies looking for accessible office space near Ortigas and Makati. This page helps you understand the building’s location, office suitability, and leasing context for teams looking to operate in Metro Manila.'
    : 'Facilities Centre is a commercial office building on Shaw Boulevard, Mandaluyong, suitable for companies that want a practical Metro Manila office location with access to nearby business districts and major roads. This page helps you understand the building’s location, office suitability, and leasing context.';

  const locationTitle = 'Why this location works';
  const tenantTitle = 'Who this office space may suit';
  const pricingTitle = 'Pricing and lease context';
  const faqTitle = 'Common questions';
  const linksTitle = 'Explore more';
  const otherSpacesTitle = 'Other office spaces you may consider';

  const summitFaqs: { q: string; a: string }[] = [
    {
      q: 'Where is Summit One located?',
      a: 'Summit One Tower is at 530 Shaw Boulevard, Mandaluyong City, Metro Manila — the address we publish across this site and our contact details.',
    },
    {
      q: 'Is Summit One suitable for small and mid-sized teams?',
      a: 'Suitability depends on the floor area and layout you need. Available sizes for each unit are shown in the listings above; open any unit for full specs, then enquire so our leasing team can confirm fit and viewing options.',
    },
    {
      q: 'Is Summit One accessible from Ortigas or Makati?',
      a: 'The building sits on Shaw Boulevard in Mandaluyong, a corridor that links closely with Ortigas and connects toward Makati via Metro Manila’s major road network. Published materials also reference proximity to MRT Shaw Station.',
    },
    {
      q: 'How do I enquire about available office space at Summit One?',
      a: 'Choose a unit above to see photos, facts, and inquiry buttons, or use the contact section on the homepage to reach our team with general questions.',
    },
  ];

  const facilitiesFaqs: { q: string; a: string }[] = [
    {
      q: 'Where is Facilities Centre located?',
      a: 'Our listings and metadata describe Facilities Centre at 548 Shaw Boulevard, Mandaluyong City, Metro Manila.',
    },
    {
      q: 'What kinds of companies may suit Facilities Centre?',
      a: 'Published inventory emphasizes small to mid-size office formats alongside larger plates, with building-level notes on security, parking, and PEZA accreditation — a mix that often suits professional offices, SMEs, and operational teams.',
    },
    {
      q: 'Is Facilities Centre a practical office location in Metro Manila?',
      a: 'Yes. Shaw Boulevard is a major east–west spine through Mandaluyong, which tends to work well for teams connecting across Ortigas, inner Metro Manila, and adjoining business areas.',
    },
    {
      q: 'How do I enquire about available office space at Facilities Centre?',
      a: 'Select any unit card for detail and the email or phone inquiry options, or message us through the site’s contact block.',
    },
  ];

  const faqs = isSummit ? summitFaqs : facilitiesFaqs;

  return (
    <section
      className="mt-20 md:mt-28 pt-16 border-t border-corporate-200 space-y-16 max-w-3xl"
      aria-labelledby={`building-seo-${buildingKey}`}
    >
      <header className="space-y-6">
        <h2 id={`building-seo-${buildingKey}`} className="text-2xl md:text-3xl font-serif text-corporate-900 leading-tight border-b border-corporate-200 pb-6">
          {heading}
        </h2>
        <p className="text-lg text-corporate-600 leading-relaxed">
          {introLead}{' '}
          {isSummit ? (
            <>
              If you are also exploring office space options along Shaw Boulevard, you may consider{' '}
              <a href={otherBuildingHref} className={linkClass}>
                Facilities Centre
              </a>
              .
              {' '}You can also explore our{' '}
              <a href="/office-space-mandaluyong" className={linkClass}>
                Mandaluyong office space guide
              </a>{' '}
              for a broader view of available buildings.
            </>
          ) : (
            <>
              For companies comparing buildings along Shaw Boulevard,{' '}
              <a href={otherBuildingHref} className={linkClass}>
                Summit One Tower
              </a>{' '}
              is another option nearby.
              {' '}You can also explore our{' '}
              <a href="/office-space-mandaluyong" className={linkClass}>
                Mandaluyong office space guide
              </a>{' '}
              for a broader view of available buildings.
            </>
          )}
        </p>
      </header>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{locationTitle}</h3>
        <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
          {(isSummit ? summitLocationPoints : facilitiesLocationPoints).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{tenantTitle}</h3>
        <ul className="list-disc pl-5 space-y-3 text-lg text-corporate-600 leading-relaxed">
          {(isSummit ? summitTenantBullets : facilitiesTenantBullets).map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{pricingTitle}</h3>
        <p className="text-lg text-corporate-600 leading-relaxed">{pricingContextParagraph}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{faqTitle}</h3>
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
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{linksTitle}</h3>
        <ul className="space-y-3 text-lg text-corporate-600 leading-relaxed">
          <li>
            <a href="/#projects" className={linkClass}>
              Browse all office buildings on the overview
            </a>
          </li>
          <li>
            <a href="/blog" className={linkClass}>
              Leasing and workplace insights on our blog
            </a>
          </li>
          <li>
            <a href="/#contact" className={linkClass}>
              Contact Facilities Inc. for leasing questions
            </a>
          </li>
        </ul>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-bold text-corporate-900 uppercase tracking-widest">{otherSpacesTitle}</h3>
        <p className="text-lg text-corporate-600 leading-relaxed">
          {isSummit ? (
            <>
              Browse current listings at{' '}
              <a href={otherBuildingHref} className={linkClass}>
                Facilities Centre
              </a>
              .
            </>
          ) : (
            <>
              Browse current listings at{' '}
              <a href={otherBuildingHref} className={linkClass}>
                Summit One Tower
              </a>
              .
            </>
          )}
        </p>
      </div>
    </section>
  );
};
