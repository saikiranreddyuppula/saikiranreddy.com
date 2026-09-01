import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sparkles } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

const fibonacciSphere = (count: number, radius: number) => {
  const pts: THREE.Vector3[] = [];
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const theta = golden * i;
    pts.push(
      new THREE.Vector3(
        Math.cos(theta) * r * radius,
        y * radius,
        Math.sin(theta) * r * radius,
      ),
    );
  }
  return pts;
};

const Core = () => {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    const t = clock.elapsedTime;
    if (group.current) {
      group.current.rotation.y = t * 0.12;
      group.current.rotation.x = Math.sin(t * 0.18) * 0.12;
    }
    if (inner.current) {
      const s = 1 + Math.sin(t * 0.7) * 0.03;
      inner.current.scale.setScalar(s);
    }
  });

  return (
    <group ref={group}>
      <Float speed={1.2} rotationIntensity={0.25} floatIntensity={0.4}>
        <mesh ref={inner}>
          <icosahedronGeometry args={[1.55, 16]} />
          <MeshDistortMaterial
            color="#f4f4f4"
            emissive="#8a8a8a"
            emissiveIntensity={0.35}
            roughness={0.18}
            metalness={0.92}
            distort={0.38}
            speed={1.4}
            transparent
            opacity={0.72}
          />
        </mesh>
        <mesh scale={1.045}>
          <icosahedronGeometry args={[1.55, 1]} />
          <meshBasicMaterial
            color="#ffffff"
            wireframe
            transparent
            opacity={0.22}
          />
        </mesh>
      </Float>
    </group>
  );
};

const Constellation = () => {
  const points = useMemo(() => fibonacciSphere(22, 3.35), []);
  const dots = useRef<THREE.Group>(null);
  const lineGeo = useMemo(() => {
    const positions: number[] = [];
    points.forEach((p, i) => {
      if (i % 2 === 0) {
        positions.push(0, 0, 0, p.x, p.y, p.z);
      }
      const next = points[(i + 5) % points.length];
      positions.push(p.x, p.y, p.z, next.x, next.y, next.z);
    });
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return geo;
  }, [points]);

  useFrame(({ clock }) => {
    if (dots.current) dots.current.rotation.y = clock.elapsedTime * 0.07;
  });

  return (
    <group ref={dots}>
      <lineSegments geometry={lineGeo}>
        <lineBasicMaterial
          color="#ffffff"
          transparent
          opacity={0.16}
          depthWrite={false}
        />
      </lineSegments>
      {points.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[i % 5 === 0 ? 0.055 : 0.028, 10, 10]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.85} />
        </mesh>
      ))}
    </group>
  );
};

const MouseRig = () => {
  const { camera } = useThree();
  const target = useRef({ x: 0, y: 0 });
  const cur = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      target.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      target.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  useFrame(() => {
    cur.current.x += (target.current.x - cur.current.x) * 0.035;
    cur.current.y += (target.current.y - cur.current.y) * 0.035;
    camera.position.x = cur.current.x * 1.1;
    camera.position.y = cur.current.y * 0.55;
    camera.lookAt(0, 0, 0);
  });

  return null;
};

const SkillField = () => (
  <div
    aria-hidden
    style={{
      position: "absolute",
      inset: 0,
      zIndex: 0,
      pointerEvents: "none",
    }}
  >
    <Canvas
      camera={{ position: [0, 0, 7.2], fov: 42 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 6, 16]} />
      <ambientLight intensity={0.35} />
      <pointLight position={[4, 3, 5]} intensity={18} color="#ffffff" />
      <pointLight position={[-5, -2, 2]} intensity={6} color="#cfcfcf" />
      <Core />
      <Constellation />
      <Sparkles
        count={48}
        scale={[10, 6, 6]}
        size={1.6}
        speed={0.35}
        color="#ffffff"
        opacity={0.45}
      />
      <MouseRig />
    </Canvas>
  </div>
);

export default SkillField;
