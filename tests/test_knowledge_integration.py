"""
CHE·NU™ V71 - Knowledge Base Integration Tests
Comprehensive test suite for document indexing, semantic search, and RAG

Tests:
- Document management (CRUD)
- Chunking strategies
- Embedding generation
- Semantic search
- Keyword search
- Hybrid search
- RAG context generation
- Knowledge graph relations
- Statistics and metrics
"""

import pytest
from datetime import datetime, timedelta
from typing import List, Dict, Any
import asyncio
import sys
import os

# Add parent directory for imports
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from services.knowledge_base_service import (
    KnowledgeBaseService,
    Document,
    DocumentMetadata,
    DocumentType,
    DocumentStatus,
    Chunk,
    ChunkConfig,
    ChunkStrategy,
    EmbeddingConfig,
    EmbeddingProvider,
    SearchQuery,
    SearchMode,
    SearchResult,
    SearchResponse,
    RelationType,
    KnowledgeRelation,
    RAGContext
)


# ============================================================================
# FIXTURES
# ============================================================================

@pytest.fixture
def knowledge_service():
    """Fresh knowledge base service for each test"""
    config = ChunkConfig(
        strategy=ChunkStrategy.RECURSIVE,
        chunk_size=256,
        chunk_overlap=32
    )
    embedding_config = EmbeddingConfig(
        provider=EmbeddingProvider.MOCK,
        dimensions=128
    )
    return KnowledgeBaseService(
        chunk_config=config,
        embedding_config=embedding_config
    )


@pytest.fixture
def sample_metadata():
    """Sample document metadata"""
    return DocumentMetadata(
        title="CHE·NU Architecture Guide",
        source="internal/docs/architecture.md",
        author="Jo",
        created_at=datetime.utcnow(),
        language="en",
        tags=["architecture", "governance", "agents"]
    )


@pytest.fixture
def sample_content():
    """Sample document content"""
    return """
# CHE·NU Architecture

CHE·NU is a Multi-Lane Cognitive OS with the core principle: GOVERNANCE > EXECUTION.

## Core Principles

1. Human Sovereignty: All AI actions require explicit human approval before execution.
2. Identity Isolation: Users can only access their own data, enforced at the middleware level.
3. Full Audit Trail: Every action is logged with timestamp, user, and context.
4. Token Governance: AI usage is tracked and limited by configurable budgets.

## Main Components

### Nova Pipeline
The Nova Pipeline is a 7-lane processing system that handles all AI interactions.
Each lane performs a specific function: Intent, Context, Encoding, Governance, Checkpoint, Execution, and Audit.

### Agent System
The Agent System manages multiple AI agents with different capabilities.
Agents are assigned tasks through workflows that require human approval.

### Knowledge Base
The Knowledge Base provides semantic search and RAG (Retrieval Augmented Generation) capabilities.
Documents are indexed, chunked, and embedded for efficient retrieval.

## Security Model

Security is built on the principle of zero-trust architecture.
Every request is authenticated, authorized, and logged.
Cross-sphere data access is prohibited without explicit workflow approval.
"""


@pytest.fixture
def multiple_documents():
    """Multiple documents for testing"""
    return [
        {
            "content": "Python is a programming language. It is widely used for AI and machine learning.",
            "metadata": DocumentMetadata(title="Python Guide", source="guides/python.md", tags=["python", "programming"]),
            "doc_type": DocumentType.MARKDOWN
        },
        {
            "content": "Machine learning is a subset of artificial intelligence. It enables systems to learn from data.",
            "metadata": DocumentMetadata(title="ML Basics", source="guides/ml.md", tags=["ml", "ai"]),
            "doc_type": DocumentType.MARKDOWN
        },
        {
            "content": "FastAPI is a modern web framework for Python. It is fast and easy to use for building APIs.",
            "metadata": DocumentMetadata(title="FastAPI Tutorial", source="guides/fastapi.md", tags=["python", "api"]),
            "doc_type": DocumentType.MARKDOWN
        }
    ]


# ============================================================================
# DOCUMENT MANAGEMENT TESTS
# ============================================================================

class TestDocumentManagement:
    """Tests for document CRUD operations"""
    
    @pytest.mark.asyncio
    async def test_add_document(self, knowledge_service, sample_metadata, sample_content):
        """Test adding a document"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata,
            sphere_id="personal",
            owner_id="user_123"
        )
        
        assert doc.id is not None
        assert doc.content == sample_content
        assert doc.doc_type == DocumentType.MARKDOWN
        assert doc.metadata.title == "CHE·NU Architecture Guide"
        assert doc.sphere_id == "personal"
        assert doc.owner_id == "user_123"
        assert doc.status == DocumentStatus.INDEXED
        assert doc.chunk_count > 0
    
    @pytest.mark.asyncio
    async def test_get_document(self, knowledge_service, sample_metadata, sample_content):
        """Test retrieving a document by ID"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        retrieved = await knowledge_service.get_document(doc.id)
        
        assert retrieved is not None
        assert retrieved.id == doc.id
        assert retrieved.content == sample_content
    
    @pytest.mark.asyncio
    async def test_get_nonexistent_document(self, knowledge_service):
        """Test retrieving non-existent document returns None"""
        result = await knowledge_service.get_document("nonexistent_id")
        assert result is None
    
    @pytest.mark.asyncio
    async def test_list_documents_no_filter(self, knowledge_service, multiple_documents):
        """Test listing all documents"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        docs = await knowledge_service.list_documents()
        
        assert len(docs) == 3
    
    @pytest.mark.asyncio
    async def test_list_documents_by_sphere(self, knowledge_service, sample_metadata, sample_content):
        """Test filtering documents by sphere"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata,
            sphere_id="personal"
        )
        await knowledge_service.add_document(
            content="Business document",
            doc_type=DocumentType.TEXT,
            metadata=DocumentMetadata(title="Business", source="business.txt"),
            sphere_id="business"
        )
        
        personal_docs = await knowledge_service.list_documents(sphere_id="personal")
        business_docs = await knowledge_service.list_documents(sphere_id="business")
        
        assert len(personal_docs) == 1
        assert len(business_docs) == 1
        assert personal_docs[0].sphere_id == "personal"
        assert business_docs[0].sphere_id == "business"
    
    @pytest.mark.asyncio
    async def test_list_documents_by_tags(self, knowledge_service, multiple_documents):
        """Test filtering documents by tags"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        python_docs = await knowledge_service.list_documents(tags=["python"])
        ai_docs = await knowledge_service.list_documents(tags=["ai"])
        
        assert len(python_docs) == 2  # Python Guide and FastAPI
        assert len(ai_docs) == 1  # ML Basics
    
    @pytest.mark.asyncio
    async def test_update_document_content(self, knowledge_service, sample_metadata, sample_content):
        """Test updating document content triggers reindexing"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        original_chunk_count = doc.chunk_count
        
        new_content = "Updated content that is shorter."
        updated = await knowledge_service.update_document(
            document_id=doc.id,
            content=new_content,
            reindex=True
        )
        
        assert updated.content == new_content
        assert updated.chunk_count != original_chunk_count
        assert updated.updated_at > doc.created_at
    
    @pytest.mark.asyncio
    async def test_update_document_metadata(self, knowledge_service, sample_metadata, sample_content):
        """Test updating document metadata"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        new_metadata = DocumentMetadata(
            title="Updated Title",
            source="new/path.md",
            author="New Author",
            tags=["new", "tags"]
        )
        
        updated = await knowledge_service.update_document(
            document_id=doc.id,
            metadata=new_metadata
        )
        
        assert updated.metadata.title == "Updated Title"
        assert updated.metadata.author == "New Author"
    
    @pytest.mark.asyncio
    async def test_delete_document(self, knowledge_service, sample_metadata, sample_content):
        """Test deleting a document removes it and its chunks"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        # Verify chunks exist
        chunks_before = len(knowledge_service.chunks)
        assert chunks_before > 0
        
        # Delete document
        result = await knowledge_service.delete_document(doc.id)
        assert result is True
        
        # Verify document and chunks are removed
        assert await knowledge_service.get_document(doc.id) is None
        assert len(knowledge_service.document_chunks.get(doc.id, [])) == 0
    
    @pytest.mark.asyncio
    async def test_delete_nonexistent_document(self, knowledge_service):
        """Test deleting non-existent document returns False"""
        result = await knowledge_service.delete_document("nonexistent_id")
        assert result is False
    
    @pytest.mark.asyncio
    async def test_document_content_hash(self, knowledge_service, sample_metadata, sample_content):
        """Test content hash is computed correctly"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        assert doc.content_hash is not None
        assert len(doc.content_hash) == 64  # SHA-256 hex length


# ============================================================================
# CHUNKING TESTS
# ============================================================================

class TestChunking:
    """Tests for document chunking strategies"""
    
    @pytest.mark.asyncio
    async def test_recursive_chunking(self, sample_metadata, sample_content):
        """Test recursive chunking strategy"""
        config = ChunkConfig(
            strategy=ChunkStrategy.RECURSIVE,
            chunk_size=128,
            chunk_overlap=16
        )
        service = KnowledgeBaseService(chunk_config=config)
        
        doc = await service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunks = [service.chunks[cid] for cid in service.document_chunks[doc.id]]
        
        assert len(chunks) > 1
        for chunk in chunks:
            assert len(chunk.content) <= config.chunk_size * 6  # Account for approx token-to-char ratio
    
    @pytest.mark.asyncio
    async def test_sentence_chunking(self, sample_metadata, sample_content):
        """Test sentence-based chunking"""
        config = ChunkConfig(
            strategy=ChunkStrategy.SENTENCE,
            chunk_size=256
        )
        service = KnowledgeBaseService(chunk_config=config)
        
        doc = await service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunks = [service.chunks[cid] for cid in service.document_chunks[doc.id]]
        
        assert len(chunks) >= 1
    
    @pytest.mark.asyncio
    async def test_paragraph_chunking(self, sample_metadata, sample_content):
        """Test paragraph-based chunking"""
        config = ChunkConfig(
            strategy=ChunkStrategy.PARAGRAPH,
            chunk_size=512
        )
        service = KnowledgeBaseService(chunk_config=config)
        
        doc = await service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunks = [service.chunks[cid] for cid in service.document_chunks[doc.id]]
        
        assert len(chunks) >= 1
    
    @pytest.mark.asyncio
    async def test_fixed_size_chunking(self, sample_metadata, sample_content):
        """Test fixed-size chunking"""
        config = ChunkConfig(
            strategy=ChunkStrategy.FIXED_SIZE,
            chunk_size=100,
            chunk_overlap=20
        )
        service = KnowledgeBaseService(chunk_config=config)
        
        doc = await service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunks = [service.chunks[cid] for cid in service.document_chunks[doc.id]]
        
        assert len(chunks) > 1
    
    @pytest.mark.asyncio
    async def test_chunk_metadata(self, knowledge_service, sample_metadata, sample_content):
        """Test chunk metadata is populated correctly"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunk_ids = knowledge_service.document_chunks[doc.id]
        chunk = knowledge_service.chunks[chunk_ids[0]]
        
        assert chunk.document_id == doc.id
        assert chunk.index == 0
        assert chunk.metadata["doc_title"] == sample_metadata.title
        assert chunk.token_count > 0
    
    @pytest.mark.asyncio
    async def test_chunk_positions(self, knowledge_service, sample_metadata, sample_content):
        """Test chunk character positions"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunk_ids = knowledge_service.document_chunks[doc.id]
        
        for i, cid in enumerate(chunk_ids):
            chunk = knowledge_service.chunks[cid]
            assert chunk.index == i
            assert chunk.start_char >= 0
            assert chunk.end_char > chunk.start_char


# ============================================================================
# EMBEDDING TESTS
# ============================================================================

class TestEmbeddings:
    """Tests for embedding generation"""
    
    @pytest.mark.asyncio
    async def test_embeddings_generated(self, knowledge_service, sample_metadata, sample_content):
        """Test embeddings are generated for chunks"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunk_ids = knowledge_service.document_chunks[doc.id]
        
        for cid in chunk_ids:
            assert cid in knowledge_service.chunk_embeddings
            embedding = knowledge_service.chunk_embeddings[cid]
            assert len(embedding) == knowledge_service.embedding_config.dimensions
    
    @pytest.mark.asyncio
    async def test_embedding_normalization(self, knowledge_service, sample_metadata, sample_content):
        """Test embeddings are normalized"""
        import math
        
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        chunk_ids = knowledge_service.document_chunks[doc.id]
        embedding = knowledge_service.chunk_embeddings[chunk_ids[0]]
        
        # Check magnitude is ~1 for normalized vectors
        magnitude = math.sqrt(sum(v * v for v in embedding))
        assert abs(magnitude - 1.0) < 0.01
    
    @pytest.mark.asyncio
    async def test_embedding_determinism(self, knowledge_service):
        """Test mock embeddings are deterministic"""
        embeddings1 = await knowledge_service._generate_embeddings(["test content"])
        embeddings2 = await knowledge_service._generate_embeddings(["test content"])
        
        assert embeddings1 == embeddings2
    
    @pytest.mark.asyncio
    async def test_different_content_different_embeddings(self, knowledge_service):
        """Test different content produces different embeddings"""
        embeddings1 = await knowledge_service._generate_embeddings(["first content"])
        embeddings2 = await knowledge_service._generate_embeddings(["second content"])
        
        assert embeddings1 != embeddings2


# ============================================================================
# SEARCH TESTS
# ============================================================================

class TestSearch:
    """Tests for search functionality"""
    
    @pytest.mark.asyncio
    async def test_semantic_search(self, knowledge_service, multiple_documents):
        """Test semantic similarity search"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="machine learning artificial intelligence",
            mode=SearchMode.SEMANTIC,
            top_k=5
        )
        
        response = await knowledge_service.search(query)
        
        assert response.total_results > 0
        assert response.mode == SearchMode.SEMANTIC
        assert len(response.results) <= 5
        # Results should be sorted by score descending
        for i in range(len(response.results) - 1):
            assert response.results[i].score >= response.results[i + 1].score
    
    @pytest.mark.asyncio
    async def test_keyword_search(self, knowledge_service, multiple_documents):
        """Test keyword-based search"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="Python programming",
            mode=SearchMode.KEYWORD,
            top_k=5
        )
        
        response = await knowledge_service.search(query)
        
        assert response.total_results > 0
        assert response.mode == SearchMode.KEYWORD
    
    @pytest.mark.asyncio
    async def test_hybrid_search(self, knowledge_service, multiple_documents):
        """Test hybrid search combining semantic and keyword"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="Python machine learning",
            mode=SearchMode.HYBRID,
            top_k=5
        )
        
        response = await knowledge_service.search(query)
        
        assert response.total_results > 0
        assert response.mode == SearchMode.HYBRID
    
    @pytest.mark.asyncio
    async def test_search_min_score_filter(self, knowledge_service, multiple_documents):
        """Test minimum score filtering"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="Python",
            mode=SearchMode.KEYWORD,
            top_k=10,
            min_score=0.9  # High threshold
        )
        
        response = await knowledge_service.search(query)
        
        for result in response.results:
            assert result.score >= 0.9
    
    @pytest.mark.asyncio
    async def test_search_sphere_filter(self, knowledge_service, sample_metadata, sample_content):
        """Test filtering by sphere"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata,
            sphere_id="personal"
        )
        await knowledge_service.add_document(
            content="Business content about governance",
            doc_type=DocumentType.TEXT,
            metadata=DocumentMetadata(title="Business", source="business.txt"),
            sphere_id="business"
        )
        
        query = SearchQuery(
            query="governance",
            mode=SearchMode.KEYWORD,
            sphere_id="personal"
        )
        
        response = await knowledge_service.search(query)
        
        for result in response.results:
            doc = await knowledge_service.get_document(result.document_id)
            assert doc.sphere_id == "personal"
    
    @pytest.mark.asyncio
    async def test_search_tags_filter(self, knowledge_service, multiple_documents):
        """Test filtering by tags"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="programming",
            mode=SearchMode.KEYWORD,
            tags=["python"]
        )
        
        response = await knowledge_service.search(query)
        
        for result in response.results:
            doc = await knowledge_service.get_document(result.document_id)
            assert "python" in doc.metadata.tags
    
    @pytest.mark.asyncio
    async def test_search_includes_highlights(self, knowledge_service, multiple_documents):
        """Test search results include highlights"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        query = SearchQuery(
            query="Python programming",
            mode=SearchMode.KEYWORD
        )
        
        response = await knowledge_service.search(query)
        
        # At least some results should have highlights
        has_highlights = any(len(r.highlights) > 0 for r in response.results)
        assert has_highlights
    
    @pytest.mark.asyncio
    async def test_search_time_tracking(self, knowledge_service, sample_metadata, sample_content):
        """Test search time is tracked"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        query = SearchQuery(query="governance")
        response = await knowledge_service.search(query)
        
        assert response.search_time_ms > 0
    
    @pytest.mark.asyncio
    async def test_empty_search_results(self, knowledge_service, sample_metadata, sample_content):
        """Test search with no matches"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        query = SearchQuery(
            query="xyznonexistentterm123",
            mode=SearchMode.KEYWORD
        )
        
        response = await knowledge_service.search(query)
        
        assert response.total_results == 0
        assert len(response.results) == 0


# ============================================================================
# RAG TESTS
# ============================================================================

class TestRAG:
    """Tests for RAG context generation"""
    
    @pytest.mark.asyncio
    async def test_rag_context_generation(self, knowledge_service, sample_metadata, sample_content):
        """Test RAG context generation"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        context = await knowledge_service.get_rag_context(
            query="What are the core principles?",
            top_k=3,
            max_tokens=1000
        )
        
        assert context.query == "What are the core principles?"
        assert len(context.retrieved_chunks) > 0
        assert len(context.formatted_context) > 0
        assert context.token_count > 0
        assert len(context.sources) > 0
    
    @pytest.mark.asyncio
    async def test_rag_max_tokens_limit(self, knowledge_service, sample_metadata, sample_content):
        """Test RAG respects max_tokens limit"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        context = await knowledge_service.get_rag_context(
            query="architecture",
            top_k=10,
            max_tokens=100  # Small limit
        )
        
        assert context.token_count <= 100
    
    @pytest.mark.asyncio
    async def test_rag_sources_include_metadata(self, knowledge_service, sample_metadata, sample_content):
        """Test RAG sources include title and source"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        context = await knowledge_service.get_rag_context(
            query="governance",
            top_k=3
        )
        
        for source in context.sources:
            assert "title" in source
            assert "source" in source
            assert "chunk_id" in source
    
    @pytest.mark.asyncio
    async def test_rag_sphere_filter(self, knowledge_service, sample_metadata, sample_content):
        """Test RAG context respects sphere filter"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata,
            sphere_id="personal"
        )
        await knowledge_service.add_document(
            content="Business governance policies",
            doc_type=DocumentType.TEXT,
            metadata=DocumentMetadata(title="Business", source="business.txt"),
            sphere_id="business"
        )
        
        context = await knowledge_service.get_rag_context(
            query="governance",
            sphere_id="personal"
        )
        
        # All sources should be from personal sphere
        for result in context.retrieved_chunks:
            doc = await knowledge_service.get_document(result.document_id)
            assert doc.sphere_id == "personal"


# ============================================================================
# KNOWLEDGE GRAPH TESTS
# ============================================================================

class TestKnowledgeGraph:
    """Tests for knowledge graph relations"""
    
    @pytest.mark.asyncio
    async def test_add_relation(self, knowledge_service, multiple_documents):
        """Test adding a relation between documents"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        relation = await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.RELATED_TO,
            created_by="user_123"
        )
        
        assert relation.id is not None
        assert relation.source_id == docs[0].id
        assert relation.target_id == docs[1].id
        assert relation.relation_type == RelationType.RELATED_TO
    
    @pytest.mark.asyncio
    async def test_add_relation_invalid_source(self, knowledge_service, sample_metadata, sample_content):
        """Test adding relation with invalid source fails"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        with pytest.raises(ValueError, match="Source not found"):
            await knowledge_service.add_relation(
                source_id="invalid_id",
                target_id=doc.id,
                relation_type=RelationType.REFERENCES
            )
    
    @pytest.mark.asyncio
    async def test_get_relations(self, knowledge_service, multiple_documents):
        """Test retrieving relations for an entity"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        # Create relations
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.REFERENCES
        )
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[2].id,
            relation_type=RelationType.RELATED_TO
        )
        
        relations = await knowledge_service.get_relations(docs[0].id)
        
        assert len(relations) == 2
    
    @pytest.mark.asyncio
    async def test_get_relations_by_type(self, knowledge_service, multiple_documents):
        """Test filtering relations by type"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.REFERENCES
        )
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[2].id,
            relation_type=RelationType.RELATED_TO
        )
        
        references = await knowledge_service.get_relations(
            docs[0].id,
            relation_type=RelationType.REFERENCES
        )
        
        assert len(references) == 1
        assert references[0].relation_type == RelationType.REFERENCES
    
    @pytest.mark.asyncio
    async def test_get_relations_direction(self, knowledge_service, multiple_documents):
        """Test getting relations by direction"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.REFERENCES
        )
        
        outgoing = await knowledge_service.get_relations(docs[0].id, direction="outgoing")
        incoming = await knowledge_service.get_relations(docs[0].id, direction="incoming")
        
        assert len(outgoing) == 1
        assert len(incoming) == 0
    
    @pytest.mark.asyncio
    async def test_get_related_documents(self, knowledge_service, multiple_documents):
        """Test getting related documents with depth"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        # Create chain: doc0 -> doc1 -> doc2
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.REFERENCES
        )
        await knowledge_service.add_relation(
            source_id=docs[1].id,
            target_id=docs[2].id,
            relation_type=RelationType.REFERENCES
        )
        
        related = await knowledge_service.get_related_documents(docs[0].id, max_depth=2)
        
        assert len(related) >= 2  # Should find doc1 (depth 1) and doc2 (depth 2)
    
    @pytest.mark.asyncio
    async def test_delete_document_removes_relations(self, knowledge_service, multiple_documents):
        """Test deleting document removes its relations"""
        docs = []
        for doc_data in multiple_documents:
            doc = await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
            docs.append(doc)
        
        await knowledge_service.add_relation(
            source_id=docs[0].id,
            target_id=docs[1].id,
            relation_type=RelationType.REFERENCES
        )
        
        # Delete source document
        await knowledge_service.delete_document(docs[0].id)
        
        # Relation should be removed
        relations = await knowledge_service.get_relations(docs[1].id)
        assert len(relations) == 0


# ============================================================================
# STATISTICS TESTS
# ============================================================================

class TestStatistics:
    """Tests for statistics and metrics"""
    
    @pytest.mark.asyncio
    async def test_statistics_documents(self, knowledge_service, multiple_documents):
        """Test document statistics"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        stats = knowledge_service.get_statistics()
        
        assert stats["total_documents"] == 3
        assert stats["documents_indexed"] == 3
    
    @pytest.mark.asyncio
    async def test_statistics_chunks(self, knowledge_service, sample_metadata, sample_content):
        """Test chunk statistics"""
        doc = await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        stats = knowledge_service.get_statistics()
        
        assert stats["total_chunks"] == doc.chunk_count
        assert stats["chunks_created"] >= doc.chunk_count
    
    @pytest.mark.asyncio
    async def test_statistics_by_type(self, knowledge_service, multiple_documents):
        """Test statistics by document type"""
        for doc_data in multiple_documents:
            await knowledge_service.add_document(
                content=doc_data["content"],
                doc_type=doc_data["doc_type"],
                metadata=doc_data["metadata"]
            )
        
        stats = knowledge_service.get_statistics()
        
        assert "documents_by_type" in stats
        assert "markdown" in stats["documents_by_type"]
    
    @pytest.mark.asyncio
    async def test_statistics_search_count(self, knowledge_service, sample_metadata, sample_content):
        """Test search count tracking"""
        await knowledge_service.add_document(
            content=sample_content,
            doc_type=DocumentType.MARKDOWN,
            metadata=sample_metadata
        )
        
        # Perform searches
        for i in range(5):
            await knowledge_service.search(SearchQuery(query=f"test query {i}"))
        
        stats = knowledge_service.get_statistics()
        
        assert stats["searches_performed"] == 5
    
    @pytest.mark.asyncio
    async def test_statistics_embedding_config(self, knowledge_service):
        """Test embedding config in statistics"""
        stats = knowledge_service.get_statistics()
        
        assert "embedding_config" in stats
        assert stats["embedding_config"]["provider"] == "mock"


# ============================================================================
# EDGE CASES
# ============================================================================

class TestEdgeCases:
    """Tests for edge cases and error handling"""
    
    @pytest.mark.asyncio
    async def test_empty_content_document(self, knowledge_service, sample_metadata):
        """Test adding document with empty content"""
        doc = await knowledge_service.add_document(
            content="",
            doc_type=DocumentType.TEXT,
            metadata=sample_metadata
        )
        
        assert doc.chunk_count == 0
    
    @pytest.mark.asyncio
    async def test_very_short_content(self, knowledge_service, sample_metadata):
        """Test adding document with very short content"""
        doc = await knowledge_service.add_document(
            content="Short.",
            doc_type=DocumentType.TEXT,
            metadata=sample_metadata
        )
        
        assert doc.chunk_count >= 0  # May be 0 or 1 depending on min size
    
    @pytest.mark.asyncio
    async def test_special_characters_in_content(self, knowledge_service, sample_metadata):
        """Test document with special characters"""
        content = "Special chars: 你好 🎉 <script>alert('xss')</script> & © ® ™"
        
        doc = await knowledge_service.add_document(
            content=content,
            doc_type=DocumentType.TEXT,
            metadata=sample_metadata
        )
        
        assert doc.status == DocumentStatus.INDEXED
    
    @pytest.mark.asyncio
    async def test_search_special_characters(self, knowledge_service, sample_metadata):
        """Test search with special characters"""
        await knowledge_service.add_document(
            content="Test content with special chars: 你好 🎉",
            doc_type=DocumentType.TEXT,
            metadata=sample_metadata
        )
        
        query = SearchQuery(query="你好 🎉")
        response = await knowledge_service.search(query)
        
        # Should not crash
        assert response is not None
    
    @pytest.mark.asyncio
    async def test_update_nonexistent_document(self, knowledge_service):
        """Test updating non-existent document raises error"""
        with pytest.raises(ValueError, match="Document not found"):
            await knowledge_service.update_document(
                document_id="nonexistent",
                content="new content"
            )
    
    @pytest.mark.asyncio
    async def test_concurrent_document_adds(self, knowledge_service, sample_metadata):
        """Test concurrent document additions"""
        async def add_doc(i):
            return await knowledge_service.add_document(
                content=f"Document content {i}",
                doc_type=DocumentType.TEXT,
                metadata=DocumentMetadata(title=f"Doc {i}", source=f"doc{i}.txt")
            )
        
        # Add 10 documents concurrently
        tasks = [add_doc(i) for i in range(10)]
        docs = await asyncio.gather(*tasks)
        
        assert len(docs) == 10
        assert len(knowledge_service.documents) == 10


# ============================================================================
# PERFORMANCE TESTS
# ============================================================================

class TestPerformance:
    """Tests for performance characteristics"""
    
    @pytest.mark.asyncio
    async def test_bulk_document_indexing(self, knowledge_service):
        """Test indexing many documents"""
        import time
        
        start = time.time()
        
        for i in range(50):
            await knowledge_service.add_document(
                content=f"Document content {i}. This is some text to index. " * 10,
                doc_type=DocumentType.TEXT,
                metadata=DocumentMetadata(title=f"Doc {i}", source=f"doc{i}.txt")
            )
        
        duration = time.time() - start
        
        assert duration < 10  # Should complete in <10 seconds
        assert len(knowledge_service.documents) == 50
    
    @pytest.mark.asyncio
    async def test_search_performance(self, knowledge_service):
        """Test search performance with many documents"""
        import time
        
        # Index 20 documents
        for i in range(20):
            await knowledge_service.add_document(
                content=f"Document about topic {i}. Contains various information. " * 20,
                doc_type=DocumentType.TEXT,
                metadata=DocumentMetadata(title=f"Doc {i}", source=f"doc{i}.txt")
            )
        
        # Perform search
        start = time.time()
        
        for _ in range(10):
            await knowledge_service.search(SearchQuery(query="topic information"))
        
        duration = time.time() - start
        avg_time = duration / 10
        
        assert avg_time < 1.0  # Each search should be <1 second


# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
