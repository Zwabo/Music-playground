import { compressToEncodedURIComponent, decompressFromEncodedURIComponent } from 'lz-string'
import type { CanvasState } from '@/types'

export function serializeCanvas(state: CanvasState): string {
  const json = JSON.stringify(state)
  return compressToEncodedURIComponent(json)
}

export function deserializeCanvas(hash: string): CanvasState | null {
  try {
    const json = decompressFromEncodedURIComponent(hash)
    if (!json) return null
    return JSON.parse(json) as CanvasState
  } catch {
    return null
  }
}

export function saveToUrl(state: CanvasState) {
  const hash = serializeCanvas(state)
  window.history.replaceState(null, '', `#${hash}`)
}

export function loadFromUrl(): CanvasState | null {
  const hash = window.location.hash.slice(1)
  if (!hash) return null
  return deserializeCanvas(hash)
}

export async function copyShareUrl() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    return true
  } catch {
    return false
  }
}
