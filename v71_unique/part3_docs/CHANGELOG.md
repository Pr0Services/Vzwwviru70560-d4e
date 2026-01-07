# 📝 Changelog

All notable changes to CHE·NU are documented here.

## [71.0.0] - 2026-01-07

### 🎉 Major Release: Thread System V2 & XR Integration

#### Added
- **Thread Service V2** - Complete rewrite with canonical compliance
  - Append-only event log
  - Single memory agent per thread
  - Permission-based redaction
  - Correction system (append-only)
  
- **XR Environment Generator**
  - Projection-only architecture
  - 6 canonical zones
  - Template selection system
  - Blueprint caching
  
- **Nova Pipeline**
  - 7-lane execution model
  - HTTP 423 checkpoint system
  - Governance enforcement
  
- **UIKit V71**
  - 15 core components
  - Dark/light theme
  - Accessibility (ARIA)
  
- **Authentication System**
  - JWT with refresh tokens
  - Identity boundary enforcement
  - HTTP 403 on violations

#### Changed
- Migrated from Thread V1 to V2
- Updated all API endpoints to /api/v2
- Improved error handling

#### Fixed
- Memory agent duplication issue
- Permission escalation vulnerability
- XR state persistence bug

#### Security
- Identity boundary enforcement
- Rate limiting on all endpoints
- Input validation strengthened

### Migration Guide

```python
# V1 (deprecated)
thread.edit_event(event_id, new_data)

# V2 (canonical)
thread.append_correction(
    original_event_id=event_id,
    correction="Updated data",
    reason="Error correction"
)
```

---

## [70.0.0] - 2025-12-15

### Added
- Initial Thread V1 implementation
- Basic agent system
- Frontend scaffold

---

Format: [Semantic Versioning](https://semver.org/)
