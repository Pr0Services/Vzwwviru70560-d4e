/**
 * ============================================================
 * CHE·NU — UI DASHBOARD — HELP PAGE
 * SAFE · READ-ONLY · REPRESENTATIONAL
 * ============================================================
 */

import React, { useState } from "react";

interface HelpPageProps {
  onBack: () => void;
}

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const FAQ_DATA: FAQItem[] = [
  {
    id: "1",
    category: "General",
    question: "What is CHE·NU?",
    answer: "CHE·NU (Chez Nous - Our Place) is a representational architecture framework for organizing digital life across personal, creative, and professional domains. It provides a unified visual structure for navigating complex ecosystems while maintaining strict safety principles."
  },
  {
    id: "2",
    category: "General",
    question: "What does 'SAFE' mean?",
    answer: "SAFE indicates that CHE·NU operates in a non-autonomous, read-only mode. All data is representational, no actions are taken without explicit human approval, and there is no persistent AI memory or unsupervised processing."
  },
  {
    id: "3",
    category: "Navigation",
    question: "How do I navigate between spheres?",
    answer: "From the main dashboard, click on any sphere card to view its detailed dashboard. Use the 'Back to Universe' button to return to the main overview. The sidebar also provides quick access to all spheres."
  },
  {
    id: "4",
    category: "Navigation",
    question: "What are the 10 spheres?",
    answer: "The 10 spheres are: Personal (daily life), Creative (artistic projects), Business (professional activities), Education (learning), Construction (building projects), Real Estate (property), Government (civic), Social (community), Production (manufacturing), and Systems (infrastructure)."
  },
  {
    id: "5",
    category: "Features",
    question: "What are Engines?",
    answer: "Engines are the core processing components of CHE·NU: HyperFabric (contextual organization), Cartography (spatial mapping), Depth & Lens (detail levels), and Projection Engine (visualization). They work together to render the dashboard views."
  },
  {
    id: "6",
    category: "Features",
    question: "How does the Memory system work?",
    answer: "The Memory system is external and documentary only. It stores information you explicitly add via ADD_TO_MEMORY commands and retrieves it via READ_MEMORY. There is no internal AI memory or learning - all memory is user-controlled documentation."
  },
  {
    id: "7",
    category: "Data",
    question: "Is my data stored?",
    answer: "CHE·NU operates in read-only mode with session-based settings. Data displayed is representational and loaded from schemas. No user data is stored persistently. The system serves as a visualization framework, not a data storage solution."
  },
  {
    id: "8",
    category: "Data",
    question: "Can I edit projects or templates?",
    answer: "In the current SAFE mode, all data is read-only and representational. The dashboard displays mock data for demonstration. Any editing functionality would require explicit integration with external systems and human approval for each action."
  },
  {
    id: "9",
    category: "Technical",
    question: "What technology powers CHE·NU?",
    answer: "The CHE·NU dashboard is built with React and TypeScript, following a component-based architecture. It uses a modular adapter pattern for data loading, allowing easy integration with various data sources while maintaining the SAFE principles."
  },
  {
    id: "10",
    category: "Technical",
    question: "What is XR Suite?",
    answer: "The XR Suite provides schemas and builders for immersive representations of CHE·NU data. It includes XR Scene schemas, scene builders, and orchestration for potential VR/AR integrations while maintaining read-only, representational principles."
  }
];

export const HelpPage: React.FC<HelpPageProps> = ({ onBack }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(FAQ_DATA.map(item => item.category)))];
  
  const filteredFAQ = activeCategory === "All" 
    ? FAQ_DATA 
    : FAQ_DATA.filter(item => item.category === activeCategory);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backButton} onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1 style={styles.title}>
          <span style={styles.icon}>❓</span>
          Help & Documentation
        </h1>
        <p style={styles.subtitle}>
          Find answers to common questions and learn how to navigate CHE·NU.
        </p>
      </div>

      {/* Quick Links */}
      <div style={styles.quickLinks}>
        <QuickLinkCard 
          icon="📘"
          title="Getting Started"
          description="Learn the basics of navigating CHE·NU"
        />
        <QuickLinkCard 
          icon="🔮"
          title="Understanding Spheres"
          description="Explore the 10 spheres and their purposes"
        />
        <QuickLinkCard 
          icon="⚙️"
          title="Engines & Systems"
          description="How the core components work together"
        />
        <QuickLinkCard 
          icon="🛡️"
          title="Safety Principles"
          description="Understanding SAFE mode and constraints"
        />
      </div>

      {/* FAQ Section */}
      <div style={styles.faqSection}>
        <h2 style={styles.faqTitle}>Frequently Asked Questions</h2>
        
        {/* Category Filter */}
        <div style={styles.categoryFilter}>
          {categories.map(category => (
            <button
              key={category}
              style={{
                ...styles.categoryButton,
                ...(activeCategory === category ? styles.categoryButtonActive : {})
              }}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div style={styles.faqList}>
          {filteredFAQ.map(item => (
            <div 
              key={item.id} 
              style={{
                ...styles.faqItem,
                ...(expandedId === item.id ? styles.faqItemExpanded : {})
              }}
            >
              <button 
                style={styles.faqQuestion}
                onClick={() => toggleExpand(item.id)}
              >
                <div style={styles.faqQuestionContent}>
                  <span style={styles.faqCategory}>{item.category}</span>
                  <span style={styles.faqQuestionText}>{item.question}</span>
                </div>
                <span style={styles.faqToggle}>
                  {expandedId === item.id ? "−" : "+"}
                </span>
              </button>
              {expandedId === item.id && (
                <div style={styles.faqAnswer}>
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div style={styles.shortcutsSection}>
        <h2 style={styles.shortcutsTitle}>Keyboard Shortcuts</h2>
        <div style={styles.shortcutsGrid}>
          <ShortcutItem keys={["⌘", "/"]} description="Open help" />
          <ShortcutItem keys={["⌘", "K"]} description="Quick search" />
          <ShortcutItem keys={["Esc"]} description="Close modal / Go back" />
          <ShortcutItem keys={["⌘", "1-9"]} description="Navigate to sphere" />
          <ShortcutItem keys={["⌘", "S"]} description="Open settings" />
          <ShortcutItem keys={["⌘", "H"]} description="Return to home" />
        </div>
      </div>

      {/* Contact Section */}
      <div style={styles.contactSection}>
        <div style={styles.contactContent}>
          <span style={styles.contactIcon}>💬</span>
          <h3 style={styles.contactTitle}>Need More Help?</h3>
          <p style={styles.contactText}>
            CHE·NU is a representational framework. For technical documentation, 
            architecture details, and integration guides, refer to the ARCHITECTURE.md 
            and README.md files in the repository.
          </p>
        </div>
      </div>

      {/* Safety Reminder */}
      <div style={styles.safetyReminder}>
        <span style={styles.safetyIcon}>🔒</span>
        <span style={styles.safetyText}>
          Remember: CHE·NU operates in SAFE mode. All data is read-only and representational.
        </span>
      </div>
    </div>
  );
};

// Quick Link Card Component
const QuickLinkCard: React.FC<{ icon: string; title: string; description: string }> = ({ icon, title, description }) => (
  <div style={styles.quickLinkCard}>
    <span style={styles.quickLinkIcon}>{icon}</span>
    <h3 style={styles.quickLinkTitle}>{title}</h3>
    <p style={styles.quickLinkDesc}>{description}</p>
  </div>
);

// Shortcut Item Component
const ShortcutItem: React.FC<{ keys: string[]; description: string }> = ({ keys, description }) => (
  <div style={styles.shortcutItem}>
    <div style={styles.shortcutKeys}>
      {keys.map((key, i) => (
        <React.Fragment key={i}>
          <span style={styles.shortcutKey}>{key}</span>
          {i < keys.length - 1 && <span style={styles.shortcutPlus}>+</span>}
        </React.Fragment>
      ))}
    </div>
    <span style={styles.shortcutDesc}>{description}</span>
  </div>
);

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: "1000px"
  },
  header: {
    marginBottom: "32px"
  },
  backButton: {
    background: "none",
    border: "none",
    color: "#8D8371",
    cursor: "pointer",
    fontSize: "13px",
    padding: "0",
    marginBottom: "16px"
  },
  title: {
    margin: "0 0 8px 0",
    fontSize: "28px",
    fontWeight: 700,
    color: "#1E1F22",
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  icon: {
    fontSize: "28px"
  },
  subtitle: {
    margin: 0,
    fontSize: "14px",
    color: "#8D8371"
  },
  quickLinks: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "16px",
    marginBottom: "40px"
  },
  quickLinkCard: {
    padding: "20px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  quickLinkIcon: {
    fontSize: "28px",
    display: "block",
    marginBottom: "12px"
  },
  quickLinkTitle: {
    margin: "0 0 6px 0",
    fontSize: "14px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  quickLinkDesc: {
    margin: 0,
    fontSize: "12px",
    color: "#666",
    lineHeight: 1.4
  },
  faqSection: {
    marginBottom: "40px"
  },
  faqTitle: {
    margin: "0 0 20px 0",
    fontSize: "20px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  categoryFilter: {
    display: "flex",
    gap: "8px",
    marginBottom: "20px"
  },
  categoryButton: {
    padding: "8px 16px",
    backgroundColor: "#F0F0F0",
    border: "none",
    borderRadius: "20px",
    fontSize: "13px",
    color: "#666",
    cursor: "pointer",
    transition: "all 0.2s"
  },
  categoryButtonActive: {
    backgroundColor: "#3F7249",
    color: "#FFFFFF"
  },
  faqList: {},
  faqItem: {
    marginBottom: "8px",
    backgroundColor: "#FFFFFF",
    borderRadius: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    border: "1px solid #E5E5E5",
    overflow: "hidden"
  },
  faqItemExpanded: {
    borderColor: "#3F7249"
  },
  faqQuestion: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "16px 20px",
    background: "none",
    border: "none",
    cursor: "pointer",
    textAlign: "left" as const
  },
  faqQuestionContent: {},
  faqCategory: {
    display: "block",
    fontSize: "10px",
    color: "#8D8371",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.5px"
  },
  faqQuestionText: {
    display: "block",
    fontSize: "14px",
    fontWeight: 500,
    color: "#1E1F22"
  },
  faqToggle: {
    fontSize: "20px",
    color: "#8D8371",
    fontWeight: 300
  },
  faqAnswer: {
    padding: "0 20px 20px 20px",
    fontSize: "13px",
    color: "#666",
    lineHeight: 1.6,
    borderTop: "1px solid #F0F0F0",
    paddingTop: "16px"
  },
  shortcutsSection: {
    marginBottom: "40px",
    padding: "24px",
    backgroundColor: "#FFFFFF",
    borderRadius: "12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
    border: "1px solid #E5E5E5"
  },
  shortcutsTitle: {
    margin: "0 0 20px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#1E1F22"
  },
  shortcutsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px"
  },
  shortcutItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px"
  },
  shortcutKeys: {
    display: "flex",
    alignItems: "center",
    gap: "4px"
  },
  shortcutKey: {
    padding: "4px 8px",
    backgroundColor: "#F0F0F0",
    borderRadius: "4px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#444",
    fontFamily: "monospace"
  },
  shortcutPlus: {
    fontSize: "12px",
    color: "#8D8371"
  },
  shortcutDesc: {
    fontSize: "13px",
    color: "#666"
  },
  contactSection: {
    marginBottom: "24px",
    padding: "24px",
    backgroundColor: "#D8B26A15",
    borderRadius: "12px",
    border: "1px solid #D8B26A30"
  },
  contactContent: {
    textAlign: "center" as const
  },
  contactIcon: {
    fontSize: "32px",
    display: "block",
    marginBottom: "12px"
  },
  contactTitle: {
    margin: "0 0 8px 0",
    fontSize: "16px",
    fontWeight: 600,
    color: "#7A593A"
  },
  contactText: {
    margin: 0,
    fontSize: "13px",
    color: "#7A593A",
    lineHeight: 1.5,
    maxWidth: "500px",
    marginLeft: "auto",
    marginRight: "auto"
  },
  safetyReminder: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    padding: "16px",
    backgroundColor: "#3F724910",
    borderRadius: "8px"
  },
  safetyIcon: {
    fontSize: "18px"
  },
  safetyText: {
    fontSize: "13px",
    color: "#2F4C39"
  }
};

export default HelpPage;
