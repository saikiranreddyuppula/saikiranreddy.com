import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";

interface ScrollRef {
  scrollProgress?: React.MutableRefObject<number>;
}

/* ── Ambient particle dust ────────────────────────────── */
const Particles = ({ scrollProgress }: ScrollRef) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const count = 180;

  const geometry = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      pos[i * 3 + 0] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 28;
      pos[i * 3 + 2] = Math.random() * -20;
      sizes[i] = Math.random() * 2.5 + 0.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("aSize", new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute("aPhase", new THREE.BufferAttribute(phases, 1));
    return geo;
  }, []);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uScroll.value = scrollProgress?.current ?? 0;
    }
  });

  return (
    <points geometry={geometry}>
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
        }}
        vertexShader={
          /* glsl */ `
          attribute float aSize;
          attribute float aPhase;
          uniform float uTime;
          uniform float uScroll;
          varying float vAlpha;

          void main() {
            vec3 p = position;
            float t = uTime * 0.15;
            p.x += sin(t + aPhase) * 0.6;
            p.y += cos(t * 0.8 + aPhase * 1.7) * 0.5;
            p.z += sin(t * 0.5 + aPhase * 2.3) * 0.3;

            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = aSize * (120.0 / -mv.z);

            float d = length(p.xy);
            vAlpha = smoothstep(22.0, 2.0, d) * (0.25 + uScroll * 0.2);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            gl_FragColor = vec4(1.0, 1.0, 1.0, smoothstep(0.5, 0.0, d) * vAlpha);
          }
        `
        }
      />
    </points>
  );
};

/* ── Central wireframe icosahedron ────────────────────── */
const CentralShape = ({ scrollProgress }: ScrollRef) => {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.elapsedTime;
    const sp = scrollProgress?.current ?? 0;

    meshRef.current.rotation.x = t * 0.08 + sp * 1.2;
    meshRef.current.rotation.y = t * 0.12;
    meshRef.current.rotation.z = t * 0.06;

    const breathe = 1 + Math.sin(t * 0.4) * 0.04;
    const scrollScale = 1 + sp * 0.25;
    meshRef.current.scale.setScalar(breathe * scrollScale);
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -6]}>
      <icosahedronGeometry args={[3.5, 1]} />
      <meshBasicMaterial
        wireframe
        color="#ffffff"
        opacity={0.035}
        transparent
      />
    </mesh>
  );
};

/* ── Orbital rings ────────────────────────────────────── */
const OrbitalRings = () => {
  const groupRef = useRef<THREE.Group>(null);

  const rings = useMemo(
    () => [
      {
        radius: 5.5,
        rotation: [1.0, 0, 0] as [number, number, number],
        speed: 0.06,
        opacity: 0.05,
      },
      {
        radius: 6.5,
        rotation: [0.5, 0.8, 0] as [number, number, number],
        speed: -0.04,
        opacity: 0.035,
      },
      {
        radius: 7.5,
        rotation: [0.2, 1.5, 0.3] as [number, number, number],
        speed: 0.03,
        opacity: 0.025,
      },
    ],
    [],
  );

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    groupRef.current.children.forEach((child, i) => {
      child.rotation.z += rings[i].speed * delta;
    });
  });

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {rings.map((r, i) => (
        <mesh key={i} rotation={r.rotation}>
          <torusGeometry args={[r.radius, 0.015, 4, 120]} />
          <meshBasicMaterial color="#ffffff" opacity={r.opacity} transparent />
        </mesh>
      ))}
    </group>
  );
};

/* ── Accent shapes at edges ───────────────────────────── */
const AccentShapes = ({ scrollProgress }: ScrollRef) => {
  const refs = useRef<(THREE.Mesh | null)[]>([]);

  const shapes = useMemo(
    () => [
      { x: -10, y: 5, z: -12, type: "oct" as const, r: 1.4, spd: 0.25, op: 0.04 },
      { x: 11, y: -3, z: -9, type: "dod" as const, r: 1.2, spd: 0.2, op: 0.035 },
      { x: -8, y: -6, z: -14, type: "ico" as const, r: 1.6, spd: 0.18, op: 0.03 },
      { x: 9, y: 6, z: -16, type: "oct" as const, r: 1.0, spd: 0.3, op: 0.03 },
    ],
    [],
  );

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    const sp = scrollProgress?.current ?? 0;

    refs.current.forEach((mesh, i) => {
      if (!mesh) return;
      const s = shapes[i];
      const dir = i % 2 === 0 ? 1 : -1;

      mesh.rotation.x = t * s.spd * 0.4 * dir;
      mesh.rotation.y = t * s.spd * 0.3;

      mesh.position.y = s.y + Math.sin(t * 0.2 + i * 1.8) * 0.5;
      mesh.position.x = s.x + Math.cos(t * 0.15 + i * 2.4) * 0.3;

      const scale = 1 + sp * 0.15;
      mesh.scale.setScalar(scale);
    });
  });

  return (
    <group>
      {shapes.map((s, i) => (
        <mesh
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          position={[s.x, s.y, s.z]}
        >
          {s.type === "ico" && <icosahedronGeometry args={[s.r, 0]} />}
          {s.type === "oct" && <octahedronGeometry args={[s.r, 0]} />}
          {s.type === "dod" && <dodecahedronGeometry args={[s.r, 0]} />}
          <meshBasicMaterial
            wireframe
            color="#ffffff"
            opacity={s.op}
            transparent
          />
        </mesh>
      ))}
    </group>
  );
};

/* ── Subtle background glow ──────────────────────────── */
const BackgroundGlow = ({ scrollProgress }: ScrollRef) => {
  const matRef = useRef<THREE.ShaderMaterial>(null);

  useFrame(({ clock }) => {
    if (matRef.current) {
      matRef.current.uniforms.uTime.value = clock.elapsedTime;
      matRef.current.uniforms.uScroll.value = scrollProgress?.current ?? 0;
    }
  });

  return (
    <mesh position={[0, 0, -20]}>
      <planeGeometry args={[50, 50]} />
      <shaderMaterial
        ref={matRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
        }}
        vertexShader={
          /* glsl */ `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          varying vec2 vUv;
          uniform float uTime;
          uniform float uScroll;

          void main() {
            float d = distance(vUv, vec2(0.5));
            float pulse = 1.0 + sin(uTime * 0.3) * 0.1;
            float glow = exp(-d * 6.0) * 0.08 * pulse;
            glow += exp(-d * 2.5) * 0.02;
            gl_FragColor = vec4(1.0, 1.0, 1.0, glow);
          }
        `
        }
      />
    </mesh>
  );
};

/* ── Main scene ───────────────────────────────────────── */
interface AboutSceneProps {
  scrollProgress?: React.MutableRefObject<number>;
}

const AboutScene = ({ scrollProgress }: AboutSceneProps) => (
  <div
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 15], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: false }}
    >
      <color attach="background" args={["#000000"]} />
      <BackgroundGlow scrollProgress={scrollProgress} />
      <Particles scrollProgress={scrollProgress} />
      <CentralShape scrollProgress={scrollProgress} />
      <OrbitalRings />
      <AccentShapes scrollProgress={scrollProgress} />
    </Canvas>
  </div>
);

export default AboutScene;
