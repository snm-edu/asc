import * as THREE from "https://esm.sh/three@0.165.0";
import { OrbitControls } from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://esm.sh/three@0.165.0/examples/jsm/loaders/FBXLoader.js";

const viewport = document.getElementById("viewport");
const loadingNotice = document.getElementById("loadingNotice");
const systemSelect = document.getElementById("systemSelect");
const toggleEn = document.getElementById("toggleEn");
const resetViewButton = document.getElementById("resetView");
const partName = document.getElementById("partName");
const partNameEn = document.getElementById("partNameEn");
const partDescription = document.getElementById("partDescription");
const structureCount = document.getElementById("structureCount");
const modelSource = document.getElementById("modelSource");

const SYSTEMS = [
  {
    id: "visceral",
    label: "Z-Anatomy 内臓系",
    url: "./assets/z-anatomy/VisceralSystem100.fbx",
    sourceLabel: "VisceralSystem100.fbx",
    emptyMessage: "内臓系の構造をタップすると、名称を表示します。",
    targetHeight: 2.35,
  },
];

const JAPANESE_NAME_MAP = new Map([
  ["Liver", "肝臓"],
  ["Stomach", "胃"],
  ["Pancreas", "膵臓"],
  ["Gallbladder", "胆嚢"],
  ["Right lung", "右肺"],
  ["Left lung", "左肺"],
  ["Lung", "肺"],
  ["Kidney", "腎臓"],
  ["Right kidney", "右腎臓"],
  ["Left kidney", "左腎臓"],
  ["Urinary bladder", "膀胱"],
  ["Bladder", "膀胱"],
  ["Oesophagus", "食道"],
  ["Esophagus", "食道"],
  ["Testis", "精巣"],
  ["Ovary", "卵巣"],
  ["Uterus", "子宮"],
  ["Trachea", "気管"],
  ["Spleen", "脾臓"],
  ["Duodenum", "十二指腸"],
  ["Jejunum", "空腸"],
  ["Ileum", "回腸"],
  ["Caecum", "盲腸"],
  ["Cecum", "盲腸"],
  ["Appendix", "虫垂"],
  ["Colon", "結腸"],
  ["Rectum", "直腸"],
]);

const ORGAN_HINTS = [
  { keyword: "liver", label: "肝臓関連の構造です。" },
  { keyword: "lung", label: "肺関連の構造です。" },
  { keyword: "kidney", label: "腎臓関連の構造です。" },
  { keyword: "stomach", label: "胃関連の構造です。" },
  { keyword: "pancreas", label: "膵臓関連の構造です。" },
  { keyword: "gallbladder", label: "胆嚢関連の構造です。" },
  { keyword: "bladder", label: "膀胱関連の構造です。" },
  { keyword: "testis", label: "精巣関連の構造です。" },
  { keyword: "ovary", label: "卵巣関連の構造です。" },
  { keyword: "uterus", label: "子宮関連の構造です。" },
  { keyword: "spleen", label: "脾臓関連の構造です。" },
  { keyword: "oesophagus", label: "食道関連の構造です。" },
  { keyword: "esophagus", label: "食道関連の構造です。" },
  { keyword: "duodenum", label: "十二指腸関連の構造です。" },
  { keyword: "jejunum", label: "空腸関連の構造です。" },
  { keyword: "ileum", label: "回腸関連の構造です。" },
  { keyword: "colon", label: "結腸関連の構造です。" },
  { keyword: "rectum", label: "直腸関連の構造です。" },
];

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d9e6ff");
scene.fog = new THREE.Fog("#d9e6ff", 5.5, 10);

const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
camera.position.set(2, 1.4, 2.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.35));
renderer.domElement.className = "viewer-canvas";
renderer.domElement.style.touchAction = "none";
if ("outputColorSpace" in renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
viewport.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.rotateSpeed = 0.9;
controls.zoomSpeed = 0.95;
controls.panSpeed = 0.8;
controls.minPolarAngle = 0.12;
controls.maxPolarAngle = Math.PI - 0.08;
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

scene.add(new THREE.HemisphereLight(0xffffff, 0x6f7e99, 1.55));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.35);
keyLight.position.set(4, 6, 5);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0xadc4ff, 0.7);
fillLight.position.set(-4, 3, -3);
scene.add(fillLight);

const rimLight = new THREE.DirectionalLight(0xffffff, 0.35);
rimLight.position.set(0, 3, -6);
scene.add(rimLight);

const groundShadow = new THREE.Mesh(
  new THREE.CircleGeometry(1.85, 72),
  new THREE.MeshBasicMaterial({ color: "#c7d6f5", transparent: true, opacity: 0.55 })
);
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.position.y = -0.01;
scene.add(groundShadow);

const modelRoot = new THREE.Group();
scene.add(modelRoot);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const labelWorldPosition = new THREE.Vector3();

const floatingLabel = document.createElement("div");
floatingLabel.className = "floating-label hidden";
viewport.appendChild(floatingLabel);

const state = {
  currentSystemId: "visceral",
  currentModel: null,
  interactiveMeshes: [],
  selectedMesh: null,
  selectedMaterials: [],
  showEnglish: true,
  defaultCameraPosition: new THREE.Vector3(2, 1.4, 2.8),
  defaultTarget: new THREE.Vector3(0, 1.1, 0),
  activePointers: new Map(),
  tapCandidate: null,
  ready: false,
};

window.addEventListener("error", (event) => {
  if (state.ready) {
    return;
  }
  const message = event.error?.message || event.message || "不明なエラー";
  setLoadingMessage(`初期化エラー: ${message}`, true);
});

window.addEventListener("unhandledrejection", (event) => {
  if (state.ready) {
    return;
  }
  const reason =
    event.reason instanceof Error ? event.reason.message : String(event.reason ?? "不明なエラー");
  setLoadingMessage(`初期化エラー: ${reason}`, true);
});

function setLoadingMessage(message, isError = false) {
  loadingNotice.textContent = message;
  loadingNotice.classList.remove("hidden");
  loadingNotice.classList.toggle("error", isError);
}

function hideLoadingMessage() {
  loadingNotice.classList.add("hidden");
  loadingNotice.classList.remove("error");
}

function cleanAnatomyName(rawName = "") {
  return rawName
    .replace(/\.t$/i, "")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function exactJapaneseName(label) {
  return JAPANESE_NAME_MAP.get(label) ?? null;
}

function describeStructure(label) {
  const lowerLabel = label.toLowerCase();
  const organHint = ORGAN_HINTS.find((entry) => lowerLabel.includes(entry.keyword));
  if (organHint) {
    return `${organHint.label} 詳細名: ${label}`;
  }
  return `Z-Anatomy の解剖構造名です。詳細名: ${label}`;
}

function extractDisplayName(object) {
  let current = object;
  while (current) {
    const label = cleanAnatomyName(current.name);
    if (label && label !== "RootNode") {
      return label;
    }
    current = current.parent;
  }
  return "Unknown structure";
}

function renderEmptySelection(message) {
  partName.textContent = "未選択";
  partNameEn.textContent = "";
  partDescription.textContent = message;
}

function renderStructureInfo(label) {
  const japanese = exactJapaneseName(label);
  partName.textContent = japanese ?? label;
  partNameEn.textContent = state.showEnglish ? label : "";
  partDescription.textContent = describeStructure(label);
}

function setEnglishLabels(enabled) {
  state.showEnglish = enabled;
  toggleEn.textContent = enabled ? "英語名 ON" : "英語名 OFF";

  if (state.selectedMesh) {
    renderStructureInfo(state.selectedMesh.userData.displayName);
    updateFloatingLabel();
  } else {
    const system = SYSTEMS.find((entry) => entry.id === state.currentSystemId);
    renderEmptySelection(system?.emptyMessage ?? "構造をタップすると名称を表示します。");
  }
}

function forEachMaterial(mesh, callback) {
  const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
  materials.forEach((material) => {
    if (material) {
      callback(material);
    }
  });
}

function restoreSelectedAppearance() {
  state.selectedMaterials.forEach((snapshot) => {
    if (snapshot.emissive && snapshot.material.emissive) {
      snapshot.material.emissive.copy(snapshot.emissive);
    }
    if ("emissiveIntensity" in snapshot.material && snapshot.emissiveIntensity !== undefined) {
      snapshot.material.emissiveIntensity = snapshot.emissiveIntensity;
    }
    if (snapshot.color && snapshot.material.color) {
      snapshot.material.color.copy(snapshot.color);
    }
  });
  state.selectedMaterials = [];
}

function clearSelection({ resetInfo = false } = {}) {
  restoreSelectedAppearance();
  state.selectedMesh = null;
  floatingLabel.classList.add("hidden");

  if (resetInfo) {
    const system = SYSTEMS.find((entry) => entry.id === state.currentSystemId);
    renderEmptySelection(system?.emptyMessage ?? "構造をタップすると名称を表示します。");
  }
}

function applySelectedAppearance(mesh) {
  restoreSelectedAppearance();

  forEachMaterial(mesh, (material) => {
    state.selectedMaterials.push({
      material,
      emissive: material.emissive?.clone?.(),
      emissiveIntensity: material.emissiveIntensity,
      color: material.color?.clone?.(),
    });

    if (material.emissive) {
      material.emissive.set("#164bff");
      material.emissiveIntensity = 0.35;
    } else if (material.color) {
      material.color.offsetHSL(0, 0, 0.08);
    }
  });
}

function updateFloatingLabel() {
  if (!state.selectedMesh) {
    floatingLabel.classList.add("hidden");
    return;
  }

  const label = state.selectedMesh.userData.displayName;
  const japanese = exactJapaneseName(label);
  floatingLabel.textContent = japanese ?? label;

  state.selectedMesh.getWorldPosition(labelWorldPosition);
  labelWorldPosition.project(camera);

  if (labelWorldPosition.z > 1) {
    floatingLabel.classList.add("hidden");
    return;
  }

  const x = (labelWorldPosition.x * 0.5 + 0.5) * viewport.clientWidth;
  const y = (labelWorldPosition.y * -0.5 + 0.5) * viewport.clientHeight - 18;
  floatingLabel.style.left = `${x}px`;
  floatingLabel.style.top = `${y}px`;
  floatingLabel.classList.remove("hidden");
}

function selectMesh(mesh) {
  state.selectedMesh = mesh;
  applySelectedAppearance(mesh);
  renderStructureInfo(mesh.userData.displayName);
  updateFloatingLabel();
}

function pickMesh(event) {
  if (state.interactiveMeshes.length === 0) {
    return null;
  }

  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(state.interactiveMeshes, false)[0] ?? null;
}

function onSceneTap(event) {
  const hit = pickMesh(event);

  if (!hit) {
    clearSelection({ resetInfo: true });
    return;
  }

  selectMesh(hit.object);
}

function fitCameraToObject(object) {
  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = (maxDim / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 1.5;

  state.defaultTarget.copy(center);
  state.defaultCameraPosition.copy(center).add(new THREE.Vector3(distance * 0.55, size.y * 0.18, distance));

  camera.near = Math.max(0.01, maxDim / 100);
  camera.far = distance * 10;
  camera.position.copy(state.defaultCameraPosition);
  camera.updateProjectionMatrix();

  controls.minDistance = Math.max(0.45, distance * 0.32);
  controls.maxDistance = distance * 3.4;
  controls.target.copy(state.defaultTarget);
  controls.update();
}

function normalizeModel(object, targetHeight) {
  const initialBox = new THREE.Box3().setFromObject(object);
  const initialSize = initialBox.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(initialSize.y, 0.001);
  object.scale.setScalar(scale);

  const scaledBox = new THREE.Box3().setFromObject(object);
  const scaledCenter = scaledBox.getCenter(new THREE.Vector3());
  object.position.x -= scaledCenter.x;
  object.position.z -= scaledCenter.z;
  object.position.y -= scaledBox.min.y;

  fitCameraToObject(object);
}

function disposeCurrentModel() {
  if (!state.currentModel) {
    return;
  }

  clearSelection({ resetInfo: false });

  state.currentModel.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.geometry?.dispose?.();
    forEachMaterial(child, (material) => material.dispose?.());
  });

  modelRoot.remove(state.currentModel);
  state.currentModel = null;
  state.interactiveMeshes = [];
  structureCount.textContent = "-";
}

function registerMeshes(object) {
  const labels = new Set();
  state.interactiveMeshes = [];

  object.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    const label = extractDisplayName(child);
    if (!label || label === "Unknown structure") {
      return;
    }

    if (Array.isArray(child.material)) {
      child.material = child.material.map((material) => material?.clone?.() ?? material).filter(Boolean);
    } else if (child.material?.clone) {
      child.material = child.material.clone();
    }

    child.userData.displayName = label;
    state.interactiveMeshes.push(child);
    labels.add(label);

    forEachMaterial(child, (material) => {
      if ("side" in material) {
        material.side = THREE.DoubleSide;
      }
      if ("transparent" in material) {
        material.transparent = material.opacity < 1;
      }
    });
  });

  structureCount.textContent = `${labels.size}`;
}

function resetView() {
  camera.position.copy(state.defaultCameraPosition);
  controls.target.copy(state.defaultTarget);
  controls.update();
  updateFloatingLabel();
}

function resize() {
  const width = Math.max(viewport.clientWidth, 320);
  const height = Math.max(viewport.clientHeight, 320);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
  updateFloatingLabel();
}

function resetTapCandidateIfNeeded(pointerId) {
  state.activePointers.delete(pointerId);
  if (state.activePointers.size === 0) {
    state.tapCandidate = null;
  } else if (state.tapCandidate) {
    state.tapCandidate.multiTouch = true;
  }
}

function onPointerDown(event) {
  state.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

  if (state.activePointers.size === 1) {
    state.tapCandidate = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      startedAt: performance.now(),
      moved: false,
      multiTouch: false,
    };
    return;
  }

  if (state.tapCandidate) {
    state.tapCandidate.multiTouch = true;
  }
}

function onPointerMove(event) {
  if (state.activePointers.has(event.pointerId)) {
    state.activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
  }

  if (!state.tapCandidate || state.tapCandidate.pointerId !== event.pointerId) {
    return;
  }

  const movedDistance = Math.hypot(
    event.clientX - state.tapCandidate.x,
    event.clientY - state.tapCandidate.y
  );
  if (movedDistance > 10) {
    state.tapCandidate.moved = true;
  }
}

function onPointerUp(event) {
  if (
    state.tapCandidate &&
    state.tapCandidate.pointerId === event.pointerId &&
    !state.tapCandidate.moved &&
    !state.tapCandidate.multiTouch &&
    performance.now() - state.tapCandidate.startedAt < 350
  ) {
    onSceneTap(event);
  }

  resetTapCandidateIfNeeded(event.pointerId);
}

function onPointerCancel(event) {
  resetTapCandidateIfNeeded(event.pointerId);
}

function populateSystemOptions() {
  systemSelect.innerHTML = "";
  SYSTEMS.forEach((system) => {
    const option = document.createElement("option");
    option.value = system.id;
    option.textContent = system.label;
    systemSelect.appendChild(option);
  });
}

function createLoader() {
  return new Promise((resolve, reject) => {
    const system = SYSTEMS.find((entry) => entry.id === state.currentSystemId);
    const loader = new FBXLoader();

    loader.load(
      system.url,
      (object) => resolve(object),
      (event) => {
        if (!event.loaded) {
          setLoadingMessage("Z-Anatomy モデルを読み込み中...");
          return;
        }

        const loadedMb = (event.loaded / (1024 * 1024)).toFixed(1);
        if (event.total) {
          const progress = Math.round((event.loaded / event.total) * 100);
          const totalMb = (event.total / (1024 * 1024)).toFixed(1);
          setLoadingMessage(`Z-Anatomy モデルを読み込み中... ${progress}% (${loadedMb}/${totalMb} MB)`);
          return;
        }

        setLoadingMessage(`Z-Anatomy モデルを読み込み中... ${loadedMb} MB`);
      },
      (error) => reject(error)
    );
  });
}

async function loadSelectedSystem() {
  const system = SYSTEMS.find((entry) => entry.id === state.currentSystemId);
  modelSource.textContent = system.sourceLabel;
  renderEmptySelection(system.emptyMessage);
  state.ready = false;
  setLoadingMessage("Z-Anatomy モデルを読み込み中...");

  try {
    const object = await createLoader();
    disposeCurrentModel();
    normalizeModel(object, system.targetHeight);
    registerMeshes(object);
    modelRoot.add(object);
    state.currentModel = object;
    state.ready = true;
    hideLoadingMessage();
    resetView();
  } catch (error) {
    setLoadingMessage(`モデル読み込みエラー: ${error.message}`, true);
    renderEmptySelection("Z-Anatomy モデルの読み込みに失敗しました。");
  }
}

populateSystemOptions();
systemSelect.value = state.currentSystemId;
setEnglishLabels(true);

systemSelect.addEventListener("change", () => {
  state.currentSystemId = systemSelect.value;
  loadSelectedSystem();
});

toggleEn.addEventListener("click", () => setEnglishLabels(!state.showEnglish));
resetViewButton.addEventListener("click", resetView);

renderer.domElement.addEventListener("pointerdown", onPointerDown, { passive: true });
renderer.domElement.addEventListener("pointermove", onPointerMove, { passive: true });
renderer.domElement.addEventListener("pointerup", onPointerUp, { passive: true });
renderer.domElement.addEventListener("pointercancel", onPointerCancel, { passive: true });
window.addEventListener("resize", resize);

if (typeof ResizeObserver === "function") {
  const viewportResizeObserver = new ResizeObserver(() => resize());
  viewportResizeObserver.observe(viewport);
}

resize();
loadSelectedSystem();

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateFloatingLabel();
  renderer.render(scene, camera);
}

animate();
