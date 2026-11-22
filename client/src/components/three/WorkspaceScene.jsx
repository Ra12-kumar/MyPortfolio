import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { siReact, siJavascript, siNodedotjs } from 'simple-icons';
import { glowTexture, makeTexture, roundRect } from './textures';

/**
 * Hero scene: a floating laptop showing a code editor, tech badges orbiting
 * it, soft particles and pointer parallax. Loaded lazily (see DeveloperWorkspace3D).
 */

const SKY = '#7c9cff';
const VIOLET = '#8b5cf6';

/* ---------- procedural textures ---------- */

const CODE_LINES = [
  [['const ', '#c792ea'], ['app ', '#82aaff'], ['= ', '#89ddff'], ['express', '#ffcb6b'], ['();', '#89ddff']],
  [],
  [['app', '#82aaff'], ['.get', '#89ddff'], ["('/api/projects', ", '#c3e88d'], ['async ', '#c792ea'], ['(req, res) ', '#89ddff'], ['=> {', '#89ddff']],
  [['  const ', '#c792ea'], ['{ data } ', '#82aaff'], ['= await ', '#c792ea'], ['db', '#ffcb6b'], ['.from', '#89ddff'], ["('projects')", '#c3e88d']],
  [['  res', '#82aaff'], ['.json', '#89ddff'], ['({ ', '#89ddff'], ['data', '#f78c6c'], [' });', '#89ddff']],
  [['});', '#89ddff']],
  [],
  [['export function ', '#c792ea'], ['Dashboard', '#ffcb6b'], ['() {', '#89ddff']],
  [['  return ', '#c792ea'], ['<Layout ', '#f07178'], ['ai', '#c792ea'], ['={true} />', '#f07178']],
  [['}', '#89ddff']],
];

function screenTexture() {
  return makeTexture(1024, 640, (ctx, w, h) => {
    ctx.fillStyle = '#0b1020';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#111936';
    ctx.fillRect(0, 0, w, 52);
    ['#ff5f56', '#ffbd2e', '#27c93f'].forEach((c, i) => {
      ctx.fillStyle = c;
      ctx.beginPath();
      ctx.arc(30 + i * 26, 26, 8, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.fillStyle = '#64748b';
    ctx.font = '500 20px ui-monospace, Menlo, monospace';
    ctx.fillText('server.js - portfolio', 140, 33);
    ctx.fillStyle = '#0d1328';
    ctx.fillRect(0, 52, 190, h - 52);
    ['src', 'components', 'routes', 'server.js', 'package.json'].forEach((f, i) => {
      ctx.fillStyle = i === 3 ? '#a9bcff' : '#475569';
      ctx.fillText(f, 24, 100 + i * 36);
    });
    ctx.font = '500 26px ui-monospace, Menlo, monospace';
    CODE_LINES.forEach((line, i) => {
      const y = 104 + i * 44;
      ctx.fillStyle = '#334155';
      ctx.fillText(String(i + 1).padStart(2, ' '), 214, y);
      let x = 270;
      line.forEach(([text, color]) => {
        ctx.fillStyle = color;
        ctx.fillText(text, x, y);
        x += ctx.measureText(text).width;
      });
    });
    ctx.fillStyle = '#7c9cff';
    ctx.fillRect(520, 410, 3, 30);
    ctx.fillStyle = '#4361ee';
    ctx.fillRect(0, h - 34, w, 34);
    ctx.fillStyle = '#e0e7ff';
    ctx.font = '500 18px system-ui, sans-serif';
    ctx.fillText('main    0 errors    JavaScript    UTF-8', 20, h - 11);
  });
}

function keyboardTexture() {
  return makeTexture(1024, 512, (ctx, w, h) => {
    ctx.fillStyle = '#0f1530';
    ctx.fillRect(0, 0, w, h);
    const rows = [14, 14, 13, 12, 8];
    const pad = 28;
    const gap = 8;
    const rowH = (h * 0.62 - gap * 4) / 5;
    rows.forEach((n, r) => {
      const keyW = (w - pad * 2 - gap * (n - 1)) / n;
      for (let i = 0; i < n; i += 1) {
        roundRect(ctx, pad + i * (keyW + gap), 30 + r * (rowH + gap), keyW, rowH, 8);
        ctx.fillStyle = '#1b2447';
        ctx.fill();
      }
    });
    roundRect(ctx, w / 2 - 130, h * 0.78, 260, 100, 14);
    ctx.fillStyle = '#161d3d';
    ctx.fill();
  });
}

function badgeTexture({ path, color, text }) {
  return makeTexture(192, 192, (ctx, w, h) => {
    roundRect(ctx, 8, 8, w - 16, h - 16, 40);
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, 'rgba(34,46,84,0.95)');
    g.addColorStop(1, 'rgba(12,18,38,0.95)');
    ctx.fillStyle = g;
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(169,188,255,0.35)';
    ctx.stroke();
    ctx.fillStyle = color;
    if (path) {
      ctx.save();
      ctx.translate(w / 2 - 50, h / 2 - 50);
      ctx.scale(100 / 24, 100 / 24);
      ctx.fill(new Path2D(path));
      ctx.restore();
    } else {
      ctx.font = '700 64px ui-monospace, Menlo, monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(text, w / 2, h / 2 + 4);
    }
  });
}

/** Generic database glyph (no brand mark implied). */
function databaseTexture() {
  return makeTexture(192, 192, (ctx, w, h) => {
    roundRect(ctx, 8, 8, w - 16, h - 16, 40);
    ctx.fillStyle = 'rgba(16,24,48,0.95)';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'rgba(169,188,255,0.35)';
    ctx.stroke();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 7;
    const cx = w / 2;
    [58, 96, 134].forEach((y, i) => {
      ctx.beginPath();
      ctx.ellipse(cx, y, 42, 14, 0, 0, Math.PI * 2);
      if (i === 0) {
        ctx.fillStyle = 'rgba(56,189,248,0.25)';
        ctx.fill();
      }
      ctx.stroke();
    });
    ctx.beginPath();
    ctx.moveTo(cx - 42, 58);
    ctx.lineTo(cx - 42, 134);
    ctx.moveTo(cx + 42, 58);
    ctx.lineTo(cx + 42, 134);
    ctx.stroke();
  });
}

/* ---------- scene parts ---------- */

function Environment({ enabled }) {
  const { gl, scene } = useThree();
  useEffect(() => {
    if (!enabled) return undefined;
    const pmrem = new THREE.PMREMGenerator(gl);
    const room = new RoomEnvironment();
    const target = pmrem.fromScene(room, 0.04);
    scene.environment = target.texture;
    scene.environmentIntensity = 0.55;
    return () => {
      scene.environment = null;
      target.dispose();
      pmrem.dispose();
      room.dispose();
    };
  }, [enabled, gl, scene]);
  return null;
}

function Laptop() {
  const { baseGeo, lidGeo, screenTex, keysTex } = useMemo(
    () => ({
      baseGeo: new RoundedBoxGeometry(3.3, 0.1, 2.2, 3, 0.04),
      lidGeo: new RoundedBoxGeometry(3.3, 2.1, 0.08, 3, 0.04),
      screenTex: screenTexture(),
      keysTex: keyboardTexture(),
    }),
    [],
  );
  useEffect(() => () => [baseGeo, lidGeo, screenTex, keysTex].forEach((r) => r.dispose()), [baseGeo, lidGeo, screenTex, keysTex]);

  return (
    <group position={[0, -0.35, 0]}>
      <mesh geometry={baseGeo}>
        <meshStandardMaterial color="#9aa4c4" metalness={0.85} roughness={0.32} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.052, 0.05]}>
        <planeGeometry args={[3.0, 1.9]} />
        <meshStandardMaterial map={keysTex} roughness={0.7} metalness={0.2} />
      </mesh>
      {/* lid, hinged along the back edge */}
      <group position={[0, 0.05, -1.05]} rotation={[-0.2, 0, 0]}>
        <mesh geometry={lidGeo} position={[0, 1.05, 0]}>
          <meshStandardMaterial color="#8791b3" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 1.05, 0.045]}>
          <planeGeometry args={[3.12, 1.92]} />
          <meshBasicMaterial map={screenTex} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
}

function Badges({ low }) {
  const refs = useRef([]);
  const items = useMemo(
    () => [
      { tex: badgeTexture({ path: siJavascript.path, color: `#${siJavascript.hex}` }), r: 2.45, y: 0.95, a: 0.0, s: 0.62 },
      { tex: badgeTexture({ path: siReact.path, color: `#${siReact.hex}` }), r: 2.6, y: 0.1, a: 1.6, s: 0.7 },
      { tex: badgeTexture({ path: siNodedotjs.path, color: `#${siNodedotjs.hex}` }), r: 2.4, y: 1.35, a: 3.2, s: 0.58 },
      { tex: databaseTexture(), r: 2.6, y: -0.4, a: 4.7, s: 0.62 },
      ...(low ? [] : [{ tex: badgeTexture({ text: '</>', color: '#a9bcff' }), r: 2.7, y: 0.6, a: 5.6, s: 0.5 }]),
    ],
    [low],
  );
  useEffect(() => () => items.forEach((i) => i.tex.dispose()), [items]);

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    items.forEach((it, i) => {
      const a = it.a + t * 0.28;
      const m = refs.current[i];
      if (!m) return;
      m.position.set(Math.cos(a) * it.r, it.y + Math.sin(t * 0.9 + i) * 0.12, Math.sin(a) * it.r * 0.6);
    });
  });

  return (
    <>
      {items.map((it, i) => (
        <sprite
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          scale={[it.s, it.s, 1]}
        >
          <spriteMaterial map={it.tex} transparent depthWrite={false} />
        </sprite>
      ))}
    </>
  );
}

function Orbiters() {
  const a = useRef();
  const b = useRef();
  useFrame((_, dt) => {
    a.current.rotation.y += dt * 0.35;
    a.current.rotation.x += dt * 0.1;
    b.current.rotation.z += dt * 0.25;
    b.current.rotation.x += dt * 0.12;
  });
  return (
    <>
      <mesh ref={a} position={[-2.1, 1.7, -0.8]} scale={0.28}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color={SKY} wireframe transparent opacity={0.6} />
      </mesh>
      <mesh ref={b} position={[2.1, -1.0, -0.4]} scale={0.26}>
        <torusGeometry args={[1, 0.28, 12, 40]} />
        <meshStandardMaterial color={VIOLET} emissive={VIOLET} emissiveIntensity={0.7} metalness={0.4} roughness={0.35} />
      </mesh>
    </>
  );
}

function Particles({ count }) {
  const ref = useRef();
  const { positions, tex } = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      arr[i * 3] = (Math.random() - 0.5) * 9;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 5.5;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6 - 0.5;
    }
    return { positions: arr, tex: glowTexture('rgba(169,188,255,1)') };
  }, [count]);
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state, dt) => {
    ref.current.rotation.y += dt * 0.025;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.12;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.09} transparent opacity={0.7} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

/** Soft contact shadow + glow ring beneath the floating laptop. */
function Floor() {
  const tex = useMemo(
    () =>
      makeTexture(256, 256, (ctx, w, h) => {
        const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
        g.addColorStop(0, 'rgba(0,0,0,0.65)');
        g.addColorStop(0.45, 'rgba(25,35,110,0.28)');
        g.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = g;
        ctx.fillRect(0, 0, w, h);
      }),
    [],
  );
  const ring = useRef();
  useEffect(() => () => tex.dispose(), [tex]);
  useFrame((state) => {
    ring.current.material.opacity = 0.28 + Math.sin(state.clock.elapsedTime * 1.2) * 0.06;
  });
  return (
    <group position={[0, -1.5, 0]}>
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[5.6, 5.6]} />
        <meshBasicMaterial map={tex} transparent depthWrite={false} />
      </mesh>
      <mesh ref={ring} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[1.7, 1.73, 96]} />
        <meshBasicMaterial color={SKY} transparent opacity={0.3} depthWrite={false} />
      </mesh>
    </group>
  );
}

function Rig({ children }) {
  const group = useRef();
  useFrame((state) => {
    const g = group.current;
    const t = state.clock.elapsedTime;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, -0.38 + state.pointer.x * 0.35 + Math.sin(t * 0.35) * 0.1, 0.05);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.08 - state.pointer.y * 0.14, 0.05);
    g.position.y = Math.sin(t * 0.8) * 0.09;
  });
  return <group ref={group}>{children}</group>;
}

export default function WorkspaceScene({ active = true, quality = 'high' }) {
  const low = quality === 'low';
  return (
    <Canvas
      dpr={low ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0.7, 8.4], fov: 38 }}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
    >
      <Environment enabled={!low} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[3, 5, 4]} intensity={1.6} />
      <pointLight position={[-4, 2, 3]} intensity={25} color={VIOLET} />
      <pointLight position={[4, 0, 3]} intensity={20} color={SKY} />
      <Floor />
      <Rig>
        <Laptop />
        <Badges low={low} />
        <Orbiters />
      </Rig>
      <Particles count={low ? 50 : 120} />
    </Canvas>
  );
}
