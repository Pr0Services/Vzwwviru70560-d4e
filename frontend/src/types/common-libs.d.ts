// Common library shims for development

// Framer Motion
declare module 'framer-motion' {
  export const motion: {
    div: any;
    span: any;
    button: any;
    a: any;
    ul: any;
    li: any;
    nav: any;
    header: any;
    section: any;
    article: any;
    aside: any;
    main: any;
    footer: any;
    form: any;
    input: any;
    textarea: any;
    select: any;
    svg: any;
    path: any;
    circle: any;
    [key: string]: any;
  };
  export const AnimatePresence: any;
  export const useAnimation: () => any;
  export const useMotionValue: (initial: number) => any;
  export const useTransform: (value: any, input: number[], output: any[]) => any;
  export const useSpring: (value: any, config?: any) => any;
  export const useInView: (ref: any, options?: any) => boolean;
  export type Variants = Record<string, any>;
  export type Transition = any;
}

// React Router
declare module 'react-router-dom' {
  export const BrowserRouter: any;
  export const Routes: any;
  export const Route: any;
  export const Link: any;
  export const NavLink: any;
  export const Navigate: any;
  export const Outlet: any;
  export function useNavigate(): (path: string, options?: any) => void;
  export function useParams<T = Record<string, string>>(): T;
  export function useSearchParams(): [URLSearchParams, (params: URLSearchParams) => void];
  export function useLocation(): { pathname: string; search: string; hash: string; state: any };
  export function useMatch(pattern: string): any;
}

// TanStack Query
declare module '@tanstack/react-query' {
  export function useQuery<T>(options: any): {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    refetch: () => void;
    isFetching: boolean;
  };
  export function useMutation<T, V>(options: any): {
    mutate: (variables: V) => void;
    mutateAsync: (variables: V) => Promise<T>;
    isLoading: boolean;
    isError: boolean;
    error: Error | null;
    data: T | undefined;
    reset: () => void;
  };
  export function useQueryClient(): any;
  export const QueryClient: any;
  export const QueryClientProvider: any;
}

// Zustand
declare module 'zustand' {
  export function create<T>(initializer: (set: any, get: any) => T): () => T;
  export function createStore<T>(initializer: (set: any, get: any) => T): any;
}

// Lucide React (icons)
declare module 'lucide-react' {
  export const Search: any;
  export const X: any;
  export const Check: any;
  export const ChevronDown: any;
  export const ChevronUp: any;
  export const ChevronLeft: any;
  export const ChevronRight: any;
  export const Plus: any;
  export const Minus: any;
  export const Edit: any;
  export const Trash: any;
  export const Settings: any;
  export const User: any;
  export const Users: any;
  export const Home: any;
  export const Menu: any;
  export const Bell: any;
  export const Mail: any;
  export const Calendar: any;
  export const Clock: any;
  export const File: any;
  export const Folder: any;
  export const Image: any;
  export const Video: any;
  export const Music: any;
  export const Download: any;
  export const Upload: any;
  export const Share: any;
  export const Link: any;
  export const ExternalLink: any;
  export const Copy: any;
  export const Clipboard: any;
  export const Save: any;
  export const RefreshCw: any;
  export const RotateCcw: any;
  export const Filter: any;
  export const SortAsc: any;
  export const SortDesc: any;
  export const Grid: any;
  export const List: any;
  export const Layout: any;
  export const Maximize: any;
  export const Minimize: any;
  export const Eye: any;
  export const EyeOff: any;
  export const Lock: any;
  export const Unlock: any;
  export const Shield: any;
  export const AlertCircle: any;
  export const AlertTriangle: any;
  export const Info: any;
  export const HelpCircle: any;
  export const MessageCircle: any;
  export const MessageSquare: any;
  export const Send: any;
  export const Inbox: any;
  export const Archive: any;
  export const Star: any;
  export const Heart: any;
  export const ThumbsUp: any;
  export const ThumbsDown: any;
  export const Zap: any;
  export const Activity: any;
  export const TrendingUp: any;
  export const TrendingDown: any;
  export const BarChart: any;
  export const PieChart: any;
  export const LineChart: any;
  export const Target: any;
  export const Award: any;
  export const Flag: any;
  export const Bookmark: any;
  export const Tag: any;
  export const Hash: any;
  export const AtSign: any;
  export const Globe: any;
  export const Map: any;
  export const MapPin: any;
  export const Navigation: any;
  export const Compass: any;
  export const Sun: any;
  export const Moon: any;
  export const Cloud: any;
  export const Loader: any;
  export const Loader2: any;
  export const MoreHorizontal: any;
  export const MoreVertical: any;
  export const Grip: any;
  export const Move: any;
  export const ArrowUp: any;
  export const ArrowDown: any;
  export const ArrowLeft: any;
  export const ArrowRight: any;
  export const LogIn: any;
  export const LogOut: any;
  export const Power: any;
  export const Play: any;
  export const Pause: any;
  export const Stop: any;
  export const SkipBack: any;
  export const SkipForward: any;
  export const Volume: any;
  export const Volume2: any;
  export const VolumeX: any;
  export const Mic: any;
  export const MicOff: any;
  export const Camera: any;
  export const CameraOff: any;
  export const Monitor: any;
  export const Smartphone: any;
  export const Tablet: any;
  export const Laptop: any;
  export const Cpu: any;
  export const Database: any;
  export const Server: any;
  export const Wifi: any;
  export const WifiOff: any;
  export const Bluetooth: any;
  export const Battery: any;
  export const Plug: any;
  export const Code: any;
  export const Terminal: any;
  export const FileCode: any;
  export const GitBranch: any;
  export const GitCommit: any;
  export const GitMerge: any;
  export const GitPullRequest: any;
  export const Package: any;
  export const Box: any;
  export const Layers: any;
  export const Layout: any;
  export const Sidebar: any;
  export const PanelLeft: any;
  export const PanelRight: any;
  export const Columns: any;
  export const Rows: any;
  export const Table: any;
  export const Kanban: any;
  export const GanttChart: any;
  export const Brain: any;
  export const Bot: any;
  export const Sparkles: any;
  export const Wand: any;
  export const Wand2: any;
  export const FileText: any;
  export const Files: any;
  export const FolderOpen: any;
  export const Paperclip: any;
  export const Slash: any;
  export const Circle: any;
  export const Square: any;
  export const Triangle: any;
  export const Hexagon: any;
  export const Octagon: any;
  export const Command: any;
  export const Option: any;
  export const Delete: any;
  export const CornerDownLeft: any;
  export const CornerDownRight: any;
  export const CornerUpLeft: any;
  export const CornerUpRight: any;
  const LucideIcon: any;
  export default LucideIcon;
}

// Recharts
declare module 'recharts' {
  export const LineChart: any;
  export const Line: any;
  export const BarChart: any;
  export const Bar: any;
  export const PieChart: any;
  export const Pie: any;
  export const Cell: any;
  export const AreaChart: any;
  export const Area: any;
  export const XAxis: any;
  export const YAxis: any;
  export const CartesianGrid: any;
  export const Tooltip: any;
  export const Legend: any;
  export const ResponsiveContainer: any;
}

// date-fns
declare module 'date-fns' {
  export function format(date: Date | number, formatStr: string): string;
  export function formatDistanceToNow(date: Date | number, options?: any): string;
  export function formatDistance(date: Date | number, baseDate: Date | number, options?: any): string;
  export function parseISO(dateString: string): Date;
  export function isValid(date: any): boolean;
  export function addDays(date: Date | number, amount: number): Date;
  export function addWeeks(date: Date | number, amount: number): Date;
  export function addMonths(date: Date | number, amount: number): Date;
  export function subDays(date: Date | number, amount: number): Date;
  export function differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
  export function startOfDay(date: Date | number): Date;
  export function endOfDay(date: Date | number): Date;
  export function startOfWeek(date: Date | number, options?: any): Date;
  export function endOfWeek(date: Date | number, options?: any): Date;
  export function startOfMonth(date: Date | number): Date;
  export function endOfMonth(date: Date | number): Date;
  export function isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  export function isAfter(date: Date | number, dateToCompare: Date | number): boolean;
  export function isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
}

// clsx / classnames
declare module 'clsx' {
  export default function clsx(...args: any[]): string;
  export function clsx(...args: any[]): string;
}

declare module 'classnames' {
  export default function classNames(...args: any[]): string;
}

// Tailwind merge
declare module 'tailwind-merge' {
  export function twMerge(...args: string[]): string;
}

// UUID
declare module 'uuid' {
  export function v4(): string;
  export function v1(): string;
}

// Axios
declare module 'axios' {
  export interface AxiosRequestConfig {
    url?: string;
    method?: string;
    baseURL?: string;
    headers?: Record<string, string>;
    params?: any;
    data?: any;
    timeout?: number;
    withCredentials?: boolean;
  }
  export interface AxiosResponse<T = any> {
    data: T;
    status: number;
    statusText: string;
    headers: Record<string, string>;
    config: AxiosRequestConfig;
  }
  export interface AxiosInstance {
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    interceptors: {
      request: { use: (fn: any) => number; eject: (id: number) => void };
      response: { use: (fn: any, errFn?: any) => number; eject: (id: number) => void };
    };
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
  const axios: AxiosInstance & { create: typeof create };
  export default axios;
}

// Three.js
declare module 'three' {
  export class Scene {}
  export class PerspectiveCamera {}
  export class WebGLRenderer {}
  export class Mesh {}
  export class BoxGeometry {}
  export class SphereGeometry {}
  export class PlaneGeometry {}
  export class MeshBasicMaterial {}
  export class MeshStandardMaterial {}
  export class AmbientLight {}
  export class DirectionalLight {}
  export class PointLight {}
  export class SpotLight {}
  export class Vector3 {
    constructor(x?: number, y?: number, z?: number);
    x: number;
    y: number;
    z: number;
  }
  export class Color {
    constructor(color?: string | number);
  }
  export class Fog {}
  export class FogExp2 {}
  export class Group {}
  export class Object3D {}
  export class Raycaster {}
  export class Clock {}
  export const DoubleSide: any;
  export const FrontSide: any;
  export const BackSide: any;
}

// React Three Fiber
declare module '@react-three/fiber' {
  export const Canvas: any;
  export function useFrame(callback: (state: any, delta: number) => void): void;
  export function useThree(): any;
  export function useLoader(loader: any, url: string): any;
}

declare module '@react-three/drei' {
  export const OrbitControls: any;
  export const PerspectiveCamera: any;
  export const Environment: any;
  export const Stars: any;
  export const Sky: any;
  export const Cloud: any;
  export const Float: any;
  export const Text: any;
  export const Text3D: any;
  export const Html: any;
  export const Billboard: any;
  export const useTexture: any;
  export const useGLTF: any;
  export const Sparkles: any;
  export const MeshDistortMaterial: any;
  export const MeshWobbleMaterial: any;
  export const RoundedBox: any;
  export const Box: any;
  export const Sphere: any;
  export const Plane: any;
  export const Cylinder: any;
  export const Cone: any;
  export const Torus: any;
}

export {};
