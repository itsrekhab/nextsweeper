import { DifficultyId, difficultyModes } from "@/constants";

export function isDifficultyMode(mode: number): mode is DifficultyId {
  return difficultyModes.some((dm) => dm.id === mode);
}
