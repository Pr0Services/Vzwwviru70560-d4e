/**
 * CHE·NU™ V71 - Knowledge Base Components
 * 
 * Provides:
 * - Document list with filters
 * - Document upload and indexing
 * - Semantic search interface
 * - RAG context viewer
 * - Knowledge graph visualization
 */

import React, { useState, useEffect, useCallback } from 'react';

// ============================================================================
// TYPES
// ============================================================================

interface DocumentMetadata {
  title: string;
  source: string;
  author?: string;
  created_at?: string;
  language: string;
  tags: string[];
  custom?: Record<string, any>;
}

interface Document {
  id: string;
  content: string;
  doc_type: string;
  metadata: DocumentMetadata;
  status: string;
  sphere_id: string;
  owner_id: string;
  created_at: string;
  updated_at: string;
  indexed_at?: string;
  chunk_count: number;
  embedding_model?: string;
}

interface SearchResult {
  chunk_id: string;
  document_id: string;
  content: string;
  score: number;
  metadata: Record<string, any>;
  highlights: string[];
  document_title: string;
  document_source: string;
}

interface SearchResponse {
  query: string;
  results: SearchResult[];
  total_results: number;
  search_time_ms: number;
  mode: string;
}

interface RAGContext {
  query: string;
  retrieved_chunks: SearchResult[];
  formatted_context: string;
  token_count: number;
  sources: Array<{
    title: string;
    source: string;
    chunk_id: string;
  }>;
}

interface KnowledgeRelation {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
  weight: number;
  created_at: string;
}

interface KnowledgeStats {
  total_documents: number;
  total_chunks: number;
  total_relations: number;
  documents_by_type: Record<string, number>;
  documents_by_status: Record<string, number>;
  documents_by_sphere: Record<string, number>;
  searches_performed: number;
}

// ============================================================================
// API CLIENT
// ============================================================================

const API_BASE = '/api/v2/knowledge';

const knowledgeApi = {
  // Documents
  async listDocuments(params?: {
    sphere_id?: string;
    status?: string;
    doc_type?: string;
    tags?: string[];
    limit?: number;
    offset?: number;
  }): Promise<Document[]> {
    const query = new URLSearchParams();
    if (params?.sphere_id) query.set('sphere_id', params.sphere_id);
    if (params?.status) query.set('status', params.status);
    if (params?.doc_type) query.set('doc_type', params.doc_type);
    if (params?.tags) params.tags.forEach(t => query.append('tags', t));
    if (params?.limit) query.set('limit', params.limit.toString());
    if (params?.offset) query.set('offset', params.offset.toString());
    
    const res = await fetch(`${API_BASE}/documents?${query}`);
    if (!res.ok) throw new Error('Failed to list documents');
    return res.json();
  },

  async getDocument(id: string): Promise<Document> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Document not found');
    return res.json();
  },

  async createDocument(data: {
    content: string;
    doc_type: string;
    metadata: DocumentMetadata;
    sphere_id?: string;
    auto_index?: boolean;
  }): Promise<Document> {
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create document');
    return res.json();
  },

  async updateDocument(id: string, data: {
    content?: string;
    metadata?: DocumentMetadata;
    reindex?: boolean;
  }): Promise<Document> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update document');
    return res.json();
  },

  async deleteDocument(id: string): Promise<void> {
    const res = await fetch(`${API_BASE}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete document');
  },

  async reindexDocument(id: string): Promise<Document> {
    const res = await fetch(`${API_BASE}/documents/${id}/reindex`, {
      method: 'POST',
    });
    if (!res.ok) throw new Error('Failed to reindex document');
    return res.json();
  },

  // Search
  async search(query: {
    query: string;
    mode?: string;
    top_k?: number;
    min_score?: number;
    sphere_id?: string;
    doc_types?: string[];
    tags?: string[];
  }): Promise<SearchResponse> {
    const res = await fetch(`${API_BASE}/search`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(query),
    });
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // RAG
  async getRAGContext(params: {
    query: string;
    top_k?: number;
    max_tokens?: number;
    sphere_id?: string;
  }): Promise<RAGContext> {
    const res = await fetch(`${API_BASE}/rag/context`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    if (!res.ok) throw new Error('Failed to get RAG context');
    return res.json();
  },

  // Relations
  async getRelations(entityId: string, params?: {
    relation_type?: string;
    direction?: string;
  }): Promise<KnowledgeRelation[]> {
    const query = new URLSearchParams();
    if (params?.relation_type) query.set('relation_type', params.relation_type);
    if (params?.direction) query.set('direction', params.direction);
    
    const res = await fetch(`${API_BASE}/relations/${entityId}?${query}`);
    if (!res.ok) throw new Error('Failed to get relations');
    return res.json();
  },

  async createRelation(data: {
    source_id: string;
    target_id: string;
    relation_type: string;
    weight?: number;
  }): Promise<KnowledgeRelation> {
    const res = await fetch(`${API_BASE}/relations`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create relation');
    return res.json();
  },

  // Statistics
  async getStatistics(): Promise<KnowledgeStats> {
    const res = await fetch(`${API_BASE}/stats`);
    if (!res.ok) throw new Error('Failed to get statistics');
    return res.json();
  },
};

// ============================================================================
// DOCUMENT LIST COMPONENT
// ============================================================================

interface DocumentListProps {
  sphereId?: string;
  onSelect?: (doc: Document) => void;
}

export const DocumentList: React.FC<DocumentListProps> = ({ sphereId, onSelect }) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [typeFilter, setTypeFilter] = useState<string>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const loadDocuments = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const docs = await knowledgeApi.listDocuments({
        sphere_id: sphereId,
        status: statusFilter || undefined,
        doc_type: typeFilter || undefined,
        limit: 50,
      });
      setDocuments(docs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  }, [sphereId, statusFilter, typeFilter]);

  useEffect(() => {
    loadDocuments();
    const interval = setInterval(loadDocuments, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, [loadDocuments]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;
    
    try {
      await knowledgeApi.deleteDocument(id);
      loadDocuments();
    } catch (err) {
      alert('Failed to delete document');
    }
  };

  const handleReindex = async (id: string) => {
    try {
      await knowledgeApi.reindexDocument(id);
      loadDocuments();
    } catch (err) {
      alert('Failed to reindex document');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      indexed: '#22c55e',
      processing: '#eab308',
      pending: '#94a3b8',
      failed: '#ef4444',
      archived: '#6b7280',
    };
    return colors[status] || '#94a3b8';
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      markdown: '📝',
      text: '📄',
      html: '🌐',
      pdf: '📑',
      code: '💻',
      json: '{}',
      csv: '📊',
    };
    return icons[type] || '📄';
  };

  if (loading && documents.length === 0) {
    return (
      <div style={styles.container}>
        <div style={styles.loading}>Loading documents...</div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📚 Documents</h3>
        <button onClick={loadDocuments} style={styles.refreshButton}>
          🔄 Refresh
        </button>
      </div>

      {/* Filters */}
      <div style={styles.filters}>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Status</option>
          <option value="indexed">Indexed</option>
          <option value="processing">Processing</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          style={styles.select}
        >
          <option value="">All Types</option>
          <option value="markdown">Markdown</option>
          <option value="text">Text</option>
          <option value="html">HTML</option>
          <option value="pdf">PDF</option>
          <option value="code">Code</option>
        </select>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Document List */}
      <div style={styles.list}>
        {documents.length === 0 ? (
          <div style={styles.empty}>No documents found</div>
        ) : (
          documents.map((doc) => (
            <div
              key={doc.id}
              style={{
                ...styles.docCard,
                ...(selectedId === doc.id ? styles.docCardSelected : {}),
              }}
              onClick={() => {
                setSelectedId(doc.id);
                onSelect?.(doc);
              }}
            >
              <div style={styles.docHeader}>
                <span style={styles.docIcon}>{getTypeIcon(doc.doc_type)}</span>
                <span style={styles.docTitle}>{doc.metadata.title}</span>
                <span
                  style={{
                    ...styles.statusBadge,
                    backgroundColor: getStatusColor(doc.status),
                  }}
                >
                  {doc.status}
                </span>
              </div>

              <div style={styles.docMeta}>
                <span>📁 {doc.metadata.source}</span>
                <span>📦 {doc.chunk_count} chunks</span>
                <span>🌐 {doc.sphere_id}</span>
              </div>

              {doc.metadata.tags.length > 0 && (
                <div style={styles.tags}>
                  {doc.metadata.tags.map((tag) => (
                    <span key={tag} style={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div style={styles.docActions}>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReindex(doc.id);
                  }}
                  style={styles.actionButton}
                >
                  🔄 Reindex
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(doc.id);
                  }}
                  style={{ ...styles.actionButton, color: '#ef4444' }}
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// ============================================================================
// SEARCH COMPONENT
// ============================================================================

interface SearchPanelProps {
  sphereId?: string;
  onResultSelect?: (result: SearchResult) => void;
}

export const SearchPanel: React.FC<SearchPanelProps> = ({ sphereId, onResultSelect }) => {
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<string>('hybrid');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchTime, setSearchTime] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await knowledgeApi.search({
        query: query.trim(),
        mode,
        top_k: 10,
        min_score: 0.3,
        sphere_id: sphereId,
      });

      setResults(response.results);
      setSearchTime(response.search_time_ms);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🔍 Semantic Search</h3>
      </div>

      {/* Search Input */}
      <div style={styles.searchBox}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Enter your search query..."
          style={styles.searchInput}
        />
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value)}
          style={styles.modeSelect}
        >
          <option value="hybrid">Hybrid</option>
          <option value="semantic">Semantic</option>
          <option value="keyword">Keyword</option>
        </select>
        <button
          onClick={handleSearch}
          disabled={loading || !query.trim()}
          style={styles.searchButton}
        >
          {loading ? '⏳' : '🔍'} Search
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Results */}
      {results.length > 0 && (
        <div style={styles.searchMeta}>
          Found {results.length} results in {searchTime.toFixed(1)}ms
        </div>
      )}

      <div style={styles.resultsList}>
        {results.map((result, index) => (
          <div
            key={result.chunk_id}
            style={styles.resultCard}
            onClick={() => onResultSelect?.(result)}
          >
            <div style={styles.resultHeader}>
              <span style={styles.resultRank}>#{index + 1}</span>
              <span style={styles.resultTitle}>{result.document_title}</span>
              <span style={styles.resultScore}>
                Score: {(result.score * 100).toFixed(1)}%
              </span>
            </div>

            <div style={styles.resultContent}>
              {result.content.slice(0, 300)}
              {result.content.length > 300 && '...'}
            </div>

            {result.highlights.length > 0 && (
              <div style={styles.highlights}>
                {result.highlights.map((h, i) => (
                  <span key={i} style={styles.highlight}>
                    {h}
                  </span>
                ))}
              </div>
            )}

            <div style={styles.resultSource}>
              📁 {result.document_source}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// RAG CONTEXT COMPONENT
// ============================================================================

interface RAGContextPanelProps {
  sphereId?: string;
}

export const RAGContextPanel: React.FC<RAGContextPanelProps> = ({ sphereId }) => {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState<RAGContext | null>(null);
  const [maxTokens, setMaxTokens] = useState(2000);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetContext = async () => {
    if (!query.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const result = await knowledgeApi.getRAGContext({
        query: query.trim(),
        top_k: 5,
        max_tokens: maxTokens,
        sphere_id: sphereId,
      });

      setContext(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to get context');
      setContext(null);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (context) {
      navigator.clipboard.writeText(context.formatted_context);
      alert('Context copied to clipboard!');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>🤖 RAG Context</h3>
      </div>

      {/* Query Input */}
      <div style={styles.ragInput}>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your question to generate RAG context..."
          style={styles.ragTextarea}
          rows={3}
        />
        <div style={styles.ragControls}>
          <label style={styles.tokenLabel}>
            Max Tokens:
            <input
              type="number"
              value={maxTokens}
              onChange={(e) => setMaxTokens(parseInt(e.target.value) || 2000)}
              style={styles.tokenInput}
              min={100}
              max={8000}
            />
          </label>
          <button
            onClick={handleGetContext}
            disabled={loading || !query.trim()}
            style={styles.ragButton}
          >
            {loading ? '⏳ Generating...' : '✨ Generate Context'}
          </button>
        </div>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      {/* Context Display */}
      {context && (
        <div style={styles.contextContainer}>
          <div style={styles.contextHeader}>
            <span>📊 {context.token_count} tokens</span>
            <span>📚 {context.sources.length} sources</span>
            <button onClick={copyToClipboard} style={styles.copyButton}>
              📋 Copy
            </button>
          </div>

          {/* Sources */}
          <div style={styles.sourcesList}>
            <h4 style={styles.sourcesTitle}>Sources:</h4>
            {context.sources.map((source, i) => (
              <div key={i} style={styles.sourceItem}>
                <span style={styles.sourceNumber}>{i + 1}.</span>
                <span style={styles.sourceTitle}>{source.title}</span>
                <span style={styles.sourcePath}>{source.source}</span>
              </div>
            ))}
          </div>

          {/* Context Preview */}
          <div style={styles.contextPreview}>
            <h4 style={styles.contextPreviewTitle}>Generated Context:</h4>
            <pre style={styles.contextText}>{context.formatted_context}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// DOCUMENT UPLOAD COMPONENT
// ============================================================================

interface DocumentUploadProps {
  sphereId?: string;
  onUpload?: (doc: Document) => void;
}

export const DocumentUpload: React.FC<DocumentUploadProps> = ({ sphereId, onUpload }) => {
  const [title, setTitle] = useState('');
  const [source, setSource] = useState('');
  const [docType, setDocType] = useState('text');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const doc = await knowledgeApi.createDocument({
        content: content.trim(),
        doc_type: docType,
        metadata: {
          title: title.trim(),
          source: source.trim() || 'manual-upload',
          language: 'en',
          tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
        },
        sphere_id: sphereId,
        auto_index: true,
      });

      onUpload?.(doc);

      // Reset form
      setTitle('');
      setSource('');
      setContent('');
      setTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h3 style={styles.title}>📤 Upload Document</h3>
      </div>

      <form onSubmit={handleSubmit} style={styles.uploadForm}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Title *</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document title"
            style={styles.input}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Source</label>
          <input
            type="text"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="e.g., docs/guide.md"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Type</label>
          <select
            value={docType}
            onChange={(e) => setDocType(e.target.value)}
            style={styles.select}
          >
            <option value="text">Text</option>
            <option value="markdown">Markdown</option>
            <option value="html">HTML</option>
            <option value="code">Code</option>
            <option value="json">JSON</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Tags (comma-separated)</label>
          <input
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., guide, architecture, api"
            style={styles.input}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Content *</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste or type your document content..."
            style={styles.textarea}
            rows={10}
            required
          />
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <button
          type="submit"
          disabled={loading}
          style={styles.submitButton}
        >
          {loading ? '⏳ Uploading...' : '📤 Upload & Index'}
        </button>
      </form>
    </div>
  );
};

// ============================================================================
// STATISTICS COMPONENT
// ============================================================================

export const KnowledgeStats: React.FC = () => {
  const [stats, setStats] = useState<KnowledgeStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await knowledgeApi.getStatistics();
        setStats(data);
      } catch (err) {
        console.error('Failed to load stats:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading || !stats) {
    return <div style={styles.loading}>Loading statistics...</div>;
  }

  return (
    <div style={styles.statsGrid}>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.total_documents}</div>
        <div style={styles.statLabel}>Documents</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.total_chunks}</div>
        <div style={styles.statLabel}>Chunks</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.total_relations}</div>
        <div style={styles.statLabel}>Relations</div>
      </div>
      <div style={styles.statCard}>
        <div style={styles.statValue}>{stats.searches_performed}</div>
        <div style={styles.statLabel}>Searches</div>
      </div>
    </div>
  );
};

// ============================================================================
// KNOWLEDGE DASHBOARD
// ============================================================================

export const KnowledgeDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'documents' | 'search' | 'rag' | 'upload'>('documents');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);

  return (
    <div style={styles.dashboard}>
      <div style={styles.dashboardHeader}>
        <h2 style={styles.dashboardTitle}>📚 Knowledge Base</h2>
        <KnowledgeStats />
      </div>

      {/* Tab Navigation */}
      <div style={styles.tabs}>
        {(['documents', 'search', 'rag', 'upload'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              ...styles.tab,
              ...(activeTab === tab ? styles.tabActive : {}),
            }}
          >
            {tab === 'documents' && '📄 Documents'}
            {tab === 'search' && '🔍 Search'}
            {tab === 'rag' && '🤖 RAG'}
            {tab === 'upload' && '📤 Upload'}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div style={styles.tabContent}>
        {activeTab === 'documents' && (
          <DocumentList onSelect={setSelectedDoc} />
        )}
        {activeTab === 'search' && <SearchPanel />}
        {activeTab === 'rag' && <RAGContextPanel />}
        {activeTab === 'upload' && (
          <DocumentUpload onUpload={() => setActiveTab('documents')} />
        )}
      </div>

      {/* Document Detail Modal */}
      {selectedDoc && (
        <div style={styles.modal} onClick={() => setSelectedDoc(null)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <div style={styles.modalHeader}>
              <h3>{selectedDoc.metadata.title}</h3>
              <button onClick={() => setSelectedDoc(null)} style={styles.closeButton}>
                ✕
              </button>
            </div>
            <div style={styles.modalBody}>
              <div style={styles.docInfo}>
                <p><strong>Source:</strong> {selectedDoc.metadata.source}</p>
                <p><strong>Type:</strong> {selectedDoc.doc_type}</p>
                <p><strong>Status:</strong> {selectedDoc.status}</p>
                <p><strong>Chunks:</strong> {selectedDoc.chunk_count}</p>
                <p><strong>Sphere:</strong> {selectedDoc.sphere_id}</p>
              </div>
              <div style={styles.docContentPreview}>
                <h4>Content Preview:</h4>
                <pre>{selectedDoc.content.slice(0, 1000)}...</pre>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================================================
// STYLES
// ============================================================================

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '16px',
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    color: '#e0e0e0',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    fontWeight: 600,
  },
  refreshButton: {
    padding: '6px 12px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    cursor: 'pointer',
  },
  filters: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  select: {
    padding: '8px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    minWidth: '120px',
  },
  list: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    maxHeight: '500px',
    overflowY: 'auto',
  },
  docCard: {
    padding: '12px',
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
    border: '1px solid #444',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  docCardSelected: {
    border: '1px solid #3b82f6',
    backgroundColor: '#1e3a5f',
  },
  docHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  docIcon: {
    fontSize: '20px',
  },
  docTitle: {
    flex: 1,
    fontWeight: 500,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  statusBadge: {
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: 500,
    color: '#fff',
  },
  docMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '12px',
    color: '#888',
    marginBottom: '8px',
  },
  tags: {
    display: 'flex',
    gap: '4px',
    flexWrap: 'wrap',
    marginBottom: '8px',
  },
  tag: {
    padding: '2px 6px',
    backgroundColor: '#3b82f6',
    borderRadius: '4px',
    fontSize: '11px',
  },
  docActions: {
    display: 'flex',
    gap: '8px',
    marginTop: '8px',
  },
  actionButton: {
    padding: '4px 8px',
    backgroundColor: 'transparent',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#888',
    cursor: 'pointer',
    fontSize: '12px',
  },
  searchBox: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  },
  searchInput: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  modeSelect: {
    padding: '10px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
  },
  searchButton: {
    padding: '10px 16px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  },
  searchMeta: {
    fontSize: '12px',
    color: '#888',
    marginBottom: '12px',
  },
  resultsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    maxHeight: '400px',
    overflowY: 'auto',
  },
  resultCard: {
    padding: '12px',
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  resultHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '8px',
  },
  resultRank: {
    width: '24px',
    height: '24px',
    backgroundColor: '#3b82f6',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 600,
  },
  resultTitle: {
    flex: 1,
    fontWeight: 500,
  },
  resultScore: {
    fontSize: '12px',
    color: '#22c55e',
    fontWeight: 500,
  },
  resultContent: {
    fontSize: '13px',
    color: '#aaa',
    lineHeight: 1.5,
    marginBottom: '8px',
  },
  highlights: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    marginBottom: '8px',
  },
  highlight: {
    padding: '4px 8px',
    backgroundColor: '#3b3b00',
    borderRadius: '4px',
    fontSize: '12px',
  },
  resultSource: {
    fontSize: '11px',
    color: '#666',
  },
  ragInput: {
    marginBottom: '16px',
  },
  ragTextarea: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    resize: 'vertical',
    fontSize: '14px',
    marginBottom: '8px',
  },
  ragControls: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tokenLabel: {
    fontSize: '12px',
    color: '#888',
  },
  tokenInput: {
    width: '80px',
    padding: '4px 8px',
    marginLeft: '8px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
  },
  ragButton: {
    padding: '10px 20px',
    backgroundColor: '#22c55e',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
  },
  contextContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
    padding: '16px',
  },
  contextHeader: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '1px solid #444',
  },
  copyButton: {
    marginLeft: 'auto',
    padding: '6px 12px',
    backgroundColor: '#3b82f6',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
  },
  sourcesList: {
    marginBottom: '16px',
  },
  sourcesTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
  },
  sourceItem: {
    display: 'flex',
    gap: '8px',
    fontSize: '12px',
    padding: '4px 0',
  },
  sourceNumber: {
    color: '#3b82f6',
    fontWeight: 500,
  },
  sourceTitle: {
    fontWeight: 500,
  },
  sourcePath: {
    color: '#888',
  },
  contextPreview: {
    marginTop: '16px',
  },
  contextPreviewTitle: {
    margin: '0 0 8px 0',
    fontSize: '14px',
  },
  contextText: {
    padding: '12px',
    backgroundColor: '#1e1e1e',
    borderRadius: '4px',
    fontSize: '12px',
    maxHeight: '300px',
    overflowY: 'auto',
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  uploadForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '13px',
    fontWeight: 500,
    color: '#aaa',
  },
  input: {
    padding: '10px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
  },
  textarea: {
    padding: '10px',
    backgroundColor: '#2d2d2d',
    border: '1px solid #444',
    borderRadius: '4px',
    color: '#e0e0e0',
    fontSize: '14px',
    resize: 'vertical',
    fontFamily: 'monospace',
  },
  submitButton: {
    padding: '12px',
    backgroundColor: '#22c55e',
    border: 'none',
    borderRadius: '4px',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '12px',
    marginBottom: '16px',
  },
  statCard: {
    padding: '12px',
    backgroundColor: '#2d2d2d',
    borderRadius: '6px',
    textAlign: 'center',
  },
  statValue: {
    fontSize: '24px',
    fontWeight: 600,
    color: '#3b82f6',
  },
  statLabel: {
    fontSize: '12px',
    color: '#888',
  },
  dashboard: {
    padding: '24px',
    backgroundColor: '#121212',
    minHeight: '100vh',
    color: '#e0e0e0',
  },
  dashboardHeader: {
    marginBottom: '24px',
  },
  dashboardTitle: {
    margin: '0 0 16px 0',
    fontSize: '24px',
  },
  tabs: {
    display: 'flex',
    gap: '4px',
    borderBottom: '1px solid #444',
    marginBottom: '16px',
  },
  tab: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: 'none',
    borderBottom: '2px solid transparent',
    color: '#888',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  tabActive: {
    color: '#3b82f6',
    borderBottomColor: '#3b82f6',
  },
  tabContent: {
    padding: '16px 0',
  },
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '800px',
    maxHeight: '80vh',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  modalHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    borderBottom: '1px solid #444',
  },
  closeButton: {
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#333',
    border: 'none',
    color: '#fff',
    cursor: 'pointer',
    fontSize: '16px',
  },
  modalBody: {
    padding: '16px',
    overflowY: 'auto',
  },
  docInfo: {
    marginBottom: '16px',
  },
  docContentPreview: {
    backgroundColor: '#2d2d2d',
    borderRadius: '4px',
    padding: '12px',
  },
  loading: {
    textAlign: 'center',
    padding: '20px',
    color: '#888',
  },
  error: {
    padding: '12px',
    backgroundColor: '#3b0000',
    border: '1px solid #7f1d1d',
    borderRadius: '4px',
    color: '#fca5a5',
    marginBottom: '12px',
  },
  empty: {
    textAlign: 'center',
    padding: '40px',
    color: '#666',
  },
};

// ============================================================================
// EXPORTS
// ============================================================================

export default KnowledgeDashboard;
