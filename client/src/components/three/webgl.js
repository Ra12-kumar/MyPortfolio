/** Shared helpers for the lazy-loaded 3D scenes. */

export function supportsWebGL() {
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    // Release the probe context immediately so it does not count against the browser's context limit.
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return Boolean(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

/** 'low' on phones / small tablets / weak devices, otherwise 'high'. */
export function detectQuality() {
  if (typeof window === 'undefined') return 'high';
  const small = window.matchMedia?.('(max-width: 767px)').matches;
  const coarse = window.matchMedia?.('(pointer: coarse)').matches;
  const weak = (navigator.hardwareConcurrency || 8) <= 4 || (navigator.deviceMemory || 8) <= 4;
  return small || (coarse && weak) ? 'low' : 'high';
}
