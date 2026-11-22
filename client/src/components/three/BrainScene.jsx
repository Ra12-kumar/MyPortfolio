import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture } from './textures';

/**
 * AI brain: nodes distributed over a two-lobed, brain-shaped surface, joined
 * to their nearest neighbours, with pulses travelling along the connections.
 * Loaded lazily (see AIBrain3D).
 */

const BLUE = new THREE.Color('#5b7cfa');
const VIOLET = new THREE.Color('#8b5cf6');
const SKY = new THREE.Color('#a9bcff');

// Deterministic PRNG so the brain looks identical on every visit.
function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildNetwork(nodeCount) {
  const rand = mulberry32(42);
  const pts = [];
  let guard = 0;
  while (pts.length < nodeCount && guard < nodeCount * 60) {
    guard += 1;
    // random direction on a sphere
    const u = rand() * 2 - 1;
    const th = rand() * Math.PI * 2;
    const s = Math.sqrt(1 - u * u);
    const dir = new THREE.Vector3(s * Math.cos(th), u, s * Math.sin(th));
    // brain-ish ellipsoid, surface folds and a central fissure
    const fold = 1 + 0.06 * Math.sin(dir.x * 7 + dir.y * 5) * Math.cos(dir.z * 6);
    const depth = rand() < 0.78 ? 1 : 0.55 + rand() * 0.35; // most nodes on the cortex, some inside
    const p = new THREE.Vector3(dir.x * 1.55, dir.y * 1.1, dir.z * 1.3).multiplyScalar(fold * depth);
    p.y += dir.y > 0 ? 0.0 : -0.15 * Math.abs(dir.y); // flatter underside
    if (Math.abs(p.x) < 0.1) p.x += p.x >= 0 ? 0.1 : -0.1; // fissure between hemispheres
    if (pts.every((q) => q.distanceToSquared(p) > 0.085)) pts.push(p);
  }

  // connect each node to its 3 nearest neighbours (deduplicated)
  const edgeSet = new Set();
  const edges = [];
  pts.forEach((p, i) => {
    pts
      .map((q, j) => ({ j, d: p.distanceToSquared(q) }))
      .filter((o) => o.j !== i && o.d < 0.9)
      .sort((a, b) => a.d - b.d)
      .slice(0, 3)
      .forEach(({ j }) => {
        const key = i < j ? `${i}-${j}` : `${j}-${i}`;
        if (!edgeSet.has(key)) {
          edgeSet.add(key);
          edges.push([i, j]);
        }
      });
  });

  const adjacency = pts.map(() => []);
  edges.forEach(([a, b], idx) => {
    adjacency[a].push({ edge: idx, to: b });
    adjacency[b].push({ edge: idx, to: a });
  });
  return { pts, edges, adjacency };
}

function Network({ nodeCount, pulseCount, hoverRef }) {
  const group = useRef();
  const pulses = useRef();
  const nodesMat = useRef();
  const glow = useMemo(() => glowTexture('rgba(255,255,255,1)'), []);
  const net = useMemo(() => buildNetwork(nodeCount), [nodeCount]);

  const { nodePos, nodeCol, linePos, pulseState, pulsePos, pulseCol } = useMemo(() => {
    const { pts, edges } = net;
    const nodePos = new Float32Array(pts.length * 3);
    const nodeCol = new Float32Array(pts.length * 3);
    pts.forEach((p, i) => {
      nodePos.set([p.x, p.y, p.z], i * 3);
      const c = BLUE.clone().lerp(VIOLET, (p.x + 1.6) / 3.2);
      nodeCol.set([c.r, c.g, c.b], i * 3);
    });
    const linePos = new Float32Array(edges.length * 6);
    edges.forEach(([a, b], i) => {
      linePos.set([pts[a].x, pts[a].y, pts[a].z, pts[b].x, pts[b].y, pts[b].z], i * 6);
    });
    const rand = mulberry32(7);
    const pulseState = Array.from({ length: pulseCount }, () => {
      const node = Math.floor(rand() * pts.length);
      return { from: node, to: node, t: 1, speed: 0.5 + rand() * 0.6 };
    });
    const pulseCol = new Float32Array(pulseCount * 3);
    for (let i = 0; i < pulseCount; i += 1) {
      const c = SKY.clone().lerp(VIOLET, rand() * 0.6);
      pulseCol.set([c.r, c.g, c.b], i * 3);
    }
    return { nodePos, nodeCol, linePos, pulseState, pulsePos: new Float32Array(pulseCount * 3), pulseCol };
  }, [net, pulseCount]);

  useEffect(() => () => glow.dispose(), [glow]);

  useFrame((state, dt) => {
    const g = group.current;
    const hover = hoverRef.current;
    // continuous rotation, pointer tilt, hover emphasis
    g.rotation.y += dt * (hover ? 0.28 : 0.16);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, -state.pointer.y * 0.3, 0.05);
    g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, -state.pointer.x * 0.12, 0.05);
    g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, hover ? 1.06 : 1, 0.06));
    nodesMat.current.size = THREE.MathUtils.lerp(nodesMat.current.size, hover ? 0.17 : 0.12, 0.08);

    // advance pulses along the connections
    const { pts, adjacency } = net;
    const boost = hover ? 1.8 : 1;
    pulseState.forEach((p, i) => {
      p.t += dt * p.speed * boost;
      if (p.t >= 1) {
        const options = adjacency[p.to];
        const next = options[Math.floor(Math.random() * options.length)];
        p.from = p.to;
        p.to = next ? next.to : p.to;
        p.t = 0;
      }
      const a = pts[p.from];
      const b = pts[p.to];
      pulsePos[i * 3] = a.x + (b.x - a.x) * p.t;
      pulsePos[i * 3 + 1] = a.y + (b.y - a.y) * p.t;
      pulsePos[i * 3 + 2] = a.z + (b.z - a.z) * p.t;
    });
    const attr = pulses.current.geometry.attributes.position;
    attr.array.set(pulsePos);
    attr.needsUpdate = true;
  });

  return (
    <group ref={group}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[linePos, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#6f86ff" transparent opacity={0.28} blending={THREE.AdditiveBlending} depthWrite={false} />
      </lineSegments>

      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[nodePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[nodeCol, 3]} />
        </bufferGeometry>
        <pointsMaterial
          ref={nodesMat}
          map={glow}
          size={0.12}
          vertexColors
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          sizeAttenuation
        />
      </points>

      <points ref={pulses} frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[pulsePos, 3]} />
          <bufferAttribute attach="attributes-color" args={[pulseCol, 3]} />
        </bufferGeometry>
        <pointsMaterial map={glow} size={0.24} vertexColors transparent depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
      </points>
    </group>
  );
}

function Halo() {
  const tex = useMemo(() => glowTexture('rgba(91,124,250,0.55)'), []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <sprite scale={[6.4, 6.4, 1]} position={[0, 0, -1.5]}>
      <spriteMaterial map={tex} transparent depthWrite={false} opacity={0.55} blending={THREE.AdditiveBlending} />
    </sprite>
  );
}

export default function BrainScene({ active = true, quality = 'high' }) {
  const low = quality === 'low';
  const hoverRef = useRef(false);
  return (
    <Canvas
      dpr={low ? [1, 1.25] : [1, 1.75]}
      camera={{ position: [0, 0, 5.4], fov: 42 }}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
      onPointerEnter={() => {
        hoverRef.current = true;
      }}
      onPointerLeave={() => {
        hoverRef.current = false;
      }}
    >
      <Halo />
      <Network nodeCount={low ? 70 : 130} pulseCount={low ? 18 : 36} hoverRef={hoverRef} />
    </Canvas>
  );
}
