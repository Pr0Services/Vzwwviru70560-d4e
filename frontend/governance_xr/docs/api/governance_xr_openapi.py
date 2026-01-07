"""
OpenAPI Documentation: Governance & XR Endpoints
Spec Version: 3.1.0
CHE·NU Version: V72

R&D COMPLIANCE: ✅
- All endpoints documented
- Human Gates clearly marked
- HTTP 423/403 responses documented
"""

GOVERNANCE_XR_OPENAPI = {
    "openapi": "3.1.0",
    "info": {
        "title": "CHE·NU Governance & XR API",
        "description": """
# CHE·NU Governance & XR API

This API provides endpoints for the CHE·NU Governed Intelligence Operating System's
governance layer and XR (Mixed Reality) rendering system.

## Core Principles

1. **Human Sovereignty** (R&D Rule #1): All sensitive actions require explicit human approval
2. **Governance > Execution**: Checkpoints block execution until approved
3. **XR = Projection**: XR environments are read-only projections of Thread data

## HTTP Status Codes

- `200 OK`: Request successful
- `201 Created`: Resource created
- `400 Bad Request`: Invalid request
- `403 Forbidden`: Identity boundary violation (cannot access other identity's data)
- `423 Locked`: Checkpoint pending - requires human approval before proceeding
- `500 Internal Server Error`: Server error

## Authentication

All endpoints require Bearer token authentication.
```
Authorization: Bearer <token>
```
        """,
        "version": "1.0.0",
        "contact": {
            "name": "CHE·NU Team",
            "email": "dev@che-nu.com"
        },
        "license": {
            "name": "Proprietary",
            "identifier": "CHE-NU-PROPRIETARY"
        }
    },
    "servers": [
        {
            "url": "https://api.che-nu.com/v2",
            "description": "Production"
        },
        {
            "url": "https://staging-api.che-nu.com/v2",
            "description": "Staging"
        },
        {
            "url": "http://localhost:8000/api/v2",
            "description": "Local Development"
        }
    ],
    "tags": [
        {
            "name": "Governance Signals",
            "description": "CEA (Continuous Evaluation Agents) signal management"
        },
        {
            "name": "Backlog",
            "description": "Governance backlog for errors, decisions, and debt"
        },
        {
            "name": "Checkpoints",
            "description": "Human approval gates (HTTP 423 handlers)"
        },
        {
            "name": "Orchestrator",
            "description": "Decision audit and execution history"
        },
        {
            "name": "Thread Maturity",
            "description": "Thread maturity scoring and levels"
        },
        {
            "name": "XR Rendering",
            "description": "XR environment generation and interaction"
        },
        {
            "name": "Thread Lobby",
            "description": "Thread entry point and mode selection"
        }
    ],
    "paths": {
        # =====================================================================
        # GOVERNANCE SIGNALS
        # =====================================================================
        "/governance/signals": {
            "get": {
                "tags": ["Governance Signals"],
                "summary": "List governance signals",
                "description": "Retrieve recent CEA signals for a thread or all threads",
                "operationId": "listGovernanceSignals",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "query",
                        "description": "Filter by thread ID",
                        "required": False,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "level",
                        "in": "query",
                        "description": "Filter by signal level",
                        "required": False,
                        "schema": {
                            "type": "string",
                            "enum": ["WARN", "CORRECT", "PAUSE", "BLOCK", "ESCALATE"]
                        }
                    },
                    {
                        "name": "limit",
                        "in": "query",
                        "description": "Maximum number of signals to return",
                        "required": False,
                        "schema": {"type": "integer", "default": 50, "maximum": 100}
                    },
                    {
                        "name": "offset",
                        "in": "query",
                        "description": "Offset for pagination",
                        "required": False,
                        "schema": {"type": "integer", "default": 0}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of governance signals",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/GovernanceSignalList"
                                }
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"}
                }
            }
        },
        "/governance/signals/{signal_id}/acknowledge": {
            "post": {
                "tags": ["Governance Signals"],
                "summary": "Acknowledge a governance signal",
                "description": "Mark a signal as acknowledged by the user",
                "operationId": "acknowledgeSignal",
                "parameters": [
                    {
                        "name": "signal_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Signal acknowledged",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "acknowledged": {"type": "boolean"},
                                        "acknowledged_at": {"type": "string", "format": "date-time"},
                                        "acknowledged_by": {"type": "string", "format": "uuid"}
                                    }
                                }
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Signal not found"}
                }
            }
        },
        
        # =====================================================================
        # BACKLOG
        # =====================================================================
        "/governance/backlog": {
            "get": {
                "tags": ["Backlog"],
                "summary": "List backlog items",
                "description": "Retrieve governance backlog items (errors, signals, decisions, costs, debt)",
                "operationId": "listBacklogItems",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "query",
                        "required": False,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "type",
                        "in": "query",
                        "description": "Filter by backlog type",
                        "required": False,
                        "schema": {
                            "type": "string",
                            "enum": ["error", "signal", "decision", "cost", "governance_debt"]
                        }
                    },
                    {
                        "name": "severity",
                        "in": "query",
                        "required": False,
                        "schema": {
                            "type": "string",
                            "enum": ["low", "medium", "high", "critical"]
                        }
                    },
                    {
                        "name": "status",
                        "in": "query",
                        "required": False,
                        "schema": {
                            "type": "string",
                            "enum": ["open", "in_progress", "resolved", "wont_fix", "duplicate"]
                        }
                    },
                    {
                        "name": "limit",
                        "in": "query",
                        "schema": {"type": "integer", "default": 50}
                    },
                    {
                        "name": "offset",
                        "in": "query",
                        "schema": {"type": "integer", "default": 0}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of backlog items",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/BacklogList"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"}
                }
            },
            "post": {
                "tags": ["Backlog"],
                "summary": "Create a backlog item",
                "description": "Manually create a backlog item (usually created by system)",
                "operationId": "createBacklogItem",
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/BacklogItemCreate"}
                        }
                    }
                },
                "responses": {
                    "201": {
                        "description": "Backlog item created",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/BacklogItem"}
                            }
                        }
                    },
                    "400": {"description": "Invalid request"}
                }
            }
        },
        "/governance/backlog/{item_id}/resolve": {
            "post": {
                "tags": ["Backlog"],
                "summary": "Resolve a backlog item",
                "description": "Mark a backlog item as resolved with resolution notes",
                "operationId": "resolveBacklogItem",
                "parameters": [
                    {
                        "name": "item_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["resolution"],
                                "properties": {
                                    "resolution": {
                                        "type": "string",
                                        "description": "Resolution description",
                                        "minLength": 10
                                    },
                                    "feed_to_policy_tuner": {
                                        "type": "boolean",
                                        "description": "Whether to feed this to policy tuner for learning",
                                        "default": False
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Backlog item resolved",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/BacklogItem"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Item not found"}
                }
            }
        },
        
        # =====================================================================
        # CHECKPOINTS (Human Gates)
        # =====================================================================
        "/governance/checkpoints": {
            "get": {
                "tags": ["Checkpoints"],
                "summary": "List pending checkpoints",
                "description": "Retrieve pending checkpoints requiring human approval",
                "operationId": "listCheckpoints",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "query",
                        "required": False,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "status",
                        "in": "query",
                        "schema": {
                            "type": "string",
                            "enum": ["pending", "approved", "rejected"],
                            "default": "pending"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of checkpoints",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/CheckpointList"}
                            }
                        }
                    }
                }
            }
        },
        "/governance/checkpoints/{checkpoint_id}/approve": {
            "post": {
                "tags": ["Checkpoints"],
                "summary": "Approve a checkpoint",
                "description": """
Approve a pending checkpoint to allow execution to proceed.

**This is a Human Gate (R&D Rule #1)**: The user explicitly confirms
they want the action to proceed.
                """,
                "operationId": "approveCheckpoint",
                "parameters": [
                    {
                        "name": "checkpoint_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "requestBody": {
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "comment": {
                                        "type": "string",
                                        "description": "Optional approval comment"
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Checkpoint approved",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/CheckpointResponse"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Checkpoint not found"},
                    "409": {"description": "Checkpoint already processed"}
                }
            }
        },
        "/governance/checkpoints/{checkpoint_id}/reject": {
            "post": {
                "tags": ["Checkpoints"],
                "summary": "Reject a checkpoint",
                "description": "Reject a pending checkpoint to block the action",
                "operationId": "rejectCheckpoint",
                "parameters": [
                    {
                        "name": "checkpoint_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "required": ["reason"],
                                "properties": {
                                    "reason": {
                                        "type": "string",
                                        "description": "Reason for rejection",
                                        "minLength": 5
                                    }
                                }
                            }
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Checkpoint rejected",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/CheckpointResponse"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Checkpoint not found"}
                }
            }
        },
        
        # =====================================================================
        # ORCHESTRATOR DECISIONS
        # =====================================================================
        "/governance/decisions": {
            "get": {
                "tags": ["Orchestrator"],
                "summary": "List orchestrator decisions",
                "description": "Retrieve orchestrator decision history for audit",
                "operationId": "listDecisions",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "query",
                        "required": False,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "decision",
                        "in": "query",
                        "schema": {
                            "type": "string",
                            "enum": [
                                "PROCEED_STANDARD",
                                "PROCEED_LIVE",
                                "ESCALATE_BACKLOG",
                                "BLOCK_WITH_CHECKPOINT",
                                "REJECT"
                            ]
                        }
                    },
                    {
                        "name": "limit",
                        "in": "query",
                        "schema": {"type": "integer", "default": 50}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "List of decisions",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/DecisionList"}
                            }
                        }
                    }
                }
            }
        },
        
        # =====================================================================
        # THREAD MATURITY
        # =====================================================================
        "/threads/{thread_id}/maturity": {
            "get": {
                "tags": ["Thread Maturity"],
                "summary": "Get thread maturity",
                "description": "Retrieve the maturity score and level for a thread",
                "operationId": "getThreadMaturity",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Thread maturity data",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/MaturityResult"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Thread not found"}
                }
            }
        },
        "/threads/{thread_id}/maturity/recompute": {
            "post": {
                "tags": ["Thread Maturity"],
                "summary": "Force recompute maturity",
                "description": "Force a fresh maturity computation (ignores cache)",
                "operationId": "recomputeMaturity",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Recomputed maturity",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/MaturityResult"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"}
                }
            }
        },
        
        # =====================================================================
        # THREAD LOBBY
        # =====================================================================
        "/threads/{thread_id}/lobby": {
            "get": {
                "tags": ["Thread Lobby"],
                "summary": "Get thread lobby data",
                "description": "Retrieve all data needed for the thread lobby entry UI",
                "operationId": "getThreadLobby",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "Thread lobby data",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/ThreadLobbyData"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Thread not found"}
                }
            }
        },
        
        # =====================================================================
        # XR RENDERING
        # =====================================================================
        "/xr/threads/{thread_id}/preflight": {
            "get": {
                "tags": ["XR Rendering"],
                "summary": "XR preflight check",
                "description": "Check if XR is available and get requirements",
                "operationId": "getXRPreflight",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "responses": {
                    "200": {
                        "description": "XR preflight data",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/XRPreflightData"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"}
                }
            }
        },
        "/xr/threads/{thread_id}/blueprint": {
            "get": {
                "tags": ["XR Rendering"],
                "summary": "Generate XR blueprint",
                "description": """
Generate the XR environment blueprint for a thread.

**Important**: The XR environment is a PROJECTION of the Thread data.
It is read-only. All modifications must go through Thread events.
(R&D Rule: XR = Projection, Thread = Source of Truth)
                """,
                "operationId": "getXRBlueprint",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "template",
                        "in": "query",
                        "description": "XR template to use",
                        "schema": {
                            "type": "string",
                            "enum": ["personal_room", "business_room", "cause_room", "lab_room", "custom_room"],
                            "default": "personal_room"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "XR blueprint",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/XRBlueprint"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "404": {"description": "Thread not found"}
                }
            }
        },
        "/xr/threads/{thread_id}/actions/{action_id}": {
            "patch": {
                "tags": ["XR Rendering"],
                "summary": "Update action from XR",
                "description": """
Update an action's status via XR interface.

**Note**: This creates a ThreadEvent, not a direct modification.
XR interactions are translated to events.
                """,
                "operationId": "updateActionFromXR",
                "parameters": [
                    {
                        "name": "thread_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    },
                    {
                        "name": "action_id",
                        "in": "path",
                        "required": True,
                        "schema": {"type": "string", "format": "uuid"}
                    }
                ],
                "requestBody": {
                    "required": True,
                    "content": {
                        "application/json": {
                            "schema": {"$ref": "#/components/schemas/XRActionUpdatePayload"}
                        }
                    }
                },
                "responses": {
                    "200": {
                        "description": "Action updated (event created)",
                        "content": {
                            "application/json": {
                                "schema": {"$ref": "#/components/schemas/ThreadEvent"}
                            }
                        }
                    },
                    "403": {"$ref": "#/components/responses/IdentityBoundaryViolation"},
                    "423": {"$ref": "#/components/responses/CheckpointRequired"}
                }
            }
        }
    },
    "components": {
        "schemas": {
            # =====================================================================
            # GOVERNANCE SCHEMAS
            # =====================================================================
            "GovernanceSignal": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "thread_id": {"type": "string", "format": "uuid"},
                    "event_id": {"type": "string", "format": "uuid"},
                    "level": {
                        "type": "string",
                        "enum": ["WARN", "CORRECT", "PAUSE", "BLOCK", "ESCALATE"]
                    },
                    "criterion": {
                        "type": "string",
                        "enum": ["CANON_GUARD", "SECURITY_GUARD", "BUDGET_GUARD", "RATE_LIMITER", "ESCALATION_TRIGGER"]
                    },
                    "message": {"type": "string"},
                    "details": {"type": "object"},
                    "patch_instruction": {
                        "oneOf": [
                            {"$ref": "#/components/schemas/PatchInstruction"},
                            {"type": "null"}
                        ]
                    },
                    "created_at": {"type": "string", "format": "date-time"}
                }
            },
            "PatchInstruction": {
                "type": "object",
                "properties": {
                    "field": {"type": "string"},
                    "action": {"type": "string", "enum": ["set", "merge", "delete"]},
                    "value": {},
                    "reason": {"type": "string"}
                }
            },
            "GovernanceSignalList": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/GovernanceSignal"}
                    },
                    "total": {"type": "integer"}
                }
            },
            "BacklogItem": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "thread_id": {"type": "string", "format": "uuid"},
                    "identity_id": {"type": "string", "format": "uuid"},
                    "backlog_type": {
                        "type": "string",
                        "enum": ["error", "signal", "decision", "cost", "governance_debt"]
                    },
                    "severity": {
                        "type": "string",
                        "enum": ["low", "medium", "high", "critical"]
                    },
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "context": {"type": "object"},
                    "source_spec": {"type": "string"},
                    "status": {
                        "type": "string",
                        "enum": ["open", "in_progress", "resolved", "wont_fix", "duplicate"]
                    },
                    "resolution": {"type": "string", "nullable": True},
                    "fed_to_policy_tuner": {"type": "boolean"},
                    "created_at": {"type": "string", "format": "date-time"},
                    "created_by": {"type": "string"},
                    "updated_at": {"type": "string", "format": "date-time"}
                }
            },
            "BacklogItemCreate": {
                "type": "object",
                "required": ["thread_id", "backlog_type", "severity", "title", "description"],
                "properties": {
                    "thread_id": {"type": "string", "format": "uuid"},
                    "backlog_type": {"type": "string"},
                    "severity": {"type": "string"},
                    "title": {"type": "string"},
                    "description": {"type": "string"},
                    "context": {"type": "object"},
                    "source_spec": {"type": "string"}
                }
            },
            "BacklogList": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/BacklogItem"}
                    },
                    "total": {"type": "integer"}
                }
            },
            "Checkpoint": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "thread_id": {"type": "string", "format": "uuid"},
                    "event_id": {"type": "string", "format": "uuid"},
                    "type": {
                        "type": "string",
                        "enum": ["cost", "governance", "identity", "sensitive"]
                    },
                    "reason": {"type": "string"},
                    "status": {
                        "type": "string",
                        "enum": ["pending", "approved", "rejected"]
                    },
                    "requires_approval": {"type": "boolean"},
                    "details": {"type": "object"},
                    "created_at": {"type": "string", "format": "date-time"},
                    "created_by": {"type": "string"}
                }
            },
            "CheckpointResponse": {
                "type": "object",
                "properties": {
                    "checkpoint_id": {"type": "string", "format": "uuid"},
                    "status": {"type": "string"},
                    "approved_at": {"type": "string", "format": "date-time"},
                    "approved_by": {"type": "string", "format": "uuid"},
                    "rejected_at": {"type": "string", "format": "date-time"},
                    "rejected_by": {"type": "string", "format": "uuid"},
                    "rejection_reason": {"type": "string"}
                }
            },
            "CheckpointList": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/Checkpoint"}
                    },
                    "total": {"type": "integer"}
                }
            },
            
            # =====================================================================
            # MATURITY SCHEMAS
            # =====================================================================
            "MaturitySignals": {
                "type": "object",
                "properties": {
                    "has_founding_intent": {"type": "boolean"},
                    "has_decisions": {"type": "boolean"},
                    "has_actions": {"type": "boolean"},
                    "has_notes": {"type": "boolean"},
                    "has_links": {"type": "boolean"},
                    "has_summaries": {"type": "boolean"},
                    "has_memory_compressed": {"type": "boolean"},
                    "total_events": {"type": "integer"},
                    "days_active": {"type": "integer"},
                    "has_xr_blueprint": {"type": "boolean"}
                }
            },
            "MaturityResult": {
                "type": "object",
                "properties": {
                    "thread_id": {"type": "string", "format": "uuid"},
                    "score": {"type": "integer", "minimum": 0, "maximum": 100},
                    "level": {
                        "type": "integer",
                        "description": "0=Seed, 1=Sprout, 2=Workshop, 3=Studio, 4=Org, 5=Ecosystem"
                    },
                    "signals": {"$ref": "#/components/schemas/MaturitySignals"},
                    "computed_at": {"type": "string", "format": "date-time"},
                    "stale_after": {"type": "string", "format": "date-time"}
                }
            },
            
            # =====================================================================
            # XR SCHEMAS
            # =====================================================================
            "XRPreflightData": {
                "type": "object",
                "properties": {
                    "thread_id": {"type": "string", "format": "uuid"},
                    "is_available": {"type": "boolean"},
                    "maturity_level": {"type": "integer"},
                    "visible_zones": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "enabled_features": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "requirements": {
                        "type": "object",
                        "properties": {
                            "webxr_supported": {"type": "boolean"},
                            "min_maturity": {"type": "integer"},
                            "permissions_granted": {"type": "boolean"}
                        }
                    },
                    "unavailable_reason": {"type": "string"},
                    "estimated_load_time_ms": {"type": "integer"}
                }
            },
            "XRBlueprint": {
                "type": "object",
                "properties": {
                    "thread_id": {"type": "string", "format": "uuid"},
                    "template": {"type": "string"},
                    "zones": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/BlueprintZone"}
                    },
                    "portals": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/ThreadPortal"}
                    },
                    "generated_at": {"type": "string", "format": "date-time"},
                    "source_snapshot_version": {"type": "integer"}
                }
            },
            "BlueprintZone": {
                "type": "object",
                "properties": {
                    "zone_type": {"type": "string"},
                    "enabled": {"type": "boolean"},
                    "items": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/BlueprintItem"}
                    }
                }
            },
            "BlueprintItem": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "kind": {"type": "string"},
                    "label": {"type": "string"},
                    "data": {"type": "object"},
                    "redacted": {"type": "boolean"}
                }
            },
            "ThreadPortal": {
                "type": "object",
                "properties": {
                    "target_thread_id": {"type": "string", "format": "uuid"},
                    "label": {"type": "string"},
                    "link_type": {"type": "string"}
                }
            },
            "XRActionUpdatePayload": {
                "type": "object",
                "properties": {
                    "status": {
                        "type": "string",
                        "enum": ["in_progress", "completed", "cancelled"]
                    },
                    "notes": {"type": "string"}
                }
            },
            
            # =====================================================================
            # THREAD LOBBY SCHEMAS
            # =====================================================================
            "ThreadLobbyData": {
                "type": "object",
                "properties": {
                    "thread_id": {"type": "string", "format": "uuid"},
                    "thread_title": {"type": "string"},
                    "thread_type": {"type": "string"},
                    "sphere_id": {"type": "string", "format": "uuid"},
                    "sphere_name": {"type": "string"},
                    "founding_intent": {"type": "string"},
                    "maturity": {"$ref": "#/components/schemas/MaturityResult"},
                    "summary": {"type": "string", "nullable": True},
                    "last_activity": {"type": "string", "format": "date-time"},
                    "is_live": {"type": "boolean"},
                    "live_participants": {"type": "integer"},
                    "mode_recommendation": {"$ref": "#/components/schemas/ModeRecommendation"},
                    "viewer_role": {"type": "string"}
                }
            },
            "ModeRecommendation": {
                "type": "object",
                "properties": {
                    "recommended_mode": {
                        "type": "string",
                        "enum": ["chat", "live", "xr"]
                    },
                    "available_modes": {
                        "type": "array",
                        "items": {"type": "string"}
                    },
                    "reasons": {"type": "object"}
                }
            },
            
            # =====================================================================
            # COMMON SCHEMAS
            # =====================================================================
            "ThreadEvent": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "thread_id": {"type": "string", "format": "uuid"},
                    "event_type": {"type": "string"},
                    "payload": {"type": "object"},
                    "created_at": {"type": "string", "format": "date-time"},
                    "created_by": {"type": "string", "format": "uuid"}
                }
            },
            "DecisionList": {
                "type": "object",
                "properties": {
                    "items": {
                        "type": "array",
                        "items": {"$ref": "#/components/schemas/OrchestratorDecision"}
                    },
                    "total": {"type": "integer"}
                }
            },
            "OrchestratorDecision": {
                "type": "object",
                "properties": {
                    "id": {"type": "string", "format": "uuid"},
                    "thread_id": {"type": "string", "format": "uuid"},
                    "event_id": {"type": "string", "format": "uuid"},
                    "decision": {"type": "string"},
                    "reason": {"type": "string"},
                    "qct_result": {"type": "object"},
                    "ses_result": {"type": "object"},
                    "rdc_result": {"type": "object"},
                    "checkpoint_id": {"type": "string", "format": "uuid", "nullable": True},
                    "created_at": {"type": "string", "format": "date-time"}
                }
            }
        },
        "responses": {
            "IdentityBoundaryViolation": {
                "description": "Identity boundary violation - cannot access resource owned by another identity",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "error": {"type": "string", "example": "identity_boundary_violation"},
                                "message": {"type": "string"},
                                "requested_identity": {"type": "string", "format": "uuid"},
                                "resource_identity": {"type": "string", "format": "uuid"}
                            }
                        }
                    }
                }
            },
            "CheckpointRequired": {
                "description": "Checkpoint required - action blocked pending human approval",
                "content": {
                    "application/json": {
                        "schema": {
                            "type": "object",
                            "properties": {
                                "status": {"type": "string", "example": "checkpoint_pending"},
                                "checkpoint": {"$ref": "#/components/schemas/Checkpoint"}
                            }
                        }
                    }
                }
            }
        },
        "securitySchemes": {
            "bearerAuth": {
                "type": "http",
                "scheme": "bearer",
                "bearerFormat": "JWT"
            }
        }
    },
    "security": [
        {"bearerAuth": []}
    ]
}


def get_openapi_spec() -> dict:
    """Return the OpenAPI specification dictionary."""
    return GOVERNANCE_XR_OPENAPI


def export_openapi_yaml(filepath: str) -> None:
    """Export OpenAPI spec to YAML file."""
    import yaml
    with open(filepath, 'w') as f:
        yaml.dump(GOVERNANCE_XR_OPENAPI, f, default_flow_style=False, allow_unicode=True)


def export_openapi_json(filepath: str) -> None:
    """Export OpenAPI spec to JSON file."""
    import json
    with open(filepath, 'w') as f:
        json.dump(GOVERNANCE_XR_OPENAPI, f, indent=2)


if __name__ == "__main__":
    # Export both formats
    export_openapi_json("governance_xr_openapi.json")
    print("✅ Exported governance_xr_openapi.json")
