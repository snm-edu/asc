const VISUAL_BRAIN_KEYWORDS = [
  "accessory visual",
  "visual",
  "optic",
  "eyeball",
  "orbital",
  "ophthalmic",
  "oculomotor",
  "oculi",
  "brain",
  "cerebr",
  "forebrain",
  "midbrain",
  "brainstem",
  "cranial nerve",
  "olfactory",
  "trigeminal",
  "trochlear",
  "abducens",
  "facial nerve",
  "vestibular",
  "cochlear",
  "hypoglossal",
  "glossopharyngeal",
  "vagus nerve",
  "ophthalmic nerve",
  "maxillary nerve",
  "mandibular nerve",
  "optic tract",
  "optic chiasm",
  "orbital gyri",
  "orbital sulci",
  "extra-ocular",
  "palpebral part of orbicularis oculi",
  "orbital part of orbicularis oculi",
];

const DENTAL_ORAL_KEYWORDS = [
  "mandible",
  "maxilla",
  "palatine",
  "tooth",
  "teeth",
  "incisor",
  "canine",
  "premolar",
  "molar",
  "dental arch",
  "alveolar",
  "lingual surface of tooth",
  "vestibular surface of tooth",
  "occlusal surface of tooth",
  "crown of tooth",
  "root of tooth",
  "neck of tooth",
  "cusp of tooth",
  "masseter",
  "temporalis",
  "pterygoid",
  "tongue",
  "orbicularis oris",
  "mylohyoid",
  "buccal",
  "lingual nerve",
  "mental nerve",
  "inferior alveolar nerve",
  "zygomatic",
  "nasal",
  "viscerocranium",
];

function includesAnyKeyword(label, keywords) {
  const lowerLabel = label.toLowerCase();
  return keywords.some((keyword) => lowerLabel.includes(keyword));
}

export const MODEL_ASSETS = {
  visceral: {
    id: "visceral",
    fileName: "VisceralSystem100.fbx",
    url: "./assets/z-anatomy/VisceralSystem100.fbx",
  },
  cardiovascular: {
    id: "cardiovascular",
    fileName: "CardioVascular41.fbx",
    url: "./assets/z-anatomy/CardioVascular41.fbx",
  },
  nervous: {
    id: "nervous",
    fileName: "NervousSystem100.fbx",
    url: "./assets/z-anatomy/NervousSystem100.fbx",
  },
  skeletal: {
    id: "skeletal",
    fileName: "SkeletalSystem100.fbx",
    url: "./assets/z-anatomy/SkeletalSystem100.fbx",
  },
  muscular: {
    id: "muscular",
    fileName: "MuscularSystem100.fbx",
    url: "./assets/z-anatomy/MuscularSystem100.fbx",
  },
};

export const SYSTEMS = [
  {
    id: "visceral",
    label: "内臓系",
    statusLabel: "Z-Anatomy / 内臓系",
    sources: ["visceral"],
    targetHeight: 2.35,
    emptyMessage: "内臓系の構造をタップすると、日本語名を表示します。",
  },
  {
    id: "cardiovascular",
    label: "循環器系",
    statusLabel: "Z-Anatomy / 循環器系",
    sources: ["cardiovascular"],
    targetHeight: 2.45,
    emptyMessage: "循環器系の構造をタップすると、日本語名を表示します。",
  },
  {
    id: "nervous",
    label: "脳神経系",
    statusLabel: "Z-Anatomy / 脳神経系",
    sources: ["nervous"],
    targetHeight: 2.4,
    emptyMessage: "脳神経系の構造をタップすると、日本語名を表示します。",
  },
  {
    id: "osteomuscular",
    label: "骨筋肉系",
    statusLabel: "Z-Anatomy / 骨筋肉系",
    sources: ["skeletal", "muscular"],
    targetHeight: 2.45,
    emptyMessage: "骨格や筋の構造をタップすると、日本語名を表示します。",
  },
  {
    id: "visual-brain",
    label: "視脳系",
    statusLabel: "Z-Anatomy / 視脳系",
    sources: ["nervous", "muscular"],
    targetHeight: 1.34,
    emptyMessage: "眼球・視神経・脳神経系の構造をタップすると、日本語名を表示します。",
    includeLabel: (label) => includesAnyKeyword(label, VISUAL_BRAIN_KEYWORDS),
  },
  {
    id: "dental-oral",
    label: "歯科口腔系",
    statusLabel: "Z-Anatomy / 歯科口腔系",
    sources: ["skeletal", "muscular"],
    targetHeight: 1.38,
    emptyMessage: "歯科口腔系の構造をタップすると、日本語名を表示します。",
    includeLabel: (label) => includesAnyKeyword(label, DENTAL_ORAL_KEYWORDS),
  },
];

export function getSystemById(systemId) {
  return SYSTEMS.find((system) => system.id === systemId) ?? SYSTEMS[0];
}

export function getSourceLabel(system) {
  return system.sources.map((sourceId) => MODEL_ASSETS[sourceId].fileName).join(" + ");
}

export function shouldIncludeLabel(system, label) {
  return system.includeLabel ? system.includeLabel(label) : true;
}
