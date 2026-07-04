import { Helmet } from 'react-helmet-async';
import type { SEOMetadata } from './seo-metadata';

export interface SEOHeadProps extends SEOMetadata {
  /** e.g. `noindex,nofollow` for auth routes */
  robots?: string;
}

export function SEOHead({
  title,
  description,
  keywords,
  h1: _h1,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  schema,
  robots,
}: SEOHeadProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords.length > 0 && <meta name="keywords" content={keywords.join(', ')} />}
      {robots ? <meta name="robots" content={robots} /> : null}
      <link rel="canonical" href={canonicalUrl} />

      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      {ogImage ? <meta property="og:image" content={ogImage} /> : null}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {ogImage ? <meta name="twitter:image" content={ogImage} /> : null}

      {schema ? (
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      ) : null}
    </Helmet>
  );
}
