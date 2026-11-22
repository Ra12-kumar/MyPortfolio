import { useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * WebGL scene: a faceted core with a wireframe shell, orbiting "system"
 * satellites (frontend / backend / database / AI) and a particle field.
 * The whole group follows the pointer with gentle parallax.
 * Loaded lazily (see Lazy3D) so three.js never blocks the first paint.
 */

const BRAND = '#5b7cfa';
const VIOLET = '#8b5cf6';
const SKY = '#7c9cff';
const MINT = '#34d399';

function CoreGeometry({ shape }) {
  switch (shape) {
    case 'torusKnot':
      return <torusKnotGeometry args={[0.75, 0.24, 160, 20]} />;
    case 'octahedron':
      return <octahedronGeometry args={[1.15, 0]} />;
    case 'dodecahedron':
      return <dodecahedronGeometry args={[1.05, 0]} />;
    case 'torus':
      return <torusGeometry args={[0.85, 0.32, 24, 80]} />;
    default:
      return <icosahedronGeometry args={[1.05, 1]} />;
  }
}

function Core({ shape }) {
  const inner = useRef();
  const shell = useRef();
  useFrame((state, dt) => {
    inner.current.rotation.y += dt * 0.25;
    inner.current.rotation.x += dt * 0.08;
    shell.current.rotation.y -= dt * 0.12;
    shell.current.rotation.z += dt * 0.05;
    const pulse = 1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.025;
    inner.current.scale.setScalar(pulse);
  });
  return (
    <group>
      <mesh ref={inner}>
        <CoreGeometry shape={shape} />
        <meshStandardMaterial color="#3a4fc4" emissive={BRAND} emissiveIntensity={0.12} metalness={0.55} roughness={0.3} flatShading />
      </mesh>
      <mesh ref={shell} scale={1.42}>
        <icosahedronGeometry args={[1.05, 1]} />
        <meshBasicMaterial color={SKY} wireframe transparent opacity={0.16} />
      </mesh>
    </group>
  );
}

function Orbit({ radius, speed, tilt, color, size = 0.09, offset = 0 }) {
  const sat = useRef();
  useFrame((state) => {
    const a = state.clock.elapsedTime * speed + offset;
    sat.current.position.set(Math.cos(a) * radius, 0, Math.sin(a) * radius);
  });
  return (
    <group rotation={tilt}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[radius, 0.004, 6, 160]} />
        <meshBasicMaterial color={color} transparent opacity={0.35} />
      </mesh>
      <mesh ref={sat}>
        <sphereGeometry args={[size, 24, 24]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={1.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

function Particles({ count = 500 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      // Uniform-ish distribution in a spherical shell.
      const r = 2.6 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);
  useFrame((_, dt) => {
    ref.current.rotation.y += dt * 0.02;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#a9bcff" transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Rig({ children }) {
  const group = useRef();
  useFrame((state) => {
    const g = group.current;
    g.rotation.x = THREE.MathUtils.lerp(g.rotation.x, state.pointer.y * 0.25, 0.04);
    g.rotation.y = THREE.MathUtils.lerp(g.rotation.y, state.pointer.x * 0.35, 0.04);
    g.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
  });
  return <group ref={group}>{children}</group>;
}

export default function Scene3D({ shape = 'icosahedron', active = true, orbits = true, particles = 500, distance = 5.2 }) {
  return (
    <Canvas
      dpr={[1, 1.75]}
      camera={{ position: [0, 0, distance], fov: 45 }}
      gl={{ antialias: true, alpha: true, powerPreference: 'low-power' }}
      frameloop={active ? 'always' : 'never'}
      aria-hidden="true"
    >
      <ambientLight intensity={0.25} />
      <directionalLight position={[2, 4, 3]} intensity={2.2} color="#ffffff" />
      <pointLight position={[3, 3, 4]} intensity={30} color={SKY} />
      <pointLight position={[-4, -2, 2]} intensity={20} color={VIOLET} />
      <Rig>
        <Core shape={shape} />
        {orbits && (
          <>
            <Orbit radius={1.9} speed={0.55} tilt={[0.35, 0, 0.15]} color={SKY} />
            <Orbit radius={2.25} speed={-0.4} tilt={[-0.5, 0.3, -0.2]} color={VIOLET} offset={2} />
            <Orbit radius={2.6} speed={0.3} tilt={[1.1, -0.2, 0.4]} color={MINT} size={0.07} offset={4} />
          </>
        )}
        {particles > 0 && <Particles count={particles} />}
      </Rig>
    </Canvas>
  );
}
