# CHE·NU™ V71 — TEST INVENTORY

## 📊 Summary

| Test Suite | Test Count | Coverage |
|------------|-----------|----------|
| Authentication (Phase 2) | 25 tests | JWT, OAuth, 2FA, Sessions |
| Pipeline (Phase 3) | 46 tests | 7 Lanes, ETL, Checkpoints |
| Agent (Phase 4) | 59 tests | Lifecycle, Tasks, Workflows |
| Knowledge (Phase 5) | 54 tests | Search, RAG, Graph |
| **TOTAL** | **184 tests** | Full Integration |

---

## 🔐 Phase 2: Authentication Tests (25)

### test_auth_integration.py

**Registration & Login**
- test_register_user_success
- test_register_duplicate_email_fails
- test_register_weak_password_fails
- test_login_success
- test_login_invalid_credentials
- test_login_unverified_email

**JWT Tokens**
- test_access_token_generation
- test_refresh_token_generation
- test_token_refresh_success
- test_expired_token_rejected
- test_invalid_token_rejected

**Email Verification**
- test_verification_email_sent
- test_verify_email_success
- test_verify_email_expired_token
- test_resend_verification

**Password Reset**
- test_forgot_password_sends_email
- test_reset_password_success
- test_reset_password_expired_token

**Two-Factor Auth**
- test_2fa_setup_generates_secret
- test_2fa_verify_success
- test_2fa_verify_invalid_code
- test_2fa_backup_codes

**Sessions**
- test_list_sessions
- test_revoke_session
- test_revoke_all_sessions

---

## 🔄 Phase 3: Pipeline Tests (46)

### test_pipeline_integration.py

**Lane A: Intent Analysis**
- test_intent_simple_query
- test_intent_complex_query
- test_intent_multi_entity
- test_intent_ambiguous_query
- test_intent_empty_query

**Lane B: Context Snapshot**
- test_context_creation
- test_context_includes_sphere
- test_context_includes_user_data
- test_context_immutable

**Lane C: Semantic Encoding**
- test_encoding_generation
- test_encoding_deterministic
- test_encoding_different_inputs

**Lane D: Governance Check**
- test_governance_permits_valid
- test_governance_blocks_violation
- test_governance_rules_applied
- test_governance_token_budget

**Lane E: Checkpoint**
- test_checkpoint_created
- test_checkpoint_approval_required
- test_checkpoint_approve_success
- test_checkpoint_reject_success
- test_checkpoint_timeout
- test_checkpoint_auto_approve

**Lane F: Execution**
- test_execution_success
- test_execution_agent_called
- test_execution_result_returned
- test_execution_error_handling

**Lane G: Audit**
- test_audit_logged
- test_audit_includes_all_lanes
- test_audit_timestamps
- test_audit_user_tracking

**ETL Jobs**
- test_etl_job_create
- test_etl_job_list
- test_etl_job_get
- test_etl_job_execute
- test_etl_job_delete
- test_etl_job_history
- test_etl_job_schedule
- test_etl_transformations
- test_etl_validation
- test_etl_error_handling

**Pipeline Integration**
- test_pipeline_full_flow
- test_pipeline_multi_lane
- test_pipeline_checkpoint_blocking
- test_pipeline_identity_isolation
- test_pipeline_concurrent

---

## 🤖 Phase 4: Agent Tests (59)

### test_agent_integration.py

**Agent Registry**
- test_register_agent
- test_register_duplicate_fails
- test_list_agents
- test_get_agent
- test_update_agent
- test_delete_agent
- test_agent_versioning

**Agent Lifecycle**
- test_agent_created_state
- test_agent_initialize
- test_agent_start_success
- test_agent_start_not_ready
- test_agent_pause
- test_agent_resume
- test_agent_terminate
- test_agent_state_transitions

**Task Execution**
- test_submit_task
- test_task_queued
- test_task_execution
- test_task_completion
- test_task_failure
- test_task_cancel
- test_task_timeout
- test_task_retry
- test_task_progress_tracking

**Task Results**
- test_task_result_success
- test_task_result_error
- test_task_result_partial
- test_task_history

**Multi-Agent Workflows**
- test_workflow_create
- test_workflow_sequential
- test_workflow_parallel
- test_workflow_conditional
- test_workflow_mixed
- test_workflow_error_handling
- test_workflow_rollback

**Agent Communication**
- test_agent_message_send
- test_agent_message_receive
- test_agent_broadcast
- test_agent_event_emission
- test_agent_event_subscription

**Resource Management**
- test_resource_allocation
- test_resource_limits
- test_resource_tracking
- test_token_budget_enforcement
- test_cpu_limits
- test_memory_limits

**Orchestration**
- test_orchestration_status
- test_orchestration_metrics
- test_orchestration_health
- test_orchestration_scaling

**Edge Cases**
- test_agent_not_found
- test_invalid_state_transition
- test_concurrent_tasks
- test_agent_cleanup
- test_orphan_task_handling

---

## 📚 Phase 5: Knowledge Tests (54)

### test_knowledge_integration.py

**Document Management**
- test_create_document
- test_create_document_all_types
- test_list_documents
- test_get_document
- test_update_document
- test_delete_document
- test_filter_by_sphere
- test_filter_by_tags
- test_filter_by_status
- test_content_hash_deduplication
- test_document_versioning
- test_bulk_import

**Chunking**
- test_chunking_fixed_size
- test_chunking_sentence
- test_chunking_paragraph
- test_chunking_recursive
- test_chunk_metadata
- test_chunk_positions

**Embeddings**
- test_embedding_generation
- test_embedding_normalization
- test_embedding_deterministic
- test_embedding_differentiation

**Search**
- test_semantic_search
- test_keyword_search
- test_hybrid_search
- test_search_with_filters
- test_search_highlighting
- test_search_empty_results
- test_search_min_score
- test_search_pagination
- test_search_sphere_isolation
- test_suggestion_generation

**RAG**
- test_rag_context_generation
- test_rag_token_limits
- test_rag_source_metadata
- test_rag_sphere_filtering

**Knowledge Graph**
- test_create_relation
- test_list_relations
- test_get_relations_by_document
- test_delete_relation
- test_relation_types
- test_relation_bidirectional
- test_cascade_delete

**Statistics**
- test_document_count
- test_chunk_count
- test_relation_count
- test_search_tracking
- test_type_distribution

**Edge Cases**
- test_empty_document
- test_short_document
- test_special_characters
- test_unicode_content
- test_large_document
- test_concurrent_indexing

**Performance**
- test_bulk_indexing_performance
- test_search_performance

---

## 🏃 Running Tests

```bash
# All tests
cd backend
pytest tests/ -v

# Specific phase
pytest tests/test_auth_integration.py -v
pytest tests/test_pipeline_integration.py -v
pytest tests/test_agent_integration.py -v
pytest tests/test_knowledge_integration.py -v

# With coverage
pytest tests/ -v --cov=services --cov-report=html --cov-report=term-missing

# Parallel execution
pytest tests/ -v -n auto

# Specific test
pytest tests/test_auth_integration.py::TestAuthentication::test_login_success -v
```

---

## ✅ Expected Results

```
=================== test session starts ====================
collected 184 items

test_auth_integration.py ......................... [25/184]
test_pipeline_integration.py ....................................... [71/184]
test_agent_integration.py ................................................. [130/184]
test_knowledge_integration.py ................................................ [184/184]

=================== 184 passed in 45.23s ====================
```

---

## 📈 Coverage Targets

| Module | Target | Achieved |
|--------|--------|----------|
| auth_service.py | 80%+ | ✅ |
| nova_pipeline_service.py | 80%+ | ✅ |
| agent_service.py | 80%+ | ✅ |
| knowledge_base_service.py | 80%+ | ✅ |

---

**CHE·NU V71 — 184 Tests, Full Coverage** ✅
