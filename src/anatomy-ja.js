const SIDE_MAP = new Map([
  ["r", "右"],
  ["l", "左"],
]);

const DECORATION_SEGMENTS = new Set(["e", "el", "eo", "er", "g", "i", "j", "o", "ol", "or", "s", "t"]);

const EXACT_TRANSLATIONS = new Map(
  [
    ["Accessory visual structures", "副視覚器"],
    ["Extra-ocular muscles", "外眼筋"],
    ["Muscles of tongue", "舌筋群"],
    ["Neurocranium", "神経頭蓋"],
    ["Viscerocranium", "顔面頭蓋"],
    ["Bones of cranium", "頭蓋骨"],
    ["Cranium", "頭蓋"],
    ["Eye", "眼"],
    ["Ear", "耳"],
    ["Sense organs", "感覚器"],
    ["Middle ear", "中耳"],
    ["External ear", "外耳"],
    ["Internal ear", "内耳"],
    ["Nasal cartilages", "鼻軟骨"],
    ["Teeth", "歯列"],
    ["Eyeball", "眼球"],
    ["Brain", "脳"],
    ["Cerebrum", "大脳"],
    ["Cerebral hemisphere", "大脳半球"],
    ["Brainstem", "脳幹"],
    ["Basal forebrain", "前脳基底部"],
    ["Midbrain", "中脳"],
    ["Insula", "島葉"],
    ["Cerebellum", "小脳"],
    ["Optic tract", "視索"],
    ["Optic chiasm", "視交叉"],
    ["Central nervous system", "中枢神経系"],
    ["Peripheral nervous system", "末梢神経系"],
    ["Oculomotor complex", "動眼神経核複合体"],
    ["Cranial nerves", "脳神経"],
    ["Roots of nerves", "神経根"],
    ["Systemic veins", "体循環静脈"],
    ["Cranial veins", "頭蓋静脈"],
    ["Orbital veins", "眼窩静脈"],
    ["Pulmonary arteries", "肺動脈"],
    ["Pulmonary veins", "肺静脈"],
    ["Arteries of heart", "心臓の動脈"],
    ["Cardiac veins", "心静脈"],
    ["Valvular complex of heart", "心臓弁複合体"],
    ["Root of aorta", "大動脈基部"],
    ["Root of pulmonary trunk", "肺動脈幹基部"],
    ["Union of brachiocephalic veins", "腕頭静脈の合流部"],
    ["Hepatic portal vein", "肝門脈"],
    ["Branches of hepatic portal vein", "肝門脈枝"],
    ["Tributaries of hepatic portal vein", "肝門脈流入枝"],
    ["Bifurcation of pulmonary trunk", "肺動脈幹分岐部"],
    ["Pulmonary trunk", "肺動脈幹"],
    ["Coronary sinus", "冠状静脈洞"],
    ["Great cardiac vein", "大心静脈"],
    ["Middle cardiac vein", "中心静脈"],
    ["Inferior vein of left ventricle", "左心室下静脈"],
    ["Left coronary artery", "左冠状動脈"],
    ["Right coronary artery", "右冠状動脈"],
    ["Circumflex artery of heart", "心臓回旋枝"],
    ["Anterior interventricular artery", "前室間枝"],
    ["Thoracic aorta", "胸大動脈"],
    ["Abdominal aorta", "腹大動脈"],
    ["Superior mesenteric artery", "上腸間膜動脈"],
    ["Inferior mesenteric artery", "下腸間膜動脈"],
    ["Splenic artery", "脾動脈"],
    ["Left gastric artery", "左胃動脈"],
    ["Common hepatic artery", "総肝動脈"],
    ["Proper hepatic artery", "固有肝動脈"],
    ["Gastroduodenal artery", "胃十二指腸動脈"],
    ["Right renal artery", "右腎動脈"],
    ["Left renal artery", "左腎動脈"],
    ["Common carotid artery", "総頸動脈"],
    ["Internal carotid artery", "内頸動脈"],
    ["External carotid artery", "外頸動脈"],
    ["Subclavian artery", "鎖骨下動脈"],
    ["Superior gluteal artery", "上殿動脈"],
    ["Systemic arteries", "体循環動脈"],
    ["Aortic bifurcation", "大動脈分岐部"],
    ["Cerebral arterial circle", "大脳動脈輪"],
    ["Aortic valve", "大動脈弁"],
    ["Interatrial septum", "心房中隔"],
    ["Apex of heart", "心尖"],
    ["Anterior jugular vein", "前頸静脈"],
    ["Inferior epigastric artery", "下腹壁動脈"],
    ["Ascending pharyngeal artery", "上行咽頭動脈"],
    ["Superior labial artery", "上唇動脈"],
    ["Occipital artery", "後頭動脈"],
    ["Central retinal artery", "網膜中心動脈"],
    ["Arterial system", "動脈系"],
    ["Venous system", "静脈系"],
    ["Olfactory nerve (I)", "嗅神経 (I)"],
    ["Optic nerve (II)", "視神経 (II)"],
    ["Oculomotor nerve (III)", "動眼神経 (III)"],
    ["Trochlear nerve (IV)", "滑車神経 (IV)"],
    ["Trigeminal nerve (V)", "三叉神経 (V)"],
    ["Abducens nerve (VI)", "外転神経 (VI)"],
    ["Facial nerve (VII)", "顔面神経 (VII)"],
    ["Vestibulocochlear nerve (VIII)", "前庭蝸牛神経 (VIII)"],
    ["Glossopharyngeal nerve (IX)", "舌咽神経 (IX)"],
    ["Vagus nerve (X)", "迷走神経 (X)"],
    ["Accessory nerve (XI)", "副神経 (XI)"],
    ["Hypoglossal nerve (XII)", "舌下神経 (XII)"],
    ["Mandibular nerve", "下顎神経"],
    ["Maxillary nerve", "上顎神経"],
    ["Ophthalmic nerve", "眼神経"],
    ["Inferior alveolar nerve", "下歯槽神経"],
    ["Mental nerve", "オトガイ神経"],
    ["Lingual nerve", "舌神経"],
    ["Buccal nerve", "頬神経"],
    ["Nerve to mylohyoid muscle", "顎舌骨筋神経"],
    ["Vestibular nerve", "前庭神経"],
    ["Cochlear nerve", "蝸牛神経"],
    ["Olfactory nerve", "嗅神経"],
    ["Optic nerve", "視神経"],
    ["Accessory nucleus of oculomotor nerve", "副動眼神経核"],
    ["Nucleus of oculomotor nerve", "動眼神経核"],
    ["Nucleus of abducens nerve", "外転神経核"],
    ["Motor nucleus of facial nerve", "顔面神経運動核"],
    ["Nucleus of accessory nerve", "副神経核"],
    ["Orbital part of orbicularis oculi", "眼輪筋眼窩部"],
    ["Palpebral part of orbicularis oculi", "眼輪筋眼瞼部"],
    ["Orbicularis oris muscle", "口輪筋"],
    ["Superficial part of masseter", "咬筋浅部"],
    ["Deep part of masseter", "咬筋深部"],
    ["Temporalis muscle", "側頭筋"],
    ["Medial pterygoid muscle", "内側翼突筋"],
    ["Superior head of lateral pterygoid muscle", "外側翼突筋上頭"],
    ["Inferior head of lateral pterygoid muscle", "外側翼突筋下頭"],
    ["Masseteric fascia", "咬筋筋膜"],
    ["Mandible", "下顎骨"],
    ["Maxilla", "上顎骨"],
    ["Palatine bone", "口蓋骨"],
    ["Zygomatic bone", "頬骨"],
    ["Nasal bone", "鼻骨"],
    ["Inferior nasal concha bone", "下鼻甲介骨"],
    ["Nasal septal cartilage", "鼻中隔軟骨"],
    ["Maxillary dental arch", "上顎歯列弓"],
    ["Base of mandible", "下顎骨底"],
    ["Body of mandible", "下顎骨体"],
    ["Crown of tooth", "歯冠"],
    ["Cusp of tooth", "歯尖"],
    ["Root of tooth", "歯根"],
    ["Neck of tooth", "歯頸"],
    ["Occlusal surface of tooth", "咬合面"],
    ["Lingual surface of tooth", "舌側面"],
    ["Vestibular surface of tooth", "頬側面"],
    ["Mesial surface of tooth", "近心面"],
    ["Distal surface of tooth", "遠心面"],
    ["Upper medial incisor", "上顎中切歯"],
    ["Upper lateral incisor", "上顎側切歯"],
    ["Upper canine", "上顎犬歯"],
    ["Upper first premolar", "上顎第一小臼歯"],
    ["Upper second premolar", "上顎第二小臼歯"],
    ["Upper first molar tooth", "上顎第一大臼歯"],
    ["Upper second molar tooth", "上顎第二大臼歯"],
    ["Lower medial incisor", "下顎中切歯"],
    ["Lower lateral incisor", "下顎側切歯"],
    ["Lower canine", "下顎犬歯"],
    ["Lower first premolar", "下顎第一小臼歯"],
    ["Lower second premolar", "下顎第二小臼歯"],
    ["Lower first molar tooth", "下顎第一大臼歯"],
    ["Lower second molar tooth", "下顎第二大臼歯"],
    ["Liver", "肝臓"],
    ["Angular incisure", "胃角切痕"],
    ["Stomach", "胃"],
    ["Cardia", "噴門"],
    ["Fornix of stomach", "胃穹窿"],
    ["Fundus of stomach", "胃底"],
    ["Pancreas", "膵臓"],
    ["Gallbladder", "胆嚢"],
    ["Infundibulum of gallbladder", "胆嚢漏斗"],
    ["Right lung", "右肺"],
    ["Left lung", "左肺"],
    ["Lung", "肺"],
    ["Lingula of left lung", "左肺舌区"],
    ["Kidney", "腎臓"],
    ["Right kidney", "右腎臓"],
    ["Left kidney", "左腎臓"],
    ["Hilum of kidney", "腎門"],
    ["Urinary bladder", "膀胱"],
    ["Bladder", "膀胱"],
    ["Apex of bladder", "膀胱尖"],
    ["Body of bladder", "膀胱体"],
    ["Fundus of bladder", "膀胱底"],
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
    ["Heart", "心臓"],
    ["Suprarenal gland", "副腎"],
    ["Thyroid gland", "甲状腺"],
    ["Isthmus of thyroid gland", "甲状腺峡"],
    ["Lobe of thyroid gland", "甲状腺葉"],
    ["Pyramidal lobe", "錐体葉"],
    ["Caudate lobe", "尾状葉"],
    ["Quadrate lobe", "方形葉"],
    ["Costal surface of lung", "肺肋面"],
    ["Diaphragmatic surface of lung", "肺横隔面"],
    ["Diaphragmatic surface of liver", "肝横隔面"],
    ["Hilum of lung", "肺門"],
    ["Apex of lung", "肺尖"],
    ["Porta hepatis", "肝門"],
    ["Parietal lobe", "頭頂葉"],
    ["Occipital lobe", "後頭葉"],
    ["Limbic lobe", "辺縁葉"],
    ["Corpus striatum", "線条体"],
    ["Cervical plexus", "頸神経叢"],
    ["Brachial plexus", "腕神経叢"],
    ["Lumbar plexus", "腰神経叢"],
    ["Sacral plexus", "仙骨神経叢"],
    ["Lumbosacral plexus", "腰仙骨神経叢"],
    ["Lacrimal apparatus", "涙器"],
    ["Pupil", "瞳孔"],
    ["Axial skeleton", "中軸骨格"],
    ["Pectoral girdle", "肩帯"],
    ["Foramen magnum", "大後頭孔"],
    ["Sternum", "胸骨"],
    ["Ribs", "肋骨"],
    ["Vertebrae", "椎骨"],
    ["Atlas", "環椎"],
    ["Axis", "軸椎"],
    ["Clavicle", "鎖骨"],
    ["Scapula", "肩甲骨"],
    ["Humerus", "上腕骨"],
    ["Radius", "橈骨"],
    ["Ulna", "尺骨"],
    ["Femur", "大腿骨"],
    ["Patella", "膝蓋骨"],
    ["Tibia", "脛骨"],
    ["Fibula", "腓骨"],
    ["Calcaneus", "踵骨"],
    ["Talus", "距骨"],
    ["Malleus", "槌骨"],
    ["Incus", "砧骨"],
    ["Stapes", "鐙骨"],
    ["Deltoid muscle", "三角筋"],
    ["Rotator cuff muscles", "回旋筋腱板"],
    ["Digastric muscle", "顎二腹筋"],
    ["Trapezius muscle", "僧帽筋"],
    ["Pectoralis major muscle", "大胸筋"],
    ["Pectoralis minor muscle", "小胸筋"],
    ["Erector spinae", "脊柱起立筋"],
    ["Fasciae", "筋膜群"],
  ].map(([english, japanese]) => [normalizeLookup(english), japanese])
);

const PHRASE_TRANSLATIONS = [
  ["sense organs", "感覚器"],
  ["middle ear", "中耳"],
  ["external ear", "外耳"],
  ["internal ear", "内耳"],
  ["suprarenal gland", "副腎"],
  ["thyroid gland", "甲状腺"],
  ["angular incisure", "胃角切痕"],
  ["aortic bifurcation", "大動脈分岐部"],
  ["cerebral arterial circle", "大脳動脈輪"],
  ["aortic valve", "大動脈弁"],
  ["interatrial septum", "心房中隔"],
  ["anterior jugular vein", "前頸静脈"],
  ["inferior epigastric artery", "下腹壁動脈"],
  ["ascending pharyngeal artery", "上行咽頭動脈"],
  ["superior labial artery", "上唇動脈"],
  ["occipital artery", "後頭動脈"],
  ["central retinal artery", "網膜中心動脈"],
  ["caudate lobe", "尾状葉"],
  ["quadrate lobe", "方形葉"],
  ["fornix of stomach", "胃穹窿"],
  ["fundus of stomach", "胃底"],
  ["hilum of kidney", "腎門"],
  ["hilum of lung", "肺門"],
  ["lingula of left lung", "左肺舌区"],
  ["isthmus of thyroid gland", "甲状腺峡"],
  ["parietal lobe", "頭頂葉"],
  ["occipital lobe", "後頭葉"],
  ["limbic lobe", "辺縁葉"],
  ["corpus striatum", "線条体"],
  ["cervical plexus", "頸神経叢"],
  ["brachial plexus", "腕神経叢"],
  ["lumbar plexus", "腰神経叢"],
  ["sacral plexus", "仙骨神経叢"],
  ["lumbosacral plexus", "腰仙骨神経叢"],
  ["lacrimal apparatus", "涙器"],
  ["axial skeleton", "中軸骨格"],
  ["pectoral girdle", "肩帯"],
  ["foramen magnum", "大後頭孔"],
  ["deltoid muscle", "三角筋"],
  ["rotator cuff muscles", "回旋筋腱板"],
  ["digastric muscle", "顎二腹筋"],
  ["trapezius muscle", "僧帽筋"],
  ["pectoralis major muscle", "大胸筋"],
  ["pectoralis minor muscle", "小胸筋"],
  ["erector spinae", "脊柱起立筋"],
  ["common carotid artery", "総頸動脈"],
  ["internal carotid artery", "内頸動脈"],
  ["external carotid artery", "外頸動脈"],
  ["subclavian artery", "鎖骨下動脈"],
  ["superior mesenteric artery", "上腸間膜動脈"],
  ["inferior mesenteric artery", "下腸間膜動脈"],
  ["common hepatic artery", "総肝動脈"],
  ["proper hepatic artery", "固有肝動脈"],
  ["left gastric artery", "左胃動脈"],
  ["splenic artery", "脾動脈"],
  ["gastroduodenal artery", "胃十二指腸動脈"],
  ["right renal artery", "右腎動脈"],
  ["left renal artery", "左腎動脈"],
  ["pulmonary trunk", "肺動脈幹"],
  ["coronary sinus", "冠状静脈洞"],
  ["great cardiac vein", "大心静脈"],
  ["middle cardiac vein", "中心静脈"],
  ["anterior interventricular artery", "前室間枝"],
  ["circumflex artery of heart", "心臓回旋枝"],
  ["root of aorta", "大動脈基部"],
  ["root of pulmonary trunk", "肺動脈幹基部"],
  ["hepatic portal vein", "肝門脈"],
  ["union of brachiocephalic veins", "腕頭静脈の合流部"],
  ["extra-ocular muscles", "外眼筋"],
  ["muscles of tongue", "舌筋群"],
  ["orbicularis oculi", "眼輪筋"],
  ["orbicularis oris", "口輪筋"],
  ["masseteric fascia", "咬筋筋膜"],
  ["superficial part", "浅部"],
  ["deep part", "深部"],
  ["lateral pterygoid", "外側翼突筋"],
  ["medial pterygoid", "内側翼突筋"],
  ["temporalis muscle", "側頭筋"],
  ["inferior alveolar nerve", "下歯槽神経"],
  ["mental nerve", "オトガイ神経"],
  ["lingual nerve", "舌神経"],
  ["buccal nerve", "頬神経"],
  ["ophthalmic nerve", "眼神経"],
  ["mandibular nerve", "下顎神経"],
  ["maxillary nerve", "上顎神経"],
  ["vestibulocochlear nerve", "前庭蝸牛神経"],
  ["glossopharyngeal nerve", "舌咽神経"],
  ["oculomotor nerve", "動眼神経"],
  ["trochlear nerve", "滑車神経"],
  ["abducens nerve", "外転神経"],
  ["facial nerve", "顔面神経"],
  ["vagus nerve", "迷走神経"],
  ["accessory nerve", "副神経"],
  ["hypoglossal nerve", "舌下神経"],
  ["olfactory nerve", "嗅神経"],
  ["optic nerve", "視神経"],
  ["cerebral hemisphere", "大脳半球"],
  ["basal forebrain", "前脳基底部"],
  ["brainstem", "脳幹"],
  ["orbital part", "眼窩部"],
  ["palpebral part", "眼瞼部"],
  ["maxillary dental arch", "上顎歯列弓"],
  ["frontal part of orbital margin", "眼窩縁前頭部"],
  ["body of mandible", "下顎骨体"],
  ["base of mandible", "下顎骨底"],
  ["crown of tooth", "歯冠"],
  ["root of tooth", "歯根"],
  ["neck of tooth", "歯頸"],
  ["cusp of tooth", "歯尖"],
  ["occlusal surface of tooth", "咬合面"],
  ["lingual surface of tooth", "舌側面"],
  ["vestibular surface of tooth", "頬側面"],
  ["mesial surface of tooth", "近心面"],
  ["distal surface of tooth", "遠心面"],
  ["h-shaped", "H字状"],
];

const TOKEN_TRANSLATIONS = new Map(
  [
    ["right", "右"],
    ["left", "左"],
    ["superior", "上"],
    ["inferior", "下"],
    ["anterior", "前"],
    ["posterior", "後"],
    ["middle", "中"],
    ["medial", "内側"],
    ["lateral", "外側"],
    ["apical", "尖"],
    ["apex", "尖"],
    ["basal", "底"],
    ["upper", "上"],
    ["lower", "下"],
    ["common", "総"],
    ["internal", "内"],
    ["external", "外"],
    ["proper", "固有"],
    ["inferolateral", "下外側"],
    ["anterosuperior", "前上"],
    ["anteroinferior", "前下"],
    ["apicoposterior", "尖後"],
    ["superficial", "浅"],
    ["deep", "深"],
    ["semilunar", "半月"],
    ["segmental", "区域"],
    ["segment", "区域"],
    ["segemental", "区域"],
    ["branch", "枝"],
    ["branches", "枝"],
    ["division", "枝"],
    ["root", "根"],
    ["roots", "根"],
    ["base", "基部"],
    ["surface", "面"],
    ["gland", "腺"],
    ["border", "縁"],
    ["body", "体"],
    ["head", "頭"],
    ["neck", "頸"],
    ["complex", "複合体"],
    ["union", "合流部"],
    ["bifurcation", "分岐部"],
    ["artery", "動脈"],
    ["arteries", "動脈"],
    ["vein", "静脈"],
    ["veins", "静脈"],
    ["nerve", "神経"],
    ["nerves", "神経"],
    ["muscle", "筋"],
    ["muscles", "筋"],
    ["fascia", "筋膜"],
    ["bone", "骨"],
    ["bones", "骨"],
    ["cartilage", "軟骨"],
    ["cartilages", "軟骨"],
    ["valve", "弁"],
    ["leaflet", "弁尖"],
    ["sulcus", "溝"],
    ["sulci", "溝"],
    ["gyrus", "回"],
    ["gyri", "回"],
    ["nucleus", "核"],
    ["septum", "中隔"],
    ["tract", "索"],
    ["axis", "軸"],
    ["pole", "極"],
    ["part", "部"],
    ["parts", "部"],
    ["margin", "縁"],
    ["process", "突起"],
    ["spine", "棘"],
    ["notch", "切痕"],
    ["canal", "管"],
    ["foramen", "孔"],
    ["plate", "板"],
    ["crest", "稜"],
    ["line", "線"],
    ["arch", "弓"],
    ["fissure", "裂"],
    ["lobe", "葉"],
    ["lobar", "葉"],
    ["leaflets", "弁尖"],
    ["fundus", "底"],
    ["fornix", "穹窿"],
    ["hilum", "門"],
    ["isthmus", "峡"],
    ["incisure", "切痕"],
    ["angular", "角"],
    ["caudate", "尾状"],
    ["quadrate", "方形"],
    ["costal", "肋"],
    ["diaphragmatic", "横隔膜"],
    ["lingula", "舌区"],
    ["systemic", "体循環"],
    ["aortic", "大動脈"],
    ["arterial", "動脈"],
    ["interatrial", "心房"],
    ["jugular", "頸"],
    ["epigastric", "腹壁"],
    ["ascending", "上行"],
    ["pharyngeal", "咽頭"],
    ["labial", "唇"],
    ["occipital", "後頭"],
    ["retinal", "網膜"],
    ["sense", "感覚"],
    ["organ", "器"],
    ["organs", "器"],
    ["ear", "耳"],
    ["parietal", "頭頂"],
    ["insula", "島葉"],
    ["limbic", "辺縁"],
    ["corpus", "体"],
    ["striatum", "線条体"],
    ["cerebellum", "小脳"],
    ["cervical", "頸"],
    ["brachial", "腕"],
    ["lumbar", "腰"],
    ["plexus", "神経叢"],
    ["lacrimal", "涙"],
    ["apparatus", "器"],
    ["pupil", "瞳孔"],
    ["axial", "中軸"],
    ["skeleton", "骨格"],
    ["pectoral", "肩"],
    ["girdle", "帯"],
    ["magnum", "大"],
    ["heart", "心臓"],
    ["cardiac", "心"],
    ["coronary", "冠状"],
    ["pulmonary", "肺"],
    ["lung", "肺"],
    ["lungs", "肺"],
    ["aorta", "大動脈"],
    ["renal", "腎"],
    ["kidney", "腎臓"],
    ["liver", "肝臓"],
    ["hepatic", "肝"],
    ["gastric", "胃"],
    ["stomach", "胃"],
    ["pancreas", "膵臓"],
    ["pancreaticoduodenal", "膵十二指腸"],
    ["portal", "門脈"],
    ["splenic", "脾"],
    ["mesenteric", "腸間膜"],
    ["suprarenal", "副腎"],
    ["phrenic", "横隔膜"],
    ["iliac", "腸骨"],
    ["gluteal", "殿"],
    ["brachiocephalic", "腕頭"],
    ["carotid", "頸"],
    ["subcostal", "肋下"],
    ["thoracic", "胸"],
    ["abdominal", "腹"],
    ["median", "正中"],
    ["sacral", "仙骨"],
    ["appendicular", "虫垂"],
    ["colic", "結腸"],
    ["ileal", "回腸"],
    ["dorsal", "背側"],
    ["anterior", "前"],
    ["posterior", "後"],
    ["superior", "上"],
    ["inferior", "下"],
    ["optic", "視"],
    ["visual", "視覚"],
    ["eyeball", "眼球"],
    ["lingular", "舌区"],
    ["orbital", "眼窩"],
    ["ophthalmic", "眼"],
    ["oculomotor", "動眼"],
    ["olfactory", "嗅"],
    ["trigeminal", "三叉"],
    ["trochlear", "滑車"],
    ["abducens", "外転"],
    ["facial", "顔面"],
    ["vestibular", "前庭"],
    ["cochlear", "蝸牛"],
    ["hypoglossal", "舌下"],
    ["glossopharyngeal", "舌咽"],
    ["mandibular", "下顎"],
    ["maxillary", "上顎"],
    ["lingual", "舌"],
    ["buccal", "頬"],
    ["mental", "オトガイ"],
    ["alveolar", "歯槽"],
    ["mylohyoid", "顎舌骨"],
    ["brain", "脳"],
    ["cerebrum", "大脳"],
    ["cerebral", "大脳"],
    ["forebrain", "前脳"],
    ["midbrain", "中脳"],
    ["tegmentum", "被蓋"],
    ["tectum", "蓋"],
    ["peduncle", "脚"],
    ["aqueduct", "水道"],
    ["grey", "灰"],
    ["gray", "灰"],
    ["matter", "質"],
    ["frontal", "前頭"],
    ["frontomarginal", "前頭辺縁"],
    ["temporal", "側頭"],
    ["sternum", "胸骨"],
    ["rib", "肋骨"],
    ["ribs", "肋骨"],
    ["vertebra", "椎骨"],
    ["vertebrae", "椎骨"],
    ["atlas", "環椎"],
    ["clavicle", "鎖骨"],
    ["scapula", "肩甲骨"],
    ["humerus", "上腕骨"],
    ["radius", "橈骨"],
    ["ulna", "尺骨"],
    ["femur", "大腿骨"],
    ["patella", "膝蓋骨"],
    ["tibia", "脛骨"],
    ["fibula", "腓骨"],
    ["calcaneus", "踵骨"],
    ["talus", "距骨"],
    ["malleus", "槌骨"],
    ["incus", "砧骨"],
    ["stapes", "鐙骨"],
    ["orbicularis", "輪筋"],
    ["oculi", "眼"],
    ["oris", "口"],
    ["masseter", "咬筋"],
    ["deltoid", "三角"],
    ["rotator", "回旋"],
    ["cuff", "腱板"],
    ["digastric", "顎二腹"],
    ["trapezius", "僧帽"],
    ["pectoralis", "胸筋"],
    ["major", "大"],
    ["minor", "小"],
    ["erector", "起立"],
    ["spinae", "脊柱"],
    ["fasciae", "筋膜群"],
    ["temporalis", "側頭筋"],
    ["pterygoid", "翼突筋"],
    ["tongue", "舌"],
    ["teeth", "歯"],
    ["tooth", "歯"],
    ["incisor", "切歯"],
    ["canine", "犬歯"],
    ["premolar", "小臼歯"],
    ["molar", "大臼歯"],
    ["palatine", "口蓋"],
    ["nasal", "鼻"],
    ["zygomatic", "頬骨"],
    ["cranium", "頭蓋"],
    ["neurocranium", "神経頭蓋"],
    ["viscerocranium", "顔面頭蓋"],
  ].map(([source, target]) => [source, target])
);

const PHRASE_REPLACEMENTS = PHRASE_TRANSLATIONS.sort((left, right) => right[0].length - left[0].length);

function normalizeLookup(label) {
  return label
    .replace(/\*/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

function stripLeadingTrailingSpace(label) {
  return label.replace(/\s+/g, " ").trim();
}

function humanizeRawLabel(label) {
  return stripLeadingTrailingSpace(
    String(label)
      .replace(/_/g, " ")
      .replace(/\*/g, "")
      .replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2")
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .replace(/([A-Za-z])(\d)/g, "$1 $2")
      .replace(/(\d)([A-Za-z])/g, "$1 $2")
  );
}

function isAsciiAlpha(text) {
  return /^[a-z0-9-]+$/i.test(text);
}

function translateSingleToken(token) {
  const lowerToken = token.toLowerCase();
  if (TOKEN_TRANSLATIONS.has(lowerToken)) {
    return TOKEN_TRANSLATIONS.get(lowerToken);
  }

  if (lowerToken.endsWith("s") && TOKEN_TRANSLATIONS.has(lowerToken.slice(0, -1))) {
    return TOKEN_TRANSLATIONS.get(lowerToken.slice(0, -1));
  }

  return token;
}

function replaceKnownPhrases(label) {
  let working = normalizeLookup(label);
  for (const [source, target] of PHRASE_REPLACEMENTS) {
    working = working.split(source).join(target);
  }
  return working;
}

function findConnectorIndex(label, connector) {
  let depth = 0;
  for (let index = 0; index <= label.length - connector.length; index += 1) {
    const character = label[index];
    if (character === "(") {
      depth += 1;
      continue;
    }
    if (character === ")") {
      depth = Math.max(0, depth - 1);
      continue;
    }
    if (depth === 0 && label.slice(index, index + connector.length).toLowerCase() === connector) {
      return index;
    }
  }
  return -1;
}

function translateCompositeLabel(label) {
  const cleanLabel = stripLeadingTrailingSpace(label);
  if (!cleanLabel) {
    return "";
  }

  const lookup = normalizeLookup(cleanLabel);
  if (EXACT_TRANSLATIONS.has(lookup)) {
    return EXACT_TRANSLATIONS.get(lookup);
  }

  const ofIndex = findConnectorIndex(cleanLabel, " of ");
  if (ofIndex >= 0) {
    const left = cleanLabel.slice(0, ofIndex);
    const right = cleanLabel.slice(ofIndex + 4);
    return `${translateCompositeLabel(right)}の${translateCompositeLabel(left)}`;
  }

  const andIndex = findConnectorIndex(cleanLabel, " and ");
  if (andIndex >= 0) {
    const left = cleanLabel.slice(0, andIndex);
    const right = cleanLabel.slice(andIndex + 5);
    return `${translateCompositeLabel(left)}・${translateCompositeLabel(right)}`;
  }

  const slashIndex = findConnectorIndex(cleanLabel, "/");
  if (slashIndex >= 0) {
    const left = cleanLabel.slice(0, slashIndex);
    const right = cleanLabel.slice(slashIndex + 1);
    return `${translateCompositeLabel(left)}/${translateCompositeLabel(right)}`;
  }

  const parentheticalMatch = cleanLabel.match(/^(.*)\((.*)\)$/);
  if (parentheticalMatch) {
    const mainPart = stripLeadingTrailingSpace(parentheticalMatch[1]);
    const innerPart = stripLeadingTrailingSpace(parentheticalMatch[2]);
    if (/^[ivxlcdm0-9+\- ]+$/i.test(innerPart)) {
      return `${translateCompositeLabel(mainPart)} (${innerPart.toUpperCase()})`;
    }
    return `${translateCompositeLabel(mainPart)} (${translateCompositeLabel(innerPart)})`;
  }

  const replaced = replaceKnownPhrases(cleanLabel);
  const translated = replaced
    .split(/(\s+|,|-)/)
    .filter(Boolean)
    .map((token) => {
      if (token.trim() === "") {
        return "";
      }
      if (token === ",") {
        return "、";
      }
      if (token === "-") {
        return "";
      }
      if (!isAsciiAlpha(token)) {
        return token;
      }
      return translateSingleToken(token);
    })
    .join("")
    .replace(/\s+/g, "")
    .replace(/、+/g, "、")
    .replace(/（/g, "(")
    .replace(/）/g, ")");

  return translated || cleanLabel;
}

export function parseObjectLabel(rawName = "") {
  const segments = String(rawName).split(".");
  let side = "";

  while (segments.length > 1) {
    const tail = segments.at(-1).toLowerCase();
    if (!side && SIDE_MAP.has(tail)) {
      side = SIDE_MAP.get(tail);
      segments.pop();
      continue;
    }
    if (/^\d+$/.test(tail) || DECORATION_SEGMENTS.has(tail)) {
      segments.pop();
      continue;
    }
    break;
  }

  const cleanLabel = stripLeadingTrailingSpace(
    humanizeRawLabel(segments.join("."))
  );
  return { cleanLabel, side };
}

export function translateAnatomyLabel(rawLabel = "") {
  const { cleanLabel, side } = parseObjectLabel(rawLabel);
  const translatedCore = translateCompositeLabel(cleanLabel);
  if (!side || translatedCore.startsWith(side)) {
    return translatedCore;
  }
  return `${side}${translatedCore}`;
}

export function buildStructureDescription(systemLabel, englishLabel, showOriginalName) {
  if (showOriginalName) {
    return `${systemLabel}モデルに含まれる構造です。原語: ${englishLabel}`;
  }
  return `${systemLabel}モデルに含まれる構造です。`;
}
