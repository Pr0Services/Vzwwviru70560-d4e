# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU™ V76 — OPA GOVERNANCE POLICIES
# ═══════════════════════════════════════════════════════════════════════════════
# Open Policy Agent (OPA) Rego policies for R&D Rules enforcement
#
# Usage:
#   opa eval --data governance.rego --input request.json "data.chenu.allow"
#
# Deploy:
#   opa run --server --addr :8181 governance.rego
# ═══════════════════════════════════════════════════════════════════════════════

package chenu

import future.keywords.if
import future.keywords.in
import future.keywords.contains

# ═══════════════════════════════════════════════════════════════════════════════
# DEFAULT DENY
# ═══════════════════════════════════════════════════════════════════════════════

default allow := false
default denial_reason := "unknown"

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #1: HUMAN SOVEREIGNTY (CHECKPOINTS)
# ═══════════════════════════════════════════════════════════════════════════════

# Actions requiring checkpoint approval
checkpoint_required_actions := {
    # Destructive actions
    "delete_thread",
    "delete_dataspace",
    "delete_file",
    "delete_meeting",
    "delete_workspace",
    "delete_identity",
    "purge_memory",
    
    # Archive actions
    "archive_thread",
    "archive_dataspace",
    
    # Transfer actions
    "transfer_ownership",
    "transfer_identity",
    
    # Agent actions (L2+)
    "agent_execute_l2",
    "agent_execute_l3",
    "fire_agent",
    
    # External actions
    "send_external",
    "publish_content",
    "export_dataspace",
    
    # Decision actions
    "critical_decision",
    "major_decision",
    
    # Bulk operations
    "bulk_delete",
    "bulk_archive",
    "permanent_delete",
    
    # ORIGIN module
    "create_causal_link",
    "create_bio_evolution_medium",
    "create_bio_evolution_strong",
    "create_legacy_mystery",
    "validate_origin_node"
}

# Check if action requires checkpoint
requires_checkpoint if {
    input.action in checkpoint_required_actions
}

# Check if checkpoint is valid
checkpoint_valid if {
    input.checkpoint.status == "approved"
    not checkpoint_expired
}

checkpoint_expired if {
    time.parse_rfc3339_ns(input.checkpoint.expires_at) < time.now_ns()
}

# R&D Rule #1 violation
rule1_violation if {
    requires_checkpoint
    not checkpoint_valid
}

rule1_http_status := 423 if rule1_violation

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #3: IDENTITY BOUNDARY
# ═══════════════════════════════════════════════════════════════════════════════

# Check identity boundary
identity_boundary_ok if {
    input.user_id == input.resource_owner_id
}

# Allow admin read/audit across boundaries
identity_boundary_ok if {
    input.user_role == "admin"
    input.action in {"read", "audit", "list"}
}

# R&D Rule #3 violation
rule3_violation if {
    not identity_boundary_ok
}

rule3_http_status := 403 if rule3_violation

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #4: NO AI-TO-AI ORCHESTRATION
# ═══════════════════════════════════════════════════════════════════════════════

# Blocked agent-to-agent actions
blocked_ai_actions := {
    "call_agent",
    "chain_agents",
    "orchestrate_agents",
    "delegate_to_agent",
    "spawn_agent"
}

# R&D Rule #4 violation - AI calling AI
rule4_violation if {
    input.caller_type == "agent"
    input.action in blocked_ai_actions
}

rule4_violation if {
    input.caller_type == "agent"
    input.target_type == "agent"
}

rule4_http_status := 403 if rule4_violation

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #7: FROZEN ARCHITECTURE
# ═══════════════════════════════════════════════════════════════════════════════

# 9 Valid sphere types (FROZEN)
valid_sphere_types := {
    "personal",
    "business",
    "government",
    "creative_studio",
    "community",
    "social_media",
    "entertainment",
    "my_team",
    "scholar"
}

# 6 Valid bureau sections (FROZEN)
valid_bureau_sections := {
    "quick_capture",
    "resume_workspace",
    "threads",
    "data_files",
    "active_agents",
    "meetings"
}

# Validate sphere type
sphere_type_valid if {
    input.sphere_type in valid_sphere_types
}

# Validate bureau sections (max 6)
bureau_sections_valid if {
    count(input.bureau_sections) <= 6
}

# Validate all sections are valid types
all_sections_valid if {
    every section in input.bureau_sections {
        section in valid_bureau_sections
    }
}

# R&D Rule #7 violation
rule7_violation if {
    input.action == "create_sphere"
    not sphere_type_valid
}

rule7_violation if {
    input.action in {"create_workspace", "update_workspace"}
    not bureau_sections_valid
}

rule7_violation if {
    input.action in {"create_workspace", "update_workspace"}
    not all_sections_valid
}

rule7_http_status := 400 if rule7_violation

# ═══════════════════════════════════════════════════════════════════════════════
# ORIGIN MODULE: CAUSAL VALIDATION
# ═══════════════════════════════════════════════════════════════════════════════

# Anti-anachronism check
chronology_valid if {
    input.trigger_date_int <= input.result_date_int
}

chronology_valid if {
    input.trigger_date_int == null
}

chronology_valid if {
    input.result_date_int == null
}

# Evidence validation for bio-evolution
evidence_valid if {
    input.claim_strength == "weak"
}

evidence_valid if {
    input.claim_strength == "medium"
    count(input.evidence_sources) >= 1
}

evidence_valid if {
    input.claim_strength == "strong"
    count(input.evidence_sources) >= 2
}

# Origin causal link violation
origin_chronology_violation if {
    input.action == "create_causal_link"
    not chronology_valid
}

origin_evidence_violation if {
    input.action in {"create_bio_evolution_medium", "create_bio_evolution_strong"}
    not evidence_valid
}

origin_http_status := 400 if origin_chronology_violation
origin_http_status := 400 if origin_evidence_violation

# ═══════════════════════════════════════════════════════════════════════════════
# FINAL DECISION
# ═══════════════════════════════════════════════════════════════════════════════

# Allow if no violations
allow if {
    not rule1_violation
    not rule3_violation
    not rule4_violation
    not rule7_violation
    not origin_chronology_violation
    not origin_evidence_violation
}

# Determine denial reason
denial_reason := "checkpoint_required" if rule1_violation
denial_reason := "identity_boundary_violation" if rule3_violation
denial_reason := "ai_to_ai_blocked" if rule4_violation
denial_reason := "architecture_frozen" if rule7_violation
denial_reason := "chronology_violation" if origin_chronology_violation
denial_reason := "evidence_required" if origin_evidence_violation

# HTTP status code
http_status := 200 if allow
http_status := rule1_http_status if rule1_violation
http_status := rule3_http_status if rule3_violation
http_status := rule4_http_status if rule4_violation
http_status := rule7_http_status if rule7_violation
http_status := origin_http_status if origin_chronology_violation
http_status := origin_http_status if origin_evidence_violation

# ═══════════════════════════════════════════════════════════════════════════════
# AUDIT HELPERS
# ═══════════════════════════════════════════════════════════════════════════════

# Generate audit log entry
audit_entry := {
    "timestamp": time.now_ns(),
    "action": input.action,
    "user_id": input.user_id,
    "resource_type": input.resource_type,
    "resource_id": input.resource_id,
    "allowed": allow,
    "denial_reason": denial_reason,
    "http_status": http_status,
    "rules_evaluated": [
        {"rule": "R1_HUMAN_SOVEREIGNTY", "violated": rule1_violation},
        {"rule": "R3_IDENTITY_BOUNDARY", "violated": rule3_violation},
        {"rule": "R4_NO_AI_TO_AI", "violated": rule4_violation},
        {"rule": "R7_FROZEN_ARCHITECTURE", "violated": rule7_violation}
    ]
}

# ═══════════════════════════════════════════════════════════════════════════════
# POLICY METADATA
# ═══════════════════════════════════════════════════════════════════════════════

policy_version := "1.0.0"
policy_name := "CHE·NU R&D Governance"
policy_description := "Enforcement of 7 R&D Rules for CHE·NU platform"

rules_enforced := {
    "R1": "Human Sovereignty - Checkpoint required for sensitive actions",
    "R3": "Identity Boundary - Users can only access their own data",
    "R4": "No AI-to-AI - Agents cannot orchestrate other agents",
    "R7": "Frozen Architecture - 9 spheres, 6 bureau sections"
}
