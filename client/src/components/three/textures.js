import * as THREE from 'three';

/** Creates a canvas, lets `draw` paint on it, and wraps it in a CanvasTexture. */
export function makeTexture(width, height, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  draw(ctx, width, height);
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

export function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Soft radial glow used for particles, halos and ground shadows. */
export function glowTexture(inner = 'rgba(255,255,255,1)', outer = 'rgba(255,255,255,0)', size = 128) {
  return makeTexture(size, size, (ctx, w, h) => {
    const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
    g.addColorStop(0, inner);
    g.addColorStop(0.35, inner.replace(/[\d.]+\)$/, '0.35)'));
    g.addColorStop(1, outer);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
  });
}

/**
 * Glass tile with a brand logo (SVG path from simple-icons, 24x24 viewBox) or a
 * text monogram, plus the technology name underneath. Used as a sprite texture.
 */
export function techTileTexture({ name, path, color = '#ffffff', mono }) {
  const W = 256;
  const H = 300;
  return makeTexture(W, H, (ctx) => {
    // glass body
    roundRect(ctx, 8, 8, W - 16, H - 16, 36);
    const bg = ctx.createLinearGradient(0, 0, 0, H);
    bg.addColorStop(0, 'rgba(30,40,72,0.92)');
    bg.addColorStop(1, 'rgba(10,16,32,0.92)');
    ctx.fillStyle = bg;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(169,188,255,0.32)';
    ctx.stroke();

    // logo
    const cx = W / 2;
    const cy = 126;
    if (path) {
      const size = 112;
      ctx.save();
      ctx.translate(cx - size / 2, cy - size / 2);
      ctx.scale(size / 24, size / 24);
      ctx.fillStyle = color;
      ctx.fill(new Path2D(path));
      ctx.restore();
    } else {
      ctx.fillStyle = color;
      ctx.font = '700 64px ui-monospace, SFMono-Regular, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(mono || name.slice(0, 3), cx, cy);
    }

    // label
    ctx.fillStyle = '#e2e8f0';
    ctx.font = '600 30px system-ui, -apple-system, "Segoe UI", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(name, cx, 238, W - 36);
  });
}

export function disposeAll(...resources) {
  resources.flat().forEach((r) => r?.dispose?.());
}
