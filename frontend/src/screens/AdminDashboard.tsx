/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — ADMIN DASHBOARD                                       ║
 * ║              System Configuration & Cloud Management                         ║
 * ║              GOUVERNANCE > EXÉCUTION                                         ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 * 
 * Complete admin dashboard for:
 * - Cloud service configuration
 * - User management
 * - System monitoring
 * - Deployment tools
 */

import React, { useState, useEffect, useCallback } from 'react';

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════════

type CloudProvider = 'aws' | 'gcp' | 'azure' | 'vercel' | 'railway' | 'render' | 'self_hosted';
type DatabaseType = 'postgresql' | 'mysql' | 'supabase' | 'planetscale' | 'neon';
type StorageProvider = 's3' | 'gcs' | 'azure_blob' | 'cloudflare_r2' | 'minio' | 'local';
type AuthProvider = 'internal' | 'auth0' | 'clerk' | 'supabase_auth' | 'firebase' | 'keycloak';
type AIProvider = 'openai' | 'anthropic' | 'azure_openai' | 'cohere' | 'local_llm';

interface DatabaseConfig {
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl_mode: string;
  pool_size: number;
}

interface StorageConfig {
  provider: StorageProvider;
  bucket_name: string;
  region?: string;
  access_key?: string;
  secret_key?: string;
  endpoint_url?: string;
}

interface AuthConfig {
  provider: AuthProvider;
  domain?: string;
  client_id?: string;
  client_secret?: string;
  api_key?: string;
  jwt_expiry_hours: number;
}

interface AIConfig {
  provider: AIProvider;
  api_key: string;
  model: string;
  max_tokens: number;
  temperature: number;
}

interface CloudConfig {
  provider: CloudProvider;
  database: DatabaseConfig;
  storage: StorageConfig;
  auth: AuthConfig;
  ai: AIConfig;
  redis_url?: string;
  environment: 'development' | 'staging' | 'production';
}

interface ConnectionStatus {
  service: string;
  status: 'success' | 'error' | 'testing' | 'not_tested';
  message: string;
  latency_ms?: number;
}

interface SystemMetrics {
  requests_total: number;
  active_users: number;
  token_usage: { total_allocated: number; total_used: number; remaining: number };
  storage: { used_gb: number; limit_gb: number };
}

type AdminTab = 'overview' | 'database' | 'storage' | 'auth' | 'ai' | 'users' | 'deploy' | 'logs';

interface AdminDashboardProps {
  apiUrl?: string;
  onClose?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COLORS
// ═══════════════════════════════════════════════════════════════════════════════

const COLORS = {
  bgPrimary: '#0D1117',
  bgSurface: '#1E1F22',
  bgElevated: '#2D2D30',
  bgHover: '#3D3D40',
  sacredGold: '#D8B26A',
  cenoteTurquoise: '#3EB4A2',
  jungleEmerald: '#3F7249',
  earthEmber: '#7A593A',
  textPrimary: '#E9E4D6',
  textSecondary: '#8D8371',
  error: '#EF4444',
  success: '#22C55E',
  warning: '#F59E0B',
  border: '#333333',
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════════

export function AdminDashboard({ apiUrl = '/api', onClose }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // System state
  const [systemStatus, setSystemStatus] = useState<'healthy' | 'degraded' | 'error' | 'not_configured'>('not_configured');
  const [connectionStatuses, setConnectionStatuses] = useState<Record<string, ConnectionStatus>>({});
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null);
  
  // Configuration state
  const [cloudConfig, setCloudConfig] = useState<CloudConfig>({
    provider: 'self_hosted',
    database: {
      type: 'postgresql',
      host: 'localhost',
      port: 5432,
      database: 'chenu_db',
      username: '',
      password: '',
      ssl_mode: 'require',
      pool_size: 10,
    },
    storage: {
      provider: 'local',
      bucket_name: 'chenu-storage',
    },
    auth: {
      provider: 'internal',
      jwt_expiry_hours: 24,
    },
    ai: {
      provider: 'anthropic',
      api_key: '',
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      temperature: 0.7,
    },
    environment: 'development',
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // API CALLS
  // ═══════════════════════════════════════════════════════════════════════════

  const fetchSystemStatus = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/status`);
      const data = await response.json();
      setSystemStatus(data.status);
      setConnectionStatuses(data.services || {});
    } catch (e) {
      logger.error('Failed to fetch status:', e);
    }
  }, [apiUrl]);

  const fetchMetrics = useCallback(async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/metrics`);
      const data = await response.json();
      setMetrics(data.metrics);
    } catch (e) {
      logger.error('Failed to fetch metrics:', e);
    }
  }, [apiUrl]);

  const testConnection = async (service: 'database' | 'storage' | 'ai') => {
    setConnectionStatuses(prev => ({
      ...prev,
      [service]: { service, status: 'testing', message: 'Testing connection...' }
    }));

    try {
      const configMap = {
        database: cloudConfig.database,
        storage: cloudConfig.storage,
        ai: cloudConfig.ai,
      };

      const response = await fetch(`${apiUrl}/admin/test/${service}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(configMap[service]),
      });
      
      const result = await response.json();
      setConnectionStatuses(prev => ({
        ...prev,
        [service]: result
      }));
    } catch (e) {
      setConnectionStatuses(prev => ({
        ...prev,
        [service]: { service, status: 'error', message: `Test failed: ${e}` }
      }));
    }
  };

  const saveConfiguration = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${apiUrl}/admin/setup/init`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          admin: {
            first_name: localStorage.getItem('chenu-admin-firstname') || 'Admin',
            last_name: localStorage.getItem('chenu-admin-lastname') || 'User',
            email: localStorage.getItem('chenu-admin-email') || 'admin@example.com',
            password: 'temp_password_change_me', // In production, prompt for this
            organization_name: localStorage.getItem('chenu-org-name') || 'CHE·NU Organization',
            language: 'fr',
          },
          cloud: cloudConfig,
          features: {
            nova_enabled: true,
            agents_enabled: true,
            xr_enabled: false,
            analytics_enabled: true,
            audit_log_enabled: true,
            governance_strict: true,
          }
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setSuccessMessage('Configuration saved successfully!');
        localStorage.setItem('chenu-api-key', data.api_key);
        fetchSystemStatus();
      } else {
        setError(data.detail || 'Failed to save configuration');
      }
    } catch (e) {
      setError(`Error: ${e}`);
    } finally {
      setIsLoading(false);
    }
  };

  const generateEnvFile = async () => {
    try {
      const response = await fetch(`${apiUrl}/admin/deploy/generate-env`, { method: 'POST' });
      const data = await response.json();
      
      // Download as file
      const blob = new Blob([data.env_content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = data.filename;
      a.click();
      URL.revokeObjectURL(url);
      
      setSuccessMessage('Environment file downloaded!');
    } catch (e) {
      setError(`Failed to generate env file: ${e}`);
    }
  };

  // Load initial data
  useEffect(() => {
    fetchSystemStatus();
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, [fetchSystemStatus, fetchMetrics]);

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER HELPERS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      success: COLORS.success,
      healthy: COLORS.success,
      error: COLORS.error,
      degraded: COLORS.warning,
      warning: COLORS.warning,
      testing: COLORS.cenoteTurquoise,
      not_tested: COLORS.textSecondary,
      not_configured: COLORS.textSecondary,
    };
    
    return (
      <span style={{
        padding: '4px 8px',
        borderRadius: 4,
        fontSize: 11,
        fontWeight: 600,
        backgroundColor: `${colors[status] || COLORS.textSecondary}22`,
        color: colors[status] || COLORS.textSecondary,
        textTransform: 'uppercase',
      }}>
        {status.replace('_', ' ')}
      </span>
    );
  };

  const renderInput = (
    label: string,
    value: string | number,
    onChange: (value: string) => void,
    type: string = 'text',
    placeholder?: string
  ) => (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={styles.input}
      />
    </div>
  );

  const renderSelect = (
    label: string,
    value: string,
    options: { value: string; label: string }[],
    onChange: (value: string) => void
  ) => (
    <div style={styles.formGroup}>
      <label style={styles.label}>{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={styles.select}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // TAB CONTENT RENDERERS
  // ═══════════════════════════════════════════════════════════════════════════

  const renderOverview = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>System Overview</h2>
      
      {/* Status Cards */}
      <div style={styles.statusGrid}>
        <div style={styles.statusCard}>
          <div style={styles.statusCardHeader}>
            <span style={styles.statusIcon}>🌐</span>
            <span>System Status</span>
          </div>
          {renderStatusBadge(systemStatus)}
        </div>
        
        <div style={styles.statusCard}>
          <div style={styles.statusCardHeader}>
            <span style={styles.statusIcon}>🗄️</span>
            <span>Database</span>
          </div>
          {renderStatusBadge(connectionStatuses.database?.status || 'not_tested')}
        </div>
        
        <div style={styles.statusCard}>
          <div style={styles.statusCardHeader}>
            <span style={styles.statusIcon}>📦</span>
            <span>Storage</span>
          </div>
          {renderStatusBadge(connectionStatuses.storage?.status || 'not_tested')}
        </div>
        
        <div style={styles.statusCard}>
          <div style={styles.statusCardHeader}>
            <span style={styles.statusIcon}>🤖</span>
            <span>AI Service</span>
          </div>
          {renderStatusBadge(connectionStatuses.ai?.status || 'not_tested')}
        </div>
      </div>

      {/* Metrics */}
      {metrics && (
        <div style={styles.metricsSection}>
          <h3 style={styles.subsectionTitle}>Metrics</h3>
          <div style={styles.metricsGrid}>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{metrics.active_users}</div>
              <div style={styles.metricLabel}>Active Users</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{metrics.requests_total.toLocaleString()}</div>
              <div style={styles.metricLabel}>Total Requests</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>
                {Math.round((metrics.token_usage.total_used / metrics.token_usage.total_allocated) * 100)}%
              </div>
              <div style={styles.metricLabel}>Token Usage</div>
            </div>
            <div style={styles.metricCard}>
              <div style={styles.metricValue}>{metrics.storage.used_gb.toFixed(1)} GB</div>
              <div style={styles.metricLabel}>Storage Used</div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div style={styles.quickActions}>
        <h3 style={styles.subsectionTitle}>Quick Actions</h3>
        <div style={styles.actionButtons}>
          <button style={styles.actionButton} onClick={() => setActiveTab('database')}>
            Configure Database
          </button>
          <button style={styles.actionButton} onClick={() => setActiveTab('ai')}>
            Setup AI Service
          </button>
          <button style={styles.actionButton} onClick={() => setActiveTab('deploy')}>
            Generate Deploy Files
          </button>
        </div>
      </div>
    </div>
  );

  const renderDatabaseConfig = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>Database Configuration</h2>
      
      <div style={styles.formGrid}>
        {renderSelect('Database Type', cloudConfig.database.type, [
          { value: 'postgresql', label: 'PostgreSQL' },
          { value: 'mysql', label: 'MySQL' },
          { value: 'supabase', label: 'Supabase' },
          { value: 'planetscale', label: 'PlanetScale' },
          { value: 'neon', label: 'Neon' },
        ], (v) => setCloudConfig(prev => ({ 
          ...prev, 
          database: { ...prev.database, type: v as DatabaseType } 
        })))}
        
        {renderInput('Host', cloudConfig.database.host, (v) => 
          setCloudConfig(prev => ({ ...prev, database: { ...prev.database, host: v } }))
        , 'text', 'localhost or db.example.com')}
        
        {renderInput('Port', cloudConfig.database.port, (v) => 
          setCloudConfig(prev => ({ ...prev, database: { ...prev.database, port: parseInt(v) || 5432 } }))
        , 'number')}
        
        {renderInput('Database Name', cloudConfig.database.database, (v) => 
          setCloudConfig(prev => ({ ...prev, database: { ...prev.database, database: v } }))
        , 'text', 'chenu_db')}
        
        {renderInput('Username', cloudConfig.database.username, (v) => 
          setCloudConfig(prev => ({ ...prev, database: { ...prev.database, username: v } }))
        )}
        
        {renderInput('Password', cloudConfig.database.password, (v) => 
          setCloudConfig(prev => ({ ...prev, database: { ...prev.database, password: v } }))
        , 'password')}
        
        {renderSelect('SSL Mode', cloudConfig.database.ssl_mode, [
          { value: 'require', label: 'Require' },
          { value: 'verify-full', label: 'Verify Full' },
          { value: 'prefer', label: 'Prefer' },
          { value: 'disable', label: 'Disable' },
        ], (v) => setCloudConfig(prev => ({ 
          ...prev, 
          database: { ...prev.database, ssl_mode: v } 
        })))}
      </div>
      
      <div style={styles.testSection}>
        <button 
          style={styles.testButton} 
          onClick={() => testConnection('database')}
          disabled={!cloudConfig.database.host || !cloudConfig.database.username}
        >
          Test Connection
        </button>
        {connectionStatuses.database && (
          <div style={styles.testResult}>
            {renderStatusBadge(connectionStatuses.database.status)}
            <span style={{ marginLeft: 8 }}>{connectionStatuses.database.message}</span>
            {connectionStatuses.database.latency_ms && (
              <span style={styles.latency}>{connectionStatuses.database.latency_ms.toFixed(0)}ms</span>
            )}
          </div>
        )}
      </div>
    </div>
  );

  const renderStorageConfig = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>Storage Configuration</h2>
      
      <div style={styles.formGrid}>
        {renderSelect('Storage Provider', cloudConfig.storage.provider, [
          { value: 's3', label: 'Amazon S3' },
          { value: 'gcs', label: 'Google Cloud Storage' },
          { value: 'azure_blob', label: 'Azure Blob Storage' },
          { value: 'cloudflare_r2', label: 'Cloudflare R2' },
          { value: 'minio', label: 'MinIO (Self-hosted)' },
          { value: 'local', label: 'Local Storage' },
        ], (v) => setCloudConfig(prev => ({ 
          ...prev, 
          storage: { ...prev.storage, provider: v as StorageProvider } 
        })))}
        
        {renderInput('Bucket Name', cloudConfig.storage.bucket_name, (v) => 
          setCloudConfig(prev => ({ ...prev, storage: { ...prev.storage, bucket_name: v } }))
        , 'text', 'my-chenu-bucket')}
        
        {cloudConfig.storage.provider !== 'local' && (
          <>
            {renderInput('Region', cloudConfig.storage.region || '', (v) => 
              setCloudConfig(prev => ({ ...prev, storage: { ...prev.storage, region: v } }))
            , 'text', 'us-east-1')}
            
            {renderInput('Access Key', cloudConfig.storage.access_key || '', (v) => 
              setCloudConfig(prev => ({ ...prev, storage: { ...prev.storage, access_key: v } }))
            )}
            
            {renderInput('Secret Key', cloudConfig.storage.secret_key || '', (v) => 
              setCloudConfig(prev => ({ ...prev, storage: { ...prev.storage, secret_key: v } }))
            , 'password')}
          </>
        )}
      </div>
      
      <div style={styles.testSection}>
        <button style={styles.testButton} onClick={() => testConnection('storage')}>
          Test Connection
        </button>
        {connectionStatuses.storage && (
          <div style={styles.testResult}>
            {renderStatusBadge(connectionStatuses.storage.status)}
            <span style={{ marginLeft: 8 }}>{connectionStatuses.storage.message}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderAuthConfig = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>Authentication Configuration</h2>
      
      <div style={styles.formGrid}>
        {renderSelect('Auth Provider', cloudConfig.auth.provider, [
          { value: 'internal', label: 'Internal (JWT)' },
          { value: 'auth0', label: 'Auth0' },
          { value: 'clerk', label: 'Clerk' },
          { value: 'supabase_auth', label: 'Supabase Auth' },
          { value: 'firebase', label: 'Firebase Auth' },
          { value: 'keycloak', label: 'Keycloak' },
        ], (v) => setCloudConfig(prev => ({ 
          ...prev, 
          auth: { ...prev.auth, provider: v as AuthProvider } 
        })))}
        
        {cloudConfig.auth.provider !== 'internal' && (
          <>
            {renderInput('Domain', cloudConfig.auth.domain || '', (v) => 
              setCloudConfig(prev => ({ ...prev, auth: { ...prev.auth, domain: v } }))
            , 'text', 'your-tenant.auth0.com')}
            
            {renderInput('Client ID', cloudConfig.auth.client_id || '', (v) => 
              setCloudConfig(prev => ({ ...prev, auth: { ...prev.auth, client_id: v } }))
            )}
            
            {renderInput('Client Secret', cloudConfig.auth.client_secret || '', (v) => 
              setCloudConfig(prev => ({ ...prev, auth: { ...prev.auth, client_secret: v } }))
            , 'password')}
          </>
        )}
        
        {renderInput('JWT Expiry (hours)', cloudConfig.auth.jwt_expiry_hours, (v) => 
          setCloudConfig(prev => ({ ...prev, auth: { ...prev.auth, jwt_expiry_hours: parseInt(v) || 24 } }))
        , 'number')}
      </div>
      
      <div style={styles.infoBox}>
        <span style={styles.infoIcon}>ℹ️</span>
        <p>
          {cloudConfig.auth.provider === 'internal' 
            ? 'Internal auth uses JWT tokens. A secure secret will be generated automatically.'
            : 'External auth providers handle user management. Configure callback URLs in their dashboard.'}
        </p>
      </div>
    </div>
  );

  const renderAIConfig = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>AI Service Configuration</h2>
      
      <div style={styles.formGrid}>
        {renderSelect('AI Provider', cloudConfig.ai.provider, [
          { value: 'anthropic', label: 'Anthropic (Claude)' },
          { value: 'openai', label: 'OpenAI (GPT)' },
          { value: 'azure_openai', label: 'Azure OpenAI' },
          { value: 'cohere', label: 'Cohere' },
          { value: 'local_llm', label: 'Local LLM (Ollama)' },
        ], (v) => setCloudConfig(prev => ({ 
          ...prev, 
          ai: { ...prev.ai, provider: v as AIProvider } 
        })))}
        
        {renderInput('API Key', cloudConfig.ai.api_key, (v) => 
          setCloudConfig(prev => ({ ...prev, ai: { ...prev.ai, api_key: v } }))
        , 'password', 'sk-...')}
        
        {renderSelect('Model', cloudConfig.ai.model, 
          cloudConfig.ai.provider === 'anthropic' 
            ? [
                { value: 'claude-3-opus-20240229', label: 'Claude 3 Opus' },
                { value: 'claude-3-sonnet-20240229', label: 'Claude 3 Sonnet' },
                { value: 'claude-3-haiku-20240307', label: 'Claude 3 Haiku' },
              ]
            : [
                { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
                { value: 'gpt-4', label: 'GPT-4' },
                { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
              ],
          (v) => setCloudConfig(prev => ({ ...prev, ai: { ...prev.ai, model: v } }))
        )}
        
        {renderInput('Max Tokens', cloudConfig.ai.max_tokens, (v) => 
          setCloudConfig(prev => ({ ...prev, ai: { ...prev.ai, max_tokens: parseInt(v) || 4096 } }))
        , 'number')}
        
        {renderInput('Temperature', cloudConfig.ai.temperature, (v) => 
          setCloudConfig(prev => ({ ...prev, ai: { ...prev.ai, temperature: parseFloat(v) || 0.7 } }))
        , 'number')}
      </div>
      
      <div style={styles.testSection}>
        <button 
          style={styles.testButton} 
          onClick={() => testConnection('ai')}
          disabled={!cloudConfig.ai.api_key}
        >
          Test Connection
        </button>
        {connectionStatuses.ai && (
          <div style={styles.testResult}>
            {renderStatusBadge(connectionStatuses.ai.status)}
            <span style={{ marginLeft: 8 }}>{connectionStatuses.ai.message}</span>
          </div>
        )}
      </div>
    </div>
  );

  const renderUsersTab = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>User Management</h2>
      
      <div style={styles.userList}>
        <div style={styles.userCard}>
          <div style={styles.userAvatar}>👤</div>
          <div style={styles.userInfo}>
            <div style={styles.userName}>
              {localStorage.getItem('chenu-admin-firstname')} {localStorage.getItem('chenu-admin-lastname')}
            </div>
            <div style={styles.userEmail}>{localStorage.getItem('chenu-admin-email')}</div>
          </div>
          <span style={styles.roleBadge}>Super Admin</span>
        </div>
      </div>
      
      <button style={styles.addButton}>
        + Add User
      </button>
    </div>
  );

  const renderDeployTab = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>Deployment Tools</h2>
      
      <div style={styles.deployCards}>
        <div style={styles.deployCard}>
          <div style={styles.deployCardIcon}>📄</div>
          <h3>Environment File</h3>
          <p>Generate .env file with all configuration variables</p>
          <button style={styles.deployButton} onClick={generateEnvFile}>
            Download .env
          </button>
        </div>
        
        <div style={styles.deployCard}>
          <div style={styles.deployCardIcon}>🐳</div>
          <h3>Docker Compose</h3>
          <p>Generate docker-compose.yml for containerized deployment</p>
          <button style={styles.deployButton} onClick={() => {/* TODO */}}>
            Download docker-compose.yml
          </button>
        </div>
        
        <div style={styles.deployCard}>
          <div style={styles.deployCardIcon}>☁️</div>
          <h3>Cloud Deploy</h3>
          <p>One-click deployment to supported cloud providers</p>
          <button style={{...styles.deployButton, opacity: 0.5}} disabled>
            Coming Soon
          </button>
        </div>
      </div>
      
      <div style={styles.envPreview}>
        <h3 style={styles.subsectionTitle}>Current Configuration</h3>
        <pre style={styles.codeBlock}>
{`CHENU_ENV=${cloudConfig.environment}
DATABASE_TYPE=${cloudConfig.database.type}
DATABASE_HOST=${cloudConfig.database.host}
STORAGE_PROVIDER=${cloudConfig.storage.provider}
AUTH_PROVIDER=${cloudConfig.auth.provider}
AI_PROVIDER=${cloudConfig.ai.provider}
AI_MODEL=${cloudConfig.ai.model}`}
        </pre>
      </div>
    </div>
  );

  const renderLogsTab = () => (
    <div style={styles.tabContent}>
      <h2 style={styles.sectionTitle}>System Logs</h2>
      
      <div style={styles.logFilters}>
        <select style={styles.logFilter}>
          <option value="all">All Levels</option>
          <option value="error">Errors Only</option>
          <option value="warning">Warnings</option>
          <option value="info">Info</option>
        </select>
        <select style={styles.logFilter}>
          <option value="all">All Services</option>
          <option value="backend">Backend</option>
          <option value="frontend">Frontend</option>
          <option value="database">Database</option>
        </select>
      </div>
      
      <div style={styles.logContainer}>
        <div style={styles.logEntry}>
          <span style={styles.logTime}>{new Date().toISOString()}</span>
          <span style={{...styles.logLevel, color: COLORS.success}}>INFO</span>
          <span style={styles.logService}>backend</span>
          <span style={styles.logMessage}>System initialized successfully</span>
        </div>
      </div>
    </div>
  );

  // ═══════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  const tabs: { id: AdminTab; label: string; icon: string }[] = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'database', label: 'Database', icon: '🗄️' },
    { id: 'storage', label: 'Storage', icon: '📦' },
    { id: 'auth', label: 'Auth', icon: '🔐' },
    { id: 'ai', label: 'AI', icon: '🤖' },
    { id: 'users', label: 'Users', icon: '👥' },
    { id: 'deploy', label: 'Deploy', icon: '🚀' },
    { id: 'logs', label: 'Logs', icon: '📋' },
  ];

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <span style={styles.logo}>◆</span>
          <h1 style={styles.title}>CHE·NU Admin</h1>
          {renderStatusBadge(systemStatus)}
        </div>
        <div style={styles.headerRight}>
          <button style={styles.saveButton} onClick={saveConfiguration} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save Configuration'}
          </button>
          {onClose && (
            <button style={styles.closeButton} onClick={onClose}>×</button>
          )}
        </div>
      </header>

      {/* Messages */}
      {error && (
        <div style={styles.errorBanner}>{error}</div>
      )}
      {successMessage && (
        <div style={styles.successBanner}>
          {successMessage}
          <button onClick={() => setSuccessMessage(null)}>×</button>
        </div>
      )}

      {/* Main Content */}
      <div style={styles.main}>
        {/* Sidebar */}
        <nav style={styles.sidebar}>
          {tabs.map(tab => (
            <button
              key={tab.id}
              style={{
                ...styles.navItem,
                ...(activeTab === tab.id ? styles.navItemActive : {}),
              }}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={styles.navIcon}>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content */}
        <main style={styles.content}>
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'database' && renderDatabaseConfig()}
          {activeTab === 'storage' && renderStorageConfig()}
          {activeTab === 'auth' && renderAuthConfig()}
          {activeTab === 'ai' && renderAIConfig()}
          {activeTab === 'users' && renderUsersTab()}
          {activeTab === 'deploy' && renderDeployTab()}
          {activeTab === 'logs' && renderLogsTab()}
        </main>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// STYLES
// ═══════════════════════════════════════════════════════════════════════════════

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: '100vh',
    backgroundColor: COLORS.bgPrimary,
    color: COLORS.textPrimary,
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 24px',
    borderBottom: `1px solid ${COLORS.border}`,
    backgroundColor: COLORS.bgSurface,
  },
  headerLeft: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  headerRight: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
  },
  logo: {
    fontSize: 28,
    color: COLORS.sacredGold,
  },
  title: {
    fontSize: 20,
    fontWeight: 700,
    margin: 0,
    color: COLORS.textPrimary,
  },
  saveButton: {
    padding: '10px 20px',
    backgroundColor: COLORS.cenoteTurquoise,
    border: 'none',
    borderRadius: 6,
    color: '#000',
    fontWeight: 600,
    cursor: 'pointer',
  },
  closeButton: {
    width: 32,
    height: 32,
    backgroundColor: 'transparent',
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textSecondary,
    fontSize: 20,
    cursor: 'pointer',
  },
  main: {
    display: 'flex',
    minHeight: 'calc(100vh - 65px)',
  },
  sidebar: {
    width: 200,
    backgroundColor: COLORS.bgSurface,
    borderRight: `1px solid ${COLORS.border}`,
    padding: 12,
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    width: '100%',
    padding: '12px 16px',
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: 6,
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'left',
    cursor: 'pointer',
    marginBottom: 4,
  },
  navItemActive: {
    backgroundColor: COLORS.bgElevated,
    color: COLORS.sacredGold,
  },
  navIcon: {
    fontSize: 16,
  },
  content: {
    flex: 1,
    padding: 32,
    overflowY: 'auto',
  },
  tabContent: {
    maxWidth: 800,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 700,
    margin: 0,
    marginBottom: 24,
    color: COLORS.textPrimary,
  },
  subsectionTitle: {
    fontSize: 16,
    fontWeight: 600,
    margin: 0,
    marginBottom: 16,
    color: COLORS.textSecondary,
  },
  statusGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
    marginBottom: 32,
  },
  statusCard: {
    padding: 20,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
    border: `1px solid ${COLORS.border}`,
  },
  statusCardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    color: COLORS.textSecondary,
    fontSize: 14,
  },
  statusIcon: {
    fontSize: 18,
  },
  metricsSection: {
    marginBottom: 32,
  },
  metricsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 16,
  },
  metricCard: {
    padding: 20,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
    textAlign: 'center',
  },
  metricValue: {
    fontSize: 32,
    fontWeight: 700,
    color: COLORS.sacredGold,
  },
  metricLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  quickActions: {
    marginBottom: 32,
  },
  actionButtons: {
    display: 'flex',
    gap: 12,
  },
  actionButton: {
    padding: '12px 20px',
    backgroundColor: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textPrimary,
    cursor: 'pointer',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 20,
    marginBottom: 24,
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: 600,
    color: COLORS.textSecondary,
  },
  input: {
    padding: '10px 14px',
    backgroundColor: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textPrimary,
    fontSize: 14,
    outline: 'none',
  },
  select: {
    padding: '10px 14px',
    backgroundColor: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textPrimary,
    fontSize: 14,
    outline: 'none',
  },
  testSection: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 20,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
  },
  testButton: {
    padding: '10px 20px',
    backgroundColor: COLORS.bgElevated,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textPrimary,
    cursor: 'pointer',
  },
  testResult: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    color: COLORS.textSecondary,
  },
  latency: {
    color: COLORS.textSecondary,
    fontSize: 12,
    marginLeft: 8,
  },
  infoBox: {
    display: 'flex',
    gap: 12,
    padding: 16,
    backgroundColor: 'rgba(62, 180, 162, 0.1)',
    borderRadius: 8,
    marginTop: 24,
  },
  infoIcon: {
    fontSize: 20,
  },
  userList: {
    marginBottom: 24,
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 16,
    padding: 16,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
    marginBottom: 12,
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: '50%',
    backgroundColor: COLORS.bgElevated,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 24,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontWeight: 600,
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  roleBadge: {
    padding: '4px 10px',
    backgroundColor: COLORS.sacredGold + '22',
    color: COLORS.sacredGold,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: 600,
  },
  addButton: {
    padding: '12px 20px',
    backgroundColor: 'transparent',
    border: `1px dashed ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textSecondary,
    cursor: 'pointer',
    width: '100%',
  },
  deployCards: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: 20,
    marginBottom: 32,
  },
  deployCard: {
    padding: 24,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
    textAlign: 'center',
  },
  deployCardIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  deployButton: {
    padding: '10px 20px',
    backgroundColor: COLORS.cenoteTurquoise,
    border: 'none',
    borderRadius: 6,
    color: '#000',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: 16,
  },
  envPreview: {
    padding: 24,
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
  },
  codeBlock: {
    padding: 16,
    backgroundColor: COLORS.bgPrimary,
    borderRadius: 6,
    fontFamily: 'monospace',
    fontSize: 13,
    color: COLORS.cenoteTurquoise,
    overflow: 'auto',
  },
  logFilters: {
    display: 'flex',
    gap: 12,
    marginBottom: 16,
  },
  logFilter: {
    padding: '8px 12px',
    backgroundColor: COLORS.bgSurface,
    border: `1px solid ${COLORS.border}`,
    borderRadius: 6,
    color: COLORS.textPrimary,
  },
  logContainer: {
    backgroundColor: COLORS.bgSurface,
    borderRadius: 8,
    padding: 16,
    maxHeight: 400,
    overflow: 'auto',
  },
  logEntry: {
    display: 'flex',
    gap: 12,
    padding: '8px 0',
    borderBottom: `1px solid ${COLORS.border}`,
    fontFamily: 'monospace',
    fontSize: 12,
  },
  logTime: {
    color: COLORS.textSecondary,
    minWidth: 200,
  },
  logLevel: {
    fontWeight: 600,
    minWidth: 60,
  },
  logService: {
    color: COLORS.cenoteTurquoise,
    minWidth: 80,
  },
  logMessage: {
    color: COLORS.textPrimary,
  },
  errorBanner: {
    padding: 16,
    backgroundColor: COLORS.error + '22',
    borderBottom: `1px solid ${COLORS.error}`,
    color: COLORS.error,
    textAlign: 'center',
  },
  successBanner: {
    padding: 16,
    backgroundColor: COLORS.success + '22',
    borderBottom: `1px solid ${COLORS.success}`,
    color: COLORS.success,
    textAlign: 'center',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
};

export default AdminDashboard;
