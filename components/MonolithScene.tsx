import { Canvas, ThreeEvent, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import {
  clamp01,
  easeInOutCubic,
  easeOutCubic,
  range,
} from "./sceneHooks";
import { BLOCK_COUNT, MONOLITH_PHASES, RING_COUNT } from "./sceneTimeline";

type ProgressRef = React.MutableRefObject<number>;

const COLS = 5;
const ROWS = 10;
const CELL = 0.42;
const TOWER_LEVELS = 12; // 12 levels × 4 blocks + a 2-block spire = 50
const TWIST = 0.085; // radians per level
const TOWER_BASE_Y = -2.73;
const TOWER_TOP_Y = TOWER_BASE_Y + 13 * CELL;
const BEACON_Y = TOWER_TOP_Y + 0.75;
const OUT_STAGGER = 0.4;
const IN_STAGGER = 0.6;

const Y_AXIS = new THREE.Vector3(0, 1, 0);

/** Seeded PRNG so the composition is identical on every load. */
const mulberry32 = (seed: number) => () => {
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

interface Block {
  mono: THREE.Vector3;
  tower: THREE.Vector3;
  towerRot: THREE.Quaternion;
  orbitRadius: number;
  orbitAngle: number;
  orbitY: number;
  orbitSpeed: number;
  tumbleAxis: THREE.Vector3;
  tumbleSpeed: number;
  outDelay: number;
  inDelay: number;
}

const buildBlocks = (): Block[] => {
  const rand = mulberry32(7);

  return Array.from({ length: BLOCK_COUNT }, (_, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const mono = new THREE.Vector3(
      (col - (COLS - 1) / 2) * CELL,
      (row - (ROWS - 1) / 2) * CELL,
      0,
    );

    let level: number;
    const tower = new THREE.Vector3();
    if (i < TOWER_LEVELS * 4) {
      level = Math.floor(i / 4);
      const k = i % 4;
      const lx = (k % 2 === 0 ? -0.5 : 0.5) * CELL;
      const lz = (k < 2 ? -0.5 : 0.5) * CELL;
      const a = level * TWIST;
      tower.set(
        lx * Math.cos(a) + lz * Math.sin(a),
        TOWER_BASE_Y + level * CELL,
        -lx * Math.sin(a) + lz * Math.cos(a),
      );
    } else {
      level = TOWER_LEVELS + (i - TOWER_LEVELS * 4);
      tower.set(0, TOWER_BASE_Y + level * CELL, 0);
    }

    return {
      mono,
      tower,
      towerRot: new THREE.Quaternion().setFromAxisAngle(Y_AXIS, level * TWIST),
      orbitRadius: 2.3 + rand() * 2.1,
      orbitAngle: i * 2.39996, // golden angle
      orbitY: (rand() - 0.5) * 2.4,
      orbitSpeed: 0.1 + rand() * 0.14,
      tumbleAxis: new THREE.Vector3(
        rand() - 0.5,
        rand() - 0.5,
        rand() - 0.5,
      ).normalize(),
      tumbleSpeed: 0.3 + rand() * 0.7,
      outDelay: rand() * OUT_STAGGER,
      // Bottom levels land first so the tower visibly rises
      inDelay: (level / 13) * (IN_STAGGER - 0.05) + rand() * 0.05,
    };
  });
};

const makeGlowTexture = () => {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(
    size / 2,
    size / 2,
    0,
    size / 2,
    size / 2,
    size / 2,
  );
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.25, "rgba(255,255,255,0.35)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
};

/* ── The monolith: 50 instanced blocks + light core + rings ───── */
const Monolith = ({
  progress,
  reduced,
}: {
  progress: ProgressRef;
  reduced: boolean;
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const coreRef = useRef<THREE.Mesh>(null);
  const orbRef = useRef<THREE.Group>(null);
  const orbLightRef = useRef<THREE.PointLight>(null);
  const ringsRef = useRef<THREE.Group>(null);
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const haloRef = useRef<THREE.Mesh>(null);

  const blocks = useMemo(buildBlocks, []);
  const glowTexture = useMemo(makeGlowTexture, []);

  // Spring "physics" for click / hover knocks — blocks always settle back
  const physics = useMemo(
    () => ({
      offset: blocks.map(() => new THREE.Vector3()),
      vel: blocks.map(() => new THREE.Vector3()),
      spin: blocks.map(() => new THREE.Vector3()),
      spinVel: blocks.map(() => new THREE.Vector3()),
      current: blocks.map(() => new THREE.Vector3()),
    }),
    [blocks],
  );

  const tmp = useMemo(
    () => ({
      dummy: new THREE.Object3D(),
      v: new THREE.Vector3(),
      orbit: new THREE.Vector3(),
      q: new THREE.Quaternion(),
      qTumble: new THREE.Quaternion(),
      qSpin: new THREE.Quaternion(),
      euler: new THREE.Euler(),
      invGroup: new THREE.Quaternion(),
      dir: new THREE.Vector3(),
    }),
    [],
  );

  const smooth = useRef(0);
  const lastHover = useRef(-1);

  const ringYs = useMemo(
    () =>
      Array.from(
        { length: RING_COUNT },
        (_, i) =>
          TOWER_BASE_Y - CELL / 2 + ((i + 0.6) * (14 * CELL)) / RING_COUNT,
      ),
    [],
  );

  const poke = (index: number, rayDir: THREE.Vector3, strength: number) => {
    const group = groupRef.current;
    if (!group) return;
    // Ray direction into the group's local space (the group rotates)
    group.getWorldQuaternion(tmp.invGroup).invert();
    tmp.dir.copy(rayDir).applyQuaternion(tmp.invGroup);

    const origin = physics.current[index];
    physics.current.forEach((pos, j) => {
      const d = pos.distanceTo(origin);
      if (d > 1.3) return;
      const f = strength * (1 - d / 1.3);
      physics.vel[j].addScaledVector(tmp.dir, f);
      physics.vel[j].y += f * 0.25;
      physics.spinVel[j].x += (Math.random() - 0.5) * f * 5;
      physics.spinVel[j].y += (Math.random() - 0.5) * f * 5;
      physics.spinVel[j].z += (Math.random() - 0.5) * f * 5;
    });
  };

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (e.instanceId === undefined) return;
    e.stopPropagation();
    poke(e.instanceId, e.ray.direction, 7);
  };

  const handleMove = (e: ThreeEvent<PointerEvent>) => {
    if (e.instanceId === undefined || e.instanceId === lastHover.current)
      return;
    lastHover.current = e.instanceId;
    poke(e.instanceId, e.ray.direction, 1.6);
  };

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    const group = groupRef.current;
    if (!mesh || !group) return;

    const dt = Math.min(delta, 1 / 30); // spring integration step
    smooth.current = THREE.MathUtils.damp(
      smooth.current,
      progress.current,
      4,
      Math.min(delta, 0.1),
    );
    const p = smooth.current;
    const t = state.clock.elapsedTime;
    const motion = reduced ? 0.15 : 1;

    const crack = easeInOutCubic(range(p, ...MONOLITH_PHASES.crack));
    const outP = range(p, ...MONOLITH_PHASES.orbit);
    const inP = range(p, ...MONOLITH_PHASES.tower);

    const { dummy, v, orbit, q, qTumble, qSpin, euler } = tmp;

    for (let i = 0; i < BLOCK_COUNT; i++) {
      const b = blocks[i];
      const tOut = easeInOutCubic(
        clamp01((outP - b.outDelay) / (1 - OUT_STAGGER)),
      );
      const tIn = easeInOutCubic(clamp01((inP - b.inDelay) / (1 - IN_STAGGER)));

      // Monolith, with seams opening as it cracks
      v.copy(b.mono).multiplyScalar(1 + crack * 0.18);

      // Orbit around the light core
      const ang = b.orbitAngle + t * b.orbitSpeed * motion + p * 2.4;
      orbit.set(
        Math.cos(ang) * b.orbitRadius,
        b.orbitY + Math.sin(t * 0.6 + i) * 0.08 * motion,
        Math.sin(ang) * b.orbitRadius,
      );
      v.lerp(orbit, tOut);

      // Tower, arcing up into place
      v.lerp(b.tower, tIn);
      v.y += Math.sin(tIn * Math.PI) * 0.5;

      q.identity();
      qTumble.setFromAxisAngle(
        b.tumbleAxis,
        t * b.tumbleSpeed * motion + p * 4,
      );
      q.slerp(qTumble, tOut);
      q.slerp(b.towerRot, tIn);

      // Springs pull knocked blocks back home
      const off = physics.offset[i];
      const vel = physics.vel[i];
      vel.addScaledVector(off, -30 * dt).multiplyScalar(1 - Math.min(5 * dt, 1));
      off.addScaledVector(vel, dt);
      const spin = physics.spin[i];
      const spinVel = physics.spinVel[i];
      spinVel.addScaledVector(spin, -20 * dt).multiplyScalar(1 - Math.min(4 * dt, 1));
      spin.addScaledVector(spinVel, dt);

      physics.current[i].copy(v);
      dummy.position.copy(v).add(off);
      euler.set(spin.x, spin.y, spin.z);
      qSpin.setFromEuler(euler);
      dummy.quaternion.copy(q).multiply(qSpin);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere(); // keeps raycasts accurate as blocks move

    // Whole sculpture turns slowly — reveals the tower's twist at the end
    group.rotation.y =
      -0.38 +
      easeInOutCubic(range(p, 0.3, 1)) * 1.4 +
      Math.sin(t * 0.15) * 0.05 * motion;

    // Light core: a slab of light inside the monolith that collapses into an orb
    const coreScale = 1 - easeInOutCubic(range(p, 0.16, 0.3));
    if (coreRef.current) {
      coreRef.current.visible = coreScale > 0.002;
      coreRef.current.scale.setScalar(Math.max(coreScale, 0.002));
    }

    const orbIn = easeOutCubic(range(p, 0.14, 0.3));
    const rise = easeInOutCubic(range(p, 0.62, 0.84));
    if (orbRef.current) {
      orbRef.current.visible = orbIn > 0.002;
      orbRef.current.position.y = rise * BEACON_Y;
      orbRef.current.scale.setScalar(
        Math.max(orbIn, 0.002) * (1 + Math.sin(t * 2) * 0.04 * motion),
      );
    }
    if (orbLightRef.current) {
      orbLightRef.current.position.y = rise * BEACON_Y;
      orbLightRef.current.intensity = crack * 5 + orbIn * 9 + rise * 4;
    }

    // Key light rises with the tower so its faces read; halo silhouettes it
    const towerP = easeInOutCubic(inP);
    if (keyLightRef.current) keyLightRef.current.intensity = 0.25 + towerP * 0.9;
    if (haloRef.current) {
      const mat = haloRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = 0.16 - orbIn * 0.06 + towerP * 0.06;
    }

    // Eight rings light up one after another — one per year
    if (ringsRef.current) {
      const [rs, re] = MONOLITH_PHASES.rings;
      const w = (re - rs) / RING_COUNT;
      ringsRef.current.children.forEach((ring, i) => {
        const on = easeOutCubic(range(p, rs + i * w, rs + i * w + w * 1.6));
        ring.visible = on > 0.002;
        ring.scale.setScalar(1 + (1 - on) * 0.9);
        ring.children.forEach((child, k) => {
          const mat = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
          mat.opacity = on * (k === 0 ? 0.9 : 0.12);
        });
      });
    }
  });

  return (
    <>
      <directionalLight
        ref={keyLightRef}
        position={[5, 6, 6]}
        intensity={0.25}
        color="#ffffff"
      />
      <mesh ref={haloRef} position={[0, 0.2, -6]} scale={[18, 18, 1]}>
        <planeGeometry />
        <meshBasicMaterial
          map={glowTexture}
          color="#ffffff"
          transparent
          opacity={0.16}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          toneMapped={false}
          fog={false}
        />
      </mesh>
      <group ref={groupRef}>
        <instancedMesh
          ref={meshRef}
          args={[undefined, undefined, BLOCK_COUNT]}
          frustumCulled={false}
          onClick={handleClick}
          onPointerMove={handleMove}
          onPointerOut={() => (lastHover.current = -1)}
        >
          <boxGeometry args={[CELL, CELL, CELL]} />
          <meshPhysicalMaterial
            color="#101010"
            metalness={0.55}
            roughness={0.3}
            clearcoat={1}
            clearcoatRoughness={0.1}
            envMapIntensity={1.6}
          />
        </instancedMesh>

        {/* The light within — visible only through the cracks */}
        <mesh ref={coreRef}>
          <boxGeometry
            args={[COLS * CELL * 0.94, ROWS * CELL * 0.94, CELL * 0.5]}
          />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>

        <group ref={orbRef} visible={false}>
          <mesh>
            <sphereGeometry args={[0.16, 32, 32]} />
            <meshBasicMaterial color="#ffffff" toneMapped={false} />
          </mesh>
          <sprite scale={[1.8, 1.8, 1]}>
            <spriteMaterial
              map={glowTexture}
              color="#ffffff"
              transparent
              depthWrite={false}
              blending={THREE.AdditiveBlending}
              toneMapped={false}
            />
          </sprite>
        </group>
        <pointLight
          ref={orbLightRef}
          color="#ffffff"
          intensity={0}
          distance={14}
          decay={1.6}
        />

        <group ref={ringsRef}>
          {ringYs.map((y, i) => (
            <group key={i} position={[0, y, 0]} rotation-x={Math.PI / 2} visible={false}>
              <mesh>
                <torusGeometry args={[0.82, 0.007, 8, 160]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0}
                  toneMapped={false}
                />
              </mesh>
              <mesh>
                <torusGeometry args={[0.82, 0.04, 8, 160]} />
                <meshBasicMaterial
                  color="#ffffff"
                  transparent
                  opacity={0}
                  depthWrite={false}
                  blending={THREE.AdditiveBlending}
                  toneMapped={false}
                />
              </mesh>
            </group>
          ))}
        </group>
      </group>
    </>
  );
};

/* ── Cursor light: the visitor's pointer is a torch in the dark ── */
const CursorLight = () => {
  const lightRef = useRef<THREE.PointLight>(null);
  const tmp = useMemo(
    () => ({ v: new THREE.Vector3(), target: new THREE.Vector3(0, 0, 3) }),
    [],
  );

  useFrame((state, delta) => {
    const light = lightRef.current;
    if (!light) return;
    const { camera, pointer } = state;
    const { v, target } = tmp;
    // Intersect the pointer ray with the z = 3 plane
    v.set(pointer.x, pointer.y, 0.5).unproject(camera).sub(camera.position).normalize();
    const dist = (3 - camera.position.z) / v.z;
    target.copy(camera.position).addScaledVector(v, dist);
    light.position.lerp(target, 1 - Math.exp(-8 * delta));
  });

  return (
    <pointLight
      ref={lightRef}
      position={[0, 0, 3]}
      color="#ffffff"
      intensity={12}
      distance={14}
      decay={1.5}
    />
  );
};

/* ── Camera: front-on monolith → wide orbit → full tower ──────── */
const CameraRig = ({ progress }: { progress: ProgressRef }) => {
  const smooth = useRef(0);
  const tmp = useMemo(
    () => ({
      a: new THREE.Vector3(0, 0.3, 9.5),
      b: new THREE.Vector3(0, 2.2, 12),
      c: new THREE.Vector3(0, 0.2, 12.8),
      pos: new THREE.Vector3(),
      look: new THREE.Vector3(),
      lookC: new THREE.Vector3(0, 0.35, 0),
    }),
    [],
  );

  useFrame((state, delta) => {
    smooth.current = THREE.MathUtils.damp(
      smooth.current,
      progress.current,
      3,
      Math.min(delta, 0.1),
    );
    const p = smooth.current;
    const { a, b, c, pos, look, lookC } = tmp;

    const ab = easeInOutCubic(range(p, 0.12, 0.32));
    const bc = easeInOutCubic(range(p, 0.45, 0.7));
    pos.copy(a).lerp(b, ab).lerp(c, bc);
    look.set(0, 0, 0).lerp(lookC, bc);

    // Pull back on portrait screens so the monolith and tower still fit
    const aspect = state.size.width / state.size.height;
    if (aspect < 1) pos.multiplyScalar(1 + (1 - aspect) * 0.9);

    pos.x += state.pointer.x * 0.6;
    pos.y += state.pointer.y * 0.35;

    state.camera.position.lerp(pos, 1 - Math.exp(-6 * delta));
    state.camera.lookAt(look);
  });

  return null;
};

interface MonolithSceneProps {
  progress: ProgressRef;
  active: boolean;
  reduced: boolean;
}

const MonolithScene = ({ progress, active, reduced }: MonolithSceneProps) => (
  <Canvas
    camera={{ position: [0, 0.3, 9.5], fov: 35, near: 0.1, far: 60 }}
    dpr={[1, 1.5]}
    frameloop={active ? "always" : "never"}
    gl={{ antialias: true, powerPreference: "high-performance" }}
  >
    <color attach="background" args={["#000000"]} />
    <fog attach="fog" args={["#000000", 13, 28]} />
    <ambientLight intensity={0.03} />

    {/* Studio strips for reflections on the glossy black blocks */}
    <Environment resolution={256} frames={1}>
      <Lightformer
        form="rect"
        intensity={4}
        position={[0, 6, -2]}
        rotation-x={Math.PI / 2}
        scale={[12, 1.2, 1]}
      />
      <Lightformer
        form="rect"
        intensity={2.5}
        position={[-6, 1, 2]}
        rotation-y={Math.PI / 2}
        scale={[1, 8, 1]}
      />
      <Lightformer
        form="rect"
        intensity={1.6}
        position={[6, -1, 1]}
        rotation-y={-Math.PI / 2}
        scale={[1, 6, 1]}
      />
      <Lightformer form="rect" intensity={0.5} position={[0, 0, 12]} scale={[10, 6, 1]} />
    </Environment>

    <Monolith progress={progress} reduced={reduced} />
    <CursorLight />
    <CameraRig progress={progress} />
  </Canvas>
);

export default MonolithScene;
