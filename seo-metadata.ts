/**
 * SEO metadata for Facilities Inc — canonical URLs use live /units/... routes only.
 * Homepage JSON-LD: RealEstateAgent with logo, image, sameAs, and full PostalAddress.
 */

export const SITE_ORIGIN = 'https://facilitiesinc.netlify.app';

/** Interim org logo URL (matches deployed /images/); replace with /logo.png when a dedicated logo asset is added to public/. */
const HOME_ORG_LOGO_AND_IMAGE = `${SITE_ORIGIN}/images/summit-one-tower.png`;

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  h1: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: string;
  schema?: Record<string, unknown>;
}

export const seoMetadata: Record<string, SEOMetadata> = {
  home: {
    title: 'Facilities Inc | Office Space for Rent in Mandaluyong',
    description:
      'Facilities Inc offers premium office spaces for rent along Shaw Boulevard, Mandaluyong City. Units available in Summit One Tower and Facilities Centre. Inquire today.',
    keywords: [
      'office space for rent Mandaluyong',
      'office space Shaw Boulevard',
      'commercial space Mandaluyong',
      'office lease Mandaluyong City',
      'Summit One Tower',
      'Facilities Centre',
    ],
    h1: 'Office Space for Rent in Mandaluyong — Facilities Inc',
    canonicalUrl: `${SITE_ORIGIN}/`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
    schema: {
      '@context': 'https://schema.org',
      '@type': 'RealEstateAgent',
      name: 'Facilities, Inc',
      url: SITE_ORIGIN,
      logo: HOME_ORG_LOGO_AND_IMAGE,
      image: HOME_ORG_LOGO_AND_IMAGE,
      description:
        'Office space for lease in Mandaluyong, Philippines — Facilities, Inc. offers premium office units in Summit One Tower and Facilities Centre along Shaw Boulevard.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '23/F Summit One Tower, 530 Shaw Blvd',
        addressLocality: 'Mandaluyong City',
        postalCode: '1552',
        addressRegion: 'Metro Manila',
        addressCountry: 'PH',
      },
      telephone: '+639335383815',
      email: 'mercy.laurenciano@gmail.com',
      areaServed: 'Metro Manila',
      sameAs: [],
    },
  },

  summitOne: {
    title: 'Summit One Tower Office for Rent | Mandaluyong | FI',
    description:
      'Available office units in Summit One Tower, 530 Shaw Blvd, Mandaluyong. Spaces from 766 sqm. Near MRT Shaw Station. Contact Facilities Inc for a viewing today.',
    keywords: [
      'Summit One Tower office for rent',
      'office space 530 Shaw Boulevard',
      '766 sqm office Mandaluyong',
      'office near MRT Shaw',
      'commercial space Summit One',
    ],
    h1: 'Office Units for Rent in Summit One Tower, Shaw Boulevard',
    canonicalUrl: `${SITE_ORIGIN}/units/summit-one`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  },

  facilitiesCentre: {
    title: 'Facilities Centre Office for Rent | Shaw Blvd | FI',
    description:
      'Small to mid-size offices for rent at Facilities Centre, 548 Shaw Blvd, Mandaluyong. 37–858 sqm units available. Restroom included, 24/7 security. Inquire now.',
    keywords: [
      'Facilities Centre office for rent',
      'office space 548 Shaw Boulevard',
      '37 sqm office Mandaluyong',
      '858 sqm office for rent',
      'small office space Mandaluyong',
    ],
    h1: 'Office Units for Rent at Facilities Centre, Shaw Boulevard',
    canonicalUrl: `${SITE_ORIGIN}/units/facilities-centre`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/facilities-centre.png`,
  },

  officeSpaceMandaluyong: {
    title: 'Office Space for Rent in Mandaluyong | Summit One & Facilities Centre | FI',
    description:
      'Explore office space for rent in Mandaluyong along Shaw Boulevard. Browse Summit One Tower and Facilities Centre listings, location advantages, and leasing context.',
    keywords: [
      'office space for rent in Mandaluyong',
      'Mandaluyong office lease',
      'Shaw Boulevard office space',
      'Summit One Tower Mandaluyong',
      'Facilities Centre Mandaluyong',
      'commercial office Mandaluyong City',
    ],
    h1: 'Office Space for Rent in Mandaluyong',
    canonicalUrl: `${SITE_ORIGIN}/office-space-mandaluyong`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  },

  officeSpaceShawBoulevard: {
    title: 'Office Space for Rent Along Shaw Boulevard | Facilities Inc',
    description:
      'Explore office space for rent along Shaw Boulevard in Mandaluyong, including Summit One Tower and Facilities Centre. View available units and leasing options.',
    keywords: [
      'office space for rent along Shaw Boulevard',
      'Shaw Boulevard office space',
      'office for rent Shaw Boulevard Mandaluyong',
      'Summit One Tower',
      'Facilities Centre',
      'Mandaluyong office space',
    ],
    h1: 'Office Space for Rent Along Shaw Boulevard',
    canonicalUrl: `${SITE_ORIGIN}/office-space-shaw-boulevard`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  },

  officeSpaceNearOrtigas: {
    title: 'Office Space for Rent Near Ortigas | Facilities Inc',
    description:
      'Explore office space for rent near Ortigas, including buildings in Mandaluyong with convenient access to the Ortigas CBD. View available units and leasing options.',
    keywords: [
      'office space for rent near Ortigas',
      'office space near Ortigas CBD',
      'office for rent near Ortigas',
      'Mandaluyong office space',
      'Summit One Tower',
      'Facilities Centre',
    ],
    h1: 'Office Space for Rent Near Ortigas',
    canonicalUrl: `${SITE_ORIGIN}/office-space-near-ortigas`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  },

  officeRentalMandaluyong: {
    title: 'Office Rental in Mandaluyong | Facilities Inc',
    description:
      'Explore office rental in Mandaluyong, including pricing, leasing considerations, and available office spaces along Shaw Boulevard. View current units and options.',
    keywords: [
      'office rental Mandaluyong',
      'office rent in Mandaluyong',
      'office for rent Mandaluyong',
      'Shaw Boulevard office rental',
      'Summit One Tower',
      'Facilities Centre',
    ],
    h1: 'Office Rental in Mandaluyong',
    canonicalUrl: `${SITE_ORIGIN}/office-rental-mandaluyong`,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  },

  login: {
    title: 'Login | Facilities Inc',
    description: 'Sign in to the Facilities Inc admin portal.',
    keywords: ['Facilities Inc', 'admin login'],
    h1: 'Admin Portal',
    canonicalUrl: `${SITE_ORIGIN}/login`,
    ogType: 'website',
  },

  resetPassword: {
    title: 'Reset Password | Facilities Inc',
    description: 'Set a new password for your Facilities Inc admin account.',
    keywords: ['Facilities Inc', 'password reset'],
    h1: 'Set New Password',
    canonicalUrl: `${SITE_ORIGIN}/reset-password`,
    ogType: 'website',
  },

  admin: {
    title: 'Admin Dashboard | Facilities Inc',
    description: 'Facilities Inc unit inventory and lead management.',
    keywords: ['Facilities Inc', 'admin'],
    h1: 'Management Console',
    canonicalUrl: `${SITE_ORIGIN}/admin`,
    ogType: 'website',
  },

  blogIndex: {
    title: 'Blog | Facilities Inc',
    description: 'Insights and updates on office space leasing and commercial real estate in Mandaluyong City.',
    keywords: ['Facilities Inc', 'blog', 'office space', 'commercial real estate', 'Mandaluyong'],
    h1: 'Blog',
    canonicalUrl: `${SITE_ORIGIN}/blog`,
    ogType: 'website',
  },
};

export function getSEOMetadata(route: keyof typeof seoMetadata | string, overrides?: Partial<SEOMetadata>): SEOMetadata {
  const base = seoMetadata[route as keyof typeof seoMetadata] ?? seoMetadata.home;
  return { ...base, ...overrides };
}

export interface UnitPageSEOInput {
  unit_number: string;
  area: string;
  building_name: string;
  condition: string;
  status: string;
  /** Raw `building` param from React Router — no normalization */
  buildingParam: string;
  /** Human-readable URL segment (`url_slug`), never a legacy UUID */
  unitSlug: string;
}

/** Section 4.4 template; canonical uses slug segment (not legacy UUID) */
export interface BlogPostSEOInput {
  slug: string;
  title: string;
  excerpt?: string;
  coverImageUrl?: string;
}

export function buildBlogPostSEO(input: BlogPostSEOInput): SEOMetadata {
  const canonicalUrl = `${SITE_ORIGIN}/blog/${input.slug}`;
  const description = input.excerpt || 'Read more on the Facilities Inc blog.';
  
  return {
    title: `${input.title} | Facilities Inc Blog`,
    description: description.length > 160 ? `${description.slice(0, 157)}…` : description,
    keywords: [input.title, 'Facilities Inc', 'blog', 'commercial real estate'],
    h1: input.title,
    canonicalUrl,
    ogType: 'article',
    ogImage: input.coverImageUrl || `${SITE_ORIGIN}/images/summit-one-tower.png`,
  };
}

export function buildUnitPageSEO(input: UnitPageSEOInput): SEOMetadata {
  const canonicalUrl = `${SITE_ORIGIN}/units/${input.buildingParam}/${input.unitSlug}`;
  const title = `Unit ${input.unit_number} — ${input.area} sqm Office for Rent, ${input.building_name}, Mandaluyong`;

  const featureParts = [input.condition?.trim(), input.status?.trim()].filter(Boolean);
  const featureClause = featureParts.length ? `${featureParts.join(', ')}. ` : '';

  let description = `${input.area} sqm office unit ${input.unit_number} available for rent at ${input.building_name}, Shaw Boulevard, Mandaluyong. ${featureClause}Contact Facilities Inc to schedule a viewing.`;
  if (description.length > 160) {
    description = `${description.slice(0, 157).trimEnd()}…`;
  }

  const keywords = [
    `Unit ${input.unit_number} office for rent Mandaluyong`,
    `${input.area} sqm office Shaw Boulevard`,
    `${input.building_name} ${input.unit_number}`,
  ];

  return {
    title,
    description,
    keywords,
    h1: title,
    canonicalUrl,
    ogType: 'website',
    ogImage: `${SITE_ORIGIN}/images/summit-one-tower.png`,
  };
}
