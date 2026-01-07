/**
 * CHE·NU™ LOCAL INVESTMENT & INITIATIVE COMMITMENT — COMPONENT
 * 
 * Interface for managing initiative projects, funding decisions,
 * and community reinvestment. All final decisions are human-made.
 * 
 * This is NOT a token sale, investment fund, or financial product.
 * It IS a responsibility mechanism.
 * 
 * @version 1.0
 * @status V51-extension
 * @base V51 (FROZEN)
 */

import React, { useState, useCallback } from 'react';
import type {
  InitiativeProject,
  ProjectStatus,
  FundAllocation,
  AllowedFundUse,
  EligibilityAssessment,
} from './initiative-commitment.types';
import {
  PUBLIC_COMMITMENT_STATEMENT,
  PROJECT_ELIGIBILITY,
  GOVERNANCE_MODEL,
  ETHICAL_CONSTRAINTS,
  INITIATIVE_IS,
  INITIATIVE_NON_GOALS,
} from './initiative-commitment.types';
import {
  useInitiativeProjects,
  useEligibilityAssessment,
  useInvestmentDecision,
  useFundAllocation,
  useGovernanceCompliance,
} from './hooks';

// ═══════════════════════════════════════════════════════════════════════════════
// COMMITMENT STATEMENT DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

const CommitmentStatement: React.FC = () => {
  return (
    <div className="initiative-commitment-statement">
      <h2>CHE·NU Initiative Commitment</h2>
      
      <blockquote className="commitment-quote">
        "Using its infrastructure not only to organize thought
        and decision-making, but also to support concrete,
        local, human-scale projects that strengthen communities."
      </blockquote>
      
      <div className="commitment-clarification">
        <p className="what-it-is">
          <strong>This IS:</strong> {INITIATIVE_IS}
        </p>
        
        <p className="what-it-is-not">
          <strong>This is NOT:</strong>
          {INITIATIVE_NON_GOALS.map((ng, i) => (
            <span key={ng} className="non-goal">
              {ng.replace(/_/g, ' ')}{i < INITIATIVE_NON_GOALS.length - 1 ? ', ' : ''}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ETHICAL CONSTRAINTS DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

const EthicalConstraintsDisplay: React.FC = () => {
  const constraints = [
    { key: 'no_coercion', label: 'No Coercion', icon: '🛡️' },
    { key: 'no_dependency_creation', label: 'No Dependency Creation', icon: '🔓' },
    { key: 'no_opaque_financial_mechanisms', label: 'No Opaque Mechanisms', icon: '👁️' },
    { key: 'no_extraction_first_logic', label: 'No Extraction-First Logic', icon: '🌱' },
    { key: 'participation_voluntary', label: 'Participation Voluntary', icon: '✋' },
    { key: 'exit_always_possible', label: 'Exit Always Possible', icon: '🚪' },
  ];
  
  return (
    <div className="ethical-constraints">
      <h3>Ethical Constraints</h3>
      <div className="constraints-grid">
        {constraints.map(c => (
          <div key={c.key} className="constraint">
            <span className="constraint-icon">{c.icon}</span>
            <span className="constraint-label">{c.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ELIGIBILITY CRITERIA DISPLAY
// ═══════════════════════════════════════════════════════════════════════════════

interface EligibilityCriteriaProps {
  criteriaResults?: Record<string, boolean>;
  showStatus?: boolean;
}

const EligibilityCriteria: React.FC<EligibilityCriteriaProps> = ({
  criteriaResults,
  showStatus = false,
}) => {
  const criteria = [
    { key: 'local_context_required', label: 'Rooted in real local context' },
    { key: 'concrete_need_required', label: 'Addresses a concrete need' },
    { key: 'human_accountability_required', label: 'Human owner accountable for outcomes' },
    { key: 'transparency_agreement_required', label: 'Agrees to transparency requirements' },
    { key: 'foundation_laws_compliance_required', label: 'Respects CHE·NU Foundation Laws' },
  ];
  
  const notes = [
    'Projects are NOT required to be tech-focused',
    'Value is defined by usefulness, not innovation theater',
  ];
  
  return (
    <div className="eligibility-criteria">
      <h3>Project Eligibility</h3>
      
      <ul className="criteria-list">
        {criteria.map(c => (
          <li key={c.key} className="criterion">
            {showStatus && criteriaResults && (
              <span className={`status ${criteriaResults[c.key] ? 'met' : 'unmet'}`}>
                {criteriaResults[c.key] ? '✓' : '○'}
              </span>
            )}
            {c.label}
          </li>
        ))}
      </ul>
      
      <div className="criteria-notes">
        {notes.map((note, i) => (
          <p key={i} className="note">{note}</p>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// PROJECT CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface ProjectCardProps {
  project: InitiativeProject;
  onClick?: (project: InitiativeProject) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onClick }) => {
  const statusColors: Record<ProjectStatus, string> = {
    draft: '#888',
    submitted: '#5577aa',
    under_review: '#7755aa',
    eligible: '#55aa77',
    ineligible: '#aa5555',
    approved: '#55aa55',
    active: '#4499cc',
    completed: '#339933',
    withdrawn: '#999',
  };
  
  return (
    <div 
      className="project-card"
      onClick={() => onClick?.(project)}
    >
      <div className="project-header">
        <h4 className="project-name">{project.name}</h4>
        <span 
          className="project-status"
          style={{ backgroundColor: statusColors[project.status] }}
        >
          {project.status}
        </span>
      </div>
      
      <p className="project-description">{project.description}</p>
      
      <div className="project-context">
        <span className="location">📍 {project.local_context.location}</span>
        <span className="community">{project.local_context.community}</span>
      </div>
      
      <div className="project-owner">
        <span className="owner-label">Accountable:</span>
        <span className="owner-name">{project.human_owner.name}</span>
      </div>
      
      <div className="project-support">
        <span className="support-type">{project.requested_support.type.replace(/_/g, ' ')}</span>
        <span className="support-amount">
          {project.requested_support.amount} {project.requested_support.currency}
        </span>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ALLOCATION CARD
// ═══════════════════════════════════════════════════════════════════════════════

interface AllocationCardProps {
  allocation: FundAllocation;
  onDisburse?: (id: string) => void;
  onReverse?: (id: string) => void;
}

const AllocationCard: React.FC<AllocationCardProps> = ({
  allocation,
  onDisburse,
  onReverse,
}) => {
  return (
    <div className={`allocation-card allocation-card--${allocation.status}`}>
      <div className="allocation-header">
        <span className="allocation-amount">
          {allocation.amount} {allocation.currency}
        </span>
        <span className="allocation-status">{allocation.status}</span>
      </div>
      
      <div className="allocation-use">
        <span className="use-label">For:</span>
        <span className="use-type">{allocation.intended_use.replace(/_/g, ' ')}</span>
      </div>
      
      <p className="allocation-description">{allocation.description}</p>
      
      <div className="allocation-rationale">
        <span className="rationale-label">Rationale:</span>
        <p className="rationale-text">{allocation.rationale}</p>
      </div>
      
      <div className="allocation-meta">
        <span className="approved-by">Approved by: {allocation.approved_by}</span>
        <span className="allocated-at">
          {new Date(allocation.allocated_at).toLocaleDateString()}
        </span>
      </div>
      
      {allocation.reversible && allocation.status === 'approved' && (
        <div className="allocation-actions">
          {onDisburse && (
            <button 
              className="action-disburse"
              onClick={() => onDisburse(allocation.id)}
            >
              Disburse Funds
            </button>
          )}
          {onReverse && (
            <button 
              className="action-reverse"
              onClick={() => onReverse(allocation.id)}
            >
              Reverse
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// GOVERNANCE REMINDER
// ═══════════════════════════════════════════════════════════════════════════════

const GovernanceReminder: React.FC = () => {
  return (
    <div className="governance-reminder">
      <h4>Decision Governance</h4>
      
      <div className="governance-rules">
        <div className="rule agents-can">
          <span className="rule-label">Agents may assist with:</span>
          <ul>
            {GOVERNANCE_MODEL.agent_capabilities.may_assist_with.map(a => (
              <li key={a}>{a.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
        
        <div className="rule agents-cannot">
          <span className="rule-label">Agents may NOT:</span>
          <ul>
            {GOVERNANCE_MODEL.agent_capabilities.may_not.map(a => (
              <li key={a}>{a.replace(/_/g, ' ')}</li>
            ))}
          </ul>
        </div>
      </div>
      
      <p className="final-responsibility">
        <strong>Final responsibility always rests with humans.</strong>
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// MAIN INITIATIVE COMMITMENT COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export interface InitiativeCommitmentProps {
  user_id: string;
  role: 'applicant' | 'reviewer' | 'admin';
  onProjectSelect?: (project: InitiativeProject) => void;
  className?: string;
}

export const InitiativeCommitment: React.FC<InitiativeCommitmentProps> = ({
  user_id,
  role,
  onProjectSelect,
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'governance'>('overview');
  const [selectedProject, setSelectedProject] = useState<InitiativeProject | null>(null);
  
  const {
    projects,
    isLoading,
    error,
    createProject,
    submitProject,
    refresh,
  } = useInitiativeProjects({ user_id });
  
  const { checkCompliance, ethicalConstraints } = useGovernanceCompliance();
  
  const handleProjectClick = useCallback((project: InitiativeProject) => {
    setSelectedProject(project);
    onProjectSelect?.(project);
  }, [onProjectSelect]);
  
  // Render loading
  if (isLoading) {
    return (
      <div className={`initiative-commitment initiative-commitment--loading ${className}`}>
        <div className="loading-spinner" />
        <p>Loading initiative data...</p>
      </div>
    );
  }
  
  // Render error
  if (error) {
    return (
      <div className={`initiative-commitment initiative-commitment--error ${className}`}>
        <p className="error-message">{error}</p>
        <button onClick={refresh}>Retry</button>
      </div>
    );
  }
  
  return (
    <div className={`initiative-commitment ${className}`}>
      {/* Header */}
      <header className="initiative-header">
        <h1>CHE·NU Initiative Commitment</h1>
        <p className="header-tagline">
          Infrastructure-backed reinvestment in local communities
        </p>
      </header>
      
      {/* Tabs */}
      <nav className="initiative-tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'projects' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('projects')}
        >
          Projects ({projects.length})
        </button>
        <button
          className={`tab ${activeTab === 'governance' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('governance')}
        >
          Governance
        </button>
      </nav>
      
      {/* Content */}
      <main className="initiative-content">
        {activeTab === 'overview' && (
          <div className="tab-content overview-content">
            <CommitmentStatement />
            <EthicalConstraintsDisplay />
            <EligibilityCriteria />
            
            <div className="allowed-uses">
              <h3>Allowed Fund Uses</h3>
              <ul>
                <li>Project startup costs</li>
                <li>Tooling and infrastructure</li>
                <li>Local services and suppliers</li>
                <li>Research and prototyping</li>
                <li>Early operational stability</li>
              </ul>
              
              <h4>NOT Allowed:</h4>
              <ul className="forbidden-uses">
                <li>Speculation</li>
                <li>Unrelated financial instruments</li>
                <li>Personal enrichment without accountability</li>
              </ul>
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="tab-content projects-content">
            {role === 'applicant' && (
              <div className="new-project-section">
                <h3>Submit a Project</h3>
                <p>
                  Projects must be rooted in a real local context,
                  address a concrete need, and have a human accountable for outcomes.
                </p>
                <button className="new-project-btn">
                  Start New Application
                </button>
              </div>
            )}
            
            {projects.length === 0 ? (
              <div className="no-projects">
                <p>No projects yet.</p>
              </div>
            ) : (
              <div className="projects-grid">
                {projects.map(project => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={handleProjectClick}
                  />
                ))}
              </div>
            )}
          </div>
        )}
        
        {activeTab === 'governance' && (
          <div className="tab-content governance-content">
            <GovernanceReminder />
            
            <div className="transparency-section">
              <h3>Transparency & Traceability</h3>
              <p>All initiative funding is:</p>
              <ul>
                <li>Logged</li>
                <li>Auditable</li>
                <li>Narratively traceable</li>
              </ul>
              <p className="transparency-note">
                Transparency exists to build trust,
                not to perform accountability theater.
              </p>
            </div>
            
            <div className="returns-section">
              <h3>Relationship to Profit & Returns</h3>
              <p>
                CHE·NU does not guarantee financial returns from supported projects.
              </p>
              <p>Any value generated may be:</p>
              <ul>
                <li>Reinvested into the ecosystem</li>
                <li>Used to support future initiatives</li>
                <li>Allocated according to predefined governance rules</li>
              </ul>
              <p className="priorities">
                <strong>Priorities:</strong> continuity, resilience, shared growth
              </p>
            </div>
          </div>
        )}
      </main>
      
      {/* Footer */}
      <footer className="initiative-footer">
        <p className="structural-note">
          This commitment is structural, not promotional.
        </p>
        <p className="responsibility-note">
          Technological infrastructure must also carry social responsibility.
        </p>
      </footer>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

export const INITIATIVE_COMMITMENT_STYLES = `
.initiative-commitment {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  background: #fafafa;
  color: #333;
}

.initiative-header {
  text-align: center;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid #e0e0e0;
}

.initiative-header h1 {
  margin: 0;
  font-size: 1.75rem;
  color: #2a5a3a;
}

.header-tagline {
  margin: 0.5rem 0 0;
  color: #666;
  font-style: italic;
}

.initiative-commitment-statement {
  background: #f0f5f0;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.commitment-quote {
  font-size: 1.1rem;
  font-style: italic;
  color: #2a5a3a;
  border-left: 4px solid #4a7a5a;
  padding-left: 1rem;
  margin: 1rem 0;
}

.commitment-clarification {
  margin-top: 1rem;
}

.what-it-is {
  color: #2a5a3a;
}

.what-it-is-not {
  color: #666;
}

.non-goal {
  font-style: italic;
}

.ethical-constraints {
  margin-bottom: 2rem;
}

.constraints-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 1rem;
}

.constraint {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
}

.constraint-icon {
  font-size: 1.25rem;
}

.eligibility-criteria {
  margin-bottom: 2rem;
}

.criteria-list {
  list-style: none;
  padding: 0;
}

.criterion {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid #f0f0f0;
}

.criterion .status {
  width: 24px;
  text-align: center;
}

.criterion .status.met {
  color: #4a7a5a;
}

.criterion .status.unmet {
  color: #999;
}

.criteria-notes {
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f8f8f0;
  border-radius: 4px;
}

.criteria-notes .note {
  margin: 0.25rem 0;
  font-style: italic;
  color: #666;
}

.initiative-tabs {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e0e0e0;
}

.tab {
  padding: 0.75rem 1.5rem;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 0.95rem;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab:hover {
  color: #333;
}

.tab--active {
  color: #2a5a3a;
  border-bottom-color: #2a5a3a;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
}

.project-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 1.25rem;
  cursor: pointer;
  transition: box-shadow 0.2s;
}

.project-card:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
}

.project-name {
  margin: 0;
  font-size: 1.1rem;
}

.project-status {
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: white;
}

.project-description {
  font-size: 0.9rem;
  color: #555;
  margin: 0.5rem 0;
}

.project-context {
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: #666;
  margin: 0.75rem 0;
}

.project-owner {
  font-size: 0.85rem;
  color: #666;
}

.project-support {
  display: flex;
  justify-content: space-between;
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
  font-size: 0.85rem;
}

.governance-reminder {
  background: #f8f8f0;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.governance-rules {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin: 1rem 0;
}

.rule ul {
  margin: 0.5rem 0 0;
  padding-left: 1.25rem;
}

.rule li {
  margin: 0.25rem 0;
}

.agents-cannot {
  color: #aa5555;
}

.final-responsibility {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.initiative-footer {
  margin-top: 3rem;
  padding-top: 1.5rem;
  border-top: 1px solid #e0e0e0;
  text-align: center;
}

.structural-note {
  font-weight: 500;
  color: #2a5a3a;
}

.responsibility-note {
  font-style: italic;
  color: #666;
}

.allowed-uses h3,
.allowed-uses h4 {
  margin-bottom: 0.5rem;
}

.allowed-uses ul {
  margin: 0.5rem 0 1.5rem;
  padding-left: 1.5rem;
}

.forbidden-uses {
  color: #aa5555;
}

.new-project-section {
  background: #f0f5f0;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  text-align: center;
}

.new-project-btn {
  margin-top: 1rem;
  padding: 0.75rem 1.5rem;
  background: #2a5a3a;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
}

.new-project-btn:hover {
  background: #3a6a4a;
}

.no-projects {
  text-align: center;
  padding: 3rem;
  color: #666;
}
`;

export default InitiativeCommitment;
