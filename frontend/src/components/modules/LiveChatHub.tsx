/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * CHE·NU™ — LIVE CHAT HUB
 * ═══════════════════════════════════════════════════════════════════════════════
 * Chat public temps réel avec routing intelligent:
 * - Salles dynamiques par sujet/géoloc/problème/event
 * - Routing automatique basé sur critères utilisateur
 * - Indicateurs présence temps réel
 * - Modération collaborative
 * - Événements et rencontres
 * ═══════════════════════════════════════════════════════════════════════════════
 */

import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';

const tokens = {
  colors: {
    sacredGold: '#D8B26A', cenoteTurquoise: '#3EB4A2', jungleEmerald: '#3F7249',
    ancientStone: '#8D8371', earthEmber: '#7A593A', darkSlate: '#1A1A1A',
    error: '#C45C4A', live: '#FF4757',
    bg: { primary: '#0f1217', secondary: '#161B22', tertiary: '#1E242C', card: 'rgba(22, 27, 34, 0.95)' },
    text: { primary: '#E9E4D6', secondary: '#A0998A', muted: '#6B6560' },
    border: 'rgba(216, 178, 106, 0.15)',
  },
  spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
  radius: { sm: 4, md: 8, lg: 12, xl: 16, full: 9999 },
};

// ─────────────────────────────────────────────────────────────────────────────
// ROOM CATEGORIES & ROUTING RULES
// ─────────────────────────────────────────────────────────────────────────────

const ROOM_CATEGORIES = {
  regional: {
    name: 'Régions',
    icon: '📍',
    color: tokens.colors.cenoteTurquoise,
    description: 'Discussions par région du Québec',
  },
  topic: {
    name: 'Sujets',
    icon: '💬',
    color: tokens.colors.sacredGold,
    description: 'Discussions thématiques',
  },
  help: {
    name: 'Entraide',
    icon: '🆘',
    color: tokens.colors.error,
    description: 'Demandes d\'aide et support',
  },
  events: {
    name: 'Événements',
    icon: '📅',
    color: tokens.colors.jungleEmerald,
    description: 'Rencontres et événements',
  },
  marketplace: {
    name: 'Marché',
    icon: '🛒',
    color: tokens.colors.earthEmber,
    description: 'Achats, ventes, services',
  },
};

const ROOMS = [
  // Régions
  { id: 'mtl', name: 'Montréal & Laval', category: 'regional', icon: '🏙️', members: 342, isLive: true, tags: ['montreal', 'laval'] },
  { id: 'rive-sud', name: 'Rive-Sud', category: 'regional', icon: '🌉', members: 187, isLive: true, tags: ['longueuil', 'brossard', 'rive-sud'] },
  { id: 'rive-nord', name: 'Rive-Nord', category: 'regional', icon: '🌲', members: 124, isLive: false, tags: ['rive-nord', 'laurentides'] },
  { id: 'quebec-city', name: 'Québec', category: 'regional', icon: '🏰', members: 98, isLive: true, tags: ['quebec', 'capitale'] },
  { id: 'regions', name: 'Régions éloignées', category: 'regional', icon: '🗺️', members: 67, isLive: false, tags: ['abitibi', 'saguenay', 'gaspesie'] },
  
  // Sujets
  { id: 'renovation', name: 'Rénovation', category: 'topic', icon: '🔨', members: 256, isLive: true, tags: ['renovation', 'travaux'] },
  { id: 'new-build', name: 'Nouvelle construction', category: 'topic', icon: '🏗️', members: 189, isLive: true, tags: ['construction', 'neuf'] },
  { id: 'commercial', name: 'Commercial & Industriel', category: 'topic', icon: '🏢', members: 87, isLive: false, tags: ['commercial', 'industriel'] },
  { id: 'regulations', name: 'Normes & Règlements', category: 'topic', icon: '📋', members: 145, isLive: true, tags: ['rbq', 'ccq', 'normes', 'code'] },
  { id: 'materials', name: 'Matériaux & Fournisseurs', category: 'topic', icon: '🧱', members: 178, isLive: false, tags: ['materiaux', 'fournisseurs', 'prix'] },
  
  // Entraide
  { id: 'urgent-help', name: '🚨 Aide Urgente', category: 'help', icon: '🆘', members: 45, isLive: true, tags: ['urgent', 'aide', 'probleme'], priority: true },
  { id: 'tech-support', name: 'Support Technique', category: 'help', icon: '🔧', members: 112, isLive: true, tags: ['technique', 'support', 'question'] },
  { id: 'legal-advice', name: 'Conseils Juridiques', category: 'help', icon: '⚖️', members: 78, isLive: false, tags: ['juridique', 'litige', 'contrat'] },
  
  // Événements
  { id: 'meetups', name: 'Rencontres Pro', category: 'events', icon: '🤝', members: 156, isLive: true, tags: ['meetup', 'rencontre', 'networking'] },
  { id: 'formations', name: 'Formations & Ateliers', category: 'events', icon: '🎓', members: 134, isLive: false, tags: ['formation', 'atelier', 'cours'] },
  { id: 'salons', name: 'Salons & Expos', category: 'events', icon: '🎪', members: 89, isLive: false, tags: ['salon', 'expo', 'evenement'] },
  
  // Marketplace
  { id: 'jobs', name: 'Emplois & Contrats', category: 'marketplace', icon: '💼', members: 234, isLive: true, tags: ['emploi', 'job', 'contrat', 'travail'] },
  { id: 'equipment', name: 'Équipement & Outils', category: 'marketplace', icon: '🛠️', members: 167, isLive: false, tags: ['equipement', 'outils', 'vente', 'achat'] },
  { id: 'subcontract', name: 'Sous-traitance', category: 'marketplace', icon: '🤜🤛', members: 198, isLive: true, tags: ['sous-traitance', 'partenaire'] },
];

// ─────────────────────────────────────────────────────────────────────────────
// ROUTING ENGINE
// ─────────────────────────────────────────────────────────────────────────────

const routeUserToRooms = (userProfile) => {
  const suggestedRooms = [];
  
  // Route par géolocalisation
  if (userProfile.location) {
    const loc = userProfile.location.toLowerCase();
    const geoRoom = ROOMS.find(r => r.category === 'regional' && r.tags.some(t => loc.includes(t)));
    if (geoRoom) suggestedRooms.push({ room: geoRoom, reason: 'Votre région', priority: 1 });
  }
  
  // Route par intérêts/métier
  if (userProfile.interests) {
    userProfile.interests.forEach(interest => {
      const matchingRooms = ROOMS.filter(r => r.tags.some(t => t.includes(interest.toLowerCase())));
      matchingRooms.forEach(room => {
        if (!suggestedRooms.find(s => s.room.id === room.id)) {
          suggestedRooms.push({ room, reason: `Intérêt: ${interest}`, priority: 2 });
        }
      });
    });
  }
  
  // Route par problème actuel
  if (userProfile.currentProblem) {
    suggestedRooms.unshift({ 
      room: ROOMS.find(r => r.id === 'tech-support'), 
      reason: 'Vous avez une question', 
      priority: 0 
    });
  }
  
  // Route par urgence
  if (userProfile.isUrgent) {
    suggestedRooms.unshift({ 
      room: ROOMS.find(r => r.id === 'urgent-help'), 
      reason: '🚨 Aide urgente', 
      priority: -1 
    });
  }
  
  return suggestedRooms.sort((a, b) => a.priority - b.priority).slice(0, 5);
};

// ─────────────────────────────────────────────────────────────────────────────
// MOCK DATA
// ─────────────────────────────────────────────────────────────────────────────

const mockUser = {
  id: 'u1',
  name: 'Jo Tremblay',
  avatar: 'JT',
  color: tokens.colors.cenoteTurquoise,
  location: 'Brossard',
  interests: ['rénovation', 'commercial'],
  currentProblem: null,
  isUrgent: false,
};

const generateMockMessages = (roomId) => [
  { id: 'm1', user: { name: 'Marie C.', avatar: 'MC', color: '#D94A6A' }, content: 'Salut tout le monde! 👋', time: '14:32', isSystem: false },
  { id: 'm2', user: { name: 'Pierre L.', avatar: 'PL', color: '#6AD94A' }, content: 'Hey! Quelqu\'un a des recommendations pour un électricien sur la Rive-Sud?', time: '14:33', isSystem: false },
  { id: 'm3', user: { name: 'System', avatar: '🤖', color: tokens.colors.ancientStone }, content: 'Anne B. a rejoint la salle', time: '14:34', isSystem: true },
  { id: 'm4', user: { name: 'Anne B.', avatar: 'AB', color: '#D9A04A' }, content: '@Pierre L. oui! Électro-Pro à Longueuil, excellent service', time: '14:35', isSystem: false },
  { id: 'm5', user: { name: 'Jean T.', avatar: 'JT', color: '#4A90D9' }, content: 'Je seconde, ils ont fait mon commercial le mois passé 👍', time: '14:36', isSystem: false },
  { id: 'm6', user: { name: 'Pierre L.', avatar: 'PL', color: '#6AD94A' }, content: 'Parfait merci! Je les appelle demain', time: '14:37', isSystem: false },
];

const mockOnlineUsers = [
  { id: 'u1', name: 'Marie C.', avatar: 'MC', color: '#D94A6A', status: 'active' },
  { id: 'u2', name: 'Pierre L.', avatar: 'PL', color: '#6AD94A', status: 'active' },
  { id: 'u3', name: 'Anne B.', avatar: 'AB', color: '#D9A04A', status: 'idle' },
  { id: 'u4', name: 'Jean T.', avatar: 'JT', color: '#4A90D9', status: 'active' },
  { id: 'u5', name: 'Sophie M.', avatar: 'SM', color: '#9B59B6', status: 'idle' },
];

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

const LiveIndicator = ({ isLive, size = 'sm' }) => {
  if (!isLive) return null;
  const sizes = { sm: 8, md: 10, lg: 12 };
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: size === 'sm' ? '2px 6px' : '3px 8px',
      backgroundColor: `${tokens.colors.live}20`,
      borderRadius: tokens.radius.full,
      fontSize: size === 'sm' ? 9 : 11,
      fontWeight: 600,
      color: tokens.colors.live,
    }}>
      <span style={{
        width: sizes[size], height: sizes[size],
        borderRadius: tokens.radius.full,
        backgroundColor: tokens.colors.live,
        animation: 'pulse 2s infinite',
      }} />
      LIVE
    </span>
  );
};

const RoomCard = ({ room, isActive, onClick, suggested }) => {
  const category = ROOM_CATEGORIES[room.category];
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: tokens.spacing.md,
        padding: tokens.spacing.md,
        backgroundColor: isActive ? `${category.color}15` : 'transparent',
        borderLeft: `3px solid ${isActive ? category.color : 'transparent'}`,
        cursor: 'pointer',
        transition: 'all 0.15s ease',
      }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: tokens.radius.lg,
        backgroundColor: `${category.color}20`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 18,
      }}>
        {room.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
          <span style={{ fontWeight: 500, color: tokens.colors.text.primary, fontSize: 13 }}>{room.name}</span>
          <LiveIndicator isLive={room.isLive} />
        </div>
        <div style={{ fontSize: 11, color: tokens.colors.text.muted }}>
          {room.members} membres {suggested && <span style={{ color: category.color }}>• {suggested}</span>}
        </div>
      </div>
      {room.priority && <span style={{ fontSize: 16 }}>🔥</span>}
    </div>
  );
};

const CategorySection = ({ category, rooms, activeRoom, onSelectRoom, suggestedRooms }) => {
  const [collapsed, setCollapsed] = useState(false);
  const cat = ROOM_CATEGORIES[category];
  const categoryRooms = rooms.filter(r => r.category === category);
  
  if (categoryRooms.length === 0) return null;
  
  return (
    <div style={{ marginBottom: tokens.spacing.sm }}>
      <div
        onClick={() => setCollapsed(!collapsed)}
        style={{
          display: 'flex', alignItems: 'center', gap: tokens.spacing.sm,
          padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
          cursor: 'pointer',
        }}
      >
        <span style={{ fontSize: 14 }}>{cat.icon}</span>
        <span style={{ flex: 1, fontSize: 11, fontWeight: 600, color: tokens.colors.text.muted, textTransform: 'uppercase' }}>{cat.name}</span>
        <span style={{ fontSize: 10, color: tokens.colors.text.muted }}>{collapsed ? '▶' : '▼'}</span>
      </div>
      {!collapsed && categoryRooms.map(room => {
        const suggestion = suggestedRooms.find(s => s.room.id === room.id);
        return (
          <RoomCard
            key={room.id}
            room={room}
            isActive={activeRoom === room.id}
            onClick={() => onSelectRoom(room.id)}
            suggested={suggestion?.reason}
          />
        );
      })}
    </div>
  );
};

const ChatMessage = ({ message }) => {
  if (message.isSystem) {
    return (
      <div style={{ textAlign: 'center', padding: tokens.spacing.sm, fontSize: 11, color: tokens.colors.text.muted }}>
        {message.content}
      </div>
    );
  }
  
  return (
    <div style={{ display: 'flex', gap: tokens.spacing.sm, padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px` }}>
      <div style={{
        width: 32, height: 32, borderRadius: tokens.radius.md,
        backgroundColor: message.user.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontSize: 11, fontWeight: 600, flexShrink: 0,
      }}>
        {message.user.avatar}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: tokens.spacing.sm }}>
          <span style={{ fontWeight: 600, color: tokens.colors.text.primary, fontSize: 13 }}>{message.user.name}</span>
          <span style={{ fontSize: 10, color: tokens.colors.text.muted }}>{message.time}</span>
        </div>
        <div style={{ color: tokens.colors.text.secondary, fontSize: 13, lineHeight: 1.5, marginTop: 2 }}>{message.content}</div>
      </div>
    </div>
  );
};

const OnlineUsersList = ({ users }) => (
  <div style={{ padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}` }}>
    <div style={{ fontSize: 11, fontWeight: 600, color: tokens.colors.text.muted, marginBottom: tokens.spacing.sm }}>
      EN LIGNE ({users.length})
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.xs }}>
      {users.map(user => (
        <div
          key={user.id}
          title={user.name}
          style={{
            width: 28, height: 28, borderRadius: tokens.radius.md,
            backgroundColor: user.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontSize: 9, fontWeight: 600,
            border: `2px solid ${user.status === 'active' ? tokens.colors.jungleEmerald : tokens.colors.ancientStone}`,
            cursor: 'pointer',
          }}
        >
          {user.avatar}
        </div>
      ))}
    </div>
  </div>
);

const RoutingWizard = ({ onSelectRoom, onSkip }) => {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ location: '', interests: [], currentProblem: '', isUrgent: false });
  
  const questions = [
    { key: 'location', question: 'Où êtes-vous situé?', type: 'select', options: ['Montréal', 'Laval', 'Rive-Sud', 'Rive-Nord', 'Québec', 'Autre région'] },
    { key: 'interests', question: 'Quels sujets vous intéressent?', type: 'multi', options: ['Rénovation', 'Construction neuve', 'Commercial', 'Normes/Règlements', 'Matériaux'] },
    { key: 'currentProblem', question: 'Avez-vous une question spécifique?', type: 'text', placeholder: 'Décrivez brièvement...' },
  ];
  
  const currentQ = questions[step];
  
  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      const suggestions = routeUserToRooms(profile);
      if (suggestions.length > 0) {
        onSelectRoom(suggestions[0].room.id);
      }
    }
  };
  
  return (
    <div style={{ padding: tokens.spacing.xl, textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: tokens.spacing.md }}>🧭</div>
      <h2 style={{ margin: 0, marginBottom: tokens.spacing.sm, color: tokens.colors.text.primary }}>Trouvez votre salle</h2>
      <p style={{ color: tokens.colors.text.secondary, marginBottom: tokens.spacing.lg }}>{currentQ.question}</p>
      
      {currentQ.type === 'select' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, justifyContent: 'center', marginBottom: tokens.spacing.lg }}>
          {currentQ.options.map(opt => (
            <button
              key={opt}
              onClick={() => { setProfile({ ...profile, [currentQ.key]: opt }); handleNext(); }}
              style={{
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                backgroundColor: tokens.colors.bg.tertiary,
                border: `1px solid ${tokens.colors.border}`,
                borderRadius: tokens.radius.full,
                color: tokens.colors.text.primary,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      
      {currentQ.type === 'multi' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: tokens.spacing.sm, justifyContent: 'center', marginBottom: tokens.spacing.lg }}>
          {currentQ.options.map(opt => (
            <button
              key={opt}
              onClick={() => {
                const interests = profile.interests.includes(opt)
                  ? profile.interests.filter(i => i !== opt)
                  : [...profile.interests, opt];
                setProfile({ ...profile, interests });
              }}
              style={{
                padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
                backgroundColor: profile.interests.includes(opt) ? tokens.colors.sacredGold : tokens.colors.bg.tertiary,
                color: profile.interests.includes(opt) ? tokens.colors.darkSlate : tokens.colors.text.primary,
                border: `1px solid ${profile.interests.includes(opt) ? tokens.colors.sacredGold : tokens.colors.border}`,
                borderRadius: tokens.radius.full,
                cursor: 'pointer',
                fontSize: 13,
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
      
      {currentQ.type === 'text' && (
        <div style={{ marginBottom: tokens.spacing.lg }}>
          <textarea
            value={profile.currentProblem}
            onChange={(e) => setProfile({ ...profile, currentProblem: e.target.value })}
            placeholder={currentQ.placeholder}
            style={{
              width: '100%', maxWidth: 400, padding: tokens.spacing.md,
              backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.lg, color: tokens.colors.text.primary,
              fontSize: 14, resize: 'none', minHeight: 80, outline: 'none',
            }}
          />
        </div>
      )}
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: tokens.spacing.md }}>
        <button onClick={onSkip} style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`, backgroundColor: 'transparent', border: `1px solid ${tokens.colors.border}`, borderRadius: tokens.radius.md, color: tokens.colors.text.secondary, cursor: 'pointer' }}>
          Passer
        </button>
        {(currentQ.type === 'multi' || currentQ.type === 'text') && (
          <button onClick={handleNext} style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.lg}px`, backgroundColor: tokens.colors.sacredGold, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.darkSlate, fontWeight: 600, cursor: 'pointer' }}>
            {step === questions.length - 1 ? 'Trouver ma salle' : 'Suivant'}
          </button>
        )}
      </div>
      
      {/* Progress */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: tokens.spacing.xs, marginTop: tokens.spacing.lg }}>
        {questions.map((_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: tokens.radius.full, backgroundColor: i <= step ? tokens.colors.sacredGold : tokens.colors.bg.tertiary }} />
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const LiveChatHub = () => {
  const [activeRoom, setActiveRoom] = useState(null);
  const [showWizard, setShowWizard] = useState(true);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef(null);
  
  const suggestedRooms = useMemo(() => routeUserToRooms(mockUser), []);
  
  const filteredRooms = useMemo(() => {
    if (!searchTerm) return ROOMS;
    const term = searchTerm.toLowerCase();
    return ROOMS.filter(r => r.name.toLowerCase().includes(term) || r.tags.some(t => t.includes(term)));
  }, [searchTerm]);
  
  const currentRoom = ROOMS.find(r => r.id === activeRoom);
  
  useEffect(() => {
    if (activeRoom) {
      setMessages(generateMockMessages(activeRoom));
      setShowWizard(false);
    }
  }, [activeRoom]);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: `m-${Date.now()}`,
      user: { name: mockUser.name, avatar: mockUser.avatar, color: mockUser.color },
      content: newMessage,
      time: new Date().toLocaleTimeString('fr-CA', { hour: '2-digit', minute: '2-digit' }),
      isSystem: false,
    }]);
    setNewMessage('');
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: tokens.colors.bg.primary, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar - Rooms */}
      <div style={{ width: 280, backgroundColor: tokens.colors.bg.secondary, borderRight: `1px solid ${tokens.colors.border}`, display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm, marginBottom: tokens.spacing.md }}>
            <span style={{ fontSize: 20 }}>💬</span>
            <span style={{ fontWeight: 600, color: tokens.colors.text.primary, fontSize: 16 }}>Live Chat</span>
            <LiveIndicator isLive={true} size="md" />
          </div>
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="🔍 Rechercher une salle..."
            style={{
              width: '100%', padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`,
              backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`,
              borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, fontSize: 13, outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
        
        {/* Suggested Rooms */}
        {suggestedRooms.length > 0 && !searchTerm && (
          <div style={{ padding: tokens.spacing.sm, borderBottom: `1px solid ${tokens.colors.border}` }}>
            <div style={{ padding: `${tokens.spacing.xs}px ${tokens.spacing.md}px`, fontSize: 11, fontWeight: 600, color: tokens.colors.sacredGold, textTransform: 'uppercase' }}>
              ⭐ Suggérées pour vous
            </div>
            {suggestedRooms.slice(0, 3).map(({ room, reason }) => (
              <RoomCard key={room.id} room={room} isActive={activeRoom === room.id} onClick={() => setActiveRoom(room.id)} suggested={reason} />
            ))}
          </div>
        )}
        
        {/* Room Categories */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {Object.keys(ROOM_CATEGORIES).map(category => (
            <CategorySection
              key={category}
              category={category}
              rooms={filteredRooms}
              activeRoom={activeRoom}
              onSelectRoom={setActiveRoom}
              suggestedRooms={suggestedRooms}
            />
          ))}
        </div>
        
        {/* Online Users */}
        <OnlineUsersList users={mockOnlineUsers} />
      </div>
      
      {/* Main Chat Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {showWizard && !activeRoom ? (
          <RoutingWizard onSelectRoom={setActiveRoom} onSkip={() => { setShowWizard(false); setActiveRoom('mtl'); }} />
        ) : currentRoom ? (
          <>
            {/* Chat Header */}
            <div style={{ padding: tokens.spacing.md, borderBottom: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.bg.secondary, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.md }}>
                <div style={{ fontSize: 28 }}>{currentRoom.icon}</div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: tokens.spacing.sm }}>
                    <span style={{ fontWeight: 600, color: tokens.colors.text.primary, fontSize: 16 }}>{currentRoom.name}</span>
                    <LiveIndicator isLive={currentRoom.isLive} />
                  </div>
                  <div style={{ fontSize: 12, color: tokens.colors.text.muted }}>{currentRoom.members} membres • {ROOM_CATEGORIES[currentRoom.category].name}</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: tokens.spacing.sm }}>
                <button style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer' }}>📌</button>
                <button style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer' }}>👥</button>
                <button style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer' }}>⚙️</button>
              </div>
            </div>
            
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: `${tokens.spacing.md}px 0` }}>
              {messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <div style={{ padding: tokens.spacing.md, borderTop: `1px solid ${tokens.colors.border}`, backgroundColor: tokens.colors.bg.secondary }}>
              <div style={{ display: 'flex', gap: tokens.spacing.sm, alignItems: 'flex-end' }}>
                <button style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer', fontSize: 16 }}>➕</button>
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={`Message dans #${currentRoom.name}...`}
                  style={{
                    flex: 1, padding: tokens.spacing.md,
                    backgroundColor: tokens.colors.bg.tertiary, border: `1px solid ${tokens.colors.border}`,
                    borderRadius: tokens.radius.lg, color: tokens.colors.text.primary, fontSize: 14, outline: 'none',
                  }}
                />
                <button style={{ padding: tokens.spacing.sm, backgroundColor: tokens.colors.bg.tertiary, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.text.muted, cursor: 'pointer', fontSize: 16 }}>😊</button>
                <button onClick={handleSend} style={{ padding: `${tokens.spacing.sm}px ${tokens.spacing.md}px`, backgroundColor: tokens.colors.sacredGold, border: 'none', borderRadius: tokens.radius.md, color: tokens.colors.darkSlate, fontWeight: 600, cursor: 'pointer' }}>Envoyer</button>
              </div>
            </div>
          </>
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: tokens.colors.text.muted }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 48, marginBottom: tokens.spacing.md }}>💬</div>
              <div style={{ fontSize: 16, color: tokens.colors.text.secondary }}>Sélectionnez une salle pour commencer</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LiveChatHub;
