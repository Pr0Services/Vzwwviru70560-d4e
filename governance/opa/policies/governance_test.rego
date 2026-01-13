# ═══════════════════════════════════════════════════════════════════════════════
# CHE·NU™ V76 — OPA POLICY TESTS
# ═══════════════════════════════════════════════════════════════════════════════
# Test cases for OPA governance policies
#
# Run: opa test ./opa/policies -v
# ═══════════════════════════════════════════════════════════════════════════════

package chenu_test

import future.keywords.if
import data.chenu

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #1: CHECKPOINT TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_checkpoint_required_for_delete if {
    chenu.requires_checkpoint with input as {
        "action": "delete_dataspace"
    }
}

test_checkpoint_required_for_archive if {
    chenu.requires_checkpoint with input as {
        "action": "archive_thread"
    }
}

test_checkpoint_required_for_agent_l2 if {
    chenu.requires_checkpoint with input as {
        "action": "agent_execute_l2"
    }
}

test_no_checkpoint_for_read if {
    not chenu.requires_checkpoint with input as {
        "action": "read_thread"
    }
}

test_allow_with_approved_checkpoint if {
    chenu.allow with input as {
        "action": "delete_dataspace",
        "user_id": "user-1",
        "resource_owner_id": "user-1",
        "checkpoint": {
            "status": "approved",
            "expires_at": "2099-12-31T23:59:59Z"
        },
        "caller_type": "human"
    }
}

test_deny_without_checkpoint if {
    not chenu.allow with input as {
        "action": "delete_dataspace",
        "user_id": "user-1",
        "resource_owner_id": "user-1",
        "checkpoint": null
    }
}

test_deny_with_pending_checkpoint if {
    not chenu.allow with input as {
        "action": "delete_dataspace",
        "user_id": "user-1",
        "resource_owner_id": "user-1",
        "checkpoint": {
            "status": "pending",
            "expires_at": "2099-12-31T23:59:59Z"
        }
    }
}

test_http_423_without_checkpoint if {
    chenu.http_status == 423 with input as {
        "action": "delete_file",
        "user_id": "user-1",
        "resource_owner_id": "user-1"
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #3: IDENTITY BOUNDARY TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_allow_own_resource if {
    chenu.identity_boundary_ok with input as {
        "user_id": "user-1",
        "resource_owner_id": "user-1"
    }
}

test_deny_other_resource if {
    not chenu.identity_boundary_ok with input as {
        "user_id": "user-1",
        "resource_owner_id": "user-2"
    }
}

test_http_403_for_boundary_violation if {
    chenu.http_status == 403 with input as {
        "action": "read_thread",
        "user_id": "user-1",
        "resource_owner_id": "user-2",
        "caller_type": "human"
    }
}

test_admin_can_audit_across_boundary if {
    chenu.identity_boundary_ok with input as {
        "user_id": "admin-1",
        "resource_owner_id": "user-2",
        "user_role": "admin",
        "action": "audit"
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #4: NO AI-TO-AI TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_block_agent_calling_agent if {
    chenu.rule4_violation with input as {
        "caller_type": "agent",
        "action": "call_agent"
    }
}

test_block_agent_to_agent_communication if {
    chenu.rule4_violation with input as {
        "caller_type": "agent",
        "target_type": "agent",
        "action": "send_message"
    }
}

test_allow_human_to_agent if {
    not chenu.rule4_violation with input as {
        "caller_type": "human",
        "target_type": "agent",
        "action": "execute"
    }
}

test_http_403_for_ai_to_ai if {
    chenu.http_status == 403 with input as {
        "action": "call_agent",
        "user_id": "user-1",
        "resource_owner_id": "user-1",
        "caller_type": "agent"
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# R&D RULE #7: FROZEN ARCHITECTURE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_valid_sphere_type if {
    chenu.sphere_type_valid with input as {
        "sphere_type": "personal"
    }
}

test_invalid_sphere_type if {
    not chenu.sphere_type_valid with input as {
        "sphere_type": "invalid_type"
    }
}

test_valid_bureau_sections_count if {
    chenu.bureau_sections_valid with input as {
        "bureau_sections": ["quick_capture", "threads", "meetings"]
    }
}

test_too_many_bureau_sections if {
    not chenu.bureau_sections_valid with input as {
        "bureau_sections": ["a", "b", "c", "d", "e", "f", "g"]
    }
}

test_all_sections_valid if {
    chenu.all_sections_valid with input as {
        "bureau_sections": ["quick_capture", "threads", "meetings"]
    }
}

test_invalid_section_name if {
    not chenu.all_sections_valid with input as {
        "bureau_sections": ["invalid_section"]
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# ORIGIN MODULE TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_chronology_valid if {
    chenu.chronology_valid with input as {
        "trigger_date_int": 1769,
        "result_date_int": 1850
    }
}

test_chronology_invalid if {
    not chenu.chronology_valid with input as {
        "trigger_date_int": 2000,
        "result_date_int": 1500
    }
}

test_evidence_weak_ok if {
    chenu.evidence_valid with input as {
        "claim_strength": "weak",
        "evidence_sources": []
    }
}

test_evidence_medium_needs_1 if {
    chenu.evidence_valid with input as {
        "claim_strength": "medium",
        "evidence_sources": ["source1"]
    }
}

test_evidence_medium_fails_0 if {
    not chenu.evidence_valid with input as {
        "claim_strength": "medium",
        "evidence_sources": []
    }
}

test_evidence_strong_needs_2 if {
    chenu.evidence_valid with input as {
        "claim_strength": "strong",
        "evidence_sources": ["source1", "source2"]
    }
}

test_evidence_strong_fails_1 if {
    not chenu.evidence_valid with input as {
        "claim_strength": "strong",
        "evidence_sources": ["source1"]
    }
}

# ═══════════════════════════════════════════════════════════════════════════════
# INTEGRATION TESTS
# ═══════════════════════════════════════════════════════════════════════════════

test_full_allowed_request if {
    chenu.allow with input as {
        "action": "read_thread",
        "user_id": "user-1",
        "resource_owner_id": "user-1",
        "caller_type": "human",
        "sphere_type": "personal",
        "bureau_sections": ["threads"]
    }
}

test_audit_entry_generated if {
    entry := chenu.audit_entry with input as {
        "action": "delete_file",
        "user_id": "user-1",
        "resource_type": "file",
        "resource_id": "file-123",
        "resource_owner_id": "user-1"
    }
    entry.action == "delete_file"
    entry.user_id == "user-1"
    entry.allowed == false  # No checkpoint
}
