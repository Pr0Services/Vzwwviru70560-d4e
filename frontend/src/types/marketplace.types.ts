/**
 * CHE·NU™ — Marketplace Types
 * Types pour la recherche unifiée de marketplace
 */

// ═══════════════════════════════════════════════════════════════════════════════
// SOURCES & CONDITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export type MarketplaceSource = 
  | 'amazon'
  | 'ebay'
  | 'walmart'
  | 'bestbuy'
  | 'facebook_marketplace'
  | 'kijiji'
  | 'craigslist'
  | 'etsy'
  | 'aliexpress';

export type ProductCondition = 
  | 'new'
  | 'like_new'
  | 'good'
  | 'fair'
  | 'for_parts';

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT LISTING
// ═══════════════════════════════════════════════════════════════════════════════

export interface ProductListing {
  id: string;
  source: MarketplaceSource;
  title: string;
  description: string;
  price: number;
  currency: string;
  condition: ProductCondition;
  imageUrl: string;
  productUrl: string;
  sellerName: string;
  sellerRating: number;
  location?: {
    city: string;
    distance?: number;
  };
  shippingCost?: number;
  freeShipping: boolean;
  createdAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// SEARCH & ANALYSIS
// ═══════════════════════════════════════════════════════════════════════════════

export interface SearchResults {
  query: string;
  totalResults: number;
  listings: ProductListing[];
  priceRange: {
    min: number;
    max: number;
    average: number;
  };
  sources: MarketplaceSource[];
}

export interface PriceAnalysis {
  productId: string;
  averagePrice: number;
  lowestPrice: number;
  highestPrice: number;
  priceHistory: Array<{ date: string; price: number }>;
  recommendation: 'buy_now' | 'wait' | 'good_deal' | 'overpriced';
  confidence: number;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export interface MarketplaceConfig {
  id: MarketplaceSource;
  name: string;
  icon: string;
  color: string;
  enabled: boolean;
  priority: number;
}

export const MARKETPLACE_CONFIG: Record<MarketplaceSource, MarketplaceConfig> = {
  amazon: { id: 'amazon', name: 'Amazon', icon: '📦', color: '#FF9900', enabled: true, priority: 1 },
  ebay: { id: 'ebay', name: 'eBay', icon: '🏷️', color: '#E53238', enabled: true, priority: 2 },
  walmart: { id: 'walmart', name: 'Walmart', icon: '🛒', color: '#0071DC', enabled: true, priority: 3 },
  bestbuy: { id: 'bestbuy', name: 'Best Buy', icon: '🔌', color: '#0046BE', enabled: true, priority: 4 },
  facebook_marketplace: { id: 'facebook_marketplace', name: 'FB Marketplace', icon: '👥', color: '#1877F2', enabled: true, priority: 5 },
  kijiji: { id: 'kijiji', name: 'Kijiji', icon: '🍁', color: '#373373', enabled: true, priority: 6 },
  craigslist: { id: 'craigslist', name: 'Craigslist', icon: '📋', color: '#5A269A', enabled: true, priority: 7 },
  etsy: { id: 'etsy', name: 'Etsy', icon: '🎨', color: '#F56400', enabled: true, priority: 8 },
  aliexpress: { id: 'aliexpress', name: 'AliExpress', icon: '🌏', color: '#E62E04', enabled: true, priority: 9 },
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEMO DATA
// ═══════════════════════════════════════════════════════════════════════════════

export function generateDemoListings(query: string, count: number = 10): ProductListing[] {
  const sources: MarketplaceSource[] = ['amazon', 'ebay', 'walmart', 'facebook_marketplace', 'kijiji'];
  const conditions: ProductCondition[] = ['new', 'like_new', 'good'];
  
  return Array.from({ length: count }, (_, i) => ({
    id: `listing-${i}`,
    source: sources[i % sources.length],
    title: `${query} - Item ${i + 1}`,
    description: `High-quality ${query} in excellent condition`,
    price: Math.floor(Math.random() * 500) + 50,
    currency: 'CAD',
    condition: conditions[i % conditions.length],
    imageUrl: `https://placeholder.com/300x300?text=${encodeURIComponent(query)}`,
    productUrl: `https://example.com/product/${i}`,
    sellerName: `Seller${i}`,
    sellerRating: Math.floor(Math.random() * 2) + 3,
    location: { city: 'Montreal', distance: Math.floor(Math.random() * 50) },
    freeShipping: Math.random() > 0.5,
    createdAt: new Date().toISOString(),
  }));
}
