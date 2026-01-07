"""
CHE·NU™ V71 - Knowledge Base Service
=====================================

Vector embeddings, semantic search, knowledge graph, and RAG pipeline.

Features:
- Document ingestion and chunking
- Vector embeddings (multiple providers)
- Semantic search with similarity scoring
- Knowledge graph connections
- RAG (Retrieval Augmented Generation)
- Sphere-scoped knowledge isolation
- Full audit trail

CHE·NU Principles:
- Human sovereignty over knowledge curation
- Sphere isolation for data security
- Full traceability of all operations
"""

import asyncio
import hashlib
import json
import logging
import math
import re
from dataclasses import dataclass, field
from datetime import datetime
from enum import Enum
from typing import Any, Callable, Dict, List, Optional, Set, Tuple, Union
from uuid import UUID, uuid4

logger = logging.getLogger(__name__)


# =============================================================================
# ENUMS & CONSTANTS
# =============================================================================

class DocumentType(str, Enum):
    """Types of documents that can be ingested."""
    TEXT = "text"
    MARKDOWN = "markdown"
    HTML = "html"
    PDF = "pdf"
    CODE = "code"
    JSON = "json"
    CSV = "csv"
    THREAD = "thread"  # CHE·NU thread
    DATASPACE = "dataspace"  # CHE·NU dataspace


class ChunkingStrategy(str, Enum):
    """Strategies for splitting documents into chunks."""
    FIXED_SIZE = "fixed_size"  # Fixed character count
    SENTENCE = "sentence"  # Split by sentences
    PARAGRAPH = "paragraph"  # Split by paragraphs
    SEMANTIC = "semantic"  # Semantic boundaries
    CODE_BLOCK = "code_block"  # Code-aware splitting
    RECURSIVE = "recursive"  # Recursive character splitting


class EmbeddingProvider(str, Enum):
    """Supported embedding providers."""
    OPENAI = "openai"  # text-embedding-3-small/large
    ANTHROPIC = "anthropic"  # Claude embeddings
    COHERE = "cohere"  # embed-english-v3.0
    LOCAL = "local"  # Local model (sentence-transformers)
    MOCK = "mock"  # For testing


class SearchType(str, Enum):
    """Types of search operations."""
    SEMANTIC = "semantic"  # Vector similarity
    KEYWORD = "keyword"  # BM25/TF-IDF
    HYBRID = "hybrid"  # Combination
    GRAPH = "graph"  # Knowledge graph traversal


class NodeType(str, Enum):
    """Types of nodes in knowledge graph."""
    DOCUMENT = "document"
    CHUNK = "chunk"
    ENTITY = "entity"
    CONCEPT = "concept"
    PERSON = "person"
    ORGANIZATION = "organization"
    LOCATION = "location"
    EVENT = "event"
    TOPIC = "topic"


class RelationType(str, Enum):
    """Types of relationships in knowledge graph."""
    CONTAINS = "contains"
    REFERENCES = "references"
    RELATED_TO = "related_to"
    PART_OF = "part_of"
    CREATED_BY = "created_by"
    MENTIONS = "mentions"
    SIMILAR_TO = "similar_to"
    CONTRADICTS = "contradicts"
    SUPPORTS = "supports"
    DERIVED_FROM = "derived_from"


# =============================================================================
# DATA MODELS
# =============================================================================

@dataclass
class Document:
    """A document in the knowledge base."""
    id: UUID
    title: str
    content: str
    doc_type: DocumentType
    metadata: Dict[str, Any]
    sphere_id: Optional[str]
    owner_id: str
    created_at: datetime
    updated_at: datetime
    chunk_ids: List[UUID] = field(default_factory=list)
    tags: List[str] = field(default_factory=list)
    source_url: Optional[str] = None
    checksum: Optional[str] = None


@dataclass
class Chunk:
    """A chunk of a document with embedding."""
    id: UUID
    document_id: UUID
    content: str
    embedding: Optional[List[float]]
    chunk_index: int
    start_char: int
    end_char: int
    metadata: Dict[str, Any]
    token_count: int
    created_at: datetime


@dataclass
class EmbeddingConfig:
    """Configuration for embedding generation."""
    provider: EmbeddingProvider
    model: str
    dimensions: int
    batch_size: int = 100
    max_tokens: int = 8192


@dataclass
class ChunkingConfig:
    """Configuration for document chunking."""
    strategy: ChunkingStrategy
    chunk_size: int = 512  # characters or tokens
    chunk_overlap: int = 50
    min_chunk_size: int = 100
    separators: List[str] = field(default_factory=lambda: ["\n\n", "\n", ". ", " "])


@dataclass
class SearchQuery:
    """A search query."""
    id: UUID
    query_text: str
    search_type: SearchType
    sphere_id: Optional[str]
    filters: Dict[str, Any]
    top_k: int
    min_score: float
    created_by: str
    created_at: datetime


@dataclass
class SearchResult:
    """A single search result."""
    chunk_id: UUID
    document_id: UUID
    content: str
    score: float
    metadata: Dict[str, Any]
    highlights: List[str]


@dataclass
class SearchResponse:
    """Response from a search operation."""
    query_id: UUID
    results: List[SearchResult]
    total_found: int
    search_time_ms: float
    tokens_used: int


@dataclass
class GraphNode:
    """A node in the knowledge graph."""
    id: UUID
    node_type: NodeType
    name: str
    properties: Dict[str, Any]
    embedding: Optional[List[float]]
    sphere_id: Optional[str]
    created_at: datetime


@dataclass
class GraphEdge:
    """An edge in the knowledge graph."""
    id: UUID
    source_id: UUID
    target_id: UUID
    relation_type: RelationType
    properties: Dict[str, Any]
    weight: float
    created_at: datetime


@dataclass
class RAGContext:
    """Context for RAG generation."""
    query: str
    retrieved_chunks: List[Chunk]
    total_tokens: int
    sources: List[Dict[str, Any]]


@dataclass
class RAGResponse:
    """Response from RAG pipeline."""
    id: UUID
    query: str
    answer: str
    context: RAGContext
    confidence: float
    citations: List[Dict[str, Any]]
    tokens_used: int
    created_at: datetime


# =============================================================================
# EMBEDDING PROVIDERS
# =============================================================================

class BaseEmbeddingProvider:
    """Base class for embedding providers."""
    
    def __init__(self, config: EmbeddingConfig):
        self.config = config
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding for a single text."""
        raise NotImplementedError
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for multiple texts."""
        raise NotImplementedError


class MockEmbeddingProvider(BaseEmbeddingProvider):
    """Mock provider for testing."""
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate deterministic mock embedding."""
        # Use hash for deterministic results
        hash_val = int(hashlib.md5(text.encode()).hexdigest(), 16)
        embedding = []
        for i in range(self.config.dimensions):
            # Generate pseudo-random values based on hash
            val = ((hash_val + i * 17) % 1000) / 1000.0 - 0.5
            embedding.append(val)
        # Normalize
        magnitude = math.sqrt(sum(x*x for x in embedding))
        return [x / magnitude for x in embedding]
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate embeddings for batch."""
        return [await self.embed_text(text) for text in texts]


class OpenAIEmbeddingProvider(BaseEmbeddingProvider):
    """OpenAI embedding provider."""
    
    async def embed_text(self, text: str) -> List[float]:
        """Generate embedding using OpenAI."""
        # In production: call OpenAI API
        # For now, use mock
        mock = MockEmbeddingProvider(self.config)
        return await mock.embed_text(text)
    
    async def embed_batch(self, texts: List[str]) -> List[List[float]]:
        """Generate batch embeddings."""
        # In production: batch API call
        return [await self.embed_text(text) for text in texts]


# =============================================================================
# VECTOR STORE
# =============================================================================

class VectorStore:
    """In-memory vector store with similarity search."""
    
    def __init__(self):
        self.vectors: Dict[UUID, List[float]] = {}
        self.metadata: Dict[UUID, Dict[str, Any]] = {}
        self.sphere_index: Dict[str, Set[UUID]] = {}  # sphere_id -> vector_ids
    
    def add(
        self,
        vector_id: UUID,
        embedding: List[float],
        metadata: Dict[str, Any],
        sphere_id: Optional[str] = None
    ) -> None:
        """Add a vector to the store."""
        self.vectors[vector_id] = embedding
        self.metadata[vector_id] = metadata
        
        if sphere_id:
            if sphere_id not in self.sphere_index:
                self.sphere_index[sphere_id] = set()
            self.sphere_index[sphere_id].add(vector_id)
    
    def remove(self, vector_id: UUID) -> bool:
        """Remove a vector from the store."""
        if vector_id not in self.vectors:
            return False
        
        del self.vectors[vector_id]
        metadata = self.metadata.pop(vector_id, {})
        
        # Remove from sphere index
        sphere_id = metadata.get("sphere_id")
        if sphere_id and sphere_id in self.sphere_index:
            self.sphere_index[sphere_id].discard(vector_id)
        
        return True
    
    def search(
        self,
        query_embedding: List[float],
        top_k: int = 10,
        min_score: float = 0.0,
        sphere_id: Optional[str] = None,
        filters: Optional[Dict[str, Any]] = None
    ) -> List[Tuple[UUID, float, Dict[str, Any]]]:
        """Search for similar vectors."""
        results = []
        
        # Determine which vectors to search
        if sphere_id and sphere_id in self.sphere_index:
            candidate_ids = self.sphere_index[sphere_id]
        else:
            candidate_ids = set(self.vectors.keys())
        
        for vector_id in candidate_ids:
            embedding = self.vectors[vector_id]
            metadata = self.metadata.get(vector_id, {})
            
            # Apply filters
            if filters:
                skip = False
                for key, value in filters.items():
                    if metadata.get(key) != value:
                        skip = True
                        break
                if skip:
                    continue
            
            # Calculate cosine similarity
            score = self._cosine_similarity(query_embedding, embedding)
            
            if score >= min_score:
                results.append((vector_id, score, metadata))
        
        # Sort by score descending
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results[:top_k]
    
    def _cosine_similarity(self, a: List[float], b: List[float]) -> float:
        """Calculate cosine similarity between two vectors."""
        if len(a) != len(b):
            return 0.0
        
        dot_product = sum(x * y for x, y in zip(a, b))
        magnitude_a = math.sqrt(sum(x * x for x in a))
        magnitude_b = math.sqrt(sum(x * x for x in b))
        
        if magnitude_a == 0 or magnitude_b == 0:
            return 0.0
        
        return dot_product / (magnitude_a * magnitude_b)
    
    def count(self, sphere_id: Optional[str] = None) -> int:
        """Count vectors in store."""
        if sphere_id:
            return len(self.sphere_index.get(sphere_id, set()))
        return len(self.vectors)


# =============================================================================
# KNOWLEDGE GRAPH
# =============================================================================

class KnowledgeGraph:
    """In-memory knowledge graph."""
    
    def __init__(self):
        self.nodes: Dict[UUID, GraphNode] = {}
        self.edges: Dict[UUID, GraphEdge] = {}
        self.adjacency: Dict[UUID, List[UUID]] = {}  # node_id -> edge_ids
        self.sphere_index: Dict[str, Set[UUID]] = {}  # sphere_id -> node_ids
    
    def add_node(self, node: GraphNode) -> None:
        """Add a node to the graph."""
        self.nodes[node.id] = node
        self.adjacency[node.id] = []
        
        if node.sphere_id:
            if node.sphere_id not in self.sphere_index:
                self.sphere_index[node.sphere_id] = set()
            self.sphere_index[node.sphere_id].add(node.id)
    
    def add_edge(self, edge: GraphEdge) -> None:
        """Add an edge to the graph."""
        if edge.source_id not in self.nodes or edge.target_id not in self.nodes:
            raise ValueError("Both source and target nodes must exist")
        
        self.edges[edge.id] = edge
        self.adjacency[edge.source_id].append(edge.id)
    
    def get_node(self, node_id: UUID) -> Optional[GraphNode]:
        """Get a node by ID."""
        return self.nodes.get(node_id)
    
    def get_neighbors(
        self,
        node_id: UUID,
        relation_type: Optional[RelationType] = None,
        max_depth: int = 1
    ) -> List[Tuple[GraphNode, GraphEdge, int]]:
        """Get neighboring nodes with optional relation filter."""
        if node_id not in self.nodes:
            return []
        
        results = []
        visited = {node_id}
        queue = [(node_id, 0)]
        
        while queue:
            current_id, depth = queue.pop(0)
            
            if depth >= max_depth:
                continue
            
            for edge_id in self.adjacency.get(current_id, []):
                edge = self.edges[edge_id]
                
                if relation_type and edge.relation_type != relation_type:
                    continue
                
                target_id = edge.target_id
                if target_id not in visited:
                    visited.add(target_id)
                    target_node = self.nodes[target_id]
                    results.append((target_node, edge, depth + 1))
                    queue.append((target_id, depth + 1))
        
        return results
    
    def find_path(
        self,
        source_id: UUID,
        target_id: UUID,
        max_depth: int = 5
    ) -> Optional[List[Tuple[GraphNode, GraphEdge]]]:
        """Find shortest path between two nodes."""
        if source_id not in self.nodes or target_id not in self.nodes:
            return None
        
        if source_id == target_id:
            return []
        
        visited = {source_id}
        queue = [(source_id, [])]
        
        while queue:
            current_id, path = queue.pop(0)
            
            if len(path) >= max_depth:
                continue
            
            for edge_id in self.adjacency.get(current_id, []):
                edge = self.edges[edge_id]
                target_node_id = edge.target_id
                
                if target_node_id == target_id:
                    return path + [(self.nodes[target_node_id], edge)]
                
                if target_node_id not in visited:
                    visited.add(target_node_id)
                    new_path = path + [(self.nodes[target_node_id], edge)]
                    queue.append((target_node_id, new_path))
        
        return None
    
    def get_subgraph(
        self,
        center_id: UUID,
        radius: int = 2,
        sphere_id: Optional[str] = None
    ) -> Tuple[List[GraphNode], List[GraphEdge]]:
        """Get subgraph around a center node."""
        if center_id not in self.nodes:
            return [], []
        
        node_ids = {center_id}
        edge_ids = set()
        
        frontier = {center_id}
        for _ in range(radius):
            new_frontier = set()
            for node_id in frontier:
                for edge_id in self.adjacency.get(node_id, []):
                    edge = self.edges[edge_id]
                    target_id = edge.target_id
                    
                    # Check sphere isolation
                    if sphere_id:
                        target_node = self.nodes[target_id]
                        if target_node.sphere_id and target_node.sphere_id != sphere_id:
                            continue
                    
                    edge_ids.add(edge_id)
                    if target_id not in node_ids:
                        node_ids.add(target_id)
                        new_frontier.add(target_id)
            
            frontier = new_frontier
        
        nodes = [self.nodes[nid] for nid in node_ids]
        edges = [self.edges[eid] for eid in edge_ids]
        
        return nodes, edges
    
    def count_nodes(self, sphere_id: Optional[str] = None) -> int:
        """Count nodes in graph."""
        if sphere_id:
            return len(self.sphere_index.get(sphere_id, set()))
        return len(self.nodes)
    
    def count_edges(self) -> int:
        """Count edges in graph."""
        return len(self.edges)


# =============================================================================
# TEXT PROCESSING
# =============================================================================

class TextProcessor:
    """Text processing utilities."""
    
    @staticmethod
    def clean_text(text: str) -> str:
        """Clean and normalize text."""
        # Remove excessive whitespace
        text = re.sub(r'\s+', ' ', text)
        # Remove special characters but keep punctuation
        text = re.sub(r'[^\w\s.,!?;:\'"()-]', '', text)
        return text.strip()
    
    @staticmethod
    def split_sentences(text: str) -> List[str]:
        """Split text into sentences."""
        # Simple sentence splitter
        sentences = re.split(r'(?<=[.!?])\s+', text)
        return [s.strip() for s in sentences if s.strip()]
    
    @staticmethod
    def split_paragraphs(text: str) -> List[str]:
        """Split text into paragraphs."""
        paragraphs = re.split(r'\n\s*\n', text)
        return [p.strip() for p in paragraphs if p.strip()]
    
    @staticmethod
    def estimate_tokens(text: str) -> int:
        """Estimate token count (rough approximation)."""
        # Average ~4 characters per token for English
        return len(text) // 4
    
    @staticmethod
    def extract_keywords(text: str, max_keywords: int = 10) -> List[str]:
        """Extract keywords from text."""
        # Simple keyword extraction based on frequency
        words = re.findall(r'\b\w{4,}\b', text.lower())
        word_freq = {}
        for word in words:
            word_freq[word] = word_freq.get(word, 0) + 1
        
        # Sort by frequency
        sorted_words = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
        return [word for word, _ in sorted_words[:max_keywords]]
    
    @staticmethod
    def highlight_matches(text: str, query: str, context_chars: int = 50) -> List[str]:
        """Extract highlighted snippets matching query."""
        highlights = []
        query_lower = query.lower()
        text_lower = text.lower()
        
        start = 0
        while True:
            pos = text_lower.find(query_lower, start)
            if pos == -1:
                break
            
            # Extract context around match
            highlight_start = max(0, pos - context_chars)
            highlight_end = min(len(text), pos + len(query) + context_chars)
            
            snippet = text[highlight_start:highlight_end]
            if highlight_start > 0:
                snippet = "..." + snippet
            if highlight_end < len(text):
                snippet = snippet + "..."
            
            highlights.append(snippet)
            start = pos + 1
        
        return highlights


# =============================================================================
# DOCUMENT CHUNKER
# =============================================================================

class DocumentChunker:
    """Split documents into chunks for embedding."""
    
    def __init__(self, config: ChunkingConfig):
        self.config = config
    
    def chunk_document(self, document: Document) -> List[Chunk]:
        """Split a document into chunks."""
        if self.config.strategy == ChunkingStrategy.FIXED_SIZE:
            return self._chunk_fixed_size(document)
        elif self.config.strategy == ChunkingStrategy.SENTENCE:
            return self._chunk_by_sentence(document)
        elif self.config.strategy == ChunkingStrategy.PARAGRAPH:
            return self._chunk_by_paragraph(document)
        elif self.config.strategy == ChunkingStrategy.RECURSIVE:
            return self._chunk_recursive(document)
        elif self.config.strategy == ChunkingStrategy.CODE_BLOCK:
            return self._chunk_code(document)
        else:
            return self._chunk_fixed_size(document)
    
    def _chunk_fixed_size(self, document: Document) -> List[Chunk]:
        """Split into fixed-size chunks with overlap."""
        chunks = []
        content = document.content
        chunk_size = self.config.chunk_size
        overlap = self.config.chunk_overlap
        
        start = 0
        chunk_index = 0
        
        while start < len(content):
            end = min(start + chunk_size, len(content))
            chunk_content = content[start:end]
            
            if len(chunk_content) >= self.config.min_chunk_size:
                chunks.append(Chunk(
                    id=uuid4(),
                    document_id=document.id,
                    content=chunk_content,
                    embedding=None,
                    chunk_index=chunk_index,
                    start_char=start,
                    end_char=end,
                    metadata={"strategy": "fixed_size"},
                    token_count=TextProcessor.estimate_tokens(chunk_content),
                    created_at=datetime.utcnow()
                ))
                chunk_index += 1
            
            start = end - overlap if end < len(content) else len(content)
        
        return chunks
    
    def _chunk_by_sentence(self, document: Document) -> List[Chunk]:
        """Split by sentences, grouping to target size."""
        sentences = TextProcessor.split_sentences(document.content)
        chunks = []
        
        current_content = ""
        current_start = 0
        chunk_index = 0
        
        for sentence in sentences:
            if len(current_content) + len(sentence) > self.config.chunk_size:
                if current_content:
                    chunks.append(Chunk(
                        id=uuid4(),
                        document_id=document.id,
                        content=current_content.strip(),
                        embedding=None,
                        chunk_index=chunk_index,
                        start_char=current_start,
                        end_char=current_start + len(current_content),
                        metadata={"strategy": "sentence"},
                        token_count=TextProcessor.estimate_tokens(current_content),
                        created_at=datetime.utcnow()
                    ))
                    chunk_index += 1
                    current_start += len(current_content)
                    current_content = ""
            
            current_content += sentence + " "
        
        # Add remaining content
        if current_content.strip():
            chunks.append(Chunk(
                id=uuid4(),
                document_id=document.id,
                content=current_content.strip(),
                embedding=None,
                chunk_index=chunk_index,
                start_char=current_start,
                end_char=current_start + len(current_content),
                metadata={"strategy": "sentence"},
                token_count=TextProcessor.estimate_tokens(current_content),
                created_at=datetime.utcnow()
            ))
        
        return chunks
    
    def _chunk_by_paragraph(self, document: Document) -> List[Chunk]:
        """Split by paragraphs."""
        paragraphs = TextProcessor.split_paragraphs(document.content)
        chunks = []
        
        current_pos = 0
        for i, paragraph in enumerate(paragraphs):
            start = document.content.find(paragraph, current_pos)
            if start == -1:
                start = current_pos
            
            chunks.append(Chunk(
                id=uuid4(),
                document_id=document.id,
                content=paragraph,
                embedding=None,
                chunk_index=i,
                start_char=start,
                end_char=start + len(paragraph),
                metadata={"strategy": "paragraph"},
                token_count=TextProcessor.estimate_tokens(paragraph),
                created_at=datetime.utcnow()
            ))
            current_pos = start + len(paragraph)
        
        return chunks
    
    def _chunk_recursive(self, document: Document) -> List[Chunk]:
        """Recursively split using multiple separators."""
        chunks = []
        
        def split_text(text: str, separators: List[str], start_pos: int) -> List[Tuple[str, int]]:
            if not separators or len(text) <= self.config.chunk_size:
                return [(text, start_pos)]
            
            separator = separators[0]
            remaining_separators = separators[1:]
            
            parts = text.split(separator)
            result = []
            current_pos = start_pos
            
            for part in parts:
                if len(part) > self.config.chunk_size and remaining_separators:
                    result.extend(split_text(part, remaining_separators, current_pos))
                else:
                    result.append((part, current_pos))
                current_pos += len(part) + len(separator)
            
            return result
        
        text_parts = split_text(document.content, self.config.separators, 0)
        
        for i, (text, start) in enumerate(text_parts):
            if len(text.strip()) >= self.config.min_chunk_size:
                chunks.append(Chunk(
                    id=uuid4(),
                    document_id=document.id,
                    content=text.strip(),
                    embedding=None,
                    chunk_index=i,
                    start_char=start,
                    end_char=start + len(text),
                    metadata={"strategy": "recursive"},
                    token_count=TextProcessor.estimate_tokens(text),
                    created_at=datetime.utcnow()
                ))
        
        return chunks
    
    def _chunk_code(self, document: Document) -> List[Chunk]:
        """Split code-aware (by functions, classes, etc.)."""
        # Simple code chunking by blank lines and indentation
        lines = document.content.split('\n')
        chunks = []
        
        current_chunk = []
        current_start = 0
        chunk_index = 0
        
        for line in lines:
            current_chunk.append(line)
            chunk_content = '\n'.join(current_chunk)
            
            # Check if we should start a new chunk
            is_boundary = (
                line.strip() == '' and len(current_chunk) > 1 or
                line.startswith('def ') or
                line.startswith('class ') or
                line.startswith('async def ')
            )
            
            if is_boundary and len(chunk_content) > self.config.min_chunk_size:
                if len(chunk_content) > self.config.chunk_size:
                    chunks.append(Chunk(
                        id=uuid4(),
                        document_id=document.id,
                        content=chunk_content.strip(),
                        embedding=None,
                        chunk_index=chunk_index,
                        start_char=current_start,
                        end_char=current_start + len(chunk_content),
                        metadata={"strategy": "code_block"},
                        token_count=TextProcessor.estimate_tokens(chunk_content),
                        created_at=datetime.utcnow()
                    ))
                    chunk_index += 1
                    current_start += len(chunk_content) + 1
                    current_chunk = []
        
        # Add remaining
        if current_chunk:
            chunk_content = '\n'.join(current_chunk)
            if len(chunk_content.strip()) >= self.config.min_chunk_size:
                chunks.append(Chunk(
                    id=uuid4(),
                    document_id=document.id,
                    content=chunk_content.strip(),
                    embedding=None,
                    chunk_index=chunk_index,
                    start_char=current_start,
                    end_char=current_start + len(chunk_content),
                    metadata={"strategy": "code_block"},
                    token_count=TextProcessor.estimate_tokens(chunk_content),
                    created_at=datetime.utcnow()
                ))
        
        return chunks


# =============================================================================
# KNOWLEDGE BASE SERVICE
# =============================================================================

class KnowledgeBaseService:
    """
    Main knowledge base service.
    
    Handles document ingestion, embedding generation, semantic search,
    and knowledge graph operations.
    """
    
    def __init__(
        self,
        embedding_config: Optional[EmbeddingConfig] = None,
        chunking_config: Optional[ChunkingConfig] = None
    ):
        # Configuration
        self.embedding_config = embedding_config or EmbeddingConfig(
            provider=EmbeddingProvider.MOCK,
            model="mock-embedding",
            dimensions=384
        )
        self.chunking_config = chunking_config or ChunkingConfig(
            strategy=ChunkingStrategy.RECURSIVE,
            chunk_size=512,
            chunk_overlap=50
        )
        
        # Storage
        self.documents: Dict[UUID, Document] = {}
        self.chunks: Dict[UUID, Chunk] = {}
        self.vector_store = VectorStore()
        self.knowledge_graph = KnowledgeGraph()
        
        # Processing
        self.chunker = DocumentChunker(self.chunking_config)
        self.embedding_provider = self._create_embedding_provider()
        
        # Indexes
        self.document_by_sphere: Dict[str, Set[UUID]] = {}
        self.document_by_owner: Dict[str, Set[UUID]] = {}
        
        # Audit
        self.operations: List[Dict[str, Any]] = []
        
        logger.info("KnowledgeBaseService initialized")
    
    def _create_embedding_provider(self) -> BaseEmbeddingProvider:
        """Create embedding provider based on config."""
        if self.embedding_config.provider == EmbeddingProvider.MOCK:
            return MockEmbeddingProvider(self.embedding_config)
        elif self.embedding_config.provider == EmbeddingProvider.OPENAI:
            return OpenAIEmbeddingProvider(self.embedding_config)
        else:
            return MockEmbeddingProvider(self.embedding_config)
    
    # =========================================================================
    # DOCUMENT OPERATIONS
    # =========================================================================
    
    async def ingest_document(
        self,
        title: str,
        content: str,
        doc_type: DocumentType,
        owner_id: str,
        sphere_id: Optional[str] = None,
        metadata: Optional[Dict[str, Any]] = None,
        tags: Optional[List[str]] = None,
        source_url: Optional[str] = None
    ) -> Document:
        """
        Ingest a document into the knowledge base.
        
        Steps:
        1. Create document record
        2. Chunk the document
        3. Generate embeddings for chunks
        4. Store in vector store
        5. Create knowledge graph nodes
        """
        # Create document
        document = Document(
            id=uuid4(),
            title=title,
            content=content,
            doc_type=doc_type,
            metadata=metadata or {},
            sphere_id=sphere_id,
            owner_id=owner_id,
            created_at=datetime.utcnow(),
            updated_at=datetime.utcnow(),
            tags=tags or [],
            source_url=source_url,
            checksum=hashlib.md5(content.encode()).hexdigest()
        )
        
        # Chunk document
        chunks = self.chunker.chunk_document(document)
        
        # Generate embeddings
        chunk_contents = [chunk.content for chunk in chunks]
        embeddings = await self.embedding_provider.embed_batch(chunk_contents)
        
        # Store chunks with embeddings
        for chunk, embedding in zip(chunks, embeddings):
            chunk.embedding = embedding
            self.chunks[chunk.id] = chunk
            document.chunk_ids.append(chunk.id)
            
            # Add to vector store
            self.vector_store.add(
                vector_id=chunk.id,
                embedding=embedding,
                metadata={
                    "document_id": str(document.id),
                    "chunk_index": chunk.chunk_index,
                    "sphere_id": sphere_id
                },
                sphere_id=sphere_id
            )
        
        # Store document
        self.documents[document.id] = document
        
        # Update indexes
        if sphere_id:
            if sphere_id not in self.document_by_sphere:
                self.document_by_sphere[sphere_id] = set()
            self.document_by_sphere[sphere_id].add(document.id)
        
        if owner_id not in self.document_by_owner:
            self.document_by_owner[owner_id] = set()
        self.document_by_owner[owner_id].add(document.id)
        
        # Create knowledge graph node
        doc_node = GraphNode(
            id=uuid4(),
            node_type=NodeType.DOCUMENT,
            name=title,
            properties={
                "document_id": str(document.id),
                "doc_type": doc_type.value,
                "owner_id": owner_id
            },
            embedding=await self.embedding_provider.embed_text(title),
            sphere_id=sphere_id,
            created_at=datetime.utcnow()
        )
        self.knowledge_graph.add_node(doc_node)
        
        # Audit
        self._log_operation("ingest_document", {
            "document_id": str(document.id),
            "title": title,
            "chunks": len(chunks),
            "owner_id": owner_id,
            "sphere_id": sphere_id
        })
        
        logger.info(f"Ingested document {document.id} with {len(chunks)} chunks")
        return document
    
    async def get_document(
        self,
        document_id: UUID,
        requester_id: str,
        sphere_id: Optional[str] = None
    ) -> Optional[Document]:
        """Get a document by ID with access control."""
        document = self.documents.get(document_id)
        if not document:
            return None
        
        # Check sphere access
        if sphere_id and document.sphere_id and document.sphere_id != sphere_id:
            logger.warning(f"Sphere access denied: {requester_id} -> {document_id}")
            return None
        
        return document
    
    async def list_documents(
        self,
        owner_id: Optional[str] = None,
        sphere_id: Optional[str] = None,
        doc_type: Optional[DocumentType] = None,
        tags: Optional[List[str]] = None,
        limit: int = 100,
        offset: int = 0
    ) -> List[Document]:
        """List documents with filters."""
        results = []
        
        # Determine candidate documents
        if owner_id and owner_id in self.document_by_owner:
            candidates = self.document_by_owner[owner_id]
        elif sphere_id and sphere_id in self.document_by_sphere:
            candidates = self.document_by_sphere[sphere_id]
        else:
            candidates = set(self.documents.keys())
        
        for doc_id in candidates:
            document = self.documents.get(doc_id)
            if not document:
                continue
            
            # Apply filters
            if sphere_id and document.sphere_id != sphere_id:
                continue
            if doc_type and document.doc_type != doc_type:
                continue
            if tags and not any(tag in document.tags for tag in tags):
                continue
            
            results.append(document)
        
        # Sort by created_at descending
        results.sort(key=lambda d: d.created_at, reverse=True)
        
        return results[offset:offset + limit]
    
    async def delete_document(
        self,
        document_id: UUID,
        requester_id: str
    ) -> bool:
        """Delete a document and its chunks."""
        document = self.documents.get(document_id)
        if not document:
            return False
        
        # Check ownership
        if document.owner_id != requester_id:
            logger.warning(f"Delete denied: {requester_id} != {document.owner_id}")
            return False
        
        # Remove chunks
        for chunk_id in document.chunk_ids:
            self.vector_store.remove(chunk_id)
            self.chunks.pop(chunk_id, None)
        
        # Remove from indexes
        if document.sphere_id and document.sphere_id in self.document_by_sphere:
            self.document_by_sphere[document.sphere_id].discard(document_id)
        if document.owner_id in self.document_by_owner:
            self.document_by_owner[document.owner_id].discard(document_id)
        
        # Remove document
        del self.documents[document_id]
        
        # Audit
        self._log_operation("delete_document", {
            "document_id": str(document_id),
            "requester_id": requester_id
        })
        
        logger.info(f"Deleted document {document_id}")
        return True
    
    # =========================================================================
    # SEARCH OPERATIONS
    # =========================================================================
    
    async def semantic_search(
        self,
        query: str,
        requester_id: str,
        sphere_id: Optional[str] = None,
        top_k: int = 10,
        min_score: float = 0.5,
        filters: Optional[Dict[str, Any]] = None
    ) -> SearchResponse:
        """
        Perform semantic search using vector similarity.
        """
        start_time = datetime.utcnow()
        
        # Create search query record
        search_query = SearchQuery(
            id=uuid4(),
            query_text=query,
            search_type=SearchType.SEMANTIC,
            sphere_id=sphere_id,
            filters=filters or {},
            top_k=top_k,
            min_score=min_score,
            created_by=requester_id,
            created_at=start_time
        )
        
        # Generate query embedding
        query_embedding = await self.embedding_provider.embed_text(query)
        
        # Search vector store
        vector_results = self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
            min_score=min_score,
            sphere_id=sphere_id,
            filters=filters
        )
        
        # Build search results
        results = []
        for chunk_id, score, metadata in vector_results:
            chunk = self.chunks.get(chunk_id)
            if not chunk:
                continue
            
            document = self.documents.get(chunk.document_id)
            highlights = TextProcessor.highlight_matches(chunk.content, query)
            
            results.append(SearchResult(
                chunk_id=chunk_id,
                document_id=chunk.document_id,
                content=chunk.content,
                score=score,
                metadata={
                    "document_title": document.title if document else "Unknown",
                    "chunk_index": chunk.chunk_index,
                    **metadata
                },
                highlights=highlights
            ))
        
        # Calculate timing
        end_time = datetime.utcnow()
        search_time_ms = (end_time - start_time).total_seconds() * 1000
        
        # Audit
        self._log_operation("semantic_search", {
            "query_id": str(search_query.id),
            "query": query,
            "results": len(results),
            "sphere_id": sphere_id,
            "requester_id": requester_id
        })
        
        return SearchResponse(
            query_id=search_query.id,
            results=results,
            total_found=len(results),
            search_time_ms=search_time_ms,
            tokens_used=TextProcessor.estimate_tokens(query)
        )
    
    async def hybrid_search(
        self,
        query: str,
        requester_id: str,
        sphere_id: Optional[str] = None,
        top_k: int = 10,
        semantic_weight: float = 0.7,
        keyword_weight: float = 0.3
    ) -> SearchResponse:
        """
        Hybrid search combining semantic and keyword matching.
        """
        start_time = datetime.utcnow()
        
        # Semantic search
        semantic_results = await self.semantic_search(
            query=query,
            requester_id=requester_id,
            sphere_id=sphere_id,
            top_k=top_k * 2,  # Get more for fusion
            min_score=0.3
        )
        
        # Keyword search (simple matching)
        keyword_scores: Dict[UUID, float] = {}
        query_terms = set(query.lower().split())
        
        for chunk_id, chunk in self.chunks.items():
            # Check sphere
            doc = self.documents.get(chunk.document_id)
            if sphere_id and doc and doc.sphere_id != sphere_id:
                continue
            
            # Calculate keyword match score
            chunk_terms = set(chunk.content.lower().split())
            overlap = len(query_terms & chunk_terms)
            if overlap > 0:
                score = overlap / len(query_terms)
                keyword_scores[chunk_id] = score
        
        # Fuse results
        fused_scores: Dict[UUID, float] = {}
        
        for result in semantic_results.results:
            fused_scores[result.chunk_id] = result.score * semantic_weight
        
        for chunk_id, score in keyword_scores.items():
            if chunk_id in fused_scores:
                fused_scores[chunk_id] += score * keyword_weight
            else:
                fused_scores[chunk_id] = score * keyword_weight
        
        # Sort and build results
        sorted_chunks = sorted(fused_scores.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for chunk_id, score in sorted_chunks[:top_k]:
            chunk = self.chunks.get(chunk_id)
            if not chunk:
                continue
            
            document = self.documents.get(chunk.document_id)
            highlights = TextProcessor.highlight_matches(chunk.content, query)
            
            results.append(SearchResult(
                chunk_id=chunk_id,
                document_id=chunk.document_id,
                content=chunk.content,
                score=score,
                metadata={
                    "document_title": document.title if document else "Unknown",
                    "chunk_index": chunk.chunk_index,
                    "search_type": "hybrid"
                },
                highlights=highlights
            ))
        
        end_time = datetime.utcnow()
        search_time_ms = (end_time - start_time).total_seconds() * 1000
        
        return SearchResponse(
            query_id=uuid4(),
            results=results,
            total_found=len(results),
            search_time_ms=search_time_ms,
            tokens_used=TextProcessor.estimate_tokens(query)
        )
    
    # =========================================================================
    # KNOWLEDGE GRAPH OPERATIONS
    # =========================================================================
    
    async def add_entity(
        self,
        name: str,
        node_type: NodeType,
        properties: Dict[str, Any],
        sphere_id: Optional[str] = None
    ) -> GraphNode:
        """Add an entity to the knowledge graph."""
        node = GraphNode(
            id=uuid4(),
            node_type=node_type,
            name=name,
            properties=properties,
            embedding=await self.embedding_provider.embed_text(name),
            sphere_id=sphere_id,
            created_at=datetime.utcnow()
        )
        
        self.knowledge_graph.add_node(node)
        
        self._log_operation("add_entity", {
            "node_id": str(node.id),
            "name": name,
            "node_type": node_type.value
        })
        
        return node
    
    async def add_relationship(
        self,
        source_id: UUID,
        target_id: UUID,
        relation_type: RelationType,
        properties: Optional[Dict[str, Any]] = None,
        weight: float = 1.0
    ) -> GraphEdge:
        """Add a relationship between entities."""
        edge = GraphEdge(
            id=uuid4(),
            source_id=source_id,
            target_id=target_id,
            relation_type=relation_type,
            properties=properties or {},
            weight=weight,
            created_at=datetime.utcnow()
        )
        
        self.knowledge_graph.add_edge(edge)
        
        self._log_operation("add_relationship", {
            "edge_id": str(edge.id),
            "source_id": str(source_id),
            "target_id": str(target_id),
            "relation_type": relation_type.value
        })
        
        return edge
    
    async def find_related_entities(
        self,
        entity_id: UUID,
        relation_type: Optional[RelationType] = None,
        max_depth: int = 2,
        sphere_id: Optional[str] = None
    ) -> List[Tuple[GraphNode, GraphEdge, int]]:
        """Find entities related to a given entity."""
        results = self.knowledge_graph.get_neighbors(
            node_id=entity_id,
            relation_type=relation_type,
            max_depth=max_depth
        )
        
        # Filter by sphere
        if sphere_id:
            results = [
                (node, edge, depth)
                for node, edge, depth in results
                if not node.sphere_id or node.sphere_id == sphere_id
            ]
        
        return results
    
    async def search_entities(
        self,
        query: str,
        node_type: Optional[NodeType] = None,
        sphere_id: Optional[str] = None,
        top_k: int = 10
    ) -> List[Tuple[GraphNode, float]]:
        """Search for entities by name similarity."""
        query_embedding = await self.embedding_provider.embed_text(query)
        
        results = []
        for node in self.knowledge_graph.nodes.values():
            # Filter by type
            if node_type and node.node_type != node_type:
                continue
            
            # Filter by sphere
            if sphere_id and node.sphere_id and node.sphere_id != sphere_id:
                continue
            
            # Calculate similarity
            if node.embedding:
                score = self.vector_store._cosine_similarity(query_embedding, node.embedding)
                results.append((node, score))
        
        # Sort by score
        results.sort(key=lambda x: x[1], reverse=True)
        
        return results[:top_k]
    
    # =========================================================================
    # RAG OPERATIONS
    # =========================================================================
    
    async def retrieve_context(
        self,
        query: str,
        requester_id: str,
        sphere_id: Optional[str] = None,
        max_chunks: int = 5,
        max_tokens: int = 2000
    ) -> RAGContext:
        """
        Retrieve relevant context for RAG.
        
        Returns chunks that fit within token budget.
        """
        # Search for relevant chunks
        search_response = await self.semantic_search(
            query=query,
            requester_id=requester_id,
            sphere_id=sphere_id,
            top_k=max_chunks * 2,  # Get extra for filtering
            min_score=0.4
        )
        
        # Select chunks within token budget
        selected_chunks = []
        total_tokens = 0
        sources = []
        
        for result in search_response.results:
            chunk = self.chunks.get(result.chunk_id)
            if not chunk:
                continue
            
            if total_tokens + chunk.token_count > max_tokens:
                continue
            
            if len(selected_chunks) >= max_chunks:
                break
            
            selected_chunks.append(chunk)
            total_tokens += chunk.token_count
            
            document = self.documents.get(chunk.document_id)
            sources.append({
                "document_id": str(chunk.document_id),
                "document_title": document.title if document else "Unknown",
                "chunk_index": chunk.chunk_index,
                "score": result.score
            })
        
        return RAGContext(
            query=query,
            retrieved_chunks=selected_chunks,
            total_tokens=total_tokens,
            sources=sources
        )
    
    async def generate_rag_response(
        self,
        query: str,
        requester_id: str,
        sphere_id: Optional[str] = None,
        max_context_tokens: int = 2000
    ) -> RAGResponse:
        """
        Generate a RAG response.
        
        In production, this would call an LLM with the context.
        For now, returns a structured response with the context.
        """
        # Retrieve context
        context = await self.retrieve_context(
            query=query,
            requester_id=requester_id,
            sphere_id=sphere_id,
            max_tokens=max_context_tokens
        )
        
        # Build context text
        context_text = "\n\n---\n\n".join([
            f"[Source: {src['document_title']}]\n{chunk.content}"
            for chunk, src in zip(context.retrieved_chunks, context.sources)
        ])
        
        # In production: call LLM with context
        # For now: return placeholder
        answer = f"Based on {len(context.retrieved_chunks)} relevant sources:\n\n"
        if context.retrieved_chunks:
            answer += "Key information found:\n"
            for i, chunk in enumerate(context.retrieved_chunks[:3], 1):
                summary = chunk.content[:200] + "..." if len(chunk.content) > 200 else chunk.content
                answer += f"{i}. {summary}\n\n"
        else:
            answer += "No relevant information found in the knowledge base."
        
        # Build citations
        citations = [
            {
                "index": i + 1,
                "document_id": src["document_id"],
                "title": src["document_title"],
                "relevance_score": src["score"]
            }
            for i, src in enumerate(context.sources)
        ]
        
        response = RAGResponse(
            id=uuid4(),
            query=query,
            answer=answer,
            context=context,
            confidence=sum(s["score"] for s in context.sources) / len(context.sources) if context.sources else 0,
            citations=citations,
            tokens_used=context.total_tokens + TextProcessor.estimate_tokens(query),
            created_at=datetime.utcnow()
        )
        
        # Audit
        self._log_operation("rag_query", {
            "response_id": str(response.id),
            "query": query,
            "sources": len(citations),
            "requester_id": requester_id,
            "sphere_id": sphere_id
        })
        
        return response
    
    # =========================================================================
    # STATISTICS & UTILITIES
    # =========================================================================
    
    def get_statistics(self, sphere_id: Optional[str] = None) -> Dict[str, Any]:
        """Get knowledge base statistics."""
        if sphere_id:
            doc_count = len(self.document_by_sphere.get(sphere_id, set()))
            chunk_count = sum(
                len(self.documents[doc_id].chunk_ids)
                for doc_id in self.document_by_sphere.get(sphere_id, set())
                if doc_id in self.documents
            )
            vector_count = self.vector_store.count(sphere_id)
            node_count = self.knowledge_graph.count_nodes(sphere_id)
        else:
            doc_count = len(self.documents)
            chunk_count = len(self.chunks)
            vector_count = self.vector_store.count()
            node_count = self.knowledge_graph.count_nodes()
        
        return {
            "documents": doc_count,
            "chunks": chunk_count,
            "vectors": vector_count,
            "graph_nodes": node_count,
            "graph_edges": self.knowledge_graph.count_edges(),
            "embedding_provider": self.embedding_config.provider.value,
            "embedding_dimensions": self.embedding_config.dimensions,
            "chunking_strategy": self.chunking_config.strategy.value
        }
    
    def _log_operation(self, operation: str, details: Dict[str, Any]) -> None:
        """Log an operation for audit."""
        self.operations.append({
            "operation": operation,
            "details": details,
            "timestamp": datetime.utcnow().isoformat()
        })
    
    def get_audit_log(self, limit: int = 100) -> List[Dict[str, Any]]:
        """Get recent audit log entries."""
        return self.operations[-limit:]


# =============================================================================
# FACTORY FUNCTION
# =============================================================================

def create_knowledge_base_service(
    embedding_provider: EmbeddingProvider = EmbeddingProvider.MOCK,
    embedding_model: str = "mock-embedding",
    embedding_dimensions: int = 384,
    chunking_strategy: ChunkingStrategy = ChunkingStrategy.RECURSIVE,
    chunk_size: int = 512,
    chunk_overlap: int = 50
) -> KnowledgeBaseService:
    """Create a configured knowledge base service."""
    embedding_config = EmbeddingConfig(
        provider=embedding_provider,
        model=embedding_model,
        dimensions=embedding_dimensions
    )
    
    chunking_config = ChunkingConfig(
        strategy=chunking_strategy,
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap
    )
    
    return KnowledgeBaseService(
        embedding_config=embedding_config,
        chunking_config=chunking_config
    )


# =============================================================================
# EXAMPLE USAGE
# =============================================================================

if __name__ == "__main__":
    import asyncio
    
    async def main():
        # Create service
        kb = create_knowledge_base_service()
        
        # Ingest documents
        doc1 = await kb.ingest_document(
            title="CHE·NU Architecture",
            content="""
            CHE·NU is a Governed Intelligence Operating System.
            It consists of 9 spheres: Personal, Business, Government, 
            Creative Studio, Community, Social & Media, Entertainment, 
            My Team, and Scholar.
            
            The core principle is: Governance > Execution.
            Humans take ALL decisions. AI agents assist but never decide.
            """,
            doc_type=DocumentType.TEXT,
            owner_id="user_123",
            sphere_id="business",
            tags=["architecture", "governance"]
        )
        print(f"Ingested: {doc1.title} with {len(doc1.chunk_ids)} chunks")
        
        doc2 = await kb.ingest_document(
            title="Agent System Overview",
            content="""
            The agent system in CHE·NU supports multiple agent types:
            - Assistant: General purpose helpers
            - Specialist: Domain-specific experts
            - Coordinator: Multi-agent orchestration
            - Monitor: System observation
            - Executor: Task execution
            
            All agents operate under human sovereignty principles.
            Token budgets govern resource usage.
            """,
            doc_type=DocumentType.TEXT,
            owner_id="user_123",
            sphere_id="business",
            tags=["agents", "system"]
        )
        print(f"Ingested: {doc2.title} with {len(doc2.chunk_ids)} chunks")
        
        # Semantic search
        print("\n--- Semantic Search ---")
        results = await kb.semantic_search(
            query="What are the core principles of CHE·NU?",
            requester_id="user_123",
            sphere_id="business",
            top_k=3
        )
        for result in results.results:
            print(f"Score: {result.score:.3f}")
            print(f"Content: {result.content[:100]}...")
            print()
        
        # RAG query
        print("\n--- RAG Query ---")
        rag_response = await kb.generate_rag_response(
            query="Explain the agent types in CHE·NU",
            requester_id="user_123",
            sphere_id="business"
        )
        print(f"Answer:\n{rag_response.answer}")
        print(f"\nCitations: {len(rag_response.citations)}")
        print(f"Confidence: {rag_response.confidence:.2f}")
        
        # Statistics
        print("\n--- Statistics ---")
        stats = kb.get_statistics()
        for key, value in stats.items():
            print(f"{key}: {value}")
    
    asyncio.run(main())
