/**
 * ╔══════════════════════════════════════════════════════════════════════════════╗
 * ║                    CHE·NU™ — ANALYTICS PROVIDER                              ║
 * ║                    Task B5.7: Event tracking, user analytics, and metrics    ║
 * ╚══════════════════════════════════════════════════════════════════════════════╝
 */

import { 
  createContext, 
  useContext, 
  useEffect, 
  useCallback,
  useRef,
  type ReactNode 
} from 'react'

// ============================================================================
// TYPES
// ============================================================================

interface AnalyticsEvent {
  name: string
  properties?: Record<string, any>
  timestamp: number
  sessionId: string
  userId?: string
}

interface PageView {
  path: string
  title: string
  referrer: string
  timestamp: number
  sessionId: string
  userId?: string
}

interface UserProperties {
  userId?: string
  email?: string
  name?: string
  plan?: 'free' | 'pro' | 'enterprise'
  sphere?: string
  createdAt?: string
  [key: string]: unknown
}

interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  sampleRate: number // 0-1, percentage of events to track
  batchSize: number
  batchTimeout: number
  endpoint?: string
}

interface AnalyticsContextValue {
  track: (eventName: string, properties?: Record<string, any>) => void
  page: (path?: string, properties?: Record<string, any>) => void
  identify: (userId: string, properties?: UserProperties) => void
  setUserProperties: (properties: UserProperties) => void
  reset: () => void
  getSessionId: () => string
}

const AnalyticsContext = createContext<AnalyticsContextValue | null>(null)

// ============================================================================
// ANALYTICS PROVIDER
// ============================================================================

const DEFAULT_CONFIG: AnalyticsConfig = {
  enabled: import.meta.env.PROD,
  debug: import.meta.env.DEV,
  sampleRate: 1,
  batchSize: 10,
  batchTimeout: 5000,
  endpoint: import.meta.env.VITE_ANALYTICS_ENDPOINT,
}

export function AnalyticsProvider({ 
  children,
  config: userConfig = {},
}: { 
  children: ReactNode
  config?: Partial<AnalyticsConfig>
}) {
  const config = { ...DEFAULT_CONFIG, ...userConfig }
  
  const sessionId = useRef(generateSessionId())
  const userId = useRef<string | undefined>()
  const userProperties = useRef<UserProperties>({})
  const eventQueue = useRef<AnalyticsEvent[]>([])
  const pageViewQueue = useRef<PageView[]>([])
  const flushTimeout = useRef<NodeJS.Timeout>()

  // Generate session ID
  function generateSessionId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Debug logger
  const log = useCallback((...args: unknown[]) => {
    if (config.debug) {
      logger.debug('[CHE·NU Analytics]', ...args)
    }
  }, [config.debug])

  // Check if should track (sampling)
  const shouldTrack = useCallback(() => {
    if (!config.enabled) return false
    return Math.random() < config.sampleRate
  }, [config.enabled, config.sampleRate])

  // Flush events to server
  const flush = useCallback(async () => {
    if (eventQueue.current.length === 0 && pageViewQueue.current.length === 0) {
      return
    }

    const events = [...eventQueue.current]
    const pageViews = [...pageViewQueue.current]
    
    eventQueue.current = []
    pageViewQueue.current = []

    log('Flushing', events.length, 'events and', pageViews.length, 'page views')

    if (config.endpoint) {
      try {
        await fetch(config.endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            events,
            pageViews,
            sessionId: sessionId.current,
            userId: userId.current,
            userProperties: userProperties.current,
            timestamp: Date.now(),
          }),
          keepalive: true,
        })
      } catch (error) {
        logger.error('Failed to send analytics:', error)
        // Re-queue failed events
        eventQueue.current = [...events, ...eventQueue.current]
        pageViewQueue.current = [...pageViews, ...pageViewQueue.current]
      }
    }
  }, [config.endpoint, log])

  // Schedule flush
  const scheduleFlush = useCallback(() => {
    clearTimeout(flushTimeout.current)
    
    if (eventQueue.current.length >= config.batchSize) {
      flush()
    } else {
      flushTimeout.current = setTimeout(flush, config.batchTimeout)
    }
  }, [config.batchSize, config.batchTimeout, flush])

  // Track event
  const track = useCallback((eventName: string, properties?: Record<string, any>) => {
    if (!shouldTrack()) return

    const event: AnalyticsEvent = {
      name: eventName,
      properties: {
        ...properties,
        // Auto-enriched properties
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        userAgent: navigator.userAgent,
        screenWidth: window.innerWidth,
        screenHeight: window.innerHeight,
        language: navigator.language,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      },
      timestamp: Date.now(),
      sessionId: sessionId.current,
      userId: userId.current,
    }

    log('Track:', eventName, properties)
    eventQueue.current.push(event)
    scheduleFlush()
  }, [shouldTrack, log, scheduleFlush])

  // Track page view
  const page = useCallback((path?: string, properties?: Record<string, any>) => {
    if (!shouldTrack()) return

    const pageView: PageView = {
      path: path || window.location.pathname,
      title: document.title,
      referrer: document.referrer,
      timestamp: Date.now(),
      sessionId: sessionId.current,
      userId: userId.current,
      ...properties,
    }

    log('Page:', pageView.path)
    pageViewQueue.current.push(pageView)
    scheduleFlush()
  }, [shouldTrack, log, scheduleFlush])

  // Identify user
  const identify = useCallback((newUserId: string, properties?: UserProperties) => {
    log('Identify:', newUserId, properties)
    userId.current = newUserId
    
    if (properties) {
      userProperties.current = { ...userProperties.current, ...properties }
    }

    // Track identification event
    track('user_identified', {
      userId: newUserId,
      ...properties,
    })
  }, [log, track])

  // Set user properties
  const setUserProperties = useCallback((properties: UserProperties) => {
    log('Set user properties:', properties)
    userProperties.current = { ...userProperties.current, ...properties }
  }, [log])

  // Reset (logout)
  const reset = useCallback(() => {
    log('Reset analytics')
    flush()
    userId.current = undefined
    userProperties.current = {}
    sessionId.current = generateSessionId()
  }, [flush, log])

  // Get session ID
  const getSessionId = useCallback(() => sessionId.current, [])

  // Auto-track page views on navigation
  useEffect(() => {
    // Initial page view
    page()

    // Track on popstate (back/forward)
    const handlePopState = () => page()
    window.addEventListener('popstate', handlePopState)

    return () => {
      window.removeEventListener('popstate', handlePopState)
    }
  }, [page])

  // Flush on unload
  useEffect(() => {
    const handleUnload = () => flush()
    window.addEventListener('beforeunload', handleUnload)
    window.addEventListener('pagehide', handleUnload)

    return () => {
      window.removeEventListener('beforeunload', handleUnload)
      window.removeEventListener('pagehide', handleUnload)
    }
  }, [flush])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      clearTimeout(flushTimeout.current)
      flush()
    }
  }, [flush])

  const value: AnalyticsContextValue = {
    track,
    page,
    identify,
    setUserProperties,
    reset,
    getSessionId,
  }

  return (
    <AnalyticsContext.Provider value={value}>
      {children}
    </AnalyticsContext.Provider>
  )
}

// ============================================================================
// HOOKS
// ============================================================================

export function useAnalytics() {
  const context = useContext(AnalyticsContext)
  if (!context) {
    throw new Error('useAnalytics must be used within AnalyticsProvider')
  }
  return context
}

// Track component mount
export function useTrackMount(eventName: string, properties?: Record<string, any>) {
  const { track } = useAnalytics()

  useEffect(() => {
    track(eventName, properties)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
}

// Track time spent
export function useTrackTimeSpent(componentName: string) {
  const { track } = useAnalytics()
  const startTime = useRef(Date.now())

  useEffect(() => {
    return () => {
      const timeSpent = Date.now() - startTime.current
      track('time_spent', {
        component: componentName,
        duration: timeSpent,
        durationSeconds: Math.round(timeSpent / 1000),
      })
    }
  }, [componentName, track])
}

// Track clicks
export function useTrackClick(eventName: string, properties?: Record<string, any>) {
  const { track } = useAnalytics()

  return useCallback(() => {
    track(eventName, properties)
  }, [track, eventName, properties])
}

// ============================================================================
// CHE·NU SPECIFIC EVENTS
// ============================================================================

export const AnalyticsEvents = {
  // Authentication
  USER_SIGNED_UP: 'user_signed_up',
  USER_LOGGED_IN: 'user_logged_in',
  USER_LOGGED_OUT: 'user_logged_out',

  // Spheres
  SPHERE_SWITCHED: 'sphere_switched',
  SPHERE_CUSTOMIZED: 'sphere_customized',

  // Threads
  THREAD_CREATED: 'thread_created',
  THREAD_OPENED: 'thread_opened',
  THREAD_COMPLETED: 'thread_completed',
  THREAD_ARCHIVED: 'thread_archived',

  // Agents
  AGENT_HIRED: 'agent_hired',
  AGENT_FIRED: 'agent_fired',
  AGENT_TASK_STARTED: 'agent_task_started',
  AGENT_TASK_COMPLETED: 'agent_task_completed',

  // Nova
  NOVA_QUERY: 'nova_query',
  NOVA_INSIGHT_VIEWED: 'nova_insight_viewed',
  NOVA_SUGGESTION_APPLIED: 'nova_suggestion_applied',

  // Governance
  GOVERNANCE_APPROVAL_REQUESTED: 'governance_approval_requested',
  GOVERNANCE_APPROVAL_GRANTED: 'governance_approval_granted',
  GOVERNANCE_APPROVAL_DENIED: 'governance_approval_denied',
  BUDGET_ALERT_SHOWN: 'budget_alert_shown',

  // Features
  FEATURE_USED: 'feature_used',
  SEARCH_PERFORMED: 'search_performed',
  FILE_UPLOADED: 'file_uploaded',
  EXPORT_PERFORMED: 'export_performed',

  // Errors
  ERROR_OCCURRED: 'error_occurred',
  ERROR_RECOVERED: 'error_recovered',

  // Engagement
  SESSION_STARTED: 'session_started',
  SESSION_ENDED: 'session_ended',
  FEEDBACK_SUBMITTED: 'feedback_submitted',

  // Onboarding
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_SKIPPED: 'onboarding_skipped',

  // Subscription
  SUBSCRIPTION_STARTED: 'subscription_started',
  SUBSCRIPTION_UPGRADED: 'subscription_upgraded',
  SUBSCRIPTION_CANCELLED: 'subscription_cancelled',
} as const

// ============================================================================
// SPECIALIZED TRACKING HOOKS
// ============================================================================

// Track sphere usage
export function useTrackSphere(sphereId: string) {
  const { track } = useAnalytics()

  useEffect(() => {
    track(AnalyticsEvents.SPHERE_SWITCHED, { sphereId })
  }, [sphereId, track])
}

// Track thread lifecycle
export function useTrackThread(threadId: string) {
  const { track } = useAnalytics()
  const opened = useRef(false)

  useEffect(() => {
    if (!opened.current) {
      track(AnalyticsEvents.THREAD_OPENED, { threadId })
      opened.current = true
    }
  }, [threadId, track])

  const trackComplete = useCallback(() => {
    track(AnalyticsEvents.THREAD_COMPLETED, { threadId })
  }, [threadId, track])

  const trackArchive = useCallback(() => {
    track(AnalyticsEvents.THREAD_ARCHIVED, { threadId })
  }, [threadId, track])

  return { trackComplete, trackArchive }
}

// Track agent usage
export function useTrackAgent() {
  const { track } = useAnalytics()

  const trackHire = useCallback((agentId: string, agentType: string) => {
    track(AnalyticsEvents.AGENT_HIRED, { agentId, agentType })
  }, [track])

  const trackFire = useCallback((agentId: string, reason?: string) => {
    track(AnalyticsEvents.AGENT_FIRED, { agentId, reason })
  }, [track])

  const trackTask = useCallback((agentId: string, taskType: string, duration: number) => {
    track(AnalyticsEvents.AGENT_TASK_COMPLETED, { agentId, taskType, duration })
  }, [track])

  return { trackHire, trackFire, trackTask }
}

// Track Nova interactions
export function useTrackNova() {
  const { track } = useAnalytics()

  const trackQuery = useCallback((query: string, responseTime: number) => {
    track(AnalyticsEvents.NOVA_QUERY, { 
      queryLength: query.length,
      responseTime,
    })
  }, [track])

  const trackInsight = useCallback((insightId: string, type: string) => {
    track(AnalyticsEvents.NOVA_INSIGHT_VIEWED, { insightId, type })
  }, [track])

  const trackSuggestion = useCallback((suggestionId: string, applied: boolean) => {
    track(AnalyticsEvents.NOVA_SUGGESTION_APPLIED, { suggestionId, applied })
  }, [track])

  return { trackQuery, trackInsight, trackSuggestion }
}

// Track errors
export function useTrackError() {
  const { track } = useAnalytics()

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    track(AnalyticsEvents.ERROR_OCCURRED, {
      errorName: error.name,
      errorMessage: error.message,
      errorStack: error.stack?.slice(0, 500),
      ...context,
    })
  }, [track])

  const trackRecovery = useCallback((errorType: string) => {
    track(AnalyticsEvents.ERROR_RECOVERED, { errorType })
  }, [track])

  return { trackError, trackRecovery }
}

// ============================================================================
// AUTO-TRACKING WRAPPER
// ============================================================================

interface TrackingWrapperProps {
  children: ReactNode
  trackClicks?: boolean
  trackScrollDepth?: boolean
  trackVisibility?: boolean
}

export function TrackingWrapper({
  children,
  trackClicks = true,
  trackScrollDepth = true,
  trackVisibility = true,
}: TrackingWrapperProps) {
  const { track } = useAnalytics()
  const containerRef = useRef<HTMLDivElement>(null)
  const maxScrollDepth = useRef(0)

  // Track clicks with element info
  useEffect(() => {
    if (!trackClicks) return

    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const trackableElement = target.closest('[data-track]')
      
      if (trackableElement) {
        const trackName = trackableElement.getAttribute('data-track')
        const trackProps = trackableElement.getAttribute('data-track-props')
        
        track(`click_${trackName}`, trackProps ? JSON.parse(trackProps) : {})
      }
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [trackClicks, track])

  // Track scroll depth
  useEffect(() => {
    if (!trackScrollDepth) return

    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const scrollPercent = Math.round((scrollTop / docHeight) * 100)

      if (scrollPercent > maxScrollDepth.current) {
        maxScrollDepth.current = scrollPercent

        // Track at 25%, 50%, 75%, 100%
        const milestones = [25, 50, 75, 100]
        if (milestones.includes(scrollPercent)) {
          track('scroll_depth', { depth: scrollPercent })
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [trackScrollDepth, track])

  // Track visibility
  useEffect(() => {
    if (!trackVisibility || !containerRef.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          track('element_visible', {
            elementId: containerRef.current?.id,
          })
        }
      },
      { threshold: 0.5 }
    )

    observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [trackVisibility, track])

  return <div ref={containerRef}>{children}</div>
}

// ============================================================================
// ANALYTICS DASHBOARD COMPONENT (Dev Tools)
// ============================================================================

export function AnalyticsDashboard({ enabled = false }: { enabled?: boolean }) {
  const { getSessionId } = useAnalytics()
  const [events, setEvents] = useState<AnalyticsEvent[]>([])

  // In dev mode, capture events for display
  useEffect(() => {
    if (!enabled) return

    const originalLog = console.log
    console.log = (...args) => {
      if (args[0] === '[CHE·NU Analytics]' && args[1] === 'Track:') {
        setEvents(prev => [...prev.slice(-19), {
          name: args[2],
          properties: args[3],
          timestamp: Date.now(),
          sessionId: getSessionId(),
        }])
      }
      originalLog(...args)
    }

    return () => {
      console.log = originalLog
    }
  }, [enabled, getSessionId])

  if (!enabled) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 w-80 max-h-96 overflow-auto bg-obsidian-base/95 backdrop-blur-sm rounded-xl border border-white/10 p-3 font-mono text-xs">
      <div className="flex items-center justify-between mb-2">
        <span className="text-soft-sand font-medium">Analytics Events</span>
        <span className="text-ancient-stone">{events.length}</span>
      </div>
      <div className="space-y-1">
        {events.map((event, i) => (
          <div key={i} className="p-2 rounded bg-white/5">
            <div className="text-cenote-turquoise">{event.name}</div>
            {event.properties && (
              <div className="text-ancient-stone mt-1 truncate">
                {JSON.stringify(event.properties).slice(0, 50)}...
              </div>
            )}
          </div>
        ))}
        {events.length === 0 && (
          <div className="text-ancient-stone text-center py-4">
            Aucun événement
          </div>
        )}
      </div>
    </div>
  )
}
