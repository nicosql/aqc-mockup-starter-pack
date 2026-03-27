/**
 * Mock plausible analytics context.
 * No-op in the mockup starter pack.
 */
export function usePlausible() {
  return {
    trackEvent: (_eventName: string, _opts?: { props?: Record<string, unknown> }) => {
      // no-op in mockup mode
    }
  }
}
