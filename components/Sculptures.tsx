import { useFrame } from "@react-three/fiber";
import { Html, RoundedBox } from "@react-three/drei";
import React, { useMemo, useRef } from "react";
import * as THREE from "three";

/*
 * Six gallery sculptures — one per industry. All share one matte "plaster"
 * material so the gallery reads as a single collection under spotlights.
 * Each is built from parts that separate when `explode` goes 0 → 1, and
 * the industry's three tags appear as labels on those parts.
 */

type NumRef = React.MutableRefObject<number>;
type Vec3 = [number, number, number];

export interface SculptureProps {
  /** 0..1 — how much the spotlight is on this sculpture */
  lit: NumRef;
  /** 0..1 — eased "take apart" amount */
  explode: NumRef;
  tags: string[];
  /** Tag labels currently showing (they stay mounted; drei <Html> is
   *  unreliable to unmount under React 19) */
  labelsVisible: boolean;
  reduced: boolean;
}

/** Fine cast-plaster grain: soft blotches plus speckle, tileable. */
const makeGrainTexture = () => {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const img = ctx.createImageData(size, size);
  // Low-frequency value noise for soft blotches
  const cells = 8;
  const grid = Array.from({ length: (cells + 1) * (cells + 1) }, () => Math.random());
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const gx = (x / size) * cells;
      const gy = (y / size) * cells;
      const ix = Math.floor(gx);
      const iy = Math.floor(gy);
      const at = (cx: number, cy: number) =>
        grid[(cy % cells) * (cells + 1) + (cx % cells)];
      const top = lerp(at(ix, iy), at(ix + 1, iy), gx - ix);
      const bottom = lerp(at(ix, iy + 1), at(ix + 1, iy + 1), gx - ix);
      const blotch = lerp(top, bottom, gy - iy);
      const v = 150 + blotch * 50 + (Math.random() - 0.5) * 70;
      const i = (y * size + x) * 4;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(3, 3);
  return tex;
};

const grain = makeGrainTexture();

const plaster = new THREE.MeshStandardMaterial({
  color: "#d9d9d9",
  roughness: 0.82,
  roughnessMap: grain,
  bumpMap: grain,
  bumpScale: 0.6,
  metalness: 0,
});

const ink = new THREE.MeshStandardMaterial({
  color: "#161616",
  roughness: 0.4,
  metalness: 0.3,
});

/* ── Shared building blocks ───────────────────────────────────── */

const ExplodePart = ({
  explode,
  offset,
  position = [0, 0, 0],
  children,
}: {
  explode: NumRef;
  offset: Vec3;
  position?: Vec3;
  children: React.ReactNode;
}) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    const e = explode.current;
    ref.current?.position.set(
      position[0] + offset[0] * e,
      position[1] + offset[1] * e,
      position[2] + offset[2] * e,
    );
  });
  return (
    <group ref={ref} position={position}>
      {children}
    </group>
  );
};

const TagLabel = ({
  position,
  text,
  visible,
}: {
  position: Vec3;
  text: string;
  visible: boolean;
}) => (
  <Html position={position} center zIndexRange={[20, 10]} pointerEvents="none">
    <span className={`gal-tag${visible ? " is-visible" : ""}`}>{text}</span>
  </Html>
);

/** Slow idle turn that settles to rest while the sculpture is taken apart. */
const useIdleSpin = (
  explode: NumRef,
  reduced: boolean,
  speed: number,
): NumRef => {
  const angle = useRef(0);
  useFrame((_, delta) => {
    if (reduced) return;
    angle.current += Math.min(delta, 0.1) * speed * (1 - explode.current);
  });
  return angle;
};

/* ── 01 Ecommerce — a parcel that unfolds into its net ────────── */

const PW = 1.3;
const PH = 0.8;
const PD = 0.95;
const PT = 0.035;

const Parcel = ({ lit, explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const root = useRef<THREE.Group>(null);
  const front = useRef<THREE.Group>(null);
  const back = useRef<THREE.Group>(null);
  const left = useRef<THREE.Group>(null);
  const right = useRef<THREE.Group>(null);
  const flapL = useRef<THREE.Group>(null);
  const flapR = useRef<THREE.Group>(null);
  const spin = useIdleSpin(explode, reduced, 0.25);

  useFrame(() => {
    const e = explode.current;
    const unfold = e * (Math.PI / 2);
    if (front.current) front.current.rotation.x = unfold;
    if (back.current) back.current.rotation.x = -unfold;
    if (left.current) left.current.rotation.z = unfold;
    if (right.current) right.current.rotation.z = -unfold;

    // Flaps open as the spotlight arrives, then lie flat with the net
    const open = Math.PI * 0.62 * lit.current;
    const flap = open * (1 - e) + (Math.PI / 2) * e;
    if (flapL.current) flapL.current.rotation.z = flap;
    if (flapR.current) flapR.current.rotation.z = -flap;

    if (root.current) {
      root.current.rotation.y = -0.5 + Math.sin(spin.current) * 0.3;
      root.current.rotation.x = e * 0.55;
      root.current.position.y = e * 0.35;
    }
  });

  const innerD = PD - 2 * PT;

  return (
    <group ref={root}>
      {/* Base */}
      <mesh material={plaster} position={[0, PT / 2, 0]}>
        <boxGeometry args={[PW, PT, PD]} />
      </mesh>

      {/* Front / back walls hinge on their bottom edges */}
      <group ref={front} position={[0, 0, PD / 2]}>
        <mesh material={plaster} position={[0, PH / 2, -PT / 2]}>
          <boxGeometry args={[PW, PH, PT]} />
        </mesh>
      </group>
      <group ref={back} position={[0, 0, -PD / 2]}>
        <mesh material={plaster} position={[0, PH / 2, PT / 2]}>
          <boxGeometry args={[PW, PH, PT]} />
        </mesh>
      </group>

      {/* Side walls carry the top flaps */}
      <group ref={left} position={[-PW / 2, 0, 0]}>
        <mesh material={plaster} position={[PT / 2, PH / 2, 0]}>
          <boxGeometry args={[PT, PH, innerD]} />
        </mesh>
        <group ref={flapL} position={[PT / 2, PH, 0]}>
          <mesh material={plaster} position={[PW / 4, PT / 2, 0]}>
            <boxGeometry args={[PW / 2, PT, innerD]} />
          </mesh>
        </group>
      </group>
      <group ref={right} position={[PW / 2, 0, 0]}>
        <mesh material={plaster} position={[-PT / 2, PH / 2, 0]}>
          <boxGeometry args={[PT, PH, innerD]} />
        </mesh>
        <group ref={flapR} position={[-PT / 2, PH, 0]}>
          <mesh material={plaster} position={[-PW / 4, PT / 2, 0]}>
            <boxGeometry args={[PW / 2, PT, innerD]} />
          </mesh>
        </group>
      </group>

      {/* Contents float up out of the net: a card, a crate, a cluster */}
      <ExplodePart explode={explode} position={[-0.3, 0.07, 0.14]} offset={[-0.6, 1.05, 0.35]}>
        <RoundedBox args={[0.42, 0.025, 0.28]} radius={0.012} material={plaster} rotation-x={0.25} />
        <TagLabel position={[0, 0.3, 0]} text={tags[0]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} position={[0.3, 0.18, -0.12]} offset={[0.6, 1.25, 0]}>
        <mesh material={plaster} rotation-y={0.4}>
          <boxGeometry args={[0.28, 0.28, 0.28]} />
        </mesh>
        <TagLabel position={[0, 0.38, 0]} text={tags[1]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} position={[-0.05, 0.09, -0.24]} offset={[0.05, 1.75, -0.3]}>
        {[
          [-0.07, -0.07],
          [0.07, -0.07],
          [-0.07, 0.07],
          [0.07, 0.07],
        ].map(([x, z], i) => (
          <mesh key={i} material={ink} position={[x, 0, z]}>
            <boxGeometry args={[0.1, 0.1, 0.1]} />
          </mesh>
        ))}
        <TagLabel position={[0, 0.3, 0]} text={tags[2]} visible={labelsVisible} />
      </ExplodePart>
    </group>
  );
};

/* ── 02 Cyber Security — a padlock inside gyroscope rings ─────── */

const Padlock = ({ explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const root = useRef<THREE.Group>(null);
  const rings = useRef<THREE.Group>(null);
  const ringA = useRef<THREE.Mesh>(null);
  const ringB = useRef<THREE.Mesh>(null);
  const spin = useIdleSpin(explode, reduced, 0.3);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const e = explode.current;
    if (root.current) {
      root.current.rotation.y = Math.sin(spin.current) * 0.45;
      root.current.position.y = Math.sin(t * 0.8) * 0.04;
    }
    if (ringA.current) ringA.current.rotation.set(t * 0.35, 0, 0.3);
    if (ringB.current) ringB.current.rotation.set(0.9, t * 0.45, 0);
    if (rings.current) rings.current.scale.setScalar(1 + e * 0.35);
  });

  return (
    <group ref={root}>
      {/* Body + keyhole */}
      <ExplodePart explode={explode} position={[0, 0.85, 0]} offset={[0, -0.15, 0.35]}>
        <RoundedBox args={[1.0, 0.8, 0.42]} radius={0.08} smoothness={4} material={plaster} />
        <mesh material={ink} position={[0, 0.07, 0.215]} rotation-x={Math.PI / 2}>
          <cylinderGeometry args={[0.07, 0.07, 0.02, 32]} />
        </mesh>
        <mesh material={ink} position={[0, -0.05, 0.215]}>
          <boxGeometry args={[0.045, 0.18, 0.02]} />
        </mesh>
        <TagLabel position={[0, -0.6, 0.3]} text={tags[2]} visible={labelsVisible} />
      </ExplodePart>

      {/* Shackle lifts free when taken apart */}
      <ExplodePart explode={explode} position={[0, 1.25, 0]} offset={[0, 0.55, 0]}>
        <mesh material={plaster} position={[0, 0.28, 0]}>
          <torusGeometry args={[0.3, 0.06, 20, 48, Math.PI]} />
        </mesh>
        {[-0.3, 0.3].map((x) => (
          <mesh key={x} material={plaster} position={[x, 0.12, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.36, 20]} />
          </mesh>
        ))}
        <TagLabel position={[0, 0.85, 0]} text={tags[0]} visible={labelsVisible} />
      </ExplodePart>

      {/* Perimeter rings */}
      <group ref={rings} position={[0, 0.95, 0]}>
        <mesh ref={ringA} material={plaster}>
          <torusGeometry args={[0.85, 0.016, 12, 128]} />
        </mesh>
        <mesh ref={ringB} material={plaster}>
          <torusGeometry args={[0.85, 0.016, 12, 128]} />
        </mesh>
        <TagLabel position={[1.0, 0.1, 0]} text={tags[1]} visible={labelsVisible} />
      </group>
    </group>
  );
};

/* ── 03 Healthcare — a DNA helix that unzips ──────────────────── */

const PAIRS = 12;
const HELIX_R = 0.36;
const HELIX_H = 1.7;
const HELIX_TURNS = 1.4;
const HELIX_Y0 = 0.15;

const helixPoint = (u: number, phase: number) => {
  const a = Math.PI * 2 * HELIX_TURNS * u + phase;
  return new THREE.Vector3(
    Math.cos(a) * HELIX_R,
    HELIX_Y0 + HELIX_H * u,
    Math.sin(a) * HELIX_R,
  );
};

const Strand = ({ phase }: { phase: number }) => {
  const tube = useMemo(() => {
    const pts = Array.from({ length: 80 }, (_, i) => helixPoint(i / 79, phase));
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 160, 0.032, 8);
  }, [phase]);
  const nodes = useMemo(
    () => Array.from({ length: PAIRS }, (_, k) => helixPoint((k + 0.5) / PAIRS, phase)),
    [phase],
  );
  return (
    <>
      <mesh geometry={tube} material={plaster} />
      {nodes.map((p, k) => (
        <mesh key={k} material={plaster} position={p}>
          <sphereGeometry args={[0.055, 16, 16]} />
        </mesh>
      ))}
    </>
  );
};

const Helix = ({ explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const root = useRef<THREE.Group>(null);
  const spin = useIdleSpin(explode, reduced, 0.4);

  useFrame(() => {
    if (root.current) root.current.rotation.y = spin.current;
  });

  const rungs = useMemo(
    () =>
      Array.from({ length: PAIRS }, (_, k) => {
        const u = (k + 0.5) / PAIRS;
        return {
          y: HELIX_Y0 + HELIX_H * u,
          angle: Math.PI * 2 * HELIX_TURNS * u,
        };
      }),
    [],
  );

  return (
    <group ref={root}>
      <ExplodePart explode={explode} offset={[-0.55, 0.1, 0]}>
        <Strand phase={0} />
        <TagLabel position={[-0.35, HELIX_Y0 + HELIX_H + 0.25, 0]} text={tags[0]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} offset={[0.55, -0.1, 0]}>
        <Strand phase={Math.PI} />
        <TagLabel position={[0.35, HELIX_Y0 - 0.2, 0]} text={tags[2]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} offset={[0, 0, 0.3]}>
        {rungs.map(({ y, angle }, k) => (
          <group key={k} position={[0, y, 0]} rotation-y={-angle}>
            <mesh material={ink} rotation-z={Math.PI / 2}>
              <cylinderGeometry args={[0.018, 0.018, HELIX_R * 1.7, 8]} />
            </mesh>
          </group>
        ))}
        <TagLabel position={[0, HELIX_Y0 + HELIX_H / 2, 0.45]} text={tags[1]} visible={labelsVisible} />
      </ExplodePart>
    </group>
  );
};

/* ── 04 Hospitality — a hotel key and its fob on a ring ───────── */

const HotelKey = ({ explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const root = useRef<THREE.Group>(null);
  const keyPivot = useRef<THREE.Group>(null);
  const tagPivot = useRef<THREE.Group>(null);
  const spin = useIdleSpin(explode, reduced, 0.35);

  const fob = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.22, -0.45);
    shape.lineTo(0, -0.95);
    shape.lineTo(-0.22, -0.45);
    shape.lineTo(0, 0);
    const hole = new THREE.Path();
    hole.absarc(0, -0.15, 0.045, 0, Math.PI * 2, true);
    shape.holes.push(hole);
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.06,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.025,
      bevelSegments: 3,
    });
    geo.translate(0, 0.03, -0.03);
    return geo;
  }, []);

  useFrame((state) => {
    const t = reduced ? 0 : state.clock.elapsedTime;
    const e = explode.current;
    const sway = Math.sin(t * 1.1) * 0.06 * (1 - e);
    if (keyPivot.current) keyPivot.current.rotation.z = -0.35 + sway;
    if (tagPivot.current) tagPivot.current.rotation.z = 0.3 - sway * 0.8;
    if (root.current) root.current.rotation.y = Math.sin(spin.current) * 0.4;
  });

  return (
    <group ref={root}>
      {/* Ring */}
      <ExplodePart explode={explode} position={[0, 1.7, 0]} offset={[0, 0.3, 0]}>
        <mesh material={plaster}>
          <torusGeometry args={[0.13, 0.022, 12, 48]} />
        </mesh>
        <TagLabel position={[0, 0.32, 0]} text={tags[2]} visible={labelsVisible} />
      </ExplodePart>

      {/* Key */}
      <ExplodePart explode={explode} offset={[-0.5, -0.05, 0.1]}>
        <group ref={keyPivot} position={[0, 1.57, 0]}>
          <mesh material={plaster} position={[0, -0.15, 0]}>
            <torusGeometry args={[0.15, 0.045, 16, 48]} />
          </mesh>
          <mesh material={plaster} position={[0, -0.34, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.05, 24]} />
          </mesh>
          <mesh material={plaster} position={[0, -0.74, 0]}>
            <cylinderGeometry args={[0.038, 0.038, 0.8, 16]} />
          </mesh>
          <mesh material={plaster} position={[0.075, -1.0, 0]}>
            <boxGeometry args={[0.11, 0.07, 0.05]} />
          </mesh>
          <mesh material={plaster} position={[0.1, -1.1, 0]}>
            <boxGeometry args={[0.16, 0.07, 0.05]} />
          </mesh>
        </group>
        <TagLabel position={[-0.75, 1.0, 0]} text={tags[0]} visible={labelsVisible} />
      </ExplodePart>

      {/* Fob */}
      <ExplodePart explode={explode} offset={[0.5, -0.05, 0.1]}>
        <group ref={tagPivot} position={[0, 1.57, 0]}>
          <mesh geometry={fob} material={plaster} />
          <mesh material={ink} position={[0, -0.5, 0.06]}>
            <boxGeometry args={[0.16, 0.1, 0.01]} />
          </mesh>
        </group>
        <TagLabel position={[0.75, 1.0, 0]} text={tags[1]} visible={labelsVisible} />
      </ExplodePart>
    </group>
  );
};

/* ── 05 Generative AI — a shape-shifting particle mind ────────── */

const NOISE_GLSL = /* glsl */ `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x * 34.0) + 10.0) * x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
  float snoise(vec3 v) {
    const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
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
    vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.5 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
    m = m * m;
    return 105.0 * dot(m * m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
  }
`;

const MIND_POINTS = 2600;

const NeuralCloud = ({ lit, explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshBasicMaterial>(null);

  const geometry = useMemo(() => {
    const positions = new Float32Array(MIND_POINTS * 3);
    const randoms = new Float32Array(MIND_POINTS);
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < MIND_POINTS; i++) {
      // Fibonacci sphere — even coverage
      const y = 1 - (i / (MIND_POINTS - 1)) * 2;
      const r = Math.sqrt(1 - y * y);
      const a = golden * i;
      const radius = 0.62 + Math.random() * 0.12;
      positions[i * 3] = Math.cos(a) * r * radius;
      positions[i * 3 + 1] = y * radius;
      positions[i * 3 + 2] = Math.sin(a) * r * radius;
      randoms[i] = Math.random();
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
    return geo;
  }, []);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        uniforms: {
          uTime: { value: 0 },
          uLit: { value: 0 },
          uExplode: { value: 0 },
          uSize: { value: 26 },
        },
        vertexShader: /* glsl */ `
          uniform float uTime;
          uniform float uExplode;
          uniform float uSize;
          attribute float aRandom;
          varying float vAlpha;
          ${NOISE_GLSL}
          void main() {
            vec3 p = position;
            float n = snoise(p * 1.8 + vec3(uTime * 0.25));
            float n2 = snoise(p * 3.5 - vec3(uTime * 0.4));
            p *= 1.0 + n * 0.22 + n2 * 0.06;
            p *= 1.0 + uExplode * (0.5 + aRandom * 0.9);
            vec4 mv = modelViewMatrix * vec4(p, 1.0);
            gl_Position = projectionMatrix * mv;
            gl_PointSize = uSize * (0.6 + aRandom * 0.8) / -mv.z;
            vAlpha = 0.35 + 0.65 * smoothstep(-0.3, 0.6, n);
          }
        `,
        fragmentShader: /* glsl */ `
          uniform float uLit;
          varying float vAlpha;
          void main() {
            float d = length(gl_PointCoord - 0.5);
            if (d > 0.5) discard;
            float a = smoothstep(0.5, 0.0, d);
            gl_FragColor = vec4(vec3(1.0), a * vAlpha * (0.15 + 0.85 * uLit));
          }
        `,
      }),
    [],
  );

  useFrame((state, delta) => {
    const u = material.uniforms;
    if (!reduced) u.uTime.value += Math.min(delta, 0.1);
    u.uLit.value = lit.current;
    u.uExplode.value = explode.current;
    u.uSize.value = 26 * state.gl.getPixelRatio();
    if (core.current) {
      core.current.rotation.y = u.uTime.value * 0.3;
      core.current.rotation.x = u.uTime.value * 0.2;
      core.current.scale.setScalar(1 + explode.current * 0.5);
    }
    if (coreMat.current) coreMat.current.opacity = 0.1 + lit.current * 0.35;
  });

  return (
    <group position={[0, 0.95, 0]}>
      <points geometry={geometry} material={material} />
      <mesh ref={core}>
        <icosahedronGeometry args={[0.3, 1]} />
        <meshBasicMaterial
          ref={coreMat}
          color="#ffffff"
          wireframe
          transparent
          opacity={0.2}
          depthWrite={false}
        />
      </mesh>
      <ExplodePart explode={explode} position={[-0.75, 0.55, 0]} offset={[-0.35, 0.2, 0]}>
        <TagLabel position={[0, 0, 0]} text={tags[0]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} position={[0.8, 0.15, 0]} offset={[0.4, 0, 0]}>
        <TagLabel position={[0, 0, 0]} text={tags[1]} visible={labelsVisible} />
      </ExplodePart>
      <ExplodePart explode={explode} position={[0, -0.75, 0.3]} offset={[0, -0.25, 0.2]}>
        <TagLabel position={[0, 0, 0]} text={tags[2]} visible={labelsVisible} />
      </ExplodePart>
    </group>
  );
};

/* ── 06 Manufacturing — three meshing gears ───────────────────── */

const GEAR_MODULE = 0.08;

const gearGeometry = (teeth: number) => {
  const pitch = (GEAR_MODULE * teeth) / 2;
  const tip = pitch + GEAR_MODULE * 0.9;
  const root = pitch - GEAR_MODULE * 1.1;
  const step = (Math.PI * 2) / teeth;
  const shape = new THREE.Shape();
  const at = (r: number, a: number) => [Math.cos(a) * r, Math.sin(a) * r] as const;

  for (let i = 0; i < teeth; i++) {
    const a = i * step;
    // Tooth occupies the first half of each step, gap the second half
    const pts = [
      at(root, a),
      at(tip, a + step * 0.12),
      at(tip, a + step * 0.38),
      at(root, a + step * 0.5),
    ];
    pts.forEach(([x, y], k) => {
      if (i === 0 && k === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    });
    const [ex, ey] = at(root, a + step);
    shape.lineTo(ex, ey);
  }
  const hole = new THREE.Path();
  hole.absarc(0, 0, Math.min(0.09, root * 0.35), 0, Math.PI * 2, true);
  shape.holes.push(hole);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: 0.14,
    bevelEnabled: true,
    bevelThickness: 0.012,
    bevelSize: 0.01,
    bevelSegments: 2,
  });
  geo.translate(0, 0, -0.07);
  return { geo, pitch };
};

const GEARS = [
  { teeth: 14, center: [-0.38, 0.92] as const },
  { teeth: 10, contactAngle: 0.35 },
  { teeth: 7, contactAngle: -0.7 },
];

const Gears = ({ lit, explode, tags, labelsVisible, reduced }: SculptureProps) => {
  const root = useRef<THREE.Group>(null);
  const gearRefs = [
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
    useRef<THREE.Group>(null),
  ];
  const angle = useRef(0);
  const spin = useIdleSpin(explode, reduced, 0.25);

  const gears = useMemo(() => {
    const big = gearGeometry(GEARS[0].teeth);
    const mid = gearGeometry(GEARS[1].teeth);
    const small = gearGeometry(GEARS[2].teeth);
    const [cx, cy] = GEARS[0].center!;
    const place = (pitch: number, alpha: number) =>
      [
        cx + Math.cos(alpha) * (big.pitch + pitch),
        cy + Math.sin(alpha) * (big.pitch + pitch),
        0,
      ] as Vec3;
    return [
      { ...big, position: [cx, cy, 0] as Vec3, alpha: 0 },
      { ...mid, position: place(mid.pitch, GEARS[1].contactAngle!), alpha: GEARS[1].contactAngle! },
      { ...small, position: place(small.pitch, GEARS[2].contactAngle!), alpha: GEARS[2].contactAngle! },
    ];
  }, []);

  useFrame((_, delta) => {
    if (!reduced) angle.current += Math.min(delta, 0.1) * (0.2 + lit.current * 0.35);
    const t1 = angle.current;
    const n1 = GEARS[0].teeth;
    gearRefs[0].current?.rotation.set(0, 0, t1);
    // Meshing phase: θ₂ = α + π + (N₁/N₂)(α − θ₁)
    [1, 2].forEach((k) => {
      const { alpha } = gears[k];
      const theta = alpha + Math.PI + (n1 / GEARS[k].teeth) * (alpha - t1);
      gearRefs[k].current?.rotation.set(0, 0, theta);
    });
    if (root.current) root.current.rotation.y = Math.sin(spin.current) * 0.35;
  });

  const offsets: Vec3[] = [
    [-0.35, -0.05, 0.5],
    [0.35, 0.3, 0.9],
    [0.3, -0.25, 1.25],
  ];
  const labelOffsets: Vec3[] = [
    [-0.25, -0.8, 0.1],
    [0.2, 0.62, 0.1],
    [0.55, -0.3, 0.1],
  ];
  const tagForGear = [tags[2], tags[1], tags[0]]; // big, medium, small

  return (
    <group ref={root}>
      {gears.map((g, k) => (
        <ExplodePart key={k} explode={explode} position={g.position} offset={offsets[k]}>
          <group ref={gearRefs[k]}>
            <mesh geometry={g.geo} material={plaster} />
          </group>
          <mesh material={ink} rotation-x={Math.PI / 2}>
            <cylinderGeometry args={[0.05, 0.05, 0.3, 20]} />
          </mesh>
          <TagLabel position={labelOffsets[k]} text={tagForGear[k]} visible={labelsVisible} />
        </ExplodePart>
      ))}
    </group>
  );
};

export const SCULPTURES: React.ComponentType<SculptureProps>[] = [
  Parcel,
  Padlock,
  Helix,
  HotelKey,
  NeuralCloud,
  Gears,
];
