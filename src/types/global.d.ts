declare global {
  interface Window {
    requestIdleCallback?: (callback: IdleRequestCallback, options?: { timeout: number }) => number
    cancelIdleCallback?: (handle: number) => void
  }
}
export {}
