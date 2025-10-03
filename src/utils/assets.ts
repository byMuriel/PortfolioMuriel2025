// src/utils/assets.ts
export function resolveAsset(p?: string): string {
  if (!p) return ''
  if (/^https?:\/\//i.test(p) || p.startsWith('data:')) return p

  const cleaned = p.replace(/^@\/?/, '') // "@/assets/..." -> "assets/..."
  // En dev: /src/assets/...   |   En build: /assets/...
  const base = import.meta.env.DEV ? '/src' : ''
  const path = `${base}/${cleaned}`.replace(/\/{2,}/g, '/')
  return new URL(path, window.location.origin).toString()
}

export async function preloadImages(urls: (string | undefined | null)[]): Promise<void> {
  await Promise.all(
    urls
      .filter((u): u is string => typeof u === 'string' && u.length > 0)
      .map(
        (src) =>
          new Promise<void>((res, rej) => {
            const img = new Image()
            img.onload = () => res()
            img.onerror = () => rej(new Error(`No se pudo cargar: ${src}`))
            img.src = src
          }),
      ),
  )
}
