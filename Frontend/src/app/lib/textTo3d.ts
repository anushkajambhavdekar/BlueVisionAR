import type { ViewerAsset } from "../App";

export type TextTo3dCatalogObject = {
  id: string;
  label: string;
  modelUrl: string;
  aliases: string[];
  description: string;
};

export const TEXT_TO_3D_PRESETS: TextTo3dCatalogObject[] = [
  {
    id: "chair",
    label: "Wooden Chair",
    modelUrl: "https://modelviewer.dev/assets/ShopifyModels/Chair.glb",
    aliases: ["chair", "wooden chair", "office chair", "dining chair"],
    description: "A wooden chair for seating in a room, office, dining area, classroom, or furniture scene.",
  },
  {
    id: "astronaut",
    label: "Astronaut",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Astronaut.glb",
    aliases: ["astronaut", "space suit", "spacesuit", "space man", "space explorer"],
    description: "A human space explorer wearing a white astronaut suit, helmet, boots, and life support pack.",
  },
  {
    id: "robot",
    label: "Robot",
    modelUrl: "https://modelviewer.dev/shared-assets/models/RobotExpressive.glb",
    aliases: ["robot", "android", "humanoid robot", "bot"],
    description: "A friendly humanoid robot or android with mechanical body parts for technology scenes.",
  },
  {
    id: "horse",
    label: "Horse",
    modelUrl: "https://modelviewer.dev/shared-assets/models/Horse.glb",
    aliases: ["horse", "stallion", "pony"],
    description: "A four legged horse animal, useful for farm, riding, stable, race, or outdoor scenes.",
  },
  {
    id: "helmet",
    label: "Helmet",
    modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF-Binary/DamagedHelmet.glb",
    aliases: ["helmet", "damaged helmet", "biker helmet", "motorcycle helmet", "helmate", "helment"],
    description: "A protective sci fi or motorcycle style helmet with worn metal details.",
  },
  {
    id: "train",
    label: "Toy Train",
    modelUrl: "https://modelviewer.dev/assets/ShopifyModels/ToyTrain.glb",
    aliases: ["toy train", "train", "locomotive"],
    description: "A toy train or small locomotive for railway, kids toy, transport, or playroom scenes.",
  },
  {
    id: "planter",
    label: "Planter",
    modelUrl: "https://modelviewer.dev/assets/ShopifyModels/GeoPlanter.glb",
    aliases: ["planter", "plant pot", "flower pot", "pot"],
    description: "A geometric planter or plant pot for flowers, indoor plants, garden, balcony, or home decor.",
  },
  {
    id: "boombox",
    label: "Boombox",
    modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/BoomBox/glTF-Binary/BoomBox.glb",
    aliases: ["boombox", "speaker", "music player", "radio", "stereo"],
    description: "A portable music speaker or stereo radio with handles and audio controls.",
  },
  {
    id: "avocado",
    label: "Avocado",
    modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Avocado/glTF-Binary/Avocado.glb",
    aliases: ["avocado", "fruit", "food", "green fruit"],
    description: "A sliced avocado fruit with green flesh and seed, useful for food or kitchen scenes.",
  },
  {
    id: "lantern",
    label: "Lantern",
    modelUrl: "https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/Lantern/glTF-Binary/Lantern.glb",
    aliases: ["lantern", "lamp", "light", "hanging lamp"],
    description: "A decorative lantern or lamp that represents lighting for rooms, camping, or night scenes.",
  },
];

function normalizePrompt(prompt: string): string {
  return String(prompt || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "for",
  "in",
  "into",
  "is",
  "make",
  "model",
  "of",
  "please",
  "show",
  "the",
  "to",
  "with",
]);

function getTokens(text: string): string[] {
  return normalizePrompt(text)
    .split(" ")
    .filter((token) => token.length > 2 && !STOP_WORDS.has(token));
}

function scorePreset(prompt: string, preset: TextTo3dCatalogObject): number {
  const normalizedPrompt = normalizePrompt(prompt);
  const promptTokens = new Set(getTokens(prompt));
  let score = 0;

  if (!normalizedPrompt || promptTokens.size === 0) return 0;

  if (normalizedPrompt.includes(normalizePrompt(preset.label))) {
    score += 100;
  }

  for (const alias of preset.aliases) {
    const normalizedAlias = normalizePrompt(alias);
    if (normalizedPrompt.includes(normalizedAlias)) {
      score += 120;
    }

    for (const token of getTokens(alias)) {
      if (promptTokens.has(token)) score += 18;
    }
  }

  for (const token of getTokens(preset.description)) {
    if (promptTokens.has(token)) score += 6;
  }

  return score;
}

export function getPresetAssetFromPrompt(
  prompt: string,
  catalog: TextTo3dCatalogObject[] = TEXT_TO_3D_PRESETS
): ViewerAsset | null {
  const bestMatch = catalog
    .map((preset) => ({ preset, score: scorePreset(prompt, preset) }))
    .sort((a, b) => b.score - a.score)[0];

  if (!bestMatch || bestMatch.score < 18) return null;

  return { kind: "model", url: bestMatch.preset.modelUrl };
}
