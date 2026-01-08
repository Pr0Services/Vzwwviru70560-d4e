// Page types for CHE·NU

export type PermissionLevel = 'read' | 'write' | 'admin' | 'view';

export interface PageConfig {
  id: string;
  title: string;
  path: string;
  permission: PermissionLevel;
  sphere?: string;
  layout?: 'default' | 'full' | 'sidebar' | 'minimal';
}

export interface ResolvedDimension {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface PageContext {
  user: any;
  sphere: string;
  thread?: string;
  permissions: PermissionLevel[];
}

export interface PageProps {
  config: PageConfig;
  context: PageContext;
  children?: React.ReactNode;
}
