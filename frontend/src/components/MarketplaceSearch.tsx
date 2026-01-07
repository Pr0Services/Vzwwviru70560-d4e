/**
 * CHE·NU™ — MARKETPLACE SEARCH
 * "Le Google des Marketplaces"
 * 
 * Unified shopping search across all major platforms:
 * - Amazon, eBay, Walmart, Best Buy (Retail)
 * - Facebook Marketplace, Kijiji, Craigslist (Secondhand)
 * - Geolocation for local deals
 * - AI-powered price analysis
 */

import React, { useState, useMemo, useCallback } from 'react';
import {
  ProductListing,
  MarketplaceSource,
  ProductCondition,
  SearchResults,
  PriceAnalysis,
  MARKETPLACE_CONFIG,
  generateDemoListings
} from '../types/marketplace.types';

// ═══════════════════════════════════════════════════════════════════════════
// MARKETPLACE SEARCH COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface MarketplaceSearchProps {
  userLocation?: { lat: number; lng: number; city: string };
  onProductClick?: (listing: ProductListing) => void;
  onAddToCompare?: (listing: ProductListing) => void;
}

export const MarketplaceSearch: React.FC<MarketplaceSearchProps> = ({
  userLocation,
  onProductClick,
  onAddToCompare
}) => {
  // Search state
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<ProductListing[]>([]);
  
  // Filters
  const [enabledSources, setEnabledSources] = useState<MarketplaceSource[]>([
    'amazon', 'ebay', 'facebook', 'kijiji', 'walmart'
  ]);
  const [showSecondhand, setShowSecondhand] = useState(true);
  const [showRetail, setShowRetail] = useState(true);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [conditions, setConditions] = useState<ProductCondition[]>(['new', 'like_new', 'good']);
  const [localOnly, setLocalOnly] = useState(false);
  const [maxDistance, setMaxDistance] = useState(50);
  const [sortBy, setSortBy] = useState<'relevance' | 'price_asc' | 'price_desc' | 'distance'>('relevance');
  
  // UI
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeSourceFilter, setActiveSourceFilter] = useState<MarketplaceSource | 'all'>('all');
  const [selectedListing, setSelectedListing] = useState<ProductListing | null>(null);
  const [compareList, setCompareList] = useState<ProductListing[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Perform search
  const handleSearch = useCallback(async () => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const demoResults = generateDemoListings(query, 30);
    setResults(demoResults);
    setIsSearching(false);
  }, [query]);

  // Filter results
  const filteredResults = useMemo(() => {
    let filtered = results;

    // Source filter
    if (activeSourceFilter !== 'all') {
      filtered = filtered.filter(r => r.source === activeSourceFilter);
    } else {
      filtered = filtered.filter(r => enabledSources.includes(r.source));
    }

    // Type filter
    if (!showSecondhand) {
      filtered = filtered.filter(r => r.isNew);
    }
    if (!showRetail) {
      filtered = filtered.filter(r => !r.isNew);
    }

    // Price filter
    if (minPrice !== undefined) {
      filtered = filtered.filter(r => r.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(r => r.price <= maxPrice);
    }

    // Condition filter
    filtered = filtered.filter(r => conditions.includes(r.condition));

    // Local filter
    if (localOnly && userLocation) {
      filtered = filtered.filter(r => 
        r.location && (r.location.distance || 0) <= maxDistance
      );
    }

    // Sort
    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'distance':
        filtered.sort((a, b) => (a.location?.distance || 999) - (b.location?.distance || 999));
        break;
    }

    return filtered;
  }, [results, activeSourceFilter, enabledSources, showSecondhand, showRetail, 
      minPrice, maxPrice, conditions, localOnly, maxDistance, sortBy, userLocation]);

  // Price analysis
  const priceAnalysis = useMemo<PriceAnalysis | null>(() => {
    if (filteredResults.length === 0) return null;

    const prices = filteredResults.map(r => r.price);
    const sorted = [...prices].sort((a, b) => a - b);
    const avg = prices.reduce((a, b) => a + b, 0) / prices.length;
    const median = sorted[Math.floor(sorted.length / 2)];

    const bestDeals = filteredResults
      .filter(r => r.price < avg * 0.8)
      .slice(0, 3)
      .map(listing => ({
        listing,
        savingsPercent: Math.round((1 - listing.price / avg) * 100),
        reason: listing.isNew ? 'Below average retail price' : 'Great secondhand deal'
      }));

    return {
      lowestPrice: sorted[0],
      highestPrice: sorted[sorted.length - 1],
      averagePrice: Math.round(avg),
      medianPrice: median,
      bestDeals,
      recommendation: {
        buyNow: bestDeals.length > 0,
        reason: bestDeals.length > 0 
          ? 'Good deals available below market average' 
          : 'Prices are at market average, consider waiting for sales',
        suggestedMaxPrice: Math.round(avg * 0.9)
      },
      marketInsights: [
        `${filteredResults.filter(r => r.isNew).length} new items, ${filteredResults.filter(r => !r.isNew).length} secondhand`,
        `Average secondhand savings: ${Math.round((1 - (filteredResults.filter(r => !r.isNew).reduce((a, r) => a + r.price, 0) / filteredResults.filter(r => !r.isNew).length) / avg) * 100)}%`,
        `${filteredResults.filter(r => r.shipping?.freeShipping).length} items with free shipping`
      ]
    };
  }, [filteredResults]);

  // Source stats
  const sourceStats = useMemo(() => {
    const stats: Record<MarketplaceSource, number> = {} as any;
    results.forEach(r => {
      stats[r.source] = (stats[r.source] || 0) + 1;
    });
    return stats;
  }, [results]);

  // Toggle compare
  const toggleCompare = useCallback((listing: ProductListing) => {
    setCompareList(prev => {
      if (prev.find(l => l.id === listing.id)) {
        return prev.filter(l => l.id !== listing.id);
      }
      if (prev.length >= 4) return prev;
      return [...prev, listing];
    });
  }, []);

  return (
    <div style={containerStyles}>
      {/* Search Header */}
      <div style={headerStyles}>
        <div style={logoStyles}>
          <span style={{ fontSize: '1.5rem' }}>🛒</span>
          <span style={logoTextStyles}>Marketplace Search</span>
        </div>
        
        <div style={searchBarStyles}>
          <span style={searchIconStyles}>🔍</span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="Search across all marketplaces..."
            style={searchInputStyles}
          />
          {userLocation && (
            <span style={locationBadgeStyles}>
              📍 {userLocation.city}
            </span>
          )}
          <button onClick={handleSearch} style={searchButtonStyles}>
            Search
          </button>
        </div>

        <button onClick={() => setShowFilters(!showFilters)} style={filterToggleStyles}>
          ⚙️ Filters
        </button>
      </div>

      {/* Source Tabs */}
      {results.length > 0 && (
        <div style={sourceTabsStyles}>
          <SourceTab
            label="All"
            count={results.length}
            isActive={activeSourceFilter === 'all'}
            onClick={() => setActiveSourceFilter('all')}
          />
          {Object.entries(sourceStats).map(([source, count]) => (
            <SourceTab
              key={source}
              source={source as MarketplaceSource}
              count={count}
              isActive={activeSourceFilter === source}
              onClick={() => setActiveSourceFilter(source as MarketplaceSource)}
            />
          ))}
        </div>
      )}

      <div style={contentStyles}>
        {/* Filters Panel */}
        {showFilters && (
          <div style={filtersPanelStyles}>
            <h3 style={filtersTitleStyles}>Filters</h3>

            {/* Type */}
            <div style={filterGroupStyles}>
              <label style={filterLabelStyles}>Type</label>
              <div style={checkboxGroupStyles}>
                <label style={checkboxStyles}>
                  <input
                    type="checkbox"
                    checked={showRetail}
                    onChange={(e) => setShowRetail(e.target.checked)}
                  />
                  <span>New (Retail)</span>
                </label>
                <label style={checkboxStyles}>
                  <input
                    type="checkbox"
                    checked={showSecondhand}
                    onChange={(e) => setShowSecondhand(e.target.checked)}
                  />
                  <span>Secondhand</span>
                </label>
              </div>
            </div>

            {/* Price */}
            <div style={filterGroupStyles}>
              <label style={filterLabelStyles}>Price Range</label>
              <div style={priceRangeStyles}>
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice || ''}
                  onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
                  style={priceInputStyles}
                />
                <span>-</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice || ''}
                  onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
                  style={priceInputStyles}
                />
              </div>
            </div>

            {/* Condition */}
            <div style={filterGroupStyles}>
              <label style={filterLabelStyles}>Condition</label>
              <div style={checkboxGroupStyles}>
                {(['new', 'like_new', 'good', 'fair'] as ProductCondition[]).map(cond => (
                  <label key={cond} style={checkboxStyles}>
                    <input
                      type="checkbox"
                      checked={conditions.includes(cond)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConditions([...conditions, cond]);
                        } else {
                          setConditions(conditions.filter(c => c !== cond));
                        }
                      }}
                    />
                    <span style={{ textTransform: 'capitalize' }}>{cond.replace('_', ' ')}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Location */}
            {userLocation && (
              <div style={filterGroupStyles}>
                <label style={filterLabelStyles}>Location</label>
                <label style={checkboxStyles}>
                  <input
                    type="checkbox"
                    checked={localOnly}
                    onChange={(e) => setLocalOnly(e.target.checked)}
                  />
                  <span>Local only</span>
                </label>
                {localOnly && (
                  <div style={{ marginTop: '8px' }}>
                    <input
                      type="range"
                      min={5}
                      max={100}
                      value={maxDistance}
                      onChange={(e) => setMaxDistance(Number(e.target.value))}
                      style={{ width: '100%' }}
                    />
                    <span style={{ color: '#8D8371', fontSize: '0.75rem' }}>
                      Within {maxDistance} km
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Sources */}
            <div style={filterGroupStyles}>
              <label style={filterLabelStyles}>Sources</label>
              <div style={checkboxGroupStyles}>
                {Object.values(MARKETPLACE_CONFIG).slice(0, 8).map(config => (
                  <label key={config.id} style={checkboxStyles}>
                    <input
                      type="checkbox"
                      checked={enabledSources.includes(config.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setEnabledSources([...enabledSources, config.id]);
                        } else {
                          setEnabledSources(enabledSources.filter(s => s !== config.id));
                        }
                      }}
                    />
                    <span>{config.icon} {config.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Results */}
        <div style={mainStyles}>
          {/* Results header */}
          {results.length > 0 && (
            <div style={resultsHeaderStyles}>
              <div>
                <span style={{ color: '#E9E4D6', fontWeight: 500 }}>
                  {filteredResults.length} results
                </span>
                {query && <span style={{ color: '#8D8371' }}> for "{query}"</span>}
              </div>
              <div style={resultsActionsStyles}>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  style={sortSelectStyles}
                >
                  <option value="relevance">Relevance</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="distance">Distance</option>
                </select>
                <div style={viewToggleStyles}>
                  <button
                    onClick={() => setViewMode('grid')}
                    style={{
                      ...viewButtonStyles,
                      background: viewMode === 'grid' ? '#2F4C39' : 'transparent'
                    }}
                  >
                    ⊞
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    style={{
                      ...viewButtonStyles,
                      background: viewMode === 'list' ? '#2F4C39' : 'transparent'
                    }}
                  >
                    ☰
                  </button>
                </div>
                <button
                  onClick={() => setShowAnalysis(!showAnalysis)}
                  style={analysisToggleStyles}
                >
                  🤖 AI Analysis
                </button>
              </div>
            </div>
          )}

          {/* AI Analysis Panel */}
          {showAnalysis && priceAnalysis && (
            <PriceAnalysisPanel analysis={priceAnalysis} />
          )}

          {/* Loading */}
          {isSearching && (
            <div style={loadingStyles}>
              <div style={spinnerStyles}>🔄</div>
              <p>Searching across marketplaces...</p>
            </div>
          )}

          {/* Empty state */}
          {!isSearching && results.length === 0 && (
            <div style={emptyStyles}>
              <span style={{ fontSize: '4rem', opacity: 0.5 }}>🛒</span>
              <h3 style={{ color: '#E9E4D6', margin: '16px 0 8px' }}>
                Search All Marketplaces at Once
              </h3>
              <p style={{ color: '#8D8371', margin: 0 }}>
                Compare prices across Amazon, eBay, Facebook Marketplace, Kijiji and more
              </p>
            </div>
          )}

          {/* Results grid/list */}
          {!isSearching && filteredResults.length > 0 && (
            <div style={viewMode === 'grid' ? gridStyles : listStyles}>
              {filteredResults.map(listing => (
                <ProductCard
                  key={listing.id}
                  listing={listing}
                  viewMode={viewMode}
                  isComparing={compareList.some(l => l.id === listing.id)}
                  onSelect={() => setSelectedListing(listing)}
                  onCompare={() => toggleCompare(listing)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Compare bar */}
      {compareList.length > 0 && (
        <CompareBar
          items={compareList}
          onRemove={(id) => setCompareList(prev => prev.filter(l => l.id !== id))}
          onClear={() => setCompareList([])}
          onCompare={() => {/* Open comparison view */}}
        />
      )}

      {/* Detail modal */}
      {selectedListing && (
        <ProductDetailModal
          listing={selectedListing}
          onClose={() => setSelectedListing(null)}
          onCompare={() => toggleCompare(selectedListing)}
          isComparing={compareList.some(l => l.id === selectedListing.id)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SOURCE TAB
// ═══════════════════════════════════════════════════════════════════════════

interface SourceTabProps {
  label?: string;
  source?: MarketplaceSource;
  count: number;
  isActive: boolean;
  onClick: () => void;
}

const SourceTab: React.FC<SourceTabProps> = ({ label, source, count, isActive, onClick }) => {
  const config = source ? MARKETPLACE_CONFIG[source] : null;
  
  return (
    <button
      onClick={onClick}
      style={{
        ...sourceTabStyles,
        background: isActive ? (config?.color || '#3EB4A2') + '20' : 'transparent',
        borderColor: isActive ? (config?.color || '#3EB4A2') : 'transparent',
        color: isActive ? '#E9E4D6' : '#8D8371'
      }}
    >
      {config ? (
        <>
          <span>{config.icon}</span>
          <span>{config.name}</span>
        </>
      ) : (
        <span>{label}</span>
      )}
      <span style={tabCountStyles}>{count}</span>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT CARD
// ═══════════════════════════════════════════════════════════════════════════

interface ProductCardProps {
  listing: ProductListing;
  viewMode: 'grid' | 'list';
  isComparing: boolean;
  onSelect: () => void;
  onCompare: () => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  listing, viewMode, isComparing, onSelect, onCompare
}) => {
  const config = MARKETPLACE_CONFIG[listing.source];
  
  const cardStyle = viewMode === 'grid' ? gridCardStyles : listCardStyles;
  
  return (
    <div style={cardStyle} onClick={onSelect}>
      {/* Source badge */}
      <div style={{
        ...sourceBadgeStyles,
        background: config.color
      }}>
        {config.icon}
      </div>

      {/* Image */}
      <div style={viewMode === 'grid' ? gridImageStyles : listImageStyles}>
        <div style={imagePlaceholderStyles}>📷</div>
      </div>

      {/* Content */}
      <div style={cardContentStyles}>
        <h4 style={cardTitleStyles}>{listing.title}</h4>
        
        <div style={priceRowStyles}>
          <span style={priceStyles}>${listing.price}</span>
          {listing.originalPrice && (
            <span style={originalPriceStyles}>${listing.originalPrice}</span>
          )}
          {listing.shipping?.freeShipping && (
            <span style={freeShipStyles}>Free shipping</span>
          )}
        </div>

        <div style={cardMetaStyles}>
          <span style={{
            ...conditionBadgeStyles,
            background: listing.isNew ? '#3EB4A220' : '#D8B26A20',
            color: listing.isNew ? '#3EB4A2' : '#D8B26A'
          }}>
            {listing.isNew ? 'New' : listing.condition.replace('_', ' ')}
          </span>
          {listing.location && (
            <span style={locationStyles}>
              📍 {listing.location.city} ({listing.location.distance}km)
            </span>
          )}
        </div>

        <div style={sellerRowStyles}>
          <span>{listing.sellerName}</span>
          {listing.sellerRating && (
            <span style={ratingStyles}>⭐ {listing.sellerRating.toFixed(1)}</span>
          )}
        </div>
      </div>

      {/* Compare button */}
      <button
        onClick={(e) => { e.stopPropagation(); onCompare(); }}
        style={{
          ...compareButtonStyles,
          background: isComparing ? '#3EB4A2' : 'transparent',
          borderColor: isComparing ? '#3EB4A2' : '#2F4C39'
        }}
      >
        {isComparing ? '✓' : '+'}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PRICE ANALYSIS PANEL
// ═══════════════════════════════════════════════════════════════════════════

const PriceAnalysisPanel: React.FC<{ analysis: PriceAnalysis }> = ({ analysis }) => (
  <div style={analysisPanelStyles}>
    <div style={analysisHeaderStyles}>
      <span style={{ fontSize: '1.25rem' }}>🤖</span>
      <h3 style={{ margin: 0, color: '#E9E4D6' }}>AI Price Analysis</h3>
    </div>

    <div style={analysisGridStyles}>
      <div style={analysisStatStyles}>
        <span style={statLabelStyles}>Lowest</span>
        <span style={statValueStyles}>${analysis.lowestPrice}</span>
      </div>
      <div style={analysisStatStyles}>
        <span style={statLabelStyles}>Average</span>
        <span style={statValueStyles}>${analysis.averagePrice}</span>
      </div>
      <div style={analysisStatStyles}>
        <span style={statLabelStyles}>Highest</span>
        <span style={statValueStyles}>${analysis.highestPrice}</span>
      </div>
      <div style={analysisStatStyles}>
        <span style={statLabelStyles}>Suggested Max</span>
        <span style={{ ...statValueStyles, color: '#3EB4A2' }}>
          ${analysis.recommendation.suggestedMaxPrice}
        </span>
      </div>
    </div>

    {analysis.bestDeals.length > 0 && (
      <div style={bestDealsStyles}>
        <h4 style={{ margin: '0 0 8px', color: '#D8B26A' }}>🔥 Best Deals</h4>
        {analysis.bestDeals.map((deal, i) => (
          <div key={i} style={dealItemStyles}>
            <span>{deal.listing.title.slice(0, 30)}...</span>
            <span style={{ color: '#3EB4A2' }}>-{deal.savingsPercent}%</span>
          </div>
        ))}
      </div>
    )}

    <div style={insightsStyles}>
      {analysis.marketInsights.map((insight, i) => (
        <div key={i} style={insightItemStyles}>• {insight}</div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPARE BAR
// ═══════════════════════════════════════════════════════════════════════════

interface CompareBarProps {
  items: ProductListing[];
  onRemove: (id: string) => void;
  onClear: () => void;
  onCompare: () => void;
}

const CompareBar: React.FC<CompareBarProps> = ({ items, onRemove, onClear, onCompare }) => (
  <div style={compareBarStyles}>
    <span style={{ color: '#E9E4D6' }}>Compare ({items.length}/4)</span>
    <div style={compareItemsStyles}>
      {items.map(item => (
        <div key={item.id} style={compareItemStyles}>
          <span>{item.title.slice(0, 20)}...</span>
          <button onClick={() => onRemove(item.id)} style={removeItemStyles}>✕</button>
        </div>
      ))}
    </div>
    <div style={{ display: 'flex', gap: '8px' }}>
      <button onClick={onClear} style={clearCompareStyles}>Clear</button>
      <button onClick={onCompare} style={doCompareStyles}>Compare</button>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PRODUCT DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface ProductDetailModalProps {
  listing: ProductListing;
  onClose: () => void;
  onCompare: () => void;
  isComparing: boolean;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  listing, onClose, onCompare, isComparing
}) => {
  const config = MARKETPLACE_CONFIG[listing.source];
  
  return (
    <>
      <div style={backdropStyles} onClick={onClose} />
      <div style={modalStyles}>
        <button onClick={onClose} style={modalCloseStyles}>✕</button>

        <div style={modalImageStyles}>
          <div style={imagePlaceholderStyles}>📷</div>
        </div>

        <div style={modalContentStyles}>
          <div style={{
            ...sourceBadgeStyles,
            background: config.color,
            position: 'static',
            marginBottom: '12px'
          }}>
            {config.icon} {config.name}
          </div>

          <h2 style={modalTitleStyles}>{listing.title}</h2>
          
          <div style={modalPriceStyles}>
            <span style={{ fontSize: '1.75rem', color: '#3EB4A2', fontWeight: 700 }}>
              ${listing.price}
            </span>
            {listing.originalPrice && (
              <span style={{ textDecoration: 'line-through', color: '#8D8371' }}>
                ${listing.originalPrice}
              </span>
            )}
          </div>

          <p style={modalDescStyles}>{listing.description}</p>

          <div style={modalInfoGridStyles}>
            <div>
              <span style={{ color: '#8D8371' }}>Condition</span>
              <span style={{ color: '#E9E4D6', textTransform: 'capitalize' }}>
                {listing.condition.replace('_', ' ')}
              </span>
            </div>
            <div>
              <span style={{ color: '#8D8371' }}>Seller</span>
              <span style={{ color: '#E9E4D6' }}>{listing.sellerName}</span>
            </div>
            {listing.location && (
              <div>
                <span style={{ color: '#8D8371' }}>Location</span>
                <span style={{ color: '#E9E4D6' }}>
                  {listing.location.city}, {listing.location.region}
                </span>
              </div>
            )}
            {listing.shipping && (
              <div>
                <span style={{ color: '#8D8371' }}>Shipping</span>
                <span style={{ color: '#E9E4D6' }}>
                  {listing.shipping.freeShipping ? 'Free' : `$${listing.shipping.price}`}
                </span>
              </div>
            )}
          </div>

          <div style={modalActionsStyles}>
            <a
              href={listing.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={viewExternalStyles}
            >
              View on {config.name} →
            </a>
            <button
              onClick={onCompare}
              style={{
                ...modalCompareStyles,
                background: isComparing ? '#3EB4A2' : 'transparent',
                borderColor: '#3EB4A2',
                color: isComparing ? '#E9E4D6' : '#3EB4A2'
              }}
            >
              {isComparing ? '✓ Comparing' : '+ Compare'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES (abbreviated for space - full styles included)
// ═══════════════════════════════════════════════════════════════════════════

const containerStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  background: '#0D0D0D'
};

const headerStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px 24px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39'
};

const logoStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const logoTextStyles: React.CSSProperties = {
  color: '#E9E4D6',
  fontSize: '1.125rem',
  fontWeight: 600
};

const searchBarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  flex: 1,
  maxWidth: '600px',
  padding: '10px 16px',
  background: '#0D0D0D',
  border: '1px solid #2F4C39',
  borderRadius: '24px'
};

const searchIconStyles: React.CSSProperties = {
  color: '#8D8371'
};

const searchInputStyles: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  outline: 'none'
};

const locationBadgeStyles: React.CSSProperties = {
  padding: '4px 10px',
  background: '#2F4C39',
  borderRadius: '12px',
  color: '#E9E4D6',
  fontSize: '0.75rem'
};

const searchButtonStyles: React.CSSProperties = {
  padding: '8px 20px',
  background: 'linear-gradient(135deg, #3EB4A2 0%, #3F7249 100%)',
  border: 'none',
  borderRadius: '16px',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  fontWeight: 600,
  cursor: 'pointer'
};

const filterToggleStyles: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  color: '#8D8371',
  cursor: 'pointer'
};

const sourceTabsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  padding: '12px 24px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39',
  overflow: 'auto'
};

const sourceTabStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '20px',
  color: '#8D8371',
  fontSize: '0.8125rem',
  cursor: 'pointer',
  whiteSpace: 'nowrap'
};

const tabCountStyles: React.CSSProperties = {
  padding: '2px 6px',
  background: '#2F4C39',
  borderRadius: '8px',
  fontSize: '0.6875rem'
};

const contentStyles: React.CSSProperties = {
  display: 'flex',
  flex: 1,
  overflow: 'hidden'
};

const filtersPanelStyles: React.CSSProperties = {
  width: '260px',
  padding: '20px',
  background: '#1E1F22',
  borderRight: '1px solid #2F4C39',
  overflow: 'auto'
};

const filtersTitleStyles: React.CSSProperties = {
  margin: '0 0 20px',
  color: '#E9E4D6',
  fontSize: '1rem'
};

const filterGroupStyles: React.CSSProperties = {
  marginBottom: '20px'
};

const filterLabelStyles: React.CSSProperties = {
  display: 'block',
  marginBottom: '8px',
  color: '#8D8371',
  fontSize: '0.8125rem',
  fontWeight: 500
};

const checkboxGroupStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const checkboxStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  color: '#E9E4D6',
  fontSize: '0.8125rem',
  cursor: 'pointer'
};

const priceRangeStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const priceInputStyles: React.CSSProperties = {
  width: '80px',
  padding: '8px',
  background: '#0D0D0D',
  border: '1px solid #2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6',
  fontSize: '0.875rem'
};

const mainStyles: React.CSSProperties = {
  flex: 1,
  padding: '20px',
  overflow: 'auto'
};

const resultsHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '16px'
};

const resultsActionsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const sortSelectStyles: React.CSSProperties = {
  padding: '8px 12px',
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6',
  fontSize: '0.8125rem'
};

const viewToggleStyles: React.CSSProperties = {
  display: 'flex',
  gap: '4px'
};

const viewButtonStyles: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6',
  cursor: 'pointer'
};

const analysisToggleStyles: React.CSSProperties = {
  padding: '8px 16px',
  background: '#D8B26A20',
  border: '1px solid #D8B26A',
  borderRadius: '6px',
  color: '#D8B26A',
  fontSize: '0.8125rem',
  cursor: 'pointer'
};

const loadingStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px',
  color: '#8D8371'
};

const spinnerStyles: React.CSSProperties = {
  fontSize: '2rem',
  animation: 'spin 1s linear infinite'
};

const emptyStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '80px 40px',
  textAlign: 'center'
};

const gridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
  gap: '16px'
};

const listStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '12px'
};

const gridCardStyles: React.CSSProperties = {
  position: 'relative',
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'border-color 0.15s'
};

const listCardStyles: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  position: 'relative',
  padding: '16px',
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '12px',
  cursor: 'pointer'
};

const sourceBadgeStyles: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  padding: '4px 8px',
  borderRadius: '6px',
  color: '#FFF',
  fontSize: '0.75rem',
  fontWeight: 600,
  zIndex: 1
};

const gridImageStyles: React.CSSProperties = {
  height: '160px',
  background: '#0D0D0D'
};

const listImageStyles: React.CSSProperties = {
  width: '120px',
  height: '120px',
  background: '#0D0D0D',
  borderRadius: '8px',
  flexShrink: 0
};

const imagePlaceholderStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2rem',
  color: '#8D8371',
  opacity: 0.5
};

const cardContentStyles: React.CSSProperties = {
  flex: 1,
  padding: '12px'
};

const cardTitleStyles: React.CSSProperties = {
  margin: '0 0 8px',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  fontWeight: 500,
  display: '-webkit-box',
  WebkitLineClamp: 2,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden'
};

const priceRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px'
};

const priceStyles: React.CSSProperties = {
  color: '#3EB4A2',
  fontSize: '1.125rem',
  fontWeight: 700
};

const originalPriceStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.8125rem',
  textDecoration: 'line-through'
};

const freeShipStyles: React.CSSProperties = {
  padding: '2px 6px',
  background: '#3EB4A220',
  borderRadius: '4px',
  color: '#3EB4A2',
  fontSize: '0.625rem'
};

const cardMetaStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '8px'
};

const conditionBadgeStyles: React.CSSProperties = {
  padding: '2px 8px',
  borderRadius: '8px',
  fontSize: '0.6875rem',
  fontWeight: 500,
  textTransform: 'capitalize'
};

const locationStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.75rem'
};

const sellerRowStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  color: '#8D8371',
  fontSize: '0.75rem'
};

const ratingStyles: React.CSSProperties = {
  color: '#D8B26A'
};

const compareButtonStyles: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6',
  cursor: 'pointer',
  zIndex: 1
};

const analysisPanelStyles: React.CSSProperties = {
  padding: '16px',
  marginBottom: '16px',
  background: '#1E1F22',
  border: '1px solid #D8B26A40',
  borderRadius: '12px'
};

const analysisHeaderStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '16px'
};

const analysisGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '16px',
  marginBottom: '16px'
};

const analysisStatStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const statLabelStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.75rem'
};

const statValueStyles: React.CSSProperties = {
  color: '#E9E4D6',
  fontSize: '1.25rem',
  fontWeight: 600
};

const bestDealsStyles: React.CSSProperties = {
  padding: '12px',
  background: '#0D0D0D',
  borderRadius: '8px',
  marginBottom: '12px'
};

const dealItemStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  padding: '4px 0',
  color: '#E9E4D6',
  fontSize: '0.8125rem'
};

const insightsStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '4px'
};

const insightItemStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const compareBarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '12px 24px',
  background: '#1E1F22',
  borderTop: '1px solid #3EB4A2'
};

const compareItemsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flex: 1
};

const compareItemStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '6px 10px',
  background: '#2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6',
  fontSize: '0.75rem'
};

const removeItemStyles: React.CSSProperties = {
  background: 'transparent',
  border: 'none',
  color: '#8D8371',
  cursor: 'pointer'
};

const clearCompareStyles: React.CSSProperties = {
  padding: '8px 16px',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '6px',
  color: '#8D8371',
  cursor: 'pointer'
};

const doCompareStyles: React.CSSProperties = {
  padding: '8px 20px',
  background: '#3EB4A2',
  border: 'none',
  borderRadius: '6px',
  color: '#E9E4D6',
  fontWeight: 600,
  cursor: 'pointer'
};

const backdropStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.7)',
  zIndex: 1000
};

const modalStyles: React.CSSProperties = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '500px',
  maxHeight: '90vh',
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '16px',
  overflow: 'auto',
  zIndex: 1001
};

const modalCloseStyles: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#0D0D0D',
  border: 'none',
  borderRadius: '50%',
  color: '#E9E4D6',
  cursor: 'pointer',
  zIndex: 1
};

const modalImageStyles: React.CSSProperties = {
  height: '200px',
  background: '#0D0D0D'
};

const modalContentStyles: React.CSSProperties = {
  padding: '20px'
};

const modalTitleStyles: React.CSSProperties = {
  margin: '0 0 12px',
  color: '#E9E4D6',
  fontSize: '1.25rem'
};

const modalPriceStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '16px'
};

const modalDescStyles: React.CSSProperties = {
  margin: '0 0 16px',
  color: '#8D8371',
  fontSize: '0.875rem',
  lineHeight: 1.6
};

const modalInfoGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  marginBottom: '20px'
};

const modalActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '12px'
};

const viewExternalStyles: React.CSSProperties = {
  flex: 1,
  padding: '12px 24px',
  background: 'linear-gradient(135deg, #3EB4A2 0%, #3F7249 100%)',
  border: 'none',
  borderRadius: '8px',
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  fontWeight: 600,
  textAlign: 'center',
  textDecoration: 'none',
  cursor: 'pointer'
};

const modalCompareStyles: React.CSSProperties = {
  padding: '12px 20px',
  background: 'transparent',
  border: '1px solid #3EB4A2',
  borderRadius: '8px',
  color: '#3EB4A2',
  fontSize: '0.9375rem',
  cursor: 'pointer'
};

export default MarketplaceSearch;
