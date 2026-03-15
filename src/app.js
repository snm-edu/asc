import * as THREE from "https://esm.sh/three@0.165.0";
import { OrbitControls } from "https://esm.sh/three@0.165.0/examples/jsm/controls/OrbitControls.js";

const viewport = document.getElementById("viewport");
const partName = document.getElementById("partName");
const partNameEn = document.getElementById("partNameEn");
const partDescription = document.getElementById("partDescription");
const domainFilter = document.getElementById("domainFilter");
const layerFilter = document.getElementById("layerFilter");
const toggleEn = document.getElementById("toggleEn");
const quizButton = document.getElementById("quizButton");
const quizArea = document.getElementById("quizArea");
const quizPrompt = document.getElementById("quizPrompt");
const quizOptions = document.getElementById("quizOptions");
const learningTime = document.getElementById("learningTime");
const quizScore = document.getElementById("quizScore");
const loadingNotice = document.getElementById("loadingNotice");
const resetViewButton = document.getElementById("resetView");
let appReady = false;

window.addEventListener("error", (event) => {
  if (appReady) {
    return;
  }

  const message = event.error?.message || event.message || "不明なエラー";
  setLoadingMessage(`初期化エラー: ${message}`, true);
});

window.addEventListener("unhandledrejection", (event) => {
  if (appReady) {
    return;
  }

  const reason =
    event.reason instanceof Error ? event.reason.message : String(event.reason ?? "不明なエラー");
  setLoadingMessage(`初期化エラー: ${reason}`, true);
});

const scene = new THREE.Scene();
scene.background = new THREE.Color("#dbe9ff");
scene.fog = new THREE.Fog("#dbe9ff", 4.8, 8.4);

const defaultCameraPosition = new THREE.Vector3(1.85, 1.45, 2.3);
const defaultTarget = new THREE.Vector3(0, 1.05, 0);

const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
camera.position.copy(defaultCameraPosition);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.domElement.className = "viewer-canvas";
renderer.domElement.style.touchAction = "none";
if ("outputColorSpace" in renderer) {
  renderer.outputColorSpace = THREE.SRGBColorSpace;
}
viewport.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = true;
controls.minDistance = 1.15;
controls.maxDistance = 4.8;
controls.minPolarAngle = 0.2;
controls.maxPolarAngle = Math.PI - 0.18;
controls.rotateSpeed = 0.85;
controls.zoomSpeed = 1.05;
controls.panSpeed = 0.9;
controls.target.copy(defaultTarget);
controls.touches.ONE = THREE.TOUCH.ROTATE;
controls.touches.TWO = THREE.TOUCH.DOLLY_PAN;

const hemiLight = new THREE.HemisphereLight(0xf7fbff, 0x5d6f8f, 1.45);
scene.add(hemiLight);

const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
keyLight.position.set(3, 5, 4);
scene.add(keyLight);

const fillLight = new THREE.DirectionalLight(0x9ebcff, 0.45);
fillLight.position.set(-4, 2, -2);
scene.add(fillLight);

const bodyRoot = new THREE.Group();
scene.add(bodyRoot);

const referenceBody = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.34, 1.2, 10, 18),
  new THREE.MeshStandardMaterial({
    color: "#a8bde0",
    transparent: true,
    opacity: 0.28,
    roughness: 0.55,
    metalness: 0.05,
  })
);
referenceBody.position.y = 0.95;
bodyRoot.add(referenceBody);

const groundShadow = new THREE.Mesh(
  new THREE.CircleGeometry(1.2, 48),
  new THREE.MeshBasicMaterial({ color: "#bed2f5", transparent: true, opacity: 0.32 })
);
groundShadow.rotation.x = -Math.PI / 2;
groundShadow.position.set(0, -0.02, 0);
bodyRoot.add(groundShadow);

const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const labelWorldPosition = new THREE.Vector3();

const state = {
  anatomyParts: [],
  selectedMesh: null,
  showEnglish: false,
  learningStartedAt: Date.now(),
  lastLearningMinute: -1,
  quiz: { active: false, total: 0, correct: 0, answerId: null },
  activePointers: new Map(),
  tapCandidate: null,
};

const floatingLabel = document.createElement("div");
floatingLabel.className = "floating-label hidden";
viewport.appendChild(floatingLabel);

function shuffle(items) {
  const array = [...items];
  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
  }
  return array;
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

function createGeometry(shape) {
  if (shape === "sphere") {
    return new THREE.SphereGeometry(0.5, 32, 24);
  }
  if (shape === "box") {
    return new THREE.BoxGeometry(1, 1, 1);
  }
  return new THREE.CapsuleGeometry(0.5, 0.8, 8, 16);
}

async function loadParts() {
  const response = await fetch("./data/anatomy_parts.json");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}

function buildMeshes(parts) {
  state.anatomyParts.length = 0;

  for (const part of parts) {
    const geometry = createGeometry(part.shape);
    geometry.scale(...part.scale);

    const material = new THREE.MeshStandardMaterial({
      color: part.color,
      roughness: 0.45,
      metalness: 0.08,
      emissive: "#000000",
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(...part.position);
    mesh.userData.part = part;
    bodyRoot.add(mesh);
    state.anatomyParts.push(mesh);
  }
}

function renderEmptySelection(message = "3Dビューの部位をタップすると、名称と説明が表示されます。") {
  partName.textContent = "未選択";
  partNameEn.textContent = "";
  partDescription.textContent = message;
}

function renderPartInfo(part) {
  partName.textContent = part.nameJa;
  partNameEn.textContent = state.showEnglish ? part.nameEn : "";
  partDescription.textContent = part.description;
}

function clearSelection({ resetInfo = false } = {}) {
  if (state.selectedMesh) {
    state.selectedMesh.material.emissive.set("#000000");
  }
  state.selectedMesh = null;
  floatingLabel.classList.add("hidden");

  if (resetInfo) {
    renderEmptySelection();
  }
}

function updateFloatingLabel() {
  if (!state.selectedMesh || !state.selectedMesh.visible) {
    floatingLabel.classList.add("hidden");
    return;
  }

  const part = state.selectedMesh.userData.part;
  floatingLabel.textContent = state.showEnglish ? `${part.nameJa} / ${part.nameEn}` : part.nameJa;

  state.selectedMesh.getWorldPosition(labelWorldPosition);
  labelWorldPosition.y += 0.18;
  labelWorldPosition.project(camera);

  if (labelWorldPosition.z > 1) {
    floatingLabel.classList.add("hidden");
    return;
  }

  const x = (labelWorldPosition.x * 0.5 + 0.5) * viewport.clientWidth;
  const y = (labelWorldPosition.y * -0.5 + 0.5) * viewport.clientHeight - 14;

  floatingLabel.style.left = `${x}px`;
  floatingLabel.style.top = `${y}px`;
  floatingLabel.classList.remove("hidden");
}

function selectMesh(mesh) {
  clearSelection();
  state.selectedMesh = mesh;
  state.selectedMesh.material.emissive.set("#2354ff");
  renderPartInfo(mesh.userData.part);
  updateFloatingLabel();
}

function applyFilters() {
  const domain = domainFilter.value;
  const layer = layerFilter.value;

  state.anatomyParts.forEach((mesh) => {
    const part = mesh.userData.part;
    const domainMatch = domain === "all" || part.domains.includes(domain);
    const layerMatch = layer === "all" || part.layer === layer;
    mesh.visible = domainMatch && layerMatch;
  });

  if (state.selectedMesh && !state.selectedMesh.visible) {
    clearSelection({ resetInfo: true });
  }

  if (state.quiz.active) {
    state.quiz.active = false;
    quizPrompt.textContent = "表示条件が変わったため、クイズをリセットしました。";
  }
}

function resetView() {
  camera.position.copy(defaultCameraPosition);
  controls.target.copy(defaultTarget);
  controls.update();
  updateFloatingLabel();
}

function pickVisibleMesh(event) {
  const rect = renderer.domElement.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  return raycaster.intersectObjects(state.anatomyParts.filter((mesh) => mesh.visible))[0] ?? null;
}

function onSceneTap(event) {
  const hit = pickVisibleMesh(event);

  if (!hit) {
    clearSelection({ resetInfo: true });
    return;
  }

  selectMesh(hit.object);

  if (state.quiz.active) {
    handleQuizAnswer(hit.object.userData.part.id);
  }
}

function updateLearningTime() {
  const minutes = Math.floor((Date.now() - state.learningStartedAt) / 60000);
  if (minutes === state.lastLearningMinute) {
    return;
  }
  state.lastLearningMinute = minutes;
  learningTime.textContent = `${minutes}分`;
}

function updateQuizScore() {
  if (state.quiz.total === 0) {
    quizScore.textContent = "-";
    return;
  }

  const ratio = Math.round((state.quiz.correct / state.quiz.total) * 100);
  quizScore.textContent = `${ratio}% (${state.quiz.correct}/${state.quiz.total})`;
}

function startQuiz() {
  const visibleParts = state.anatomyParts
    .filter((mesh) => mesh.visible)
    .map((mesh) => mesh.userData.part);

  if (visibleParts.length < 2) {
    quizPrompt.textContent = "クイズ出題には、表示中の部位が2つ以上必要です。";
    quizOptions.innerHTML = "";
    quizArea.classList.remove("hidden");
    return;
  }

  const answer = visibleParts[Math.floor(Math.random() * visibleParts.length)];
  const distractors = shuffle(visibleParts.filter((part) => part.id !== answer.id)).slice(0, 3);
  const options = shuffle([answer, ...distractors]);

  state.quiz.active = true;
  state.quiz.answerId = answer.id;
  state.quiz.total += 1;

  quizPrompt.textContent = `「${answer.nameJa}」はどこですか。3Dモデルをタップするか、下の候補から選択してください。`;
  quizOptions.innerHTML = "";

  options.forEach((part) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "quiz-option";
    button.textContent = part.nameJa;
    button.addEventListener("click", () => handleQuizAnswer(part.id));
    quizOptions.appendChild(button);
  });

  quizArea.classList.remove("hidden");
  updateQuizScore();
}

function handleQuizAnswer(selectedId) {
  if (!state.quiz.active) {
    return;
  }

  if (selectedId === state.quiz.answerId) {
    state.quiz.correct += 1;
    quizPrompt.textContent = "正解です。続けて次の問題を開始できます。";
  } else {
    const answerPart = state.anatomyParts
      .map((mesh) => mesh.userData.part)
      .find((part) => part.id === state.quiz.answerId);
    const answerLabel = answerPart ? answerPart.nameJa : "正解の部位";
    quizPrompt.textContent = `不正解です。正解は「${answerLabel}」でした。`;
  }

  state.quiz.active = false;
  updateQuizScore();
}

function setEnglishLabels(enabled) {
  state.showEnglish = enabled;
  toggleEn.textContent = enabled ? "英語名 ON" : "英語名 OFF";

  if (state.selectedMesh) {
    renderPartInfo(state.selectedMesh.userData.part);
    updateFloatingLabel();
  }
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
  state.activePointers.set(event.pointerId, {
    x: event.clientX,
    y: event.clientY,
  });

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
    state.activePointers.set(event.pointerId, {
      x: event.clientX,
      y: event.clientY,
    });
  }

  if (!state.tapCandidate || state.tapCandidate.pointerId !== event.pointerId) {
    return;
  }

  const distance = Math.hypot(event.clientX - state.tapCandidate.x, event.clientY - state.tapCandidate.y);
  if (distance > 10) {
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

domainFilter.addEventListener("change", applyFilters);
layerFilter.addEventListener("change", applyFilters);
toggleEn.addEventListener("click", () => setEnglishLabels(!state.showEnglish));
quizButton.addEventListener("click", startQuiz);
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

renderEmptySelection();
setEnglishLabels(false);
updateLearningTime();
updateQuizScore();

loadParts()
  .then((parts) => {
    buildMeshes(parts);
    applyFilters();
    resize();
    appReady = true;
    hideLoadingMessage();
  })
  .catch((error) => {
    renderEmptySelection("部位データの読み込みに失敗しました。");
    setLoadingMessage(`データ読み込みエラー: ${error.message}`, true);
  });

function animate() {
  requestAnimationFrame(animate);
  controls.update();
  updateLearningTime();
  updateFloatingLabel();
  renderer.render(scene, camera);
}

animate();
