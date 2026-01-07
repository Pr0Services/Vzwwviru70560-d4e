/**
 * CHE·NU™ — CRM UI Components
 * Sprint 2: Business Core - Tasks 2.6-2.8
 * 
 * Complete UI for:
 * - Contact list + detail view
 * - Company pages
 * - Deal pipeline (Kanban)
 */

import React, { useState, useMemo, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

interface Contact {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  phone?: string;
  company_id?: string;
  company_name?: string;
  job_title?: string;
  contact_type: 'lead' | 'prospect' | 'customer' | 'partner' | 'vendor';
  status: 'active' | 'inactive' | 'archived';
  lead_score: number;
  tags: string[];
  avatar_url?: string;
  created_at: string;
  last_contacted_at?: string;
}

interface Company {
  id: string;
  name: string;
  industry?: string;
  company_type: 'prospect' | 'customer' | 'partner' | 'vendor';
  status: string;
  website?: string;
  phone?: string;
  logo_url?: string;
  contact_count: number;
  deal_count: number;
  total_deal_value: number;
}

interface Deal {
  id: string;
  name: string;
  company_name?: string;
  contact_name?: string;
  amount?: number;
  currency: string;
  stage: string;
  probability: number;
  status: 'open' | 'won' | 'lost';
  expected_close_date?: string;
  created_at: string;
}

interface DealStage {
  id: string;
  name: string;
  order: number;
  probability: number;
  color: string;
  is_closed_won: boolean;
  is_closed_lost: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ContactListProps {
  contacts: Contact[];
  onSelect: (contact: Contact) => void;
  onEdit: (contact: Contact) => void;
  onDelete: (contactId: string) => void;
  selectedId?: string;
}

export const ContactList: React.FC<ContactListProps> = ({
  contacts,
  onSelect,
  onEdit,
  onDelete,
  selectedId,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'created' | 'score'>('name');

  const filteredContacts = useMemo(() => {
    let result = contacts;

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(term) ||
        c.email?.toLowerCase().includes(term) ||
        c.company_name?.toLowerCase().includes(term)
      );
    }

    // Type filter
    if (filterType !== 'all') {
      result = result.filter(c => c.contact_type === filterType);
    }

    // Sort
    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return `${a.first_name} ${a.last_name}`.localeCompare(`${b.first_name} ${b.last_name}`);
        case 'created':
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'score':
          return b.lead_score - a.lead_score;
        default:
          return 0;
      }
    });

    return result;
  }, [contacts, searchTerm, filterType, sortBy]);

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      lead: '#6B7280',
      prospect: '#3B82F6',
      customer: '#22C55E',
      partner: '#8B5CF6',
      vendor: '#F59E0B',
    };
    return colors[type] || '#6B7280';
  };

  return (
    <div className="contact-list">
      {/* Filters */}
      <div className="contact-list__filters">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="contact-list__search"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="contact-list__filter"
        >
          <option value="all">All Types</option>
          <option value="lead">Leads</option>
          <option value="prospect">Prospects</option>
          <option value="customer">Customers</option>
          <option value="partner">Partners</option>
          <option value="vendor">Vendors</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as any)}
          className="contact-list__sort"
        >
          <option value="name">Sort by Name</option>
          <option value="created">Sort by Date</option>
          <option value="score">Sort by Score</option>
        </select>
      </div>

      {/* Stats */}
      <div className="contact-list__stats">
        <span>{filteredContacts.length} contacts</span>
      </div>

      {/* List */}
      <div className="contact-list__items">
        {filteredContacts.map((contact) => (
          <div
            key={contact.id}
            className={`contact-card ${selectedId === contact.id ? 'contact-card--selected' : ''}`}
            onClick={() => onSelect(contact)}
          >
            <div className="contact-card__avatar">
              {contact.avatar_url ? (
                <img src={contact.avatar_url} alt="" />
              ) : (
                <span>{contact.first_name[0]}{contact.last_name[0]}</span>
              )}
            </div>
            
            <div className="contact-card__info">
              <h4 className="contact-card__name">
                {contact.first_name} {contact.last_name}
              </h4>
              {contact.job_title && contact.company_name && (
                <p className="contact-card__title">
                  {contact.job_title} at {contact.company_name}
                </p>
              )}
              {contact.email && (
                <p className="contact-card__email">{contact.email}</p>
              )}
            </div>

            <div className="contact-card__meta">
              <span
                className="contact-card__type"
                style={{ backgroundColor: getTypeColor(contact.contact_type) }}
              >
                {contact.contact_type}
              </span>
              {contact.lead_score > 0 && (
                <span className="contact-card__score">
                  🔥 {contact.lead_score}
                </span>
              )}
            </div>

            <div className="contact-card__actions">
              <button onClick={(e) => { e.stopPropagation(); onEdit(contact); }}>
                ✏️
              </button>
              <button onClick={(e) => { e.stopPropagation(); onDelete(contact.id); }}>
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .contact-list {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .contact-list__filters {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .contact-list__search {
          flex: 1;
          padding: 0.5rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .contact-list__filter, .contact-list__sort {
          padding: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .contact-list__stats {
          padding: 0.5rem 1rem;
          font-size: 0.875rem;
          color: #888;
        }
        .contact-list__items {
          flex: 1;
          overflow-y: auto;
          padding: 0.5rem;
        }
        .contact-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-bottom: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .contact-card:hover {
          background: rgba(255,255,255,0.06);
        }
        .contact-card--selected {
          background: rgba(216,178,106,0.1);
          border: 1px solid #D8B26A;
        }
        .contact-card__avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: #3B82F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          color: white;
          overflow: hidden;
        }
        .contact-card__avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .contact-card__info {
          flex: 1;
          min-width: 0;
        }
        .contact-card__name {
          margin: 0;
          font-size: 1rem;
          font-weight: 500;
        }
        .contact-card__title, .contact-card__email {
          margin: 0.25rem 0 0;
          font-size: 0.875rem;
          color: #888;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .contact-card__meta {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }
        .contact-card__type {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          text-transform: uppercase;
          color: white;
        }
        .contact-card__score {
          font-size: 0.875rem;
        }
        .contact-card__actions {
          display: flex;
          gap: 0.5rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .contact-card:hover .contact-card__actions {
          opacity: 1;
        }
        .contact-card__actions button {
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1rem;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// CONTACT DETAIL COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface ContactDetailProps {
  contact: Contact;
  onEdit: () => void;
  onClose: () => void;
}

export const ContactDetail: React.FC<ContactDetailProps> = ({
  contact,
  onEdit,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'activities' | 'deals'>('overview');

  return (
    <div className="contact-detail">
      <div className="contact-detail__header">
        <button className="contact-detail__close" onClick={onClose}>←</button>
        
        <div className="contact-detail__avatar">
          {contact.avatar_url ? (
            <img src={contact.avatar_url} alt="" />
          ) : (
            <span>{contact.first_name[0]}{contact.last_name[0]}</span>
          )}
        </div>

        <h2>{contact.first_name} {contact.last_name}</h2>
        {contact.job_title && <p>{contact.job_title}</p>}
        {contact.company_name && <p className="company">{contact.company_name}</p>}

        <button className="btn btn--primary" onClick={onEdit}>
          Edit Contact
        </button>
      </div>

      <div className="contact-detail__tabs">
        <button
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={activeTab === 'activities' ? 'active' : ''}
          onClick={() => setActiveTab('activities')}
        >
          Activities
        </button>
        <button
          className={activeTab === 'deals' ? 'active' : ''}
          onClick={() => setActiveTab('deals')}
        >
          Deals
        </button>
      </div>

      <div className="contact-detail__content">
        {activeTab === 'overview' && (
          <div className="contact-detail__overview">
            <div className="info-group">
              <h4>Contact Information</h4>
              {contact.email && (
                <div className="info-row">
                  <span>📧 Email</span>
                  <a href={`mailto:${contact.email}`}>{contact.email}</a>
                </div>
              )}
              {contact.phone && (
                <div className="info-row">
                  <span>📞 Phone</span>
                  <a href={`tel:${contact.phone}`}>{contact.phone}</a>
                </div>
              )}
            </div>

            <div className="info-group">
              <h4>Tags</h4>
              <div className="tags">
                {contact.tags.map((tag) => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="info-group">
              <h4>Scoring</h4>
              <div className="score-bar">
                <div className="score-bar__fill" style={{ width: `${contact.lead_score}%` }} />
                <span>{contact.lead_score}%</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activities' && (
          <div className="contact-detail__activities">
            <button className="btn btn--secondary">+ Log Activity</button>
            <p className="empty">No activities yet</p>
          </div>
        )}

        {activeTab === 'deals' && (
          <div className="contact-detail__deals">
            <button className="btn btn--secondary">+ Create Deal</button>
            <p className="empty">No deals yet</p>
          </div>
        )}
      </div>

      <style>{`
        .contact-detail {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .contact-detail__header {
          padding: 2rem;
          text-align: center;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .contact-detail__close {
          position: absolute;
          left: 1rem;
          top: 1rem;
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: inherit;
        }
        .contact-detail__avatar {
          width: 80px;
          height: 80px;
          border-radius: 50%;
          background: #3B82F6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          font-weight: 600;
          color: white;
          margin: 0 auto 1rem;
          overflow: hidden;
        }
        .contact-detail__header h2 {
          margin: 0 0 0.25rem;
        }
        .contact-detail__header p {
          margin: 0;
          color: #888;
        }
        .contact-detail__header .company {
          color: #D8B26A;
        }
        .contact-detail__tabs {
          display: flex;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .contact-detail__tabs button {
          flex: 1;
          padding: 1rem;
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          border-bottom: 2px solid transparent;
        }
        .contact-detail__tabs button.active {
          color: #D8B26A;
          border-bottom-color: #D8B26A;
        }
        .contact-detail__content {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .info-group {
          margin-bottom: 1.5rem;
        }
        .info-group h4 {
          margin: 0 0 0.75rem;
          font-size: 0.875rem;
          text-transform: uppercase;
          color: #888;
        }
        .info-row {
          display: flex;
          justify-content: space-between;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .info-row a {
          color: #3B82F6;
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }
        .tag {
          padding: 0.25rem 0.75rem;
          background: rgba(255,255,255,0.1);
          border-radius: 20px;
          font-size: 0.875rem;
        }
        .score-bar {
          height: 24px;
          background: rgba(255,255,255,0.1);
          border-radius: 12px;
          overflow: hidden;
          position: relative;
        }
        .score-bar__fill {
          height: 100%;
          background: linear-gradient(90deg, #22C55E, #D8B26A);
          transition: width 0.3s;
        }
        .score-bar span {
          position: absolute;
          right: 0.75rem;
          top: 50%;
          transform: translateY(-50%);
          font-size: 0.875rem;
          font-weight: 600;
        }
        .empty {
          text-align: center;
          color: #888;
          padding: 2rem;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// DEAL PIPELINE (KANBAN) COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface DealPipelineProps {
  stages: DealStage[];
  deals: Deal[];
  onDealClick: (deal: Deal) => void;
  onDealMove: (dealId: string, newStage: string) => void;
  onCreateDeal: (stage: string) => void;
}

export const DealPipeline: React.FC<DealPipelineProps> = ({
  stages,
  deals,
  onDealClick,
  onDealMove,
  onCreateDeal,
}) => {
  const [draggedDeal, setDraggedDeal] = useState<string | null>(null);

  const dealsByStage = useMemo(() => {
    const grouped: Record<string, Deal[]> = {};
    stages.forEach((stage) => {
      grouped[stage.id] = deals.filter((d) => d.stage === stage.id && d.status === 'open');
    });
    return grouped;
  }, [deals, stages]);

  const stageStats = useMemo(() => {
    const stats: Record<string, { count: number; value: number }> = {};
    stages.forEach((stage) => {
      const stageDeals = dealsByStage[stage.id] || [];
      stats[stage.id] = {
        count: stageDeals.length,
        value: stageDeals.reduce((sum, d) => sum + (d.amount || 0), 0),
      };
    });
    return stats;
  }, [dealsByStage, stages]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDragStart = (dealId: string) => {
    setDraggedDeal(dealId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (stageId: string) => {
    if (draggedDeal) {
      onDealMove(draggedDeal, stageId);
      setDraggedDeal(null);
    }
  };

  return (
    <div className="deal-pipeline">
      {/* Pipeline Header */}
      <div className="deal-pipeline__header">
        <h2>Sales Pipeline</h2>
        <div className="deal-pipeline__summary">
          <span>
            {deals.filter(d => d.status === 'open').length} deals
          </span>
          <span className="separator">•</span>
          <span>
            {formatCurrency(deals.filter(d => d.status === 'open').reduce((s, d) => s + (d.amount || 0), 0))} total
          </span>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="deal-pipeline__board">
        {stages.filter(s => !s.is_closed_won && !s.is_closed_lost).map((stage) => (
          <div
            key={stage.id}
            className="pipeline-column"
            onDragOver={handleDragOver}
            onDrop={() => handleDrop(stage.id)}
          >
            <div className="pipeline-column__header" style={{ borderColor: stage.color }}>
              <div className="pipeline-column__title">
                <span className="dot" style={{ backgroundColor: stage.color }} />
                {stage.name}
              </div>
              <div className="pipeline-column__stats">
                <span>{stageStats[stage.id]?.count || 0}</span>
                <span>{formatCurrency(stageStats[stage.id]?.value || 0)}</span>
              </div>
            </div>

            <div className="pipeline-column__deals">
              {(dealsByStage[stage.id] || []).map((deal) => (
                <div
                  key={deal.id}
                  className="deal-card"
                  draggable
                  onDragStart={() => handleDragStart(deal.id)}
                  onClick={() => onDealClick(deal)}
                >
                  <h4>{deal.name}</h4>
                  {deal.company_name && (
                    <p className="deal-card__company">{deal.company_name}</p>
                  )}
                  {deal.amount && (
                    <p className="deal-card__amount">{formatCurrency(deal.amount)}</p>
                  )}
                  {deal.expected_close_date && (
                    <p className="deal-card__date">
                      📅 {new Date(deal.expected_close_date).toLocaleDateString()}
                    </p>
                  )}
                  <div className="deal-card__probability">
                    <div
                      className="deal-card__probability-bar"
                      style={{ width: `${deal.probability}%`, backgroundColor: stage.color }}
                    />
                  </div>
                </div>
              ))}

              <button
                className="pipeline-column__add"
                onClick={() => onCreateDeal(stage.id)}
              >
                + Add Deal
              </button>
            </div>
          </div>
        ))}
      </div>

      <style>{`
        .deal-pipeline {
          display: flex;
          flex-direction: column;
          height: 100%;
          background: var(--color-ui-slate, #1E1F22);
        }
        .deal-pipeline__header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .deal-pipeline__header h2 {
          margin: 0;
          font-size: 1.25rem;
        }
        .deal-pipeline__summary {
          display: flex;
          gap: 0.5rem;
          color: #888;
          font-size: 0.875rem;
        }
        .separator {
          color: #444;
        }
        .deal-pipeline__board {
          display: flex;
          gap: 1rem;
          padding: 1rem;
          overflow-x: auto;
          flex: 1;
        }
        .pipeline-column {
          flex: 0 0 300px;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.02);
          border-radius: 12px;
          overflow: hidden;
        }
        .pipeline-column__header {
          padding: 1rem;
          border-top: 3px solid;
          background: rgba(255,255,255,0.03);
        }
        .pipeline-column__title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
        }
        .dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
        }
        .pipeline-column__stats {
          display: flex;
          justify-content: space-between;
          margin-top: 0.5rem;
          font-size: 0.875rem;
          color: #888;
        }
        .pipeline-column__deals {
          flex: 1;
          padding: 0.5rem;
          overflow-y: auto;
        }
        .deal-card {
          padding: 1rem;
          background: rgba(255,255,255,0.05);
          border-radius: 8px;
          margin-bottom: 0.5rem;
          cursor: grab;
          transition: all 0.2s;
        }
        .deal-card:hover {
          background: rgba(255,255,255,0.08);
          transform: translateY(-2px);
        }
        .deal-card:active {
          cursor: grabbing;
        }
        .deal-card h4 {
          margin: 0 0 0.5rem;
          font-size: 0.95rem;
        }
        .deal-card__company {
          margin: 0 0 0.25rem;
          font-size: 0.875rem;
          color: #888;
        }
        .deal-card__amount {
          margin: 0 0 0.25rem;
          font-size: 1rem;
          font-weight: 600;
          color: #22C55E;
        }
        .deal-card__date {
          margin: 0 0 0.5rem;
          font-size: 0.75rem;
          color: #888;
        }
        .deal-card__probability {
          height: 4px;
          background: rgba(255,255,255,0.1);
          border-radius: 2px;
          overflow: hidden;
        }
        .deal-card__probability-bar {
          height: 100%;
          transition: width 0.3s;
        }
        .pipeline-column__add {
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: 1px dashed rgba(255,255,255,0.2);
          border-radius: 8px;
          color: #888;
          cursor: pointer;
          transition: all 0.2s;
        }
        .pipeline-column__add:hover {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// COMPANY LIST COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

interface CompanyListProps {
  companies: Company[];
  onSelect: (company: Company) => void;
  onEdit: (company: Company) => void;
}

export const CompanyList: React.FC<CompanyListProps> = ({
  companies,
  onSelect,
  onEdit,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCompanies = useMemo(() => {
    if (!searchTerm) return companies;
    const term = searchTerm.toLowerCase();
    return companies.filter((c) =>
      c.name.toLowerCase().includes(term) ||
      c.industry?.toLowerCase().includes(term)
    );
  }, [companies, searchTerm]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-CA', {
      style: 'currency',
      currency: 'CAD',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="company-list">
      <div className="company-list__search">
        <input
          type="text"
          placeholder="Search companies..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="company-list__items">
        {filteredCompanies.map((company) => (
          <div
            key={company.id}
            className="company-card"
            onClick={() => onSelect(company)}
          >
            <div className="company-card__logo">
              {company.logo_url ? (
                <img src={company.logo_url} alt="" />
              ) : (
                <span>{company.name[0]}</span>
              )}
            </div>

            <div className="company-card__info">
              <h4>{company.name}</h4>
              {company.industry && <p>{company.industry}</p>}
            </div>

            <div className="company-card__stats">
              <div className="stat">
                <span className="stat__value">{company.contact_count}</span>
                <span className="stat__label">Contacts</span>
              </div>
              <div className="stat">
                <span className="stat__value">{company.deal_count}</span>
                <span className="stat__label">Deals</span>
              </div>
              <div className="stat">
                <span className="stat__value">{formatCurrency(company.total_deal_value)}</span>
                <span className="stat__label">Value</span>
              </div>
            </div>

            <button
              className="company-card__edit"
              onClick={(e) => { e.stopPropagation(); onEdit(company); }}
            >
              ✏️
            </button>
          </div>
        ))}
      </div>

      <style>{`
        .company-list {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .company-list__search {
          padding: 1rem;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .company-list__search input {
          width: 100%;
          padding: 0.75rem 1rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 8px;
          color: inherit;
        }
        .company-list__items {
          flex: 1;
          overflow-y: auto;
          padding: 1rem;
        }
        .company-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          background: rgba(255,255,255,0.03);
          border-radius: 12px;
          margin-bottom: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .company-card:hover {
          background: rgba(255,255,255,0.06);
        }
        .company-card__logo {
          width: 56px;
          height: 56px;
          border-radius: 12px;
          background: #8B5CF6;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
          font-weight: 600;
          color: white;
          overflow: hidden;
        }
        .company-card__logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .company-card__info {
          flex: 1;
        }
        .company-card__info h4 {
          margin: 0 0 0.25rem;
        }
        .company-card__info p {
          margin: 0;
          font-size: 0.875rem;
          color: #888;
        }
        .company-card__stats {
          display: flex;
          gap: 1.5rem;
        }
        .stat {
          text-align: center;
        }
        .stat__value {
          display: block;
          font-size: 1.1rem;
          font-weight: 600;
        }
        .stat__label {
          font-size: 0.75rem;
          color: #888;
        }
        .company-card__edit {
          padding: 0.5rem;
          background: none;
          border: none;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .company-card:hover .company-card__edit {
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════════

export default {
  ContactList,
  ContactDetail,
  DealPipeline,
  CompanyList,
};
