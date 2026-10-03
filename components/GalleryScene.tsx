import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { clamp01, smoothstep } from "./sceneHooks";
import { galleryPosition } from "./sceneTimeline";
import { SCULPTURES } from "./Sculptures";

type ProgressRef = React.MutableRefObject<number>;

export const GALLERY_SPACING = 6;
const FLOOR_Y = -1.5;
const PLINTH_H = 1.1;
const PLINTH_TOP = FLOOR_Y + PLINTH_H;
const BEAM_TOP = 3.8;

/* ── Fake volumetric beam from the ceiling ────────────────────── */
const beamMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
    uniforms: { uIntensity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        vUv = uv;
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vViewDir = normalize(-mv.xyz);
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * mv;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensity;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewDir;
      void main() {
        float facing = pow(abs(dot(vNormal, vViewDir)), 1.6);
        float along = smoothstep(0.0, 0.35, vUv.y) * (0.35 + 0.65 * vUv.y);
        gl_FragColor = vec4(vec3(1.0), facing * along * uIntensity * 0.16);
      }
    `,
  });

/* ── Soft pool of light on the floor ──────────────────────────── */
const poolMaterial = () =>
  new THREE.ShaderMaterial({
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    uniforms: { uIntensity: { value: 0 } },
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform float uIntensity;
      varying vec2 vUv;
      void main() {
        float r = length(vUv - 0.5) * 2.0;
        float a = pow(clamp(1.0 - r, 0.0, 1.0), 2.2);
        gl_FragColor = vec4(vec3(1.0), a * uIntensity * 0.22);
      }
    `,
  });

interface ExhibitProps {
  index: number;
  position: ProgressRef;
  tags: string[];
  exploded: boolean;
  focused: boolean;
  reduced: boolean;
}

const Exhibit = ({ index, position, tags, exploded, focused, reduced }: ExhibitProps) => {
  const spotRef = useRef<THREE.SpotLight>(null);
  const sculptureRef = useRef<THREE.Group>(null);
  const lit = useRef(0);
  const explode = useRef(0);
  const target = useMemo(() => new THREE.Object3D(), []);
  const beam = useMemo(beamMaterial, []);
  const pool = useMemo(poolMaterial, []);
  const beamGeo = useMemo(() => {
    const h = BEAM_TOP - PLINTH_TOP;
    const geo = new THREE.CylinderGeometry(0.06, 1.35, h, 48, 1, true);
    geo.translate(0, -h / 2, 0); // apex at the origin
    return geo;
  }, []);

  const Sculpture = SCULPTURES[index];

  useFrame((state, delta) => {
    const dt = Math.min(delta, 0.1);
    const dist = Math.abs(position.current - index);
    const targetLit = smoothstep(0, 1, clamp01(1 - dist / 0.75));
    lit.current = THREE.MathUtils.damp(lit.current, targetLit, 6, dt);
    explode.current = THREE.MathUtils.damp(
      explode.current,
      exploded ? 1 : 0,
      5,
      dt,
    );

    const l = lit.current;
    if (spotRef.current) spotRef.current.intensity = 2 + l * 70;
    beam.uniforms.uIntensity.value = 0.12 + l * 0.88;
    pool.uniforms.uIntensity.value = 0.08 + l * 0.92;

    // Focused piece leans toward the visitor's pointer
    if (sculptureRef.current) {
      const g = sculptureRef.current;
      const k = 1 - Math.exp(-4 * dt);
      g.rotation.x += ((focused ? -state.pointer.y * 0.12 : 0) - g.rotation.x) * k;
      g.rotation.z += ((focused ? -state.pointer.x * 0.06 : 0) - g.rotation.z) * k;
    }
  });

  return (
    <group position={[index * GALLERY_SPACING, 0, 0]}>
      {/* Plinth */}
      <mesh position={[0, FLOOR_Y + PLINTH_H / 2, 0]}>
        <boxGeometry args={[1.2, PLINTH_H, 1.2]} />
        <meshStandardMaterial color="#1c1c1c" roughness={0.85} metalness={0} />
      </mesh>

      {/* Spotlight + visible beam + floor pool */}
      <primitive object={target} position={[0, PLINTH_TOP + 0.6, 0]} />
      <spotLight
        ref={spotRef}
        position={[0, BEAM_TOP + 0.6, 0.9]}
        target={target}
        color="#ffffff"
        angle={0.36}
        penumbra={0.75}
        distance={14}
        decay={1.4}
        intensity={2}
      />
      <mesh geometry={beamGeo} material={beam} position={[0, BEAM_TOP, 0]} />
      <mesh
        material={pool}
        position={[0, FLOOR_Y + 0.003, 0]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[4.8, 4.8]} />
      </mesh>

      <group ref={sculptureRef} position={[0, PLINTH_TOP, 0]}>
        <Sculpture
          lit={lit}
          explode={explode}
          tags={tags}
          labels={focused}
          labelsVisible={focused && exploded}
          reduced={reduced}
        />
      </group>
    </group>
  );
};

/* ── Camera trucks sideways along the gallery ─────────────────── */
const GalleryCamera = ({
  progress,
  position,
  count,
}: {
  progress: ProgressRef;
  position: ProgressRef;
  count: number;
}) => {
  const smooth = useRef(0);
  const tmp = useMemo(
    () => ({ pos: new THREE.Vector3(), look: new THREE.Vector3() }),
    [],
  );

  useFrame((state, delta) => {
    smooth.current = THREE.MathUtils.damp(
      smooth.current,
      progress.current,
      5,
      Math.min(delta, 0.1),
    );
    position.current = galleryPosition(smooth.current, count);

    const x = position.current * GALLERY_SPACING;
    const aspect = state.size.width / state.size.height;
    // Keep one sculpture comfortably in frame on portrait screens
    const z = Math.max(7.4, 5.2 / aspect);

    tmp.pos.set(
      x + state.pointer.x * 0.35,
      1.15 + state.pointer.y * 0.2,
      z,
    );
    state.camera.position.lerp(tmp.pos, 1 - Math.exp(-8 * delta));
    tmp.look.set(x, 0.25, 0);
    state.camera.lookAt(tmp.look);
  });

  return null;
};

interface GallerySceneProps {
  progress: ProgressRef;
  active: boolean;
  reduced: boolean;
  focusedIndex: number;
  exploded: boolean;
  items: { tags: string[] }[];
}

const GalleryScene = ({
  progress,
  active,
  reduced,
  focusedIndex,
  exploded,
  items,
}: GallerySceneProps) => {
  const position = useRef(0);

  return (
    <Canvas
      camera={{ position: [0, 1.15, 7.4], fov: 35, near: 0.1, far: 60 }}
      dpr={[1, 1.5]}
      frameloop={active ? "always" : "never"}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#000000"]} />
      <fog attach="fog" args={["#000000", 8.5, 18]} />
      <ambientLight intensity={0.04} />
      {/* Faint rim from behind so unlit pieces still read as silhouettes */}
      <directionalLight position={[0, 3, -6]} intensity={0.35} color="#ffffff" />

      {/* Floor */}
      <mesh
        position={[((items.length - 1) * GALLERY_SPACING) / 2, FLOOR_Y, 0]}
        rotation-x={-Math.PI / 2}
      >
        <planeGeometry args={[items.length * GALLERY_SPACING + 30, 30]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.9} metalness={0} />
      </mesh>

      {items.map((item, i) => (
        <Exhibit
          key={i}
          index={i}
          position={position}
          tags={item.tags}
          exploded={exploded && i === focusedIndex}
          focused={i === focusedIndex}
          reduced={reduced}
        />
      ))}

      <GalleryCamera progress={progress} position={position} count={items.length} />
    </Canvas>
  );
};

export default GalleryScene;
