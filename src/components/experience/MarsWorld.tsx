import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { store, useExp } from "@/lib/store";

// --- tiny value noise ---
function hash(x: number, y: number) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x: number, y: number) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x: number, y: number) {
  let v = 0, a = 0.5, f = 1;
  for (let i = 0; i < 5; i++) { v += a * noise(x * f, y * f); f *= 2.03; a *= 0.5; }
  return v;
}

// Meridiani-like plains: gentle undulation, a crater bowl (Eagle/Endurance), far mesas
const CRATERS = [
  { x: -6, z: -22, r: 11, d: 3.2 },
  { x: 30, z: -70, r: 26, d: 6 },
  { x: -40, z: -45, r: 6, d: 1.4 },
];
function height(x: number, z: number) {
  let h = (fbm(x * 0.03, z * 0.03) - 0.5) * 5 + (fbm(x * 0.2, z * 0.2) - 0.5) * 0.35;
  for (const c of CRATERS) {
    const dd = Math.hypot(x - c.x, z - c.z) / c.r;
    if (dd < 1) h -= c.d * (1 - dd * dd);
    else if (dd < 1.5) h += c.d * 0.35 * Math.cos(((dd - 1) / 0.5) * Math.PI * 0.5) ** 2;
  }
  const far = Math.max(0, -z - 90);
  h += Math.max(0, fbm(x * 0.012, 3.1) - 0.45) * far * 0.5;
  return h;
}

function Terrain() {
  const geo = useMemo(() => {
    const g = new THREE.PlaneGeometry(320, 320, 240, 240);
    g.rotateX(-Math.PI / 2);
    const pos = g.getAttribute("position") as THREE.BufferAttribute;
    const colors = new Float32Array(pos.count * 3);
    const low = new THREE.Color("#5a2a17"), mid = new THREE.Color("#a5552c"), high = new THREE.Color("#d39a64");
    const tmp = new THREE.Color();
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i), z = pos.getZ(i);
      const h = height(x, z);
      pos.setY(i, h);
      const t = THREE.MathUtils.clamp((h + 3) / 7 + (hash(x, z) - 0.5) * 0.12, 0, 1);
      tmp.copy(low).lerp(mid, Math.min(1, t * 1.6));
      if (t > 0.6) tmp.lerp(high, (t - 0.6) * 1.8);
      colors.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    g.setAttribute("color", new THREE.BufferAttribute(colors, 3));
    g.computeVertexNormals();
    return g;
  }, []);
  return (
    <mesh geometry={geo} receiveShadow>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
    </mesh>
  );
}

function Rocks() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const count = 260;
  useMemo(() => null, []);
  const set = (m: THREE.InstancedMesh | null) => {
    if (!m || m.userData["done"]) return;
    const o = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const x = (hash(i, 1) - 0.5) * 120, z = -hash(i, 2) * 110 + 20;
      const s = 0.08 + hash(i, 3) ** 3 * 0.9;
      o.position.set(x, height(x, z) + s * 0.3, z);
      o.rotation.set(hash(i, 4) * 3, hash(i, 5) * 3, 0);
      o.scale.set(s, s * 0.6, s * 0.9);
      o.updateMatrix();
      m.setMatrixAt(i, o.matrix);
    }
    m.instanceMatrix.needsUpdate = true;
    m.userData["done"] = true;
    (ref as React.MutableRefObject<THREE.InstancedMesh | null>).current = m;
  };
  return (
    <instancedMesh ref={set} args={[undefined, undefined, count]} castShadow>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#6b3720" roughness={1} flatShading />
    </instancedMesh>
  );
}

function Dust() {
  const ref = useRef<THREE.Points>(null);
  const N = 1800;
  const pos = useMemo(() => {
    const a = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      a[i * 3] = (Math.random() - 0.5) * 80;
      a[i * 3 + 1] = Math.random() * 14;
      a[i * 3 + 2] = (Math.random() - 0.5) * 80 - 10;
    }
    return a;
  }, []);
  useFrame((_, raw) => {
    const dt = Math.min(raw, 0.05);
    const p = ref.current;
    if (!p) return;
    const s = store.get().storm;
    const attr = p.geometry.getAttribute("position") as THREE.BufferAttribute;
    const arr = attr.array as Float32Array;
    const wind = 1.5 + s * 22;
    for (let i = 0; i < N; i++) {
      arr[i * 3]! += wind * dt * (0.6 + (i % 7) * 0.1);
      arr[i * 3 + 1]! += Math.sin(i + arr[i * 3]! * 0.1) * dt * 0.3;
      if (arr[i * 3]! > 40) arr[i * 3] = -40;
    }
    attr.needsUpdate = true;
    const m = p.material as THREE.PointsMaterial;
    m.opacity = 0.25 + s * 0.6;
    m.size = 0.06 + s * 0.12;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#e2a06a" size={0.06} transparent opacity={0.3} depthWrite={false} />
    </points>
  );
}

const SKY_CLEAR = new THREE.Color("#c98b5e");
const SKY_STORM = new THREE.Color("#3a2014");
const FOG_CLEAR = new THREE.Color("#b9784c");

function Director() {
  const { camera, scene } = useThree();
  const sun = useRef<THREE.DirectionalLight>(null);
  const smooth = useRef(0);
  useFrame(({ clock }, raw) => {
    const dt = Math.min(raw, 0.05);
    const t = clock.elapsedTime;
    const s = store.get().storm;
    smooth.current += (s - smooth.current) * (1 - Math.exp(-2 * dt));
    const k = smooth.current;
    const scroll = typeof window !== "undefined" ? window.scrollY / Math.max(1, document.body.scrollHeight - innerHeight) : 0;
    const z = 26 - scroll * 40;
    camera.position.set(Math.sin(t * 0.04) * 8 + scroll * 10, 4.2 + Math.sin(t * 0.07) * 0.4 - scroll * 1.5, z);
    camera.lookAt(Math.sin(t * 0.03) * 4, 1.5, z - 40);
    const sky = (scene.background as THREE.Color) ?? new THREE.Color();
    sky.copy(SKY_CLEAR).lerp(SKY_STORM, k);
    scene.background = sky;
    if (scene.fog instanceof THREE.Fog) {
      scene.fog.color.copy(FOG_CLEAR).lerp(SKY_STORM, k);
      scene.fog.near = 20 - k * 18;
      scene.fog.far = 180 - k * 165;
    }
    if (sun.current) sun.current.intensity = 2.2 * (1 - k * 0.9);
  });
  return (
    <>
      <ambientLight intensity={0.55} color="#f0c9a0" />
      <hemisphereLight args={["#e9b48a", "#3a1a0c", 0.6]} />
      <directionalLight ref={sun} position={[-30, 18, -40]} intensity={2.2} color="#ffd7a8" />
    </>
  );
}

export function MarsWorld() {
  const dark = useExp((s) => s.dark);
  return (
    <div className="fixed inset-0 transition-opacity duration-[3000ms]" style={{ opacity: 1 - dark }} aria-hidden>
      <Canvas dpr={[1, 1.5]} camera={{ fov: 50, near: 0.1, far: 400, position: [0, 4, 26] }}>
        <color attach="background" args={["#c98b5e"]} />
        <fog attach="fog" args={["#b9784c", 20, 180]} />
        <Director />
        <Terrain />
        <Rocks />
        <Dust />
      </Canvas>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-void/50 via-transparent to-void/70" />
    </div>
  );
}
