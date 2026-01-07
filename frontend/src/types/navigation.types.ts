/**
 * CHE·NU — Navigation Types
 */

export interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path?: string;
  badge?: number;
  children?: MenuItem[];
  action?: () => void;
}

export interface Sphere {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
  enabled: boolean;
  modules: SphereModule[];
  subpages: SubPage[];
}

export interface SphereModule {
  id: string;
  name: string;
  icon: string;
  path: string;
}

export interface SubPage {
  id: string;
  name: string;
  path: string;
  icon?: string;
}

export interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

export interface NavigationState {
  currentPath: string;
  currentSphere: string | null;
  breadcrumbs: BreadcrumbItem[];
  sidebarOpen: boolean;
  novaOpen: boolean;
}
