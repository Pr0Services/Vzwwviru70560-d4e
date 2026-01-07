/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║              CHE·NU™ — BROWSER MODULE INDEX                                  ║
 * ║              Protocole chenu:// + Navigation                                 ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

export { CHENUBrowser } from './CHENUBrowser';
export { default as CHENUBrowserDefault } from './CHENUBrowser';

// ═══════════════════════════════════════════════════════════════════════════════
// POLITIQUE DE SÉCURITÉ CHE·NU BROWSER
// ═══════════════════════════════════════════════════════════════════════════════
/**
 * 🔒 RÈGLES DE SÉCURITÉ:
 * 
 * 1. chenu://  → AUTORISÉ (protocole interne, pas de réseau)
 * 2. https://  → AUTORISÉ (chiffré TLS/SSL)
 * 3. http://   → BLOQUÉ (upgrade automatique vers https://)
 * 
 * Le protocole HTTP non chiffré est INTERDIT.
 * Toute tentative HTTP est automatiquement convertie en HTTPS.
 * 
 * Cette politique protège contre:
 * - Attaques Man-in-the-Middle (MITM)
 * - Interception de données
 * - Injection de contenu malveillant
 */
export const SECURITY_POLICY = {
  allowedProtocols: ['chenu', 'https'] as const,
  blockedProtocols: ['http', 'ftp', 'file'] as const,
  autoUpgradeHttp: true,
  requireValidCertificates: true,
};

// ═══════════════════════════════════════════════════════════════════════════════
// URL ROUTER — Protocole chenu://
// ═══════════════════════════════════════════════════════════════════════════════

export type CHENUProtocol = 
  | 'chenu'      // Base protocol
  | 'workspace'  // chenu://workspace/:id
  | 'dataspace'  // chenu://dataspace/:id
  | 'thread'     // chenu://thread/:id
  | 'meeting'    // chenu://meeting/:id
  | 'document'   // chenu://document/:id
  | 'sphere'     // chenu://sphere/:id
  | 'nova'       // chenu://nova
  | 'agent'      // chenu://agent/:id
  | 'https'      // External URLs
  | 'http';

export interface CHENURoute {
  protocol: CHENUProtocol;
  path: string;
  params: Record<string, string>;
  query: Record<string, string>;
}

/**
 * Parse une URL CHE·NU en ses composants
 */
export function parseCHENUUrl(url: string): CHENURoute {
  // Handle external URLs
  if (url.startsWith('https://')) {
    return {
      protocol: 'https',
      path: url.replace('https://', ''),
      params: {},
      query: {},
    };
  }
  if (url.startsWith('http://')) {
    return {
      protocol: 'http',
      path: url.replace('http://', ''),
      params: {},
      query: {},
    };
  }

  // Handle CHE·NU protocol
  const cleanUrl = url.startsWith('chenu://') ? url.replace('chenu://', '') : url;
  const [pathPart, queryPart] = cleanUrl.split('?');
  const segments = pathPart.split('/').filter(Boolean);
  
  // Parse query string
  const query: Record<string, string> = {};
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    params.forEach((value, key) => {
      query[key] = value;
    });
  }

  // Determine protocol from first segment
  const firstSegment = segments[0] || '';
  let protocol: CHENUProtocol = 'chenu';
  
  const protocolMap: Record<string, CHENUProtocol> = {
    workspace: 'workspace',
    dataspace: 'dataspace',
    thread: 'thread',
    meeting: 'meeting',
    document: 'document',
    sphere: 'sphere',
    nova: 'nova',
    agent: 'agent',
  };
  
  if (protocolMap[firstSegment]) {
    protocol = protocolMap[firstSegment];
  }

  // Extract params (IDs)
  const params: Record<string, string> = {};
  if (segments.length > 1) {
    params.id = segments[1];
  }
  if (segments.length > 2) {
    params.subId = segments[2];
  }

  return {
    protocol,
    path: pathPart,
    params,
    query,
  };
}

/**
 * Construit une URL CHE·NU à partir de ses composants
 */
export function buildCHENUUrl(
  protocol: CHENUProtocol,
  path?: string,
  params?: Record<string, string>,
  query?: Record<string, string>
): string {
  if (protocol === 'https' || protocol === 'http') {
    return `${protocol}://${path || ''}`;
  }

  let url = 'chenu://';
  
  if (protocol !== 'chenu') {
    url += protocol;
  }
  
  if (path) {
    url += `/${path}`;
  }
  
  // Add ID params
  if (params?.id) {
    url += `/${params.id}`;
  }
  
  // Add query string
  if (query && Object.keys(query).length > 0) {
    const queryString = new URLSearchParams(query).toString();
    url += `?${queryString}`;
  }

  return url;
}

// ═══════════════════════════════════════════════════════════════════════════════
// ROUTE DEFINITIONS
// ═══════════════════════════════════════════════════════════════════════════════

export const CHENU_ROUTES = {
  // Home & Core
  home: 'chenu://home',
  nova: 'chenu://nova',
  settings: 'chenu://settings',
  
  // Spheres
  sphere: (id: string) => `chenu://sphere/${id}`,
  spherePersonal: 'chenu://sphere/personal',
  sphereBusiness: 'chenu://sphere/business',
  sphereMyTeam: 'chenu://sphere/my_team',
  sphereGovernment: 'chenu://sphere/government',
  sphereStudio: 'chenu://sphere/design_studio',
  sphereCommunity: 'chenu://sphere/community',
  sphereSocial: 'chenu://sphere/social',
  sphereEntertainment: 'chenu://sphere/entertainment',
  sphereScholars: 'chenu://sphere/scholars',
  
  // Workspaces
  workspace: (id: string) => `chenu://workspace/${id}`,
  workspaceRecent: 'chenu://workspace/recent',
  workspaceAll: 'chenu://workspace/all',
  
  // DataSpaces
  dataspace: (id: string) => `chenu://dataspace/${id}`,
  dataspaceAll: 'chenu://dataspace/all',
  dataspaceNew: 'chenu://dataspace/new',
  
  // Threads
  thread: (id: string) => `chenu://thread/${id}`,
  threads: 'chenu://threads',
  threadNew: 'chenu://thread/new',
  
  // Meetings
  meeting: (id: string) => `chenu://meeting/${id}`,
  meetings: 'chenu://meetings',
  meetingNew: 'chenu://meeting/new',
  meetingLive: (id: string) => `chenu://meeting/${id}/live`,
  
  // Documents
  document: (id: string) => `chenu://document/${id}`,
  documents: 'chenu://documents',
  
  // Agents
  agent: (id: string) => `chenu://agent/${id}`,
  agents: 'chenu://agents',
};

// ═══════════════════════════════════════════════════════════════════════════════
// NAVIGATION HELPER
// ═══════════════════════════════════════════════════════════════════════════════

export interface NavigationAction {
  type: 'push' | 'replace' | 'back' | 'forward';
  url?: string;
}

export function createNavigationHandler(
  onNavigate: (url: string) => void
) {
  return {
    push: (url: string) => onNavigate(url),
    goToHome: () => onNavigate(CHENU_ROUTES.home),
    goToNova: () => onNavigate(CHENU_ROUTES.nova),
    goToSphere: (id: string) => onNavigate(CHENU_ROUTES.sphere(id)),
    goToWorkspace: (id: string) => onNavigate(CHENU_ROUTES.workspace(id)),
    goToDataSpace: (id: string) => onNavigate(CHENU_ROUTES.dataspace(id)),
    goToThread: (id: string) => onNavigate(CHENU_ROUTES.thread(id)),
    goToMeeting: (id: string) => onNavigate(CHENU_ROUTES.meeting(id)),
    goToDocument: (id: string) => onNavigate(CHENU_ROUTES.document(id)),
    goToAgent: (id: string) => onNavigate(CHENU_ROUTES.agent(id)),
    goExternal: (url: string) => onNavigate(url.startsWith('http') ? url : `https://${url}`),
  };
}

export default CHENUBrowser;
