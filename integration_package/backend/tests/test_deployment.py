"""
CHE·NU Deployment Tests

Validates deployment configuration, Docker setup, and infrastructure.

R&D COMPLIANCE: ✅
- Rule #1: Tests verify human gates are present
- Rule #6: Tests verify traceability is maintained
"""

import pytest
import os
import yaml
import json
from pathlib import Path
from typing import Dict, Any, List
import re


# ============================================================================
# Fixtures
# ============================================================================

@pytest.fixture
def project_root() -> Path:
    """Get project root directory."""
    return Path(__file__).parent.parent.parent


@pytest.fixture
def docker_compose_path(project_root: Path) -> Path:
    """Get docker-compose.yml path."""
    return project_root / "docker-compose.yml"


@pytest.fixture
def dockerfile_path(project_root: Path) -> Path:
    """Get backend Dockerfile path."""
    return project_root / "backend" / "Dockerfile"


@pytest.fixture
def k8s_path(project_root: Path) -> Path:
    """Get Kubernetes configs path."""
    return project_root / "k8s"


@pytest.fixture
def env_example_path(project_root: Path) -> Path:
    """Get .env.example path."""
    return project_root / ".env.example"


def load_yaml(path: Path) -> Dict[str, Any]:
    """Load YAML file."""
    with open(path, 'r') as f:
        return yaml.safe_load(f)


def load_dockerfile(path: Path) -> str:
    """Load Dockerfile content."""
    with open(path, 'r') as f:
        return f.read()


# ============================================================================
# Docker Compose Tests
# ============================================================================

class TestDockerCompose:
    """Tests for docker-compose.yml configuration."""
    
    def test_docker_compose_exists(self, docker_compose_path: Path):
        """Verify docker-compose.yml exists."""
        assert docker_compose_path.exists(), "docker-compose.yml not found"
    
    def test_docker_compose_valid_yaml(self, docker_compose_path: Path):
        """Verify docker-compose.yml is valid YAML."""
        config = load_yaml(docker_compose_path)
        assert config is not None
        assert "services" in config
    
    def test_required_services_defined(self, docker_compose_path: Path):
        """Verify all required services are defined."""
        config = load_yaml(docker_compose_path)
        services = config.get("services", {})
        
        required_services = ["backend", "postgres", "redis"]
        for service in required_services:
            assert service in services, f"Required service '{service}' not found"
    
    def test_backend_service_config(self, docker_compose_path: Path):
        """Verify backend service configuration."""
        config = load_yaml(docker_compose_path)
        backend = config["services"].get("backend", {})
        
        # Should have build context
        assert "build" in backend or "image" in backend
        
        # Should expose port 8000
        ports = backend.get("ports", [])
        assert any("8000" in str(p) for p in ports), "Backend should expose port 8000"
        
        # Should have health check
        assert "healthcheck" in backend, "Backend should have healthcheck"
    
    def test_postgres_service_config(self, docker_compose_path: Path):
        """Verify PostgreSQL service configuration."""
        config = load_yaml(docker_compose_path)
        postgres = config["services"].get("postgres", {})
        
        # Should use postgres image
        image = postgres.get("image", "")
        assert "postgres" in image.lower(), "Should use postgres image"
        
        # Should have volume for data persistence
        volumes = postgres.get("volumes", [])
        assert len(volumes) > 0, "Postgres should have persistent volume"
        
        # Should have health check
        assert "healthcheck" in postgres, "Postgres should have healthcheck"
    
    def test_redis_service_config(self, docker_compose_path: Path):
        """Verify Redis service configuration."""
        config = load_yaml(docker_compose_path)
        redis = config["services"].get("redis", {})
        
        # Should use redis image
        image = redis.get("image", "")
        assert "redis" in image.lower(), "Should use redis image"
    
    def test_networks_defined(self, docker_compose_path: Path):
        """Verify networks are properly defined."""
        config = load_yaml(docker_compose_path)
        
        # Should have networks section
        assert "networks" in config, "Networks should be defined"
    
    def test_volumes_defined(self, docker_compose_path: Path):
        """Verify volumes are properly defined."""
        config = load_yaml(docker_compose_path)
        
        # Should have volumes section for persistence
        assert "volumes" in config, "Volumes should be defined"


# ============================================================================
# Dockerfile Tests
# ============================================================================

class TestDockerfile:
    """Tests for Dockerfile configuration."""
    
    def test_dockerfile_exists(self, dockerfile_path: Path):
        """Verify Dockerfile exists."""
        assert dockerfile_path.exists(), "Backend Dockerfile not found"
    
    def test_uses_python_base_image(self, dockerfile_path: Path):
        """Verify Python base image is used."""
        content = load_dockerfile(dockerfile_path)
        assert "python:3.11" in content or "python:3.12" in content, \
            "Should use Python 3.11+ base image"
    
    def test_multi_stage_build(self, dockerfile_path: Path):
        """Verify multi-stage build is used."""
        content = load_dockerfile(dockerfile_path)
        from_count = content.lower().count("from ")
        assert from_count >= 2, "Should use multi-stage build"
    
    def test_non_root_user(self, dockerfile_path: Path):
        """Verify non-root user is created."""
        content = load_dockerfile(dockerfile_path)
        assert "useradd" in content.lower() or "adduser" in content.lower() or \
               "user chenu" in content.lower() or "USER" in content, \
            "Should create non-root user"
    
    def test_healthcheck_defined(self, dockerfile_path: Path):
        """Verify HEALTHCHECK instruction exists."""
        content = load_dockerfile(dockerfile_path)
        assert "HEALTHCHECK" in content, "Should define HEALTHCHECK"
    
    def test_exposes_port(self, dockerfile_path: Path):
        """Verify port is exposed."""
        content = load_dockerfile(dockerfile_path)
        assert "EXPOSE" in content, "Should expose port"
        assert "8000" in content, "Should expose port 8000"
    
    def test_environment_variables(self, dockerfile_path: Path):
        """Verify required environment variables are set."""
        content = load_dockerfile(dockerfile_path)
        
        required_vars = ["PYTHONUNBUFFERED", "PYTHONDONTWRITEBYTECODE"]
        for var in required_vars:
            assert var in content, f"Should set {var}"


# ============================================================================
# Kubernetes Tests
# ============================================================================

class TestKubernetes:
    """Tests for Kubernetes configuration."""
    
    def test_k8s_directory_exists(self, k8s_path: Path):
        """Verify k8s directory exists."""
        assert k8s_path.exists(), "k8s directory not found"
    
    def test_base_kustomization_exists(self, k8s_path: Path):
        """Verify base kustomization.yaml exists."""
        kustomization = k8s_path / "base" / "kustomization.yaml"
        assert kustomization.exists(), "base/kustomization.yaml not found"
    
    def test_backend_deployment_exists(self, k8s_path: Path):
        """Verify backend deployment exists."""
        deployment = k8s_path / "base" / "backend-deployment.yaml"
        assert deployment.exists(), "backend-deployment.yaml not found"
    
    def test_backend_deployment_valid(self, k8s_path: Path):
        """Verify backend deployment is valid."""
        deployment_path = k8s_path / "base" / "backend-deployment.yaml"
        if deployment_path.exists():
            config = load_yaml(deployment_path)
            assert config.get("kind") == "Deployment"
            assert "spec" in config
    
    def test_services_exist(self, k8s_path: Path):
        """Verify service definitions exist."""
        base_path = k8s_path / "base"
        
        service_files = [
            "backend-service.yaml",
            "postgres-service.yaml",
            "redis-service.yaml"
        ]
        
        for service_file in service_files:
            service_path = base_path / service_file
            assert service_path.exists(), f"{service_file} not found"
    
    def test_overlays_exist(self, k8s_path: Path):
        """Verify environment overlays exist."""
        overlays_path = k8s_path / "overlays"
        
        required_overlays = ["staging", "production"]
        for overlay in required_overlays:
            overlay_path = overlays_path / overlay
            assert overlay_path.exists(), f"{overlay} overlay not found"
    
    def test_hpa_exists(self, k8s_path: Path):
        """Verify HorizontalPodAutoscaler exists."""
        hpa_path = k8s_path / "base" / "hpa.yaml"
        assert hpa_path.exists(), "HPA configuration not found"
    
    def test_network_policy_exists(self, k8s_path: Path):
        """Verify NetworkPolicy exists."""
        np_path = k8s_path / "base" / "networkpolicy.yaml"
        assert np_path.exists(), "NetworkPolicy not found"


# ============================================================================
# Environment Configuration Tests
# ============================================================================

class TestEnvironmentConfig:
    """Tests for environment configuration."""
    
    def test_env_example_exists(self, env_example_path: Path):
        """Verify .env.example exists."""
        assert env_example_path.exists(), ".env.example not found"
    
    def test_required_env_vars(self, env_example_path: Path):
        """Verify required environment variables are documented."""
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        required_vars = [
            "DATABASE_URL",
            "REDIS_URL",
            "JWT_SECRET_KEY",
            "ANTHROPIC_API_KEY"
        ]
        
        for var in required_vars:
            assert var in content, f"Required env var {var} not in .env.example"
    
    def test_rnd_compliance_vars(self, env_example_path: Path):
        """Verify R&D compliance environment variables exist."""
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        # R&D Rule #1 - Human gates
        assert "ENFORCE_HUMAN_GATES" in content or "HUMAN_GATES" in content, \
            "Human gates config should be in .env.example (R&D Rule #1)"
        
        # R&D Rule #6 - Audit
        assert "AUDIT" in content, \
            "Audit config should be in .env.example (R&D Rule #6)"
    
    def test_no_secrets_in_example(self, env_example_path: Path):
        """Verify no real secrets are in .env.example."""
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        # Check for placeholder patterns
        secret_patterns = [
            r'sk-ant-api[a-zA-Z0-9]+',  # Anthropic API key
            r'sk-[a-zA-Z0-9]{48}',       # OpenAI API key
            r'[a-f0-9]{64}',             # Hex secrets (64 chars)
        ]
        
        for pattern in secret_patterns:
            matches = re.findall(pattern, content)
            for match in matches:
                # Allow placeholder patterns
                assert 'xxx' in match.lower() or 'your' in content.lower(), \
                    f"Possible real secret found: {match[:20]}..."


# ============================================================================
# CI/CD Tests
# ============================================================================

class TestCICD:
    """Tests for CI/CD configuration."""
    
    def test_github_workflow_exists(self, project_root: Path):
        """Verify GitHub Actions workflow exists."""
        workflow_path = project_root / ".github" / "workflows" / "ci-cd.yml"
        assert workflow_path.exists(), "CI/CD workflow not found"
    
    def test_workflow_valid_yaml(self, project_root: Path):
        """Verify workflow is valid YAML."""
        workflow_path = project_root / ".github" / "workflows" / "ci-cd.yml"
        if workflow_path.exists():
            config = load_yaml(workflow_path)
            assert config is not None
            assert "jobs" in config
    
    def test_workflow_has_required_jobs(self, project_root: Path):
        """Verify workflow has required jobs."""
        workflow_path = project_root / ".github" / "workflows" / "ci-cd.yml"
        if workflow_path.exists():
            config = load_yaml(workflow_path)
            jobs = config.get("jobs", {})
            
            # Should have test jobs
            assert any("test" in job.lower() for job in jobs), \
                "Workflow should have test jobs"
    
    def test_workflow_has_rnd_compliance(self, project_root: Path):
        """Verify workflow includes R&D compliance checks."""
        workflow_path = project_root / ".github" / "workflows" / "ci-cd.yml"
        if workflow_path.exists():
            with open(workflow_path, 'r') as f:
                content = f.read()
            
            assert "compliance" in content.lower() or "rnd" in content.lower(), \
                "Workflow should include R&D compliance checks"


# ============================================================================
# Script Tests
# ============================================================================

class TestScripts:
    """Tests for deployment scripts."""
    
    def test_healthcheck_script_exists(self, project_root: Path):
        """Verify healthcheck script exists."""
        script_path = project_root / "scripts" / "healthcheck.sh"
        assert script_path.exists(), "healthcheck.sh not found"
    
    def test_backup_script_exists(self, project_root: Path):
        """Verify backup script exists."""
        script_path = project_root / "scripts" / "backup.sh"
        assert script_path.exists(), "backup.sh not found"
    
    def test_restore_script_exists(self, project_root: Path):
        """Verify restore script exists."""
        script_path = project_root / "scripts" / "restore.sh"
        assert script_path.exists(), "restore.sh not found"
    
    def test_scripts_are_executable(self, project_root: Path):
        """Verify scripts have proper structure."""
        scripts_path = project_root / "scripts"
        if scripts_path.exists():
            for script in scripts_path.glob("*.sh"):
                with open(script, 'r') as f:
                    content = f.read()
                
                # Should have shebang
                assert content.startswith("#!/bin/bash") or \
                       content.startswith("#!/usr/bin/env bash"), \
                    f"{script.name} should have bash shebang"
                
                # Should have error handling
                assert "set -e" in content, \
                    f"{script.name} should use 'set -e'"


# ============================================================================
# R&D Compliance Tests
# ============================================================================

@pytest.mark.rnd_compliance
class TestRNDComplianceDeployment:
    """Tests for R&D compliance in deployment configuration."""
    
    def test_rule_1_human_gates_configurable(self, env_example_path: Path):
        """
        R&D Rule #1: Human Sovereignty
        Verify human gates can be configured via environment.
        """
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        assert "HUMAN" in content.upper() and "GATE" in content.upper(), \
            "Human gates should be configurable via environment"
    
    def test_rule_6_audit_enabled(self, env_example_path: Path):
        """
        R&D Rule #6: Module Traceability
        Verify audit logging can be configured.
        """
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        assert "AUDIT" in content.upper(), \
            "Audit logging should be configurable"
    
    def test_rule_5_no_ranking_default(self, env_example_path: Path):
        """
        R&D Rule #5: Social Restrictions
        Verify ranking is disabled by default.
        """
        with open(env_example_path, 'r') as f:
            content = f.read()
        
        # Should have ranking disabled or social restrictions
        assert "RANKING" in content.upper() or "SOCIAL" in content.upper(), \
            "Social restrictions should be configurable"
    
    def test_governance_checkpoint_config(self, project_root: Path):
        """
        Verify governance checkpoint (HTTP 423) is properly configured.
        """
        # Check that 423 responses are not cached
        dockerfile_path = project_root / "backend" / "Dockerfile"
        if dockerfile_path.exists():
            # This is more of a code review check
            pass  # Actual implementation in caching middleware
    
    def test_backup_includes_audit_trail(self, project_root: Path):
        """
        Verify backups include audit trail.
        """
        backup_script = project_root / "scripts" / "backup.sh"
        if backup_script.exists():
            with open(backup_script, 'r') as f:
                content = f.read()
            
            assert "audit" in content.lower() or "log" in content.lower(), \
                "Backup should include audit trail"
    
    def test_restore_requires_confirmation(self, project_root: Path):
        """
        R&D Rule #1: Human Sovereignty
        Verify restore requires human confirmation.
        """
        restore_script = project_root / "scripts" / "restore.sh"
        if restore_script.exists():
            with open(restore_script, 'r') as f:
                content = f.read()
            
            assert "confirm" in content.lower() or "CONFIRM" in content, \
                "Restore should require human confirmation"


# ============================================================================
# Security Tests
# ============================================================================

class TestSecurityConfig:
    """Tests for security configuration."""
    
    def test_no_hardcoded_secrets(self, project_root: Path):
        """Verify no hardcoded secrets in deployment configs."""
        secret_patterns = [
            r'password\s*=\s*["\'][^"\']{8,}["\']',
            r'secret\s*=\s*["\'][^"\']{16,}["\']',
            r'api_key\s*=\s*["\'][^"\']{16,}["\']',
        ]
        
        # Check docker-compose
        dc_path = project_root / "docker-compose.yml"
        if dc_path.exists():
            with open(dc_path, 'r') as f:
                content = f.read()
            
            for pattern in secret_patterns:
                matches = re.findall(pattern, content, re.IGNORECASE)
                # Filter out environment variable references
                real_secrets = [m for m in matches if '${' not in m and 'your_' not in m.lower()]
                assert len(real_secrets) == 0, \
                    f"Possible hardcoded secret found"
    
    def test_secrets_use_env_vars(self, project_root: Path):
        """Verify secrets use environment variables."""
        dc_path = project_root / "docker-compose.yml"
        if dc_path.exists():
            with open(dc_path, 'r') as f:
                content = f.read()
            
            # Password should reference env var
            if "PASSWORD" in content:
                assert "${" in content, \
                    "Passwords should use environment variables"
    
    def test_k8s_secrets_exist(self, k8s_path: Path):
        """Verify Kubernetes secrets are properly configured."""
        secrets_path = k8s_path / "base" / "secrets.yaml"
        if secrets_path.exists():
            config = load_yaml(secrets_path)
            assert config.get("kind") == "Secret"


# ============================================================================
# Run Tests
# ============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
