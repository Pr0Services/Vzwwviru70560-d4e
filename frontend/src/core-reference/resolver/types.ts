// Resolver types

export interface ResolvedDimension {
  width: number;
  height: number;
  aspectRatio: number;
  breakpoint: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

export interface ResolverConfig {
  baseWidth: number;
  baseHeight: number;
  minWidth: number;
  maxWidth: number;
}

export interface ResolverResult<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ResolutionMode = 'fit' | 'fill' | 'contain' | 'cover';

export function resolveDimension(
  width: number,
  height: number,
  mode: ResolutionMode = 'fit'
): ResolvedDimension {
  const aspectRatio = width / height;
  let breakpoint: ResolvedDimension['breakpoint'] = 'md';
  
  if (width < 640) breakpoint = 'xs';
  else if (width < 768) breakpoint = 'sm';
  else if (width < 1024) breakpoint = 'md';
  else if (width < 1280) breakpoint = 'lg';
  else if (width < 1536) breakpoint = 'xl';
  else breakpoint = '2xl';
  
  return { width, height, aspectRatio, breakpoint };
}
