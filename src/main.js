import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import renderMathInElement from 'katex/dist/contrib/auto-render';
import 'katex/dist/katex.min.css';
import Prism from 'prismjs';
import 'prismjs/components/prism-javascript.js';
import 'prism-themes/themes/prism-nord.css';

/* ─── Global styles ───────────────────────────────────────────────── */
const style = document.createElement('style');
style.textContent = `
  :root {
    --nord0: #1a1a1a; --nord1: #2a2a2a; --nord2: #333; --nord3: #444;
    --nord4: #D8DEE9; --nord5: #E5E9F0; --nord6: #ECEFF4;
    --nord7: #8FBCBB; --nord8: #88C0D0; --nord9: #81A1C1; --nord10: #5E81AC;
    --nord11: #BF616A; --nord12: #D08770; --nord13: #EBCB8B;
    --nord14: #A3BE8C; --nord15: #B48EAD;
    --panel-w: 280px;
    --header-h: 48px;
    --footer-h: 32px;
  }
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    background: var(--nord0); color: var(--nord4);
    font-family: 'JetBrains Mono', ui-monospace, monospace;
    overflow: hidden; height: 100vh; display: flex; flex-direction: column;
  }

  /* Header */
  #app-header {
    height: var(--header-h); flex-shrink: 0;
    display: flex; align-items: center; gap: 0.75rem;
    padding: 0 1rem;
    background: rgba(26,26,26,0.9); border-bottom: 1px solid var(--nord3);
    z-index: 10;
  }
  .header-title { color: var(--nord8); font-size: 0.95rem; font-weight: 700; letter-spacing: 0.06em; }
  .header-tags { display: flex; gap: 0.4rem; }
  .tag {
    font-size: 0.7rem; padding: 0.15rem 0.5rem;
    border: 1px solid var(--nord3); border-radius: 999px;
    color: var(--nord9); background: var(--nord2);
  }
  #app-header .icon-button {
    margin-left: auto; font-size: 1.1rem; line-height: 1;
    background: var(--nord2); border: 1px solid var(--nord3);
    border-radius: 50%; width: 32px; height: 32px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
  }

  /* Main */
  #app-main {
    flex: 1; display: flex; overflow: hidden;
  }

  /* Viewport */
  #viewport {
    flex: 1; position: relative; overflow: hidden;
    background: #1a1a1a;
  }
  #canvas { display: block; width: 100% !important; height: 100% !important; }

  /* Control Panel */
  #control-panel {
    width: var(--panel-w); flex-shrink: 0;
    background: rgba(30,30,30,0.88); backdrop-filter: blur(12px);
    border-left: 1px solid var(--nord3);
    overflow-y: auto; padding: 0.75rem 0.9rem;
    display: flex; flex-direction: column; gap: 0.5rem;
  }
  .panel-section {
    padding: 0.65rem 0.75rem;
    background: rgba(255,255,255,0.03);
    border: 1px solid var(--nord3); border-radius: 10px;
    display: flex; flex-direction: column; gap: 0.45rem;
  }
  .section-title {
    font-size: 0.7rem; font-weight: 700; letter-spacing: 0.08em;
    color: var(--nord8); text-transform: uppercase; margin-bottom: 0.25rem;
  }
  .ctrl-label {
    font-size: 0.72rem; color: var(--nord5);
    display: flex; justify-content: space-between; align-items: center;
  }
  .ctrl-label-inline { font-size: 0.72rem; color: var(--nord5); }
  .ctrl-value { color: var(--nord13); font-size: 0.72rem; }
  input[type="range"] {
    width: 100%; accent-color: var(--nord8);
    height: 3px; cursor: pointer;
  }
  .ctrl-row {
    display: flex; justify-content: space-between; align-items: center;
  }

  /* Toggle switch */
  .toggle-switch { position: relative; display: inline-block; width: 36px; height: 20px; }
  .toggle-switch input { opacity: 0; width: 0; height: 0; }
  .toggle-track {
    position: absolute; inset: 0; background: var(--nord3);
    border-radius: 999px; cursor: pointer; transition: background 0.2s;
  }
  .toggle-track::after {
    content: ''; position: absolute; top: 3px; left: 3px;
    width: 14px; height: 14px; background: var(--nord6);
    border-radius: 50%; transition: transform 0.2s;
  }
  .toggle-switch input:checked + .toggle-track { background: var(--nord8); }
  .toggle-switch input:checked + .toggle-track::after { transform: translateX(16px); }

  /* Mode buttons */
  .btn-group { display: flex; gap: 0.3rem; flex-wrap: wrap; }
  .mode-btn {
    flex: 1; font: inherit; font-size: 0.68rem;
    padding: 0.3rem 0.4rem;
    background: var(--nord2); color: var(--nord5);
    border: 1px solid var(--nord3); border-radius: 6px; cursor: pointer;
    transition: background 0.15s, color 0.15s;
  }
  .mode-btn.active { background: var(--nord8); color: var(--nord0); border-color: var(--nord8); }

  /* Reset */
  .reset-btn {
    width: 100%; font: inherit; font-size: 0.72rem;
    padding: 0.45rem; margin-top: 0.2rem;
    background: var(--nord11); color: var(--nord6);
    border: none; border-radius: 8px; cursor: pointer;
    transition: opacity 0.15s;
  }
  .reset-btn:hover { opacity: 0.85; }

  /* Footer */
  #app-footer {
    height: var(--footer-h); flex-shrink: 0;
    display: flex; align-items: center; gap: 1.5rem;
    padding: 0 1rem;
    background: rgba(26,26,26,0.9); border-top: 1px solid var(--nord3);
    font-size: 0.72rem; color: var(--nord9);
  }
  #app-footer b { color: var(--nord13); }

  /* Math Modal */
  #math-modal[hidden] { display: none; }
  #math-modal {
    position: fixed; inset: 0; display: grid; place-items: center;
    background: rgba(0,0,0,0.65); z-index: 50;
  }
  .modal-panel {
    width: min(740px, calc(100vw - 2rem)); max-height: calc(100vh - 3rem);
    overflow: auto; background: #222;
    border: 1px solid var(--nord3); border-radius: 16px;
    box-shadow: 0 24px 60px rgba(0,0,0,0.5); padding: 1.25rem;
  }
  .modal-header {
    display: flex; justify-content: space-between; align-items: center;
    gap: 1rem; margin-bottom: 1rem;
  }
  .modal-header h2 { font-size: 1rem; color: var(--nord8); }
  .modal-actions { display: flex; gap: 0.5rem; }
  .modal-btn {
    font: inherit; font-size: 0.78rem;
    padding: 0.3rem 0.75rem;
    background: var(--nord2); color: var(--nord5);
    border: 1px solid var(--nord3); border-radius: 999px; cursor: pointer;
  }
  .modal-body { display: grid; gap: 0.9rem; line-height: 1.75; color: var(--nord5); font-size: 0.85rem; }
  .modal-body pre[class*="language-"] {
    border-radius: 8px; overflow-x: auto; font-size: 0.78rem; margin: 0;
  }
  .modal-body .katex-display { overflow-x: auto; }

  /* Drag cursor on canvas */
  #canvas.hovering { cursor: grab; }
  #canvas.dragging  { cursor: grabbing; }
`;
document.head.appendChild(style);

/* ─── DOM refs ────────────────────────────────────────────────────── */
const canvas        = document.getElementById('canvas');
const viewport      = document.getElementById('viewport');
const openMathBtn   = document.getElementById('open-math');
const closeMathBtn  = document.getElementById('close-math');
const langToggle    = document.getElementById('language-toggle');
const mathModal     = document.getElementById('math-modal');
const mathContent   = document.getElementById('math-content');
const statFps       = document.getElementById('stat-fps');
const statVerts     = document.getElementById('stat-verts');
const statPhys      = document.getElementById('stat-phys');
const btnReset      = document.getElementById('btn-reset');

/* ─── Slider helpers ──────────────────────────────────────────────── */
function slider(id, valId, fmt = (v) => v.toFixed(2)) {
  const el  = document.getElementById(id);
  const val = document.getElementById(valId);
  const get = () => parseFloat(el.value);
  el.addEventListener('input', () => { val.textContent = fmt(get()); });
  val.textContent = fmt(get());
  return { el, get };
}

const sliders = {
  length:   slider('ctrl-length',      'val-length'),
  width:    slider('ctrl-width',       'val-width'),
  thick:    slider('ctrl-thick',       'val-thick'),
  bulge:    slider('ctrl-bulge',       'val-bulge'),
  torsion:  slider('ctrl-torsion',     'val-torsion'),
  stiffness:slider('ctrl-stiffness',   'val-stiffness'),
  volume:   slider('ctrl-volume',      'val-volume'),
  gravStr:  slider('ctrl-gravity-str', 'val-gravity'),
};
const gravityToggle = document.getElementById('ctrl-gravity');

/* ─── Three.js setup ──────────────────────────────────────────────── */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x1a1a1a);
scene.fog = new THREE.Fog(0x1a1a1a, 8, 20);

const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
camera.position.set(2.2, 1.6, 2.8);
camera.lookAt(0, 0, 0);

const orbit = new OrbitControls(camera, renderer.domElement);
orbit.enableDamping = true;
orbit.dampingFactor = 0.08;
orbit.minDistance = 1.5;
orbit.maxDistance = 8;

/* ─── Lighting ────────────────────────────────────────────────────── */
const keyLight = new THREE.DirectionalLight(0xfff5e0, 2.0);
keyLight.position.set(3, 4, 3);
keyLight.castShadow = true;
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x88C0D0, 0.5);
fillLight.position.set(-3, 1, -2);
scene.add(fillLight);

scene.add(new THREE.AmbientLight(0x334455, 1.2));

/* ─── Ground grid ─────────────────────────────────────────────────── */
const gridHelper = new THREE.GridHelper(10, 20, 0x333333, 0x2a2a2a);
gridHelper.position.y = -1.2;
scene.add(gridHelper);

/* ─── World-space axis indicator at grid corner ───────────────────── */
const AXIS_ORIGIN = new THREE.Vector3(-5, -1.2, -5);
const AXIS_LEN = 0.8;

function makeAxisLabel(text, color) {
  const cvs = document.createElement('canvas');
  cvs.width = 64; cvs.height = 64;
  const ctx = cvs.getContext('2d');
  ctx.fillStyle = color;
  ctx.font = 'bold 52px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 32, 32);
  const tex = new THREE.CanvasTexture(cvs);
  const mat = new THREE.SpriteMaterial({ map: tex, sizeAttenuation: true });
  const sprite = new THREE.Sprite(mat);
  sprite.scale.set(0.35, 0.35, 0.35);
  return sprite;
}

const WORLD_AXES = [
  { dir: new THREE.Vector3(1, 0, 0), color: 0xff4455, hex: '#ff4455', label: 'X' },
  { dir: new THREE.Vector3(0, 1, 0), color: 0x88c060, hex: '#88c060', label: 'Y' },
  { dir: new THREE.Vector3(0, 0, 1), color: 0x5599ff, hex: '#5599ff', label: 'Z' },
];
for (const { dir, color, hex, label } of WORLD_AXES) {
  scene.add(new THREE.ArrowHelper(dir, AXIS_ORIGIN, AXIS_LEN, color, 0.18, 0.08));
  const sprite = makeAxisLabel(label, hex);
  sprite.position.copy(AXIS_ORIGIN).addScaledVector(dir, AXIS_LEN + 0.22);
  scene.add(sprite);
}

/* ─── Soft-body mesh (PBD-inspired) ──────────────────────────────── */
const BASE_SEGMENTS = 6;

/**
 * Builds an icosphere-like geometry subdivided for soft-body sim.
 * We use a SphereGeometry and flatten it to a "meat slab" shape.
 */
function buildMeatGeometry(sx = 1, sy = 0.65, sz = 0.8) {
  const geo = new THREE.SphereGeometry(1, BASE_SEGMENTS * 3, BASE_SEGMENTS * 2);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    pos.setXYZ(i, pos.getX(i) * sx, pos.getY(i) * sy, pos.getZ(i) * sz);
  }
  geo.computeVertexNormals();
  return geo;
}

const wireframeMat = new THREE.MeshStandardMaterial({
  color: 0x88C0D0, wireframe: true,
});
const shadedMat = new THREE.MeshStandardMaterial({
  color: 0xC87D6A, roughness: 0.85, metalness: 0.05,
});
const xrayMat = new THREE.MeshStandardMaterial({
  color: 0xC87D6A, roughness: 0.85, metalness: 0.05,
  transparent: true, opacity: 0.72,
});

let currentMode = 'wireframe';
let geometry = buildMeatGeometry();
const mesh = new THREE.Mesh(geometry, wireframeMat);
mesh.castShadow = true;
mesh.receiveShadow = true;
scene.add(mesh);

/* Wireframe overlay for x-ray mode */
const wireOverlay = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({
  color: 0x88C0D0, wireframe: true, transparent: true, opacity: 0.25,
}));
wireOverlay.visible = false;
scene.add(wireOverlay);

/* Hover vertex marker */
const hoverMarker = new THREE.Mesh(
  new THREE.SphereGeometry(0.018, 8, 6),
  new THREE.MeshBasicMaterial({ color: 0xffdd44, depthTest: false, transparent: true, opacity: 0.45 }),
);
hoverMarker.visible = false;
scene.add(hoverMarker);
let hoverVertexIdx = -1;

/* ─── PBD soft-body state ─────────────────────────────────────────── */
const REST_POS = [];   // rest positions (Vector3)
const CUR_POS  = [];   // current positions (Vector3)
const VEL      = [];   // velocities (Vector3)
const PIN_Y    = [];   // rest Y for gravity droop

function initParticles() {
  REST_POS.length = 0; CUR_POS.length = 0; VEL.length = 0; PIN_Y.length = 0;
  const pos = geometry.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const v = new THREE.Vector3(pos.getX(i), pos.getY(i), pos.getZ(i));
    REST_POS.push(v.clone());
    CUR_POS.push(v.clone());
    VEL.push(new THREE.Vector3());
    PIN_Y.push(v.y);
  }
}
initParticles();
statVerts.textContent = REST_POS.length;

/**
 * Apply slider-driven shape deformation + physics step.
 * This is a simplified PBD: shape-matching + gravity + drag.
 */
function physicsStep(dt) {
  const sx       = sliders.length.get();
  const sy       = sliders.thick.get();
  const sz       = sliders.width.get();
  const bulge    = sliders.bulge.get();
  const torsion  = sliders.torsion.get();
  const stiff    = sliders.stiffness.get();
  const volPres  = sliders.volume.get();
  const gravOn   = gravityToggle.checked;
  const gravStr  = sliders.gravStr.get();

  const n = CUR_POS.length;

  for (let i = 0; i < n; i++) {
    const rest = REST_POS[i];
    const cur  = CUR_POS[i];
    const vel  = VEL[i];

    /* Compute target position from sliders */
    const angle = torsion * rest.y * Math.PI;
    const cosA  = Math.cos(angle);
    const sinA  = Math.sin(angle);
    const rx    = rest.x * cosA - rest.z * sinA;
    const rz    = rest.x * sinA + rest.z * cosA;

    const dist  = Math.sqrt(rx * rx + rz * rz);
    const bulgeFactor = 1 + bulge * (1 - Math.abs(rest.y)) * volPres;

    const tx = rx * sx * bulgeFactor;
    const ty = rest.y * sy;
    const tz = rz * sz * bulgeFactor;

    /* Shape-matching spring toward target */
    const dx = tx - cur.x;
    const dy = ty - cur.y;
    const dz = tz - cur.z;
    vel.x += dx * stiff * 18 * dt;
    vel.y += dy * stiff * 18 * dt;
    vel.z += dz * stiff * 18 * dt;

    /* Gravity: proportional to vertex height weight */
    if (gravOn) {
      const gravWeight = (PIN_Y[i] + 0.5) * 0.5;
      vel.y -= gravStr * gravWeight * 2.5 * dt;
    }

    /* Damping */
    const damping = 1 - (1 - stiff) * 0.15;
    vel.multiplyScalar(Math.pow(damping, dt * 60));

    cur.x += vel.x * dt;
    cur.y += vel.y * dt;
    cur.z += vel.z * dt;
  }

  /* Write back to geometry */
  const pos = geometry.attributes.position;
  for (let i = 0; i < n; i++) {
    pos.setXYZ(i, CUR_POS[i].x, CUR_POS[i].y, CUR_POS[i].z);
  }
  pos.needsUpdate = true;
  geometry.computeVertexNormals();
}

/* ─── Mouse drag (direct manipulation) ───────────────────────────── */
const raycaster  = new THREE.Raycaster();
const mouse      = new THREE.Vector2();
let   dragging   = false;
let   dragVertex = -1;
const dragPlane  = new THREE.Plane();
const dragTarget = new THREE.Vector3();
const dragOffset = new THREE.Vector3();

function getNDC(e) {
  const rect = canvas.getBoundingClientRect();
  return new THREE.Vector2(
    ((e.clientX - rect.left) / rect.width)  * 2 - 1,
    -((e.clientY - rect.top)  / rect.height) * 2 + 1,
  );
}

function findNearestVertex(ndcVec) {
  raycaster.setFromCamera(ndcVec, camera);
  const hits = raycaster.intersectObject(mesh);
  if (!hits.length) return -1;
  const hp = hits[0].point;
  const pos = geometry.attributes.position;
  let best = -1, bestD = Infinity;
  for (let i = 0; i < pos.count; i++) {
    const v = CUR_POS[i];
    const d = hp.distanceToSquared(v);
    if (d < bestD) { bestD = d; best = i; }
  }
  return best;
}

canvas.addEventListener('mousemove', (e) => {
  const ndc = getNDC(e);
  raycaster.setFromCamera(ndc, camera);
  const hits = raycaster.intersectObject(mesh);
  canvas.className = hits.length ? (dragging ? 'dragging' : 'hovering') : '';
  orbit.enabled = !hits.length || dragging ? !dragging : true;

  if (!dragging) {
    if (hits.length && currentMode === 'wireframe') {
      hoverVertexIdx = findNearestVertex(ndc);
      if (hoverVertexIdx >= 0) {
        hoverMarker.position.copy(CUR_POS[hoverVertexIdx]);
        hoverMarker.visible = true;
      }
    } else {
      hoverMarker.visible = false;
      hoverVertexIdx = -1;
    }
    return;
  }
  raycaster.ray.intersectPlane(dragPlane, dragTarget);
  if (!dragTarget) return;
  const newPos = dragTarget.clone().sub(dragOffset);
  CUR_POS[dragVertex].copy(newPos);
  VEL[dragVertex].set(0, 0, 0);
  /* Propagate influence to nearby vertices */
  const influence = 0.35;
  for (let i = 0; i < CUR_POS.length; i++) {
    if (i === dragVertex) continue;
    const d = CUR_POS[i].distanceTo(newPos);
    if (d < 0.8) {
      const w = (1 - d / 0.8) * influence;
      CUR_POS[i].lerp(newPos, w * 0.12);
    }
  }
});

canvas.addEventListener('mouseleave', () => {
  hoverMarker.visible = false;
  hoverVertexIdx = -1;
});

canvas.addEventListener('mousedown', (e) => {
  const ndc = getNDC(e);
  dragVertex = findNearestVertex(ndc);
  if (dragVertex < 0) return;

  hoverMarker.visible = false;
  dragging = true;
  orbit.enabled = false;
  canvas.classList.add('dragging');

  /* Set drag plane facing the camera through the vertex */
  const cameraDir = new THREE.Vector3();
  camera.getWorldDirection(cameraDir);
  dragPlane.setFromNormalAndCoplanarPoint(cameraDir, CUR_POS[dragVertex]);
  raycaster.setFromCamera(ndc, camera);
  raycaster.ray.intersectPlane(dragPlane, dragTarget);
  dragOffset.copy(dragTarget).sub(CUR_POS[dragVertex]);
});

window.addEventListener('mouseup', () => {
  dragging = false;
  orbit.enabled = true;
  canvas.classList.remove('dragging');
});

/* ─── Render mode buttons ─────────────────────────────────────────── */
document.querySelectorAll('.mode-btn').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.mode-btn').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    currentMode = btn.dataset.mode;
    switch (currentMode) {
      case 'wireframe':
        mesh.material = wireframeMat;
        wireOverlay.visible = false;
        break;
      case 'shaded':
        mesh.material = shadedMat;
        wireOverlay.visible = false;
        break;
      case 'xray':
        mesh.material = xrayMat;
        wireOverlay.geometry = geometry;
        wireOverlay.visible = true;
        break;
    }
  });
});

/* ─── Reset ───────────────────────────────────────────────────────── */
btnReset.addEventListener('click', () => {
  Object.values(sliders).forEach(({ el }) => {
    const defaultVal = parseFloat(el.defaultValue);
    el.value = defaultVal;
    el.dispatchEvent(new Event('input'));
  });
  gravityToggle.checked = true;
  initParticles();
});

/* ─── Resize ──────────────────────────────────────────────────────── */
function resize() {
  const w = viewport.clientWidth;
  const h = viewport.clientHeight;
  renderer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);
resize();

/* ─── Modal content ───────────────────────────────────────────────── */
let modalLang = 'en';

const modalCopy = {
  en: `
    <p>Meat-Mesh simulates soft-body deformation using a simplified
    <strong>Position Based Dynamics (PBD)</strong> approach. Each vertex is treated as a
    particle with position $\\mathbf{x}_i$ and velocity $\\mathbf{v}_i$.</p>

    <p>At each frame the target (rest) position $\\tilde{\\mathbf{x}}_i$ is derived from
    the slider transforms. A <strong>shape-matching spring</strong> pulls the particle toward
    it with stiffness $k$:</p>

    <p>$$\\mathbf{v}_i \\mathrel{+}= k \\cdot (\\tilde{\\mathbf{x}}_i - \\mathbf{x}_i) \\cdot \\Delta t$$</p>

    <p>Gravity applies a downward impulse weighted by the vertex's rest height $y_0$:</p>

    <p>$$\\mathbf{v}_{i,y} \\mathrel{-}= g \\cdot w_i \\cdot \\Delta t, \\quad w_i = \\tfrac{y_0 + 0.5}{2}$$</p>

    <p><strong>Torsion</strong> rotates each vertex around the Y-axis by an angle proportional to
    its height, producing a twist deformation:</p>

    <p>$$R_y(\\theta) = \\begin{bmatrix} \\cos\\theta & 0 & \\sin\\theta \\\\ 0 & 1 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta \\end{bmatrix}, \\quad \\theta = \\tau \\cdot y_0 \\cdot \\pi$$</p>

    <p>The mouse drag uses a camera-facing plane for hit-testing and propagates displacement
    to nearby vertices with a radial falloff:</p>

    <pre><code class="language-js">// Influence falloff within radius r = 0.8
const w = (1 - d / r) * influence;
pos[i].lerp(dragPos, w * 0.12);</code></pre>
  `,
  zhTW: `
    <p>Meat-Mesh 使用簡化版的 <strong>Position Based Dynamics (PBD)</strong>
    軟體模擬。每個頂點被視為一顆粒子，具備位置 $\\mathbf{x}_i$ 與速度 $\\mathbf{v}_i$。</p>

    <p>每一幀先從滑桿參數計算出目標靜止位置 $\\tilde{\\mathbf{x}}_i$，
    再用 <strong>形狀匹配彈簧</strong> 以硬度 $k$ 拉向目標：</p>

    <p>$$\\mathbf{v}_i \\mathrel{+}= k \\cdot (\\tilde{\\mathbf{x}}_i - \\mathbf{x}_i) \\cdot \\Delta t$$</p>

    <p>重力根據頂點的初始高度 $y_0$ 加上不同權重的向下衝量：</p>

    <p>$$\\mathbf{v}_{i,y} \\mathrel{-}= g \\cdot w_i \\cdot \\Delta t, \\quad w_i = \\tfrac{y_0 + 0.5}{2}$$</p>

    <p><strong>扭轉（Torsion）</strong> 讓每個頂點依其高度繞 Y 軸旋轉一個角度，
    形成螺旋形變：</p>

    <p>$$R_y(\\theta) = \\begin{bmatrix} \\cos\\theta & 0 & \\sin\\theta \\\\ 0 & 1 & 0 \\\\ -\\sin\\theta & 0 & \\cos\\theta \\end{bmatrix}, \\quad \\theta = \\tau \\cdot y_0 \\cdot \\pi$$</p>

    <p>滑鼠拉扯透過相機朝向平面進行射線測試，並以徑向衰減將位移傳播給附近頂點：</p>

    <pre><code class="language-js">// 半徑 r = 0.8 內的影響衰減
const w = (1 - d / r) * influence;
pos[i].lerp(dragPos, w * 0.12);</code></pre>
  `,
};

function renderModal() {
  mathContent.innerHTML = modalCopy[modalLang];
  renderMathInElement(mathContent, {
    delimiters: [
      { left: '$$', right: '$$', display: true },
      { left: '$',  right: '$',  display: false },
    ],
    throwOnError: false,
  });
  Prism.highlightAllUnder(mathContent);
}

openMathBtn.addEventListener('click', () => {
  renderModal();
  mathModal.hidden = false;
});
closeMathBtn.addEventListener('click', () => { mathModal.hidden = true; });
mathModal.addEventListener('click', (e) => { if (e.target === mathModal) mathModal.hidden = true; });
langToggle.addEventListener('click', () => {
  modalLang = modalLang === 'en' ? 'zhTW' : 'en';
  renderModal();
});

/* ─── Animation loop ──────────────────────────────────────────────── */
let lastTime  = 0;
let frameCount = 0;
let fpsTimer  = 0;
let physMs    = 0;

function animate(t = 0) {
  requestAnimationFrame(animate);

  const dt = Math.min((t - lastTime) / 1000, 0.05);
  lastTime = t;

  /* Physics */
  const t0 = performance.now();
  physicsStep(dt);
  physMs = performance.now() - t0;

  if (hoverMarker.visible && hoverVertexIdx >= 0) {
    hoverMarker.position.copy(CUR_POS[hoverVertexIdx]);
  }

  orbit.update();
  renderer.render(scene, camera);

  /* Stats */
  frameCount++;
  fpsTimer += dt;
  if (fpsTimer >= 0.5) {
    statFps.textContent  = Math.round(frameCount / fpsTimer);
    statPhys.textContent = physMs.toFixed(1);
    frameCount = 0;
    fpsTimer   = 0;
  }
}
animate();
