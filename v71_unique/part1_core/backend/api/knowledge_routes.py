"""
CHE·NU™ V71 - Knowledge Base API Routes
========================================

REST API for knowledge base operations including:
- Document ingestion and management
- Semantic and hybrid search
- Knowledge graph operations
- RAG (Retrieval Augmented Generation)

All endpoints enforce sphere isolation and audit logging.
"""

from datetime import datetime
from typing import Any, Dict, List, Optional
from uuid import UUID

from fastapi import APIRouter, HTTPException, Query, Body, Depends
from pydantic import BaseModel, Field

from ..services.knowledge_base_service import (
    KnowledgeBaseService,
    create_knowledge_base_service,
    Document,
    Chunk,
    SearchResponse,
    RAGResponse,
    GraphNode,
    GraphEdge,
    DocumentType,
    ChunkingStrategy,
    EmbeddingProvider,
    SearchType,
    NodeType,
    RelationType,
)

router = APIRouter(prefix="/knowledge", tags=["Knowledge Base"])

# =============================================================================
# DEPENDENCY INJECTION
# =============================================================================

_knowledge_base_service: Optional[KnowledgeBaseService] = None


def get_knowledge_base_service() -> KnowledgeBaseService:
    """Get or create the knowledge base service singleton."""
    global _knowledge_base_service
    if _knowledge_base_service is None:
        _knowledge_base_service = create_knowledge_base_service()
    return _knowledge_base_service


# =============================================================================
# REQUEST/RESPONSE MODELS
# =============================================================================

# Document Models
class DocumentIngestRequest(BaseModel):
    """Request to ingest a document."""
    title: str = Field(..., min_length=1, max_length=500)
    content: str = Field(..., min_length=1)
    doc_type: DocumentType = DocumentType.TEXT
    owner_id: str = Field(..., min_length=1)
    sphere_id: Optional[str] = None
    metadata: Optional[Dict[str, Any]] = None
    tags: Optional[List[str]] = None
    source_url: Optional[str] = None


class DocumentResponse(BaseModel):
    """Document response."""
    id: str
    title: str
    doc_type: str
    owner_id: str
    sphere_id: Optional[str]
    chunk_count: int
    tags: List[str]
    created_at: str
    updated_at: str
    source_url: Optional[str]
    checksum: Optional[str]

    @classmethod
    def from_document(cls, doc: Document) -> "DocumentResponse":
        return cls(
            id=str(doc.id),
            title=doc.title,
            doc_type=doc.doc_type.value,
            owner_id=doc.owner_id,
            sphere_id=doc.sphere_id,
            chunk_count=len(doc.chunk_ids),
            tags=doc.tags,
            created_at=doc.created_at.isoformat(),
            updated_at=doc.updated_at.isoformat(),
            source_url=doc.source_url,
            checksum=doc.checksum
        )


class DocumentListResponse(BaseModel):
    """List of documents response."""
    documents: List[DocumentResponse]
    total: int
    limit: int
    offset: int


class DocumentDetailResponse(DocumentResponse):
    """Detailed document response with content preview."""
    content_preview: str
    metadata: Dict[str, Any]

    @classmethod
    def from_document(cls, doc: Document) -> "DocumentDetailResponse":
        preview = doc.content[:500] + "..." if len(doc.content) > 500 else doc.content
        return cls(
            id=str(doc.id),
            title=doc.title,
            doc_type=doc.doc_type.value,
            owner_id=doc.owner_id,
            sphere_id=doc.sphere_id,
            chunk_count=len(doc.chunk_ids),
            tags=doc.tags,
            created_at=doc.created_at.isoformat(),
            updated_at=doc.updated_at.isoformat(),
            source_url=doc.source_url,
            checksum=doc.checksum,
            content_preview=preview,
            metadata=doc.metadata
        )


# Search Models
class SearchRequest(BaseModel):
    """Search request."""
    query: str = Field(..., min_length=1, max_length=1000)
    search_type: SearchType = SearchType.SEMANTIC
    requester_id: str = Field(..., min_length=1)
    sphere_id: Optional[str] = None
    top_k: int = Field(default=10, ge=1, le=100)
    min_score: float = Field(default=0.5, ge=0.0, le=1.0)
    filters: Optional[Dict[str, Any]] = None


class SearchResultItem(BaseModel):
    """Single search result."""
    chunk_id: str
    document_id: str
    content: str
    score: float
    metadata: Dict[str, Any]
    highlights: List[str]


class SearchResponseModel(BaseModel):
    """Search response."""
    query_id: str
    results: List[SearchResultItem]
    total_found: int
    search_time_ms: float
    tokens_used: int

    @classmethod
    def from_search_response(cls, resp: SearchResponse) -> "SearchResponseModel":
        return cls(
            query_id=str(resp.query_id),
            results=[
                SearchResultItem(
                    chunk_id=str(r.chunk_id),
                    document_id=str(r.document_id),
                    content=r.content,
                    score=r.score,
                    metadata=r.metadata,
                    highlights=r.highlights
                )
                for r in resp.results
            ],
            total_found=resp.total_found,
            search_time_ms=resp.search_time_ms,
            tokens_used=resp.tokens_used
        )


class HybridSearchRequest(BaseModel):
    """Hybrid search request."""
    query: str = Field(..., min_length=1, max_length=1000)
    requester_id: str = Field(..., min_length=1)
    sphere_id: Optional[str] = None
    top_k: int = Field(default=10, ge=1, le=100)
    semantic_weight: float = Field(default=0.7, ge=0.0, le=1.0)
    keyword_weight: float = Field(default=0.3, ge=0.0, le=1.0)


# RAG Models
class RAGRequest(BaseModel):
    """RAG query request."""
    query: str = Field(..., min_length=1, max_length=2000)
    requester_id: str = Field(..., min_length=1)
    sphere_id: Optional[str] = None
    max_context_tokens: int = Field(default=2000, ge=100, le=8000)


class RAGContextModel(BaseModel):
    """RAG context model."""
    query: str
    chunk_count: int
    total_tokens: int
    sources: List[Dict[str, Any]]


class RAGResponseModel(BaseModel):
    """RAG response."""
    id: str
    query: str
    answer: str
    context: RAGContextModel
    confidence: float
    citations: List[Dict[str, Any]]
    tokens_used: int
    created_at: str

    @classmethod
    def from_rag_response(cls, resp: RAGResponse) -> "RAGResponseModel":
        return cls(
            id=str(resp.id),
            query=resp.query,
            answer=resp.answer,
            context=RAGContextModel(
                query=resp.context.query,
                chunk_count=len(resp.context.retrieved_chunks),
                total_tokens=resp.context.total_tokens,
                sources=resp.context.sources
            ),
            confidence=resp.confidence,
            citations=resp.citations,
            tokens_used=resp.tokens_used,
            created_at=resp.created_at.isoformat()
        )


# Knowledge Graph Models
class EntityCreateRequest(BaseModel):
    """Request to create an entity."""
    name: str = Field(..., min_length=1, max_length=200)
    node_type: NodeType
    properties: Optional[Dict[str, Any]] = None
    sphere_id: Optional[str] = None


class EntityResponse(BaseModel):
    """Entity response."""
    id: str
    name: str
    node_type: str
    properties: Dict[str, Any]
    sphere_id: Optional[str]
    created_at: str

    @classmethod
    def from_node(cls, node: GraphNode) -> "EntityResponse":
        return cls(
            id=str(node.id),
            name=node.name,
            node_type=node.node_type.value,
            properties=node.properties,
            sphere_id=node.sphere_id,
            created_at=node.created_at.isoformat()
        )


class RelationshipCreateRequest(BaseModel):
    """Request to create a relationship."""
    source_id: str
    target_id: str
    relation_type: RelationType
    properties: Optional[Dict[str, Any]] = None
    weight: float = Field(default=1.0, ge=0.0, le=1.0)


class RelationshipResponse(BaseModel):
    """Relationship response."""
    id: str
    source_id: str
    target_id: str
    relation_type: str
    properties: Dict[str, Any]
    weight: float
    created_at: str

    @classmethod
    def from_edge(cls, edge: GraphEdge) -> "RelationshipResponse":
        return cls(
            id=str(edge.id),
            source_id=str(edge.source_id),
            target_id=str(edge.target_id),
            relation_type=edge.relation_type.value,
            properties=edge.properties,
            weight=edge.weight,
            created_at=edge.created_at.isoformat()
        )


class RelatedEntityItem(BaseModel):
    """Related entity with relationship info."""
    entity: EntityResponse
    relationship: RelationshipResponse
    depth: int


class RelatedEntitiesResponse(BaseModel):
    """Related entities response."""
    entity_id: str
    related: List[RelatedEntityItem]
    total: int


class EntitySearchResponse(BaseModel):
    """Entity search response."""
    results: List[Dict[str, Any]]
    total: int


# Statistics Model
class StatisticsResponse(BaseModel):
    """Knowledge base statistics."""
    documents: int
    chunks: int
    vectors: int
    graph_nodes: int
    graph_edges: int
    embedding_provider: str
    embedding_dimensions: int
    chunking_strategy: str


# Chunk Model
class ChunkResponse(BaseModel):
    """Chunk response."""
    id: str
    document_id: str
    content: str
    chunk_index: int
    token_count: int
    start_char: int
    end_char: int
    metadata: Dict[str, Any]
    created_at: str

    @classmethod
    def from_chunk(cls, chunk: Chunk) -> "ChunkResponse":
        return cls(
            id=str(chunk.id),
            document_id=str(chunk.document_id),
            content=chunk.content,
            chunk_index=chunk.chunk_index,
            token_count=chunk.token_count,
            start_char=chunk.start_char,
            end_char=chunk.end_char,
            metadata=chunk.metadata,
            created_at=chunk.created_at.isoformat()
        )


class ChunkListResponse(BaseModel):
    """List of chunks response."""
    chunks: List[ChunkResponse]
    total: int


# =============================================================================
# DOCUMENT ENDPOINTS
# =============================================================================

@router.post("/documents", response_model=DocumentResponse)
async def ingest_document(
    request: DocumentIngestRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> DocumentResponse:
    """
    Ingest a new document into the knowledge base.
    
    The document will be:
    1. Split into chunks based on configured strategy
    2. Embedded using the configured provider
    3. Indexed for semantic search
    4. Added to the knowledge graph
    """
    try:
        document = await service.ingest_document(
            title=request.title,
            content=request.content,
            doc_type=request.doc_type,
            owner_id=request.owner_id,
            sphere_id=request.sphere_id,
            metadata=request.metadata,
            tags=request.tags,
            source_url=request.source_url
        )
        return DocumentResponse.from_document(document)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to ingest document: {str(e)}")


@router.get("/documents", response_model=DocumentListResponse)
async def list_documents(
    owner_id: Optional[str] = Query(None),
    sphere_id: Optional[str] = Query(None),
    doc_type: Optional[DocumentType] = Query(None),
    tags: Optional[str] = Query(None, description="Comma-separated tags"),
    limit: int = Query(default=100, ge=1, le=1000),
    offset: int = Query(default=0, ge=0),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> DocumentListResponse:
    """List documents with optional filters."""
    tag_list = tags.split(",") if tags else None
    
    documents = await service.list_documents(
        owner_id=owner_id,
        sphere_id=sphere_id,
        doc_type=doc_type,
        tags=tag_list,
        limit=limit,
        offset=offset
    )
    
    return DocumentListResponse(
        documents=[DocumentResponse.from_document(d) for d in documents],
        total=len(documents),
        limit=limit,
        offset=offset
    )


@router.get("/documents/{document_id}", response_model=DocumentDetailResponse)
async def get_document(
    document_id: str,
    requester_id: str = Query(...),
    sphere_id: Optional[str] = Query(None),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> DocumentDetailResponse:
    """Get a document by ID with access control."""
    try:
        doc_uuid = UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID format")
    
    document = await service.get_document(
        document_id=doc_uuid,
        requester_id=requester_id,
        sphere_id=sphere_id
    )
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    return DocumentDetailResponse.from_document(document)


@router.delete("/documents/{document_id}")
async def delete_document(
    document_id: str,
    requester_id: str = Query(...),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """Delete a document (owner only)."""
    try:
        doc_uuid = UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID format")
    
    success = await service.delete_document(
        document_id=doc_uuid,
        requester_id=requester_id
    )
    
    if not success:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    return {"deleted": True, "document_id": document_id}


@router.get("/documents/{document_id}/chunks", response_model=ChunkListResponse)
async def get_document_chunks(
    document_id: str,
    requester_id: str = Query(...),
    sphere_id: Optional[str] = Query(None),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> ChunkListResponse:
    """Get all chunks for a document."""
    try:
        doc_uuid = UUID(document_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid document ID format")
    
    document = await service.get_document(
        document_id=doc_uuid,
        requester_id=requester_id,
        sphere_id=sphere_id
    )
    
    if not document:
        raise HTTPException(status_code=404, detail="Document not found or access denied")
    
    chunks = [
        service.chunks.get(chunk_id)
        for chunk_id in document.chunk_ids
        if chunk_id in service.chunks
    ]
    
    return ChunkListResponse(
        chunks=[ChunkResponse.from_chunk(c) for c in chunks if c],
        total=len(chunks)
    )


# =============================================================================
# SEARCH ENDPOINTS
# =============================================================================

@router.post("/search/semantic", response_model=SearchResponseModel)
async def semantic_search(
    request: SearchRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> SearchResponseModel:
    """
    Perform semantic search using vector similarity.
    
    Finds documents/chunks that are semantically similar to the query,
    even if they don't contain the exact words.
    """
    try:
        response = await service.semantic_search(
            query=request.query,
            requester_id=request.requester_id,
            sphere_id=request.sphere_id,
            top_k=request.top_k,
            min_score=request.min_score,
            filters=request.filters
        )
        return SearchResponseModel.from_search_response(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.post("/search/hybrid", response_model=SearchResponseModel)
async def hybrid_search(
    request: HybridSearchRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> SearchResponseModel:
    """
    Perform hybrid search combining semantic and keyword matching.
    
    Uses weighted combination of vector similarity and keyword overlap.
    """
    try:
        response = await service.hybrid_search(
            query=request.query,
            requester_id=request.requester_id,
            sphere_id=request.sphere_id,
            top_k=request.top_k,
            semantic_weight=request.semantic_weight,
            keyword_weight=request.keyword_weight
        )
        return SearchResponseModel.from_search_response(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Search failed: {str(e)}")


@router.get("/search/quick")
async def quick_search(
    q: str = Query(..., min_length=1, max_length=500),
    requester_id: str = Query(...),
    sphere_id: Optional[str] = Query(None),
    top_k: int = Query(default=5, ge=1, le=20),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> SearchResponseModel:
    """Quick semantic search via GET request."""
    response = await service.semantic_search(
        query=q,
        requester_id=requester_id,
        sphere_id=sphere_id,
        top_k=top_k,
        min_score=0.4
    )
    return SearchResponseModel.from_search_response(response)


# =============================================================================
# RAG ENDPOINTS
# =============================================================================

@router.post("/rag/query", response_model=RAGResponseModel)
async def rag_query(
    request: RAGRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> RAGResponseModel:
    """
    Perform RAG (Retrieval Augmented Generation) query.
    
    1. Retrieves relevant context from knowledge base
    2. Generates answer using context (in production: LLM call)
    3. Returns answer with citations
    """
    try:
        response = await service.generate_rag_response(
            query=request.query,
            requester_id=request.requester_id,
            sphere_id=request.sphere_id,
            max_context_tokens=request.max_context_tokens
        )
        return RAGResponseModel.from_rag_response(response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"RAG query failed: {str(e)}")


@router.post("/rag/context")
async def get_rag_context(
    request: RAGRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """
    Get RAG context without generation.
    
    Useful for previewing what context would be used.
    """
    try:
        context = await service.retrieve_context(
            query=request.query,
            requester_id=request.requester_id,
            sphere_id=request.sphere_id,
            max_tokens=request.max_context_tokens
        )
        return {
            "query": context.query,
            "chunks": [
                {
                    "id": str(c.id),
                    "content": c.content,
                    "token_count": c.token_count
                }
                for c in context.retrieved_chunks
            ],
            "total_tokens": context.total_tokens,
            "sources": context.sources
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Context retrieval failed: {str(e)}")


# =============================================================================
# KNOWLEDGE GRAPH ENDPOINTS
# =============================================================================

@router.post("/graph/entities", response_model=EntityResponse)
async def create_entity(
    request: EntityCreateRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> EntityResponse:
    """Create a new entity in the knowledge graph."""
    try:
        node = await service.add_entity(
            name=request.name,
            node_type=request.node_type,
            properties=request.properties or {},
            sphere_id=request.sphere_id
        )
        return EntityResponse.from_node(node)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create entity: {str(e)}")


@router.get("/graph/entities/{entity_id}", response_model=EntityResponse)
async def get_entity(
    entity_id: str,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> EntityResponse:
    """Get an entity by ID."""
    try:
        entity_uuid = UUID(entity_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity ID format")
    
    node = service.knowledge_graph.get_node(entity_uuid)
    if not node:
        raise HTTPException(status_code=404, detail="Entity not found")
    
    return EntityResponse.from_node(node)


@router.post("/graph/relationships", response_model=RelationshipResponse)
async def create_relationship(
    request: RelationshipCreateRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> RelationshipResponse:
    """Create a relationship between entities."""
    try:
        source_uuid = UUID(request.source_id)
        target_uuid = UUID(request.target_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity ID format")
    
    try:
        edge = await service.add_relationship(
            source_id=source_uuid,
            target_id=target_uuid,
            relation_type=request.relation_type,
            properties=request.properties,
            weight=request.weight
        )
        return RelationshipResponse.from_edge(edge)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create relationship: {str(e)}")


@router.get("/graph/entities/{entity_id}/related", response_model=RelatedEntitiesResponse)
async def get_related_entities(
    entity_id: str,
    relation_type: Optional[RelationType] = Query(None),
    max_depth: int = Query(default=2, ge=1, le=5),
    sphere_id: Optional[str] = Query(None),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> RelatedEntitiesResponse:
    """Get entities related to a given entity."""
    try:
        entity_uuid = UUID(entity_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid entity ID format")
    
    related = await service.find_related_entities(
        entity_id=entity_uuid,
        relation_type=relation_type,
        max_depth=max_depth,
        sphere_id=sphere_id
    )
    
    items = [
        RelatedEntityItem(
            entity=EntityResponse.from_node(node),
            relationship=RelationshipResponse.from_edge(edge),
            depth=depth
        )
        for node, edge, depth in related
    ]
    
    return RelatedEntitiesResponse(
        entity_id=entity_id,
        related=items,
        total=len(items)
    )


@router.get("/graph/search", response_model=EntitySearchResponse)
async def search_entities(
    q: str = Query(..., min_length=1, max_length=200),
    node_type: Optional[NodeType] = Query(None),
    sphere_id: Optional[str] = Query(None),
    top_k: int = Query(default=10, ge=1, le=50),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> EntitySearchResponse:
    """Search for entities by name similarity."""
    results = await service.search_entities(
        query=q,
        node_type=node_type,
        sphere_id=sphere_id,
        top_k=top_k
    )
    
    return EntitySearchResponse(
        results=[
            {
                "entity": EntityResponse.from_node(node).dict(),
                "score": score
            }
            for node, score in results
        ],
        total=len(results)
    )


@router.get("/graph/subgraph/{center_id}")
async def get_subgraph(
    center_id: str,
    radius: int = Query(default=2, ge=1, le=5),
    sphere_id: Optional[str] = Query(None),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """Get a subgraph around a center node."""
    try:
        center_uuid = UUID(center_id)
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid center ID format")
    
    nodes, edges = service.knowledge_graph.get_subgraph(
        center_id=center_uuid,
        radius=radius,
        sphere_id=sphere_id
    )
    
    return {
        "center_id": center_id,
        "radius": radius,
        "nodes": [EntityResponse.from_node(n).dict() for n in nodes],
        "edges": [RelationshipResponse.from_edge(e).dict() for e in edges],
        "node_count": len(nodes),
        "edge_count": len(edges)
    }


# =============================================================================
# STATISTICS & UTILITY ENDPOINTS
# =============================================================================

@router.get("/stats", response_model=StatisticsResponse)
async def get_statistics(
    sphere_id: Optional[str] = Query(None),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> StatisticsResponse:
    """Get knowledge base statistics."""
    stats = service.get_statistics(sphere_id)
    return StatisticsResponse(**stats)


@router.get("/health")
async def health_check(
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """Health check endpoint."""
    stats = service.get_statistics()
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat(),
        "documents": stats["documents"],
        "chunks": stats["chunks"],
        "vectors": stats["vectors"]
    }


@router.get("/audit")
async def get_audit_log(
    limit: int = Query(default=100, ge=1, le=1000),
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """Get recent audit log entries."""
    entries = service.get_audit_log(limit)
    return {
        "entries": entries,
        "total": len(entries),
        "limit": limit
    }


# =============================================================================
# BATCH OPERATIONS
# =============================================================================

class BatchIngestRequest(BaseModel):
    """Request to ingest multiple documents."""
    documents: List[DocumentIngestRequest]
    owner_id: str


class BatchIngestResponse(BaseModel):
    """Response from batch ingest."""
    successful: int
    failed: int
    documents: List[DocumentResponse]
    errors: List[Dict[str, str]]


@router.post("/documents/batch", response_model=BatchIngestResponse)
async def batch_ingest_documents(
    request: BatchIngestRequest,
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> BatchIngestResponse:
    """Ingest multiple documents in batch."""
    successful = 0
    failed = 0
    documents = []
    errors = []
    
    for doc_request in request.documents:
        try:
            # Override owner_id from batch request
            doc = await service.ingest_document(
                title=doc_request.title,
                content=doc_request.content,
                doc_type=doc_request.doc_type,
                owner_id=request.owner_id,
                sphere_id=doc_request.sphere_id,
                metadata=doc_request.metadata,
                tags=doc_request.tags,
                source_url=doc_request.source_url
            )
            documents.append(DocumentResponse.from_document(doc))
            successful += 1
        except Exception as e:
            failed += 1
            errors.append({
                "title": doc_request.title,
                "error": str(e)
            })
    
    return BatchIngestResponse(
        successful=successful,
        failed=failed,
        documents=documents,
        errors=errors
    )


# =============================================================================
# CONFIGURATION ENDPOINTS
# =============================================================================

@router.get("/config")
async def get_configuration(
    service: KnowledgeBaseService = Depends(get_knowledge_base_service)
) -> Dict[str, Any]:
    """Get current knowledge base configuration."""
    return {
        "embedding": {
            "provider": service.embedding_config.provider.value,
            "model": service.embedding_config.model,
            "dimensions": service.embedding_config.dimensions,
            "batch_size": service.embedding_config.batch_size
        },
        "chunking": {
            "strategy": service.chunking_config.strategy.value,
            "chunk_size": service.chunking_config.chunk_size,
            "chunk_overlap": service.chunking_config.chunk_overlap,
            "min_chunk_size": service.chunking_config.min_chunk_size
        }
    }


@router.get("/providers")
async def list_providers() -> Dict[str, Any]:
    """List available embedding providers."""
    return {
        "embedding_providers": [p.value for p in EmbeddingProvider],
        "chunking_strategies": [s.value for s in ChunkingStrategy],
        "document_types": [t.value for t in DocumentType],
        "search_types": [t.value for t in SearchType],
        "node_types": [t.value for t in NodeType],
        "relation_types": [t.value for t in RelationType]
    }


# =============================================================================
# EXPORT
# =============================================================================

__all__ = ["router", "get_knowledge_base_service"]
