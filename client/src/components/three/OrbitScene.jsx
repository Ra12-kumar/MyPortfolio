import { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { glowTexture, techTileTexture } from './textures';
import { techIcons } from './techIcons';
import { technologies } from './techMeta';

/**
 * Technology orbit: logo tiles circling a glowing core on three tilted rings.
 * Hover pauses/slows the orbit and highlights a tile; click/tap selects it
 * (selection is owned by the parent so the DOM list and 3D scene stay in sync).
 * Loaded lazily (see TechnologyOrbit3D).
 */

const SKY = '#7c9cff';
const VIOLET = '#8b5cf6';

// category -> ring layout
const RINGS = {
  frontend: { radius: 2.15, tilt: [0.45, 0, 0.1], speed: 0.22 },
  backend: { radius: 2.85, tilt: [-0.5, 0.2, -0.15], speed: -0.17 },
  data: { radius: 3.5, tilt: [0.15, -0.1, 0.35], speed: 0.13 },
};
const ringOf = (category) => (category === 'database' || category === 'ai' ? 'data' : category);

function Core() {
  const inner = useRef();
  const shell = useRef();
  const halo = useMemo(() => glowTexture('rgba(91,124,250,0.7)'), []);
  useEffect(() => () => halo.dispose(), [halo]);
  useFrame((state, dt) => {
    inner.current.rotation.y += dt * 0.3;
    shell.current.rotation.y -= dt * 0.15;
    shell.current.rotation.x += dt * 0.06;
    inner.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.02);
  });
  return (
    <group>
      <sprite scale={[3.6, 3.6, 1]}>
        <spriteMaterial map={halo} transparent depthWrite={false} blending={THREE.AdditiveBlending} opacity={0.7} />
      </sprite>
      <mesh ref={inner}>
        <icosahedronGeometry args={[0.8, 2]} />
        <meshStandardMaterial color="#16205f" emissive="#3446c8" emissiveIntensity={0.12} metalness={0.5} roughness={0.4} flatShading />
      </mesh>
      <mesh ref={shell} scale={1.35}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshBasicMaterial color={SKY} wireframe transparent opacity={0.18} />
      </mesh>
    </group>
  );
}

function RingLine({ radius, tilt }) {
  const geo = useMemo(() => {
    const pts = Array.from({ length: 129 }, (_, i) => {
      const a = (i / 128) * Math.PI * 2;
      return new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius);
    });
    return new THREE.BufferGeometry().setFromPoints(pts);
  }, [radius]);
  useEffect(() => () => geo.dispose(), [geo]);
  return (
    <group rotation={tilt}>
      <line geometry={geo}>
        <lineBasicMaterial color={SKY} transparent opacity={0.16} />
      </line>
    </group>
  );
}

function Tile({ tech, angle, ring, controls, selectedId, onSelect, tex, glowTex }) {
  const group = useRef();
  const sprite = useRef();
  const glow = useRef();
  const hovered = useRef(false);
  const { radius, speed } = RINGS[ring];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    const a = angle + controls.phase * speed * 3.2;
    group.current.position.set(Math.cos(a) * radius, Math.sin(t * 0.8 + angle * 3) * 0.06, Math.sin(a) * radius);

    const isSelected = selectedId === tech.id;
    const targetScale = isSelected ? 1.5 : hovered.current ? 1.28 : 1;
    const s = THREE.MathUtils.lerp(sprite.current.scale.x, 0.95 * targetScale, 0.15);
    sprite.current.scale.set(s, s * 1.17, 1);
    const g = glow.current.material;
    g.opacity = THREE.MathUtils.lerp(g.opacity, isSelected ? 0.95 : hovered.current ? 0.6 : 0, 0.15);
    glow.current.scale.setScalar(s * 2.1);
    // keep nearer tiles on top of the core and farther ones dimmed slightly for depth
    const depth = (group.current.position.z + radius) / (radius * 2); // 0 far .. 1 near
    sprite.current.material.opacity = 0.55 + depth * 0.45;
  });

  return (
    <group ref={group}>
      <sprite ref={glow} scale={[2, 2, 1]} renderOrder={1}>
        <spriteMaterial map={glowTex} color={SKY} transparent opacity={0} depthWrite={false} blending={THREE.AdditiveBlending} />
      </sprite>
      <sprite
        ref={sprite}
        renderOrder={2}
        onPointerOver={(e) => {
          e.stopPropagation();
          hovered.current = true;
          controls.hover += 1;
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          if (!hovered.current) return;
          hovered.current = false;
          controls.hover = Math.max(0, controls.hover - 1);
          document.body.style.cursor = '';
        }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(selectedId === tech.id ? null : tech.id);
        }}
      >
        <spriteMaterial map={tex} transparent depthWrite={false} />
      </sprite>
    </group>
  );
}

function Orbit({ selectedId, onSelect, low }) {
  const rigRef = useRef();
  const controls = useMemo(() => ({ phase: 0, hover: 0, speed: 1 }), []);
  const glowTex = useMemo(() => glowTexture('rgba(124,156,255,1)'), []);

  // one texture per technology, created once and disposed on unmount
  const textures = useMemo(
    () => Object.fromEntries(technologies.map((t) => [t.id, techTileTexture({ name: t.name, ...techIcons[t.id] })])),
    [],
  );
  useEffect(
    () => () => {
      Object.values(textures).forEach((t) => t.dispose());
      glowTex.dispose();
      document.body.style.cursor = '';
    },
    [textures, glowTex],
  );

  // spread each ring's members evenly
  const layout = useMemo(() => {
    const groups = {};
    technologies.forEach((t) => {
      const ring = ringOf(t.category);
      (groups[ring] ||= []).push(t);
    });
    return Object.entries(groups).flatMap(([ring, list]) =>
      list.map((tech, i) => ({ tech, ring, angle: (i / list.length) * Math.PI * 2 + (ring === 'backend' ? 0.5 : 0) })),
    );
  }, []);

  useFrame((state, dt) => {
    // slow right down while hovering or with something selected, but never fully stop
    const target = controls.hover > 0 ? 0.08 : selectedId ? 0.3 : 1;
    controls.speed = THREE.MathUtils.lerp(controls.speed, target, 0.06);
    controls.phase += dt * controls.speed;
    // gentle pointer parallax for the whole system
    const g = rigRef.current;
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.25, 0.04);
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, 0.18 - state.pointer.y * 0.15, 0.04);
  });

  return (
    <group ref={rigRef}>
      <Core />
      {Object.entries(RINGS).map(([k, r]) => (
        <RingLine key={k} radius={r.radius} tilt={r.tilt} />
      ))}
      {Object.entries(RINGS).map(([ring, r]) => (
        <group key={ring} rotation={r.tilt}>
          {layout
            .filter((l) => l.ring === ring)
            .map(({ tech, angle }) => (
              <Tile
                key={tech.id}
                tech={tech}
                angle={angle}
                ring={ring}
                controls={controls}
                selectedId={selectedId}
                onSelect={onSelect}
                tex={textures[tech.id]}
                glowTex={glowTex}
              />
            ))}
        </group>
      ))}
      {!low && <Dust />}
    </group>
  );
}

function Dust() {
  const tex = useMemo(() => glowTexture('rgba(169,188,255,1)'), []);
  const positions = useMemo(() => {
    const arr = new Float32Array(90 * 3);
    for (let i = 0; i < 90; i += 1) {
      const r = 3 + Math.random() * 2.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      arr.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
    }
    return arr;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <points>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial map={tex} size={0.08} transparent opacity={0.5} depthWrite={false} blending={THREE.AdditiveBlending} sizeAttenuation />
    </points>
  );
}

export default function OrbitScene({ active = true, quality = 'high', selectedId = null, onSelect = () => {} }) {
  const low = quality === 'low';
  return (
    <Canvas
      dpr={low ? [1, 1.5] : [1, 2]}
      camera={{ position: [0, 0.4, 9.4], fov: 42 }}
      gl={{ antialias: !low, alpha: true, powerPreference: 'high-performance' }}
      frameloop={active ? 'always' : 'never'}
      // vertical swipes keep scrolling the page; taps select a technology
      style={{ touchAction: 'pan-y' }}
      aria-hidden="true"
      onPointerMissed={() => selectedId && onSelect(null)}
    >
      <ambientLight intensity={0.6} />
      <pointLight position={[4, 3, 5]} intensity={26} color={VIOLET} />
      <Orbit selectedId={selectedId} onSelect={onSelect} low={low} />
    </Canvas>
  );
}
