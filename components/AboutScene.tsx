import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";

interface ScrollRef {
  scrollProgress?: React.MutableRefObject<number>;
}

/* ── Neural Mesh — displaced wireframe icosahedron ───── */
const NeuralMesh = ({ scrollProgress }: ScrollRef) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const matRef = useRef<THREE.ShaderMaterial>(null);

  const geometry = useMemo(() => {
    return new THREE.IcosahedronGeometry(3.2, 4);
  }, []);

  useFrame(({ clock }) => {
    if (!meshRef.current || !matRef.current) return;
    const t = clock.elapsedTime;
    const sp = scrollProgress?.current ?? 0;

    // Slow rotation
    meshRef.current.rotation.x = t * 0.06;
    meshRef.current.rotation.y = t * 0.08;

    // Breathing scale
    const breathe = 1 + Math.sin(t * 0.3) * 0.03;
    const scrollScale = 1 + sp * 0.15;
    meshRef.current.scale.setScalar(breathe * scrollScale);

    // Update shader uniforms
    matRef.current.uniforms.uTime.value = t;
    matRef.current.uniforms.uScroll.value = sp;
  });

  return (
    <mesh ref={meshRef} geometry={geometry} position={[0, 0, -5]}>
      <shaderMaterial
        ref={matRef}
        wireframe
        transparent
        depthWrite={false}
        uniforms={{
          uTime: { value: 0 },
          uScroll: { value: 0 },
        }}
        vertexShader={
          /* glsl */ `
          uniform float uTime;
          uniform float uScroll;
          varying float vEdgeDist;

          // Simple noise helper
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
          vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

          float snoise(vec3 v) {
            const vec2 C = vec2(1.0/6.0, 1.0/3.0);
            const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
            vec3 i = floor(v + dot(v, C.yyy));
            vec3 x0 = v - i + dot(i, C.xxx);
            vec3 g = step(x0.yzx, x0.xyz);
            vec3 l = 1.0 - g;
            vec3 i1 = min(g.xyz, l.zxy);
            vec3 i2 = max(g.xyz, l.zxy);
            vec3 x1 = x0 - i1 + C.xxx;
            vec3 x2 = x0 - i2 + C.yyy;
            vec3 x3 = x0 - D.yyy;
            i = mod289(i);
            vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
            float n_ = 0.142857142857;
            vec3 ns = n_ * D.wyz - D.xzx;
            vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
            vec4 x_ = floor(j * ns.z);
            vec4 y_ = floor(j - 7.0 * x_);
            vec4 x = x_ * ns.x + ns.yyyy;
            vec4 y = y_ * ns.x + ns.yyyy;
            vec4 h = 1.0 - abs(x) - abs(y);
            vec4 b0 = vec4(x.xy, y.xy);
            vec4 b1 = vec4(x.zw, y.zw);
            vec4 s0 = floor(b0) * 2.0 + 1.0;
            vec4 s1 = floor(b1) * 2.0 + 1.0;
            vec4 sh = -step(h, vec4(0.0));
            vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
            vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
            vec3 p0 = vec3(a0.xy, h.x);
            vec3 p1 = vec3(a0.zw, h.y);
            vec3 p2 = vec3(a1.xy, h.z);
            vec3 p3 = vec3(a1.zw, h.w);
            vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
            p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
            vec4 m = max(0.5 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
            m = m * m;
            return 105.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
          }

          void main() {
            vec3 pos = position;
            float t = uTime * 0.25;
            float freq = 0.6 + uScroll * 0.3;

            // Displace vertices along normal using noise
            float noise = snoise(pos * freq + t);
            float displacement = noise * (0.15 + uScroll * 0.1);
            pos += normal * displacement;

            // Secondary ripple
            float ripple = sin(pos.y * 3.0 + t * 2.0) * 0.04;
            pos += normal * ripple;

            vEdgeDist = 0.5 + noise * 0.5;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `
        }
        fragmentShader={
          /* glsl */ `
          uniform float uScroll;
          varying float vEdgeDist;

          void main() {
            float baseOpacity = 0.12 + uScroll * 0.06;
            float edgeFade = 0.8 + vEdgeDist * 0.4;
            gl_FragColor = vec4(1.0, 1.0, 1.0, baseOpacity * edgeFade);
          }
        `
        }
      />
    </mesh>
  );
};

/* ── Background glow (enhanced) ──────────────────────── */
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
            float pulse = 1.0 + sin(uTime * 0.3) * 0.15;
            float glow = exp(-d * 5.0) * 0.18 * pulse;
            glow += exp(-d * 2.0) * 0.05;
            glow *= (1.0 + uScroll * 0.3);
            gl_FragColor = vec4(1.0, 1.0, 1.0, glow);
          }
        `
        }
      />
    </mesh>
  );
};

/* ── Mouse-reactive camera ───────────────────────────── */
const MouseCamera = () => {
  const { camera } = useThree();
  const mouseRef = useRef({ x: 0, y: 0 });
  const smoothRef = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = THREE.MathUtils.clamp(
        (e.clientX / window.innerWidth) * 2 - 1,
        -1,
        1,
      );
      mouseRef.current.y = THREE.MathUtils.clamp(
        -(e.clientY / window.innerHeight) * 2 + 1,
        -1,
        1,
      );
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame(() => {
    smoothRef.current.x +=
      (mouseRef.current.x - smoothRef.current.x) * 0.03;
    smoothRef.current.y +=
      (mouseRef.current.y - smoothRef.current.y) * 0.03;

    camera.position.x = smoothRef.current.x * 0.8;
    camera.position.y = smoothRef.current.y * 0.5;
    camera.lookAt(0, 0, -5);
  });

  return null;
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
      camera={{ position: [0, 0, 12], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true }}
    >
      <color attach="background" args={["#000000"]} />
      <BackgroundGlow scrollProgress={scrollProgress} />
      <NeuralMesh scrollProgress={scrollProgress} />
      <MouseCamera />
    </Canvas>
  </div>
);

export default AboutScene;
