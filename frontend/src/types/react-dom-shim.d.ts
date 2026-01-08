// React DOM type shims
declare module 'react-dom' {
  export function render(element: JSX.Element, container: HTMLElement): void;
  export function createPortal(children: any, container: HTMLElement): JSX.Element;
  export function unmountComponentAtNode(container: HTMLElement): boolean;
}

declare module 'react-dom/client' {
  export function createRoot(container: HTMLElement): {
    render(element: JSX.Element): void;
    unmount(): void;
  };
  export function hydrateRoot(container: HTMLElement, element: JSX.Element): {
    render(element: JSX.Element): void;
    unmount(): void;
  };
}

export {};
