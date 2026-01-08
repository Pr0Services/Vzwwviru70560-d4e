// React type shims for development without node_modules
declare module 'react' {
  export type FC<P = {}> = (props: P) => JSX.Element | null;
  export type ReactNode = JSX.Element | string | number | boolean | null | undefined | ReactNode[];
  export type ReactElement = JSX.Element;
  export type ComponentType<P = {}> = FC<P>;
  export type CSSProperties = Record<string, string | number>;
  
  export function useState<T>(initial: T | (() => T)): [T, (value: T | ((prev: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
  export function useCallback<T extends (...args: any[]) => any>(callback: T, deps: any[]): T;
  export function useMemo<T>(factory: () => T, deps: any[]): T;
  export function useRef<T>(initial: T): { current: T };
  export function useContext<T>(context: React.Context<T>): T;
  export function createContext<T>(defaultValue: T): React.Context<T>;
  export function memo<P>(component: FC<P>): FC<P>;
  export function forwardRef<T, P>(render: (props: P, ref: React.Ref<T>) => JSX.Element): FC<P>;
  
  export interface Context<T> {
    Provider: FC<{ value: T; children?: ReactNode }>;
    Consumer: FC<{ children: (value: T) => ReactNode }>;
  }
  
  export type Ref<T> = { current: T | null } | ((instance: T | null) => void);
  export type RefObject<T> = { current: T | null };
  
  export const Fragment: FC<{ children?: ReactNode }>;
  export const StrictMode: FC<{ children?: ReactNode }>;
  
  export default {
    useState,
    useEffect,
    useCallback,
    useMemo,
    useRef,
    useContext,
    createContext,
    memo,
    forwardRef,
    Fragment,
    StrictMode,
  };
}

declare global {
  namespace JSX {
    interface IntrinsicElements {
      div: any;
      span: any;
      p: any;
      h1: any;
      h2: any;
      h3: any;
      h4: any;
      h5: any;
      h6: any;
      a: any;
      button: any;
      input: any;
      textarea: any;
      select: any;
      option: any;
      form: any;
      label: any;
      img: any;
      svg: any;
      path: any;
      circle: any;
      rect: any;
      line: any;
      ul: any;
      ol: any;
      li: any;
      table: any;
      thead: any;
      tbody: any;
      tr: any;
      th: any;
      td: any;
      nav: any;
      header: any;
      footer: any;
      main: any;
      section: any;
      article: any;
      aside: any;
      canvas: any;
      video: any;
      audio: any;
      iframe: any;
      [elemName: string]: any;
    }
    interface Element {}
    interface ElementClass {}
    interface ElementAttributesProperty {}
    interface ElementChildrenAttribute {}
  }
}

export {};
