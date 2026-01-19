"use client";
import { DifficultyId, difficultyModes } from "@/app/_constants/constants";

export function isDifficultyMode(mode: number): mode is DifficultyId {
  return difficultyModes.some((dm) => dm.id === mode);
}
