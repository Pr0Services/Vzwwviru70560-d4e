/**
 * ═══════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — SEO COMPONENT
 * Phase 10: Final Polish & Launch
 * ═══════════════════════════════════════════════════════════════════════════
 */

import React from 'react';
import { Helmet } from 'react-helmet-async';

interface Props {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  url?: string;
}

export const SEO: React.FC<Props> = ({
  title = 'CHE·NU - Governed Intelligence Operating System',
  description = 'AI-powered life management system with governed intelligence, collaborative workspaces, and advanced analytics.',
  keywords = ['AI', 'productivity', 'intelligence', 'governance', 'CHE·NU'],
  image = '/og-image.png',
  url = 'https://chenu.ai',
}) => {
  const fullTitle = title.includes('CHE·NU') ? title : `${title} | CHE·NU`;

  return (
    <Helmet>
      {/* Basic */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords.join(', ')} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {/* PWA */}
      <meta name="theme-color" content="#d8b26a" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
    </Helmet>
  );
};
