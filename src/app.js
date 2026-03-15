import * as THREE from "https://esm.sh/three@0.165.0";
import { OrbitControls } from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";
import { FBXLoader } from "https://esm.sh/three@0.165.0/examples/jsm/loaders/FBXLoader.js";
import {
  buildStructureDescription,
  parseObjectLabel,
  translateAnatomyLabel,
} from "./anatomy-ja.js";
import {
  getSourceLabel,
  getSystemById,
  MODEL_ASSETS,
  shouldIncludeLabel,
  SYSTEMS,
} from "./model-systems.js";

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
const statusPill = document.getElementById("statusPill");
const systemLead = document.getElementById("systemLead");

const scene = new THREE.Scene();
scene.background = new THREE.Color("#d9e6ff");
scene.fog = new THREE.Fog("#d9e6ff", 5.5, 10);

const camera = new THREE.PerspectiveCamera(42, 1, 0.01, 100);
camera.position.set(2, 1.4, 2.8);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.1));
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
  currentSystemId: SYSTEMS[0].id,
  currentModel: null,
  interactiveMeshes: [],
  selectedMesh: null,
  selectedMaterialRestore: null,
  showOriginalName: false,
  defaultCameraPosition: new THREE.Vector3(2, 1.4, 2.8),
  defaultTarget: new THREE.Vector3(0, 1.1, 0),
  activePointers: new Map(),
  tapCandidate: null,
  ready: false,
  loadVersion: 0,
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

function getCurrentSystem() {
  return getSystemById(state.currentSystemId);
}

function setLoadingMessage(message, isError = false) {
  loadingNotice.textContent = message;
  loadingNotice.classList.remove("hidden");
  loadingNotice.classList.toggle("error", isError);
}

function hideLoadingMessage() {
  loadingNotice.classList.add("hidden");
  loadingNotice.classList.remove("error");
}

function updateSystemPresentation(system) {
  statusPill.textContent = system.statusLabel;
  systemLead.textContent = `${system.label}モデルをスマホで回転・拡大しながら、タップした解剖構造の日本語名を確認できる試作版です。`;
  modelSource.textContent = getSourceLabel(system);
}

function renderEmptySelection(message) {
  partName.textContent = "未選択";
  partNameEn.textContent = "";
  partDescription.textContent = message;
}

function renderStructureInfo(mesh) {
  const system = getCurrentSystem();
  partName.textContent = mesh.userData.japaneseName;
  partNameEn.textContent = state.showOriginalName ? mesh.userData.displayName : "";
  partDescription.textContent = buildStructureDescription(
    system.label,
    mesh.userData.displayName,
    state.showOriginalName
  );
}

function setOriginalNameVisibility(enabled) {
  state.showOriginalName = enabled;
  toggleEn.textContent = enabled ? "原語表示 ON" : "原語表示 OFF";

  if (state.selectedMesh) {
    renderStructureInfo(state.selectedMesh);
    updateFloatingLabel();
    return;
  }

  renderEmptySelection(getCurrentSystem().emptyMessage);
}

function forEachMaterial(materialOrMesh, callback) {
  const materials = Array.isArray(materialOrMesh.material)
    ? materialOrMesh.material
    : [materialOrMesh.material];
  materials.forEach((material) => {
    if (material) {
      callback(material);
    }
  });
}

function restoreSelectedAppearance() {
  if (!state.selectedMaterialRestore) {
    return;
  }

  const { mesh, originalMaterial } = state.selectedMaterialRestore;
  const activeMaterial = mesh.material;
  if (activeMaterial !== originalMaterial) {
    forEachMaterial({ material: activeMaterial }, (material) => material.dispose?.());
    mesh.material = originalMaterial;
  }

  state.selectedMaterialRestore = null;
}

function clearSelection({ resetInfo = false } = {}) {
  restoreSelectedAppearance();
  state.selectedMesh = null;
  floatingLabel.classList.add("hidden");

  if (resetInfo) {
    renderEmptySelection(getCurrentSystem().emptyMessage);
  }
}

function applySelectedAppearance(mesh) {
  restoreSelectedAppearance();

  const originalMaterial = mesh.material;
  const highlightedMaterial = Array.isArray(originalMaterial)
    ? originalMaterial.map((material) => material?.clone?.() ?? material)
    : originalMaterial?.clone?.() ?? originalMaterial;

  state.selectedMaterialRestore = { mesh, originalMaterial };
  mesh.material = highlightedMaterial;

  forEachMaterial(mesh, (material) => {
    if (material.emissive) {
      material.emissive.set("#164bff");
      material.emissiveIntensity = 0.35;
      return;
    }
    if (material.color) {
      material.color.offsetHSL(0, 0, 0.08);
    }
  });
}

function updateFloatingLabel() {
  if (!state.selectedMesh) {
    floatingLabel.classList.add("hidden");
    return;
  }

  floatingLabel.textContent = state.selectedMesh.userData.japaneseName;
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
  renderStructureInfo(mesh);
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

function computeBoundingBox(meshes) {
  const box = new THREE.Box3();
  let hasMesh = false;

  meshes.forEach((mesh) => {
    if (!mesh.visible || !mesh.geometry) {
      return;
    }

    mesh.updateWorldMatrix(true, false);
    if (!mesh.geometry.boundingBox) {
      mesh.geometry.computeBoundingBox();
    }
    if (!mesh.geometry.boundingBox) {
      return;
    }

    const meshBox = mesh.geometry.boundingBox.clone().applyMatrix4(mesh.matrixWorld);
    if (!hasMesh) {
      box.copy(meshBox);
      hasMesh = true;
      return;
    }
    box.union(meshBox);
  });

  return hasMesh ? box : null;
}

function fitCameraToMeshes(meshes) {
  const box = computeBoundingBox(meshes);
  if (!box) {
    return;
  }

  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());
  const maxDim = Math.max(size.x, size.y, size.z);
  const distance = (maxDim / 2) / Math.tan(THREE.MathUtils.degToRad(camera.fov * 0.5)) * 1.55;

  state.defaultTarget.copy(center);
  state.defaultCameraPosition.copy(center).add(new THREE.Vector3(distance * 0.52, size.y * 0.14, distance));

  camera.near = Math.max(0.01, maxDim / 100);
  camera.far = distance * 10;
  camera.position.copy(state.defaultCameraPosition);
  camera.updateProjectionMatrix();

  controls.minDistance = Math.max(0.28, distance * 0.32);
  controls.maxDistance = distance * 3.3;
  controls.target.copy(state.defaultTarget);
  controls.update();
}

function normalizeModel(group, meshes, targetHeight) {
  group.updateMatrixWorld(true);
  const initialBox = computeBoundingBox(meshes);
  if (!initialBox) {
    return;
  }

  const initialSize = initialBox.getSize(new THREE.Vector3());
  const scale = targetHeight / Math.max(initialSize.y, 0.001);
  group.scale.setScalar(scale);
  group.updateMatrixWorld(true);

  const scaledBox = computeBoundingBox(meshes);
  if (!scaledBox) {
    return;
  }

  const center = scaledBox.getCenter(new THREE.Vector3());
  group.position.x -= center.x;
  group.position.z -= center.z;
  group.position.y -= scaledBox.min.y;
  group.updateMatrixWorld(true);

  fitCameraToMeshes(meshes);
}

function disposeObject(object) {
  object.traverse((child) => {
    if (!child.isMesh) {
      return;
    }
    child.geometry?.dispose?.();
    forEachMaterial(child, (material) => material.dispose?.());
  });
}

function disposeCurrentModel() {
  if (!state.currentModel) {
    return;
  }

  clearSelection({ resetInfo: false });
  disposeObject(state.currentModel);
  modelRoot.remove(state.currentModel);
  state.currentModel = null;
  state.interactiveMeshes = [];
  structureCount.textContent = "-";
}

function registerMeshes(group, system) {
  const visibleMeshes = [];
  const labels = new Set();

  group.traverse((child) => {
    if (!child.isMesh) {
      return;
    }

    const { cleanLabel } = parseObjectLabel(child.name);
    if (!cleanLabel || cleanLabel === "RootNode") {
      child.visible = false;
      return;
    }

    const includeMesh = shouldIncludeLabel(system, cleanLabel);
    child.visible = includeMesh;
    if (!includeMesh) {
      return;
    }

    child.userData.displayName = cleanLabel;
    child.userData.japaneseName = translateAnatomyLabel(cleanLabel);
    visibleMeshes.push(child);
    labels.add(child.userData.japaneseName);

    forEachMaterial(child, (material) => {
      if ("side" in material) {
        material.side = THREE.DoubleSide;
      }
      if ("transparent" in material) {
        material.transparent = material.opacity < 1;
      }
    });
  });

  state.interactiveMeshes = visibleMeshes;
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

function loadFbxAsset(asset, loadVersion, sourceIndex, totalSources) {
  return new Promise((resolve, reject) => {
    const loader = new FBXLoader();
    loader.load(
      asset.url,
      (object) => resolve(object),
      (event) => {
        if (state.loadVersion !== loadVersion) {
          return;
        }

        const loadedMb = (event.loaded / (1024 * 1024)).toFixed(1);
        if (event.total) {
          const totalMb = (event.total / (1024 * 1024)).toFixed(1);
          const progress = Math.round((event.loaded / event.total) * 100);
          setLoadingMessage(
            `${sourceIndex}/${totalSources} 読み込み中: ${asset.fileName} ${progress}% (${loadedMb}/${totalMb} MB)`
          );
          return;
        }

        setLoadingMessage(`${sourceIndex}/${totalSources} 読み込み中: ${asset.fileName} ${loadedMb} MB`);
      },
      (error) => reject(error)
    );
  });
}

async function loadSelectedSystem() {
  const system = getCurrentSystem();
  const loadVersion = state.loadVersion + 1;
  state.loadVersion = loadVersion;
  state.ready = false;

  updateSystemPresentation(system);
  renderEmptySelection(system.emptyMessage);
  disposeCurrentModel();
  setLoadingMessage(`${system.label}モデルを読み込み中...`);

  const compositeGroup = new THREE.Group();

  try {
    for (let index = 0; index < system.sources.length; index += 1) {
      const sourceId = system.sources[index];
      const asset = MODEL_ASSETS[sourceId];
      const object = await loadFbxAsset(asset, loadVersion, index + 1, system.sources.length);

      if (state.loadVersion !== loadVersion) {
        disposeObject(object);
        return;
      }

      object.traverse((child) => {
        child.userData.sourceId = sourceId;
      });
      compositeGroup.add(object);
    }

    registerMeshes(compositeGroup, system);
    normalizeModel(compositeGroup, state.interactiveMeshes, system.targetHeight);
    modelRoot.add(compositeGroup);
    state.currentModel = compositeGroup;
    state.ready = true;
    hideLoadingMessage();
    resetView();
  } catch (error) {
    disposeObject(compositeGroup);
    setLoadingMessage(`モデル読み込みエラー: ${error.message}`, true);
    renderEmptySelection(`${system.label}モデルの読み込みに失敗しました。`);
  }
}

populateSystemOptions();
systemSelect.value = state.currentSystemId;
updateSystemPresentation(getCurrentSystem());
setOriginalNameVisibility(false);

systemSelect.addEventListener("change", () => {
  state.currentSystemId = systemSelect.value;
  loadSelectedSystem();
});

toggleEn.addEventListener("click", () => setOriginalNameVisibility(!state.showOriginalName));
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
