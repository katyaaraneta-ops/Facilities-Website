type PostHogClient = { capture: (eventName: string, properties?: Record<string, unknown>) => void };

/** Resolves `window.posthog` at call time so events fire after the async snippet finishes loading. */
export function capturePostHog(eventName: string, properties?: Record<string, unknown>): void {
  if (typeof window === 'undefined') return;
  const ph = (window as unknown as { posthog?: PostHogClient }).posthog;
  ph?.capture(eventName, properties);
}
