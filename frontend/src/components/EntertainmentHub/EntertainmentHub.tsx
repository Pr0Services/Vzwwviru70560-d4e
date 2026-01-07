/**
 * CHE·NU™ — ENTERTAINMENT HUB
 * Unified streaming & entertainment center
 * 
 * INTEGRATES:
 * - YouTube (Watch, playlists, subscriptions)
 * - Netflix (Browse, continue watching)
 * - Amazon Prime Video
 * - Spotify (Music)
 * - Twitch (Live streams)
 * - Disney+, Apple TV+, etc.
 */

import React, { useState, useMemo } from 'react';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type StreamingService = 
  | 'youtube'
  | 'netflix'
  | 'prime'
  | 'spotify'
  | 'twitch'
  | 'disney'
  | 'appletv'
  | 'hbomax';

export interface StreamingServiceConfig {
  id: StreamingService;
  name: string;
  icon: string;
  color: string;
  type: 'video' | 'music' | 'live';
}

export interface MediaItem {
  id: string;
  service: StreamingService;
  type: 'movie' | 'show' | 'video' | 'track' | 'stream' | 'playlist';
  title: string;
  subtitle?: string;
  thumbnail: string;
  duration?: number;
  progress?: number; // 0-100
  rating?: number;
  year?: number;
  genres?: string[];
  externalUrl: string;
}

export interface ContinueWatching {
  item: MediaItem;
  lastWatched: Date;
  remainingTime: number;
}

export const STREAMING_CONFIG: Record<StreamingService, StreamingServiceConfig> = {
  youtube: { id: 'youtube', name: 'YouTube', icon: '▶️', color: '#FF0000', type: 'video' },
  netflix: { id: 'netflix', name: 'Netflix', icon: '🎬', color: '#E50914', type: 'video' },
  prime: { id: 'prime', name: 'Prime Video', icon: '📺', color: '#00A8E1', type: 'video' },
  spotify: { id: 'spotify', name: 'Spotify', icon: '🎵', color: '#1DB954', type: 'music' },
  twitch: { id: 'twitch', name: 'Twitch', icon: '🎮', color: '#9146FF', type: 'live' },
  disney: { id: 'disney', name: 'Disney+', icon: '✨', color: '#0063E5', type: 'video' },
  appletv: { id: 'appletv', name: 'Apple TV+', icon: '🍎', color: '#000000', type: 'video' },
  hbomax: { id: 'hbomax', name: 'Max', icon: '🎭', color: '#B103FC', type: 'video' }
};

// ═══════════════════════════════════════════════════════════════════════════
// ENTERTAINMENT HUB COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface EntertainmentHubProps {
  connectedServices: StreamingService[];
  onConnectService: (service: StreamingService) => void;
  onDisconnectService: (service: StreamingService) => void;
}

export const EntertainmentHub: React.FC<EntertainmentHubProps> = ({
  connectedServices,
  onConnectService,
  onDisconnectService
}) => {
  const [activeService, setActiveService] = useState<StreamingService | 'all'>('all');
  const [activeTab, setActiveTab] = useState<'home' | 'browse' | 'watchlist' | 'search'>('home');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);

  // Demo data
  const continueWatching = useMemo<ContinueWatching[]>(() => [
    {
      item: {
        id: '1',
        service: 'netflix',
        type: 'show',
        title: 'Stranger Things',
        subtitle: 'S4 E7 - The Massacre at Hawkins Lab',
        thumbnail: '',
        duration: 78,
        progress: 45,
        rating: 8.7,
        externalUrl: 'https://netflix.com/watch/1'
      },
      lastWatched: new Date(Date.now() - 86400000),
      remainingTime: 43
    },
    {
      item: {
        id: '2',
        service: 'youtube',
        type: 'video',
        title: 'Building a $10M SaaS - Complete Guide',
        subtitle: 'TechFounders',
        thumbnail: '',
        duration: 45,
        progress: 72,
        externalUrl: 'https://youtube.com/watch?v=abc'
      },
      lastWatched: new Date(Date.now() - 3600000),
      remainingTime: 13
    },
    {
      item: {
        id: '3',
        service: 'prime',
        type: 'movie',
        title: 'The Boys',
        subtitle: 'S3 E4 - Glorious Five Year Plan',
        thumbnail: '',
        duration: 58,
        progress: 30,
        rating: 8.9,
        externalUrl: 'https://primevideo.com/watch/3'
      },
      lastWatched: new Date(Date.now() - 172800000),
      remainingTime: 41
    }
  ], []);

  const trending = useMemo<MediaItem[]>(() => [
    { id: 't1', service: 'netflix', type: 'movie', title: 'Glass Onion', thumbnail: '', rating: 7.2, year: 2022, genres: ['Mystery', 'Comedy'], externalUrl: '#' },
    { id: 't2', service: 'prime', type: 'show', title: 'The Rings of Power', thumbnail: '', rating: 6.9, year: 2022, genres: ['Fantasy', 'Drama'], externalUrl: '#' },
    { id: 't3', service: 'disney', type: 'show', title: 'Andor', thumbnail: '', rating: 8.4, year: 2022, genres: ['Sci-Fi', 'Action'], externalUrl: '#' },
    { id: 't4', service: 'youtube', type: 'video', title: 'MrBeast Latest Challenge', subtitle: '50M views', thumbnail: '', externalUrl: '#' },
    { id: 't5', service: 'netflix', type: 'show', title: 'Wednesday', thumbnail: '', rating: 8.1, year: 2022, genres: ['Comedy', 'Horror'], externalUrl: '#' },
    { id: 't6', service: 'twitch', type: 'stream', title: 'xQc - Just Chatting', subtitle: '45K viewers', thumbnail: '', externalUrl: '#' }
  ], []);

  const watchlist = useMemo<MediaItem[]>(() => [
    { id: 'w1', service: 'netflix', type: 'movie', title: 'All Quiet on the Western Front', thumbnail: '', rating: 7.8, year: 2022, genres: ['War', 'Drama'], externalUrl: '#' },
    { id: 'w2', service: 'prime', type: 'show', title: 'Jack Ryan', thumbnail: '', rating: 8.0, year: 2018, genres: ['Action', 'Thriller'], externalUrl: '#' },
    { id: 'w3', service: 'disney', type: 'movie', title: 'Avatar: The Way of Water', thumbnail: '', rating: 7.8, year: 2022, genres: ['Sci-Fi', 'Adventure'], externalUrl: '#' }
  ], []);

  const nowPlaying = useMemo(() => ({
    service: 'spotify' as StreamingService,
    track: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    progress: 65
  }), []);

  return (
    <div style={containerStyles}>
      {/* Header */}
      <div style={headerStyles}>
        <div style={headerLeftStyles}>
          <span style={{ fontSize: '1.5rem' }}>🎬</span>
          <h1 style={titleStyles}>Entertainment</h1>
        </div>

        {/* Service tabs */}
        <div style={serviceTabsStyles}>
          <button
            onClick={() => setActiveService('all')}
            style={{
              ...serviceTabStyles,
              background: activeService === 'all' ? '#2F4C39' : 'transparent'
            }}
          >
            All
          </button>
          {connectedServices.map(service => {
            const config = STREAMING_CONFIG[service];
            return (
              <button
                key={service}
                onClick={() => setActiveService(service)}
                style={{
                  ...serviceTabStyles,
                  background: activeService === service ? `${config.color}30` : 'transparent',
                  borderColor: activeService === service ? config.color : 'transparent'
                }}
              >
                <span>{config.icon}</span>
                <span>{config.name}</span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div style={searchBarStyles}>
          <span>🔍</span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search movies, shows, videos..."
            style={searchInputStyles}
          />
        </div>
      </div>

      {/* Navigation tabs */}
      <div style={navTabsStyles}>
        {(['home', 'browse', 'watchlist', 'search'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...navTabStyles,
              color: activeTab === tab ? '#E9E4D6' : '#8D8371',
              borderBottomColor: activeTab === tab ? '#3EB4A2' : 'transparent'
            }}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Main content */}
      <div style={mainStyles}>
        {/* Now Playing (Spotify) */}
        {connectedServices.includes('spotify') && (
          <div style={nowPlayingStyles}>
            <div style={nowPlayingIconStyles}>🎵</div>
            <div style={{ flex: 1 }}>
              <div style={nowPlayingTrackStyles}>{nowPlaying.track}</div>
              <div style={nowPlayingArtistStyles}>{nowPlaying.artist} • {nowPlaying.album}</div>
            </div>
            <div style={playerControlsStyles}>
              <button style={controlButtonStyles}>⏮</button>
              <button style={playButtonStyles}>▶</button>
              <button style={controlButtonStyles}>⏭</button>
            </div>
            <div style={progressBarStyles}>
              <div style={{ ...progressFillStyles, width: `${nowPlaying.progress}%` }} />
            </div>
          </div>
        )}

        {/* Continue Watching */}
        <section style={sectionStyles}>
          <h2 style={sectionTitleStyles}>▶️ Continue Watching</h2>
          <div style={horizontalScrollStyles}>
            {continueWatching.map(({ item, remainingTime }) => (
              <ContinueCard
                key={item.id}
                item={item}
                remainingTime={remainingTime}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </section>

        {/* Trending */}
        <section style={sectionStyles}>
          <h2 style={sectionTitleStyles}>🔥 Trending Now</h2>
          <div style={horizontalScrollStyles}>
            {trending
              .filter(item => activeService === 'all' || item.service === activeService)
              .map(item => (
                <MediaCard
                  key={item.id}
                  item={item}
                  onClick={() => setSelectedItem(item)}
                />
              ))}
          </div>
        </section>

        {/* My Watchlist */}
        <section style={sectionStyles}>
          <h2 style={sectionTitleStyles}>📋 My Watchlist</h2>
          <div style={horizontalScrollStyles}>
            {watchlist.map(item => (
              <MediaCard
                key={item.id}
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            ))}
          </div>
        </section>

        {/* Connect more services */}
        <section style={sectionStyles}>
          <h2 style={sectionTitleStyles}>➕ Connect More Services</h2>
          <div style={servicesGridStyles}>
            {Object.values(STREAMING_CONFIG)
              .filter(config => !connectedServices.includes(config.id))
              .map(config => (
                <button
                  key={config.id}
                  onClick={() => onConnectService(config.id)}
                  style={connectServiceStyles}
                >
                  <div style={{
                    ...serviceIconStyles,
                    background: config.color
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>{config.icon}</span>
                  </div>
                  <span>{config.name}</span>
                </button>
              ))}
          </div>
        </section>
      </div>

      {/* Media detail modal */}
      {selectedItem && (
        <MediaDetailModal
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
        />
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONTINUE WATCHING CARD
// ═══════════════════════════════════════════════════════════════════════════

interface ContinueCardProps {
  item: MediaItem;
  remainingTime: number;
  onClick: () => void;
}

const ContinueCard: React.FC<ContinueCardProps> = ({ item, remainingTime, onClick }) => {
  const config = STREAMING_CONFIG[item.service];
  
  return (
    <div style={continueCardStyles} onClick={onClick}>
      {/* Thumbnail */}
      <div style={continueThumbnailStyles}>
        <div style={thumbnailPlaceholderStyles}>🎬</div>
        <div style={playOverlayStyles}>▶</div>
        <div style={{
          ...serviceTagStyles,
          background: config.color
        }}>
          {config.icon}
        </div>
      </div>
      
      {/* Progress bar */}
      <div style={continueProgressStyles}>
        <div style={{
          ...continueProgressFillStyles,
          width: `${item.progress}%`
        }} />
      </div>
      
      {/* Info */}
      <div style={continueInfoStyles}>
        <h4 style={continueTitleStyles}>{item.title}</h4>
        <p style={continueSubtitleStyles}>{item.subtitle}</p>
        <span style={remainingTimeStyles}>{remainingTime}m remaining</span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA CARD
// ═══════════════════════════════════════════════════════════════════════════

interface MediaCardProps {
  item: MediaItem;
  onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ item, onClick }) => {
  const config = STREAMING_CONFIG[item.service];
  
  return (
    <div style={mediaCardStyles} onClick={onClick}>
      {/* Thumbnail */}
      <div style={mediaThumbnailStyles}>
        <div style={thumbnailPlaceholderStyles}>🎬</div>
        <div style={playOverlayStyles}>▶</div>
        <div style={{
          ...serviceTagStyles,
          background: config.color
        }}>
          {config.icon}
        </div>
        {item.type === 'stream' && (
          <div style={liveTagStyles}>🔴 LIVE</div>
        )}
      </div>
      
      {/* Info */}
      <div style={mediaInfoStyles}>
        <h4 style={mediaTitleStyles}>{item.title}</h4>
        {item.subtitle && (
          <p style={mediaSubtitleStyles}>{item.subtitle}</p>
        )}
        <div style={mediaMetaStyles}>
          {item.rating && <span>⭐ {item.rating}</span>}
          {item.year && <span>{item.year}</span>}
          {item.genres && <span>{item.genres[0]}</span>}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MEDIA DETAIL MODAL
// ═══════════════════════════════════════════════════════════════════════════

interface MediaDetailModalProps {
  item: MediaItem;
  onClose: () => void;
}

const MediaDetailModal: React.FC<MediaDetailModalProps> = ({ item, onClose }) => {
  const config = STREAMING_CONFIG[item.service];
  
  return (
    <>
      <div style={backdropStyles} onClick={onClose} />
      <div style={modalStyles}>
        {/* Hero */}
        <div style={modalHeroStyles}>
          <div style={heroPlaceholderStyles}>🎬</div>
          <button onClick={onClose} style={closeButtonStyles}>✕</button>
          <div style={{
            ...modalServiceTagStyles,
            background: config.color
          }}>
            {config.icon} {config.name}
          </div>
        </div>

        {/* Content */}
        <div style={modalContentStyles}>
          <h2 style={modalTitleStyles}>{item.title}</h2>
          
          <div style={modalMetaStyles}>
            {item.rating && <span style={ratingBadgeStyles}>⭐ {item.rating}</span>}
            {item.year && <span>{item.year}</span>}
            {item.duration && <span>{item.duration}m</span>}
            {item.genres && item.genres.map(g => (
              <span key={g} style={genreBadgeStyles}>{g}</span>
            ))}
          </div>

          {item.subtitle && (
            <p style={modalSubtitleStyles}>{item.subtitle}</p>
          )}

          <div style={modalActionsStyles}>
            <a
              href={item.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={watchButtonStyles}
            >
              ▶ Watch on {config.name}
            </a>
            <button style={addToListStyles}>+ Add to Watchlist</button>
          </div>

          {/* Progress */}
          {item.progress !== undefined && (
            <div style={progressSectionStyles}>
              <div style={progressLabelStyles}>
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <div style={modalProgressBarStyles}>
                <div style={{
                  ...modalProgressFillStyles,
                  width: `${item.progress}%`
                }} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STYLES
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
  gap: '20px',
  padding: '16px 24px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39'
};

const headerLeftStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const titleStyles: React.CSSProperties = {
  margin: 0,
  color: '#E9E4D6',
  fontSize: '1.25rem',
  fontWeight: 600
};

const serviceTabsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  flex: 1
};

const serviceTabStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  padding: '8px 14px',
  background: 'transparent',
  border: '1px solid transparent',
  borderRadius: '20px',
  color: '#E9E4D6',
  fontSize: '0.8125rem',
  cursor: 'pointer'
};

const searchBarStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '8px 16px',
  background: '#0D0D0D',
  border: '1px solid #2F4C39',
  borderRadius: '20px',
  color: '#8D8371'
};

const searchInputStyles: React.CSSProperties = {
  width: '200px',
  background: 'transparent',
  border: 'none',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  outline: 'none'
};

const navTabsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '24px',
  padding: '0 24px',
  background: '#1E1F22',
  borderBottom: '1px solid #2F4C39'
};

const navTabStyles: React.CSSProperties = {
  padding: '16px 0',
  background: 'transparent',
  border: 'none',
  borderBottom: '2px solid transparent',
  color: '#8D8371',
  fontSize: '0.9375rem',
  cursor: 'pointer'
};

const mainStyles: React.CSSProperties = {
  flex: 1,
  padding: '24px',
  overflow: 'auto'
};

const nowPlayingStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px',
  padding: '16px',
  marginBottom: '24px',
  background: 'linear-gradient(135deg, #1DB95420 0%, #1E1F22 100%)',
  border: '1px solid #1DB954',
  borderRadius: '12px',
  position: 'relative'
};

const nowPlayingIconStyles: React.CSSProperties = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#1DB954',
  borderRadius: '8px',
  fontSize: '1.5rem'
};

const nowPlayingTrackStyles: React.CSSProperties = {
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  fontWeight: 600
};

const nowPlayingArtistStyles: React.CSSProperties = {
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const playerControlsStyles: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const controlButtonStyles: React.CSSProperties = {
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'transparent',
  border: 'none',
  color: '#E9E4D6',
  cursor: 'pointer'
};

const playButtonStyles: React.CSSProperties = {
  width: '40px',
  height: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#1DB954',
  border: 'none',
  borderRadius: '50%',
  color: '#FFF',
  cursor: 'pointer'
};

const progressBarStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: 0,
  right: 0,
  height: '3px',
  background: '#2F4C39',
  borderRadius: '0 0 12px 12px',
  overflow: 'hidden'
};

const progressFillStyles: React.CSSProperties = {
  height: '100%',
  background: '#1DB954'
};

const sectionStyles: React.CSSProperties = {
  marginBottom: '32px'
};

const sectionTitleStyles: React.CSSProperties = {
  margin: '0 0 16px',
  color: '#E9E4D6',
  fontSize: '1.125rem',
  fontWeight: 600
};

const horizontalScrollStyles: React.CSSProperties = {
  display: 'flex',
  gap: '16px',
  overflow: 'auto',
  paddingBottom: '8px'
};

const continueCardStyles: React.CSSProperties = {
  width: '280px',
  flexShrink: 0,
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer'
};

const continueThumbnailStyles: React.CSSProperties = {
  height: '140px',
  background: '#0D0D0D',
  position: 'relative'
};

const thumbnailPlaceholderStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '2.5rem',
  color: '#8D8371',
  opacity: 0.3
};

const playOverlayStyles: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  borderRadius: '50%',
  color: '#FFF',
  fontSize: '1.25rem',
  opacity: 0,
  transition: 'opacity 0.2s'
};

const serviceTagStyles: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  left: '8px',
  padding: '4px 8px',
  borderRadius: '6px',
  color: '#FFF',
  fontSize: '0.75rem'
};

const liveTagStyles: React.CSSProperties = {
  position: 'absolute',
  top: '8px',
  right: '8px',
  padding: '4px 8px',
  background: '#E74C3C',
  borderRadius: '6px',
  color: '#FFF',
  fontSize: '0.6875rem',
  fontWeight: 600
};

const continueProgressStyles: React.CSSProperties = {
  height: '4px',
  background: '#2F4C39'
};

const continueProgressFillStyles: React.CSSProperties = {
  height: '100%',
  background: '#E50914'
};

const continueInfoStyles: React.CSSProperties = {
  padding: '12px'
};

const continueTitleStyles: React.CSSProperties = {
  margin: '0 0 4px',
  color: '#E9E4D6',
  fontSize: '0.9375rem',
  fontWeight: 600
};

const continueSubtitleStyles: React.CSSProperties = {
  margin: '0 0 8px',
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const remainingTimeStyles: React.CSSProperties = {
  color: '#3EB4A2',
  fontSize: '0.75rem'
};

const mediaCardStyles: React.CSSProperties = {
  width: '180px',
  flexShrink: 0,
  background: '#1E1F22',
  border: '1px solid #2F4C39',
  borderRadius: '12px',
  overflow: 'hidden',
  cursor: 'pointer'
};

const mediaThumbnailStyles: React.CSSProperties = {
  height: '240px',
  background: '#0D0D0D',
  position: 'relative'
};

const mediaInfoStyles: React.CSSProperties = {
  padding: '12px'
};

const mediaTitleStyles: React.CSSProperties = {
  margin: '0 0 4px',
  color: '#E9E4D6',
  fontSize: '0.875rem',
  fontWeight: 500,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis'
};

const mediaSubtitleStyles: React.CSSProperties = {
  margin: '0 0 8px',
  color: '#8D8371',
  fontSize: '0.75rem'
};

const mediaMetaStyles: React.CSSProperties = {
  display: 'flex',
  gap: '8px',
  color: '#8D8371',
  fontSize: '0.6875rem'
};

const servicesGridStyles: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
  gap: '12px'
};

const connectServiceStyles: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  padding: '16px',
  background: '#1E1F22',
  border: '1px dashed #2F4C39',
  borderRadius: '12px',
  color: '#8D8371',
  fontSize: '0.875rem',
  cursor: 'pointer'
};

const serviceIconStyles: React.CSSProperties = {
  width: '48px',
  height: '48px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '12px'
};

const backdropStyles: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0, 0, 0, 0.8)',
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
  overflow: 'hidden',
  zIndex: 1001
};

const modalHeroStyles: React.CSSProperties = {
  height: '200px',
  background: '#0D0D0D',
  position: 'relative'
};

const heroPlaceholderStyles: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '4rem',
  color: '#8D8371',
  opacity: 0.3
};

const closeButtonStyles: React.CSSProperties = {
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '32px',
  height: '32px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'rgba(0, 0, 0, 0.7)',
  border: 'none',
  borderRadius: '50%',
  color: '#FFF',
  cursor: 'pointer'
};

const modalServiceTagStyles: React.CSSProperties = {
  position: 'absolute',
  bottom: '12px',
  left: '12px',
  padding: '6px 12px',
  borderRadius: '8px',
  color: '#FFF',
  fontSize: '0.8125rem',
  fontWeight: 500
};

const modalContentStyles: React.CSSProperties = {
  padding: '20px'
};

const modalTitleStyles: React.CSSProperties = {
  margin: '0 0 12px',
  color: '#E9E4D6',
  fontSize: '1.375rem',
  fontWeight: 600
};

const modalMetaStyles: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '8px',
  marginBottom: '16px',
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const ratingBadgeStyles: React.CSSProperties = {
  padding: '4px 8px',
  background: '#D8B26A20',
  borderRadius: '6px',
  color: '#D8B26A'
};

const genreBadgeStyles: React.CSSProperties = {
  padding: '4px 8px',
  background: '#2F4C39',
  borderRadius: '6px',
  color: '#E9E4D6'
};

const modalSubtitleStyles: React.CSSProperties = {
  margin: '0 0 20px',
  color: '#8D8371',
  fontSize: '0.9375rem',
  lineHeight: 1.6
};

const modalActionsStyles: React.CSSProperties = {
  display: 'flex',
  gap: '12px',
  marginBottom: '20px'
};

const watchButtonStyles: React.CSSProperties = {
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

const addToListStyles: React.CSSProperties = {
  padding: '12px 20px',
  background: 'transparent',
  border: '1px solid #2F4C39',
  borderRadius: '8px',
  color: '#8D8371',
  fontSize: '0.9375rem',
  cursor: 'pointer'
};

const progressSectionStyles: React.CSSProperties = {
  padding: '12px',
  background: '#0D0D0D',
  borderRadius: '8px'
};

const progressLabelStyles: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '8px',
  color: '#8D8371',
  fontSize: '0.8125rem'
};

const modalProgressBarStyles: React.CSSProperties = {
  height: '6px',
  background: '#2F4C39',
  borderRadius: '3px',
  overflow: 'hidden'
};

const modalProgressFillStyles: React.CSSProperties = {
  height: '100%',
  background: '#3EB4A2'
};

export default EntertainmentHub;
