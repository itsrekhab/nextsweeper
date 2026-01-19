import * as v from "valibot";
import { DifficultyId, difficultyModes } from "../_constants/constants";
import { HighScoresSchema, Score } from "../game/types";

export function getHighScores(difficulty: DifficultyId): Score[] {
  const result = v.safeParse(
    HighScoresSchema,
    JSON.parse(localStorage?.getItem(`highScores_${difficulty}`) || "[]"),
  );
  if (!result.success) {
    console.error("Failed to parse high scores:", result.issues);
    return [];
  }

  return result.output;
}

export async function saveHighScore(score: Score, difficulty: DifficultyId) {
  const highScores = getHighScores(difficulty);

  highScores.push(score);
  highScores.sort((a, b) => a.score - b.score);
  highScores.splice(5);
  localStorage?.setItem(`highScores_${difficulty}`, JSON.stringify(highScores));
}

export function clearAllData() {
  for (const { id } of difficultyModes) {
    localStorage?.removeItem(`highScores_${id}`);
    localStorage?.removeItem(`gameCount_${id}`);
    localStorage?.removeItem(`winCount_${id}`);
  }
}

export function getGameCount(difficulty: DifficultyId) {
  const gameCount = localStorage?.getItem(`gameCount_${difficulty}`);
  return gameCount ? parseInt(gameCount) : 0;
}

export function getTotalGameCount() {
  return difficultyModes.reduce((acc, { id }) => acc + getGameCount(id), 0);
}

export function getWinCount(difficulty: DifficultyId) {
  const winCount = localStorage?.getItem(`winCount_${difficulty}`);
  return winCount ? parseInt(winCount) : 0;
}

export function getTotalWinCount() {
  return difficultyModes.reduce((acc, { id }) => (acc += getWinCount(id)), 0);
}

export function incrementGameCount(difficulty: DifficultyId) {
  const gameCount = getGameCount(difficulty);
  localStorage?.setItem(`gameCount_${difficulty}`, (gameCount + 1).toString());
}

export function incrementWinCount(difficulty: DifficultyId) {
  const winCount = getWinCount(difficulty);
  localStorage?.setItem(`winCount_${difficulty}`, (winCount + 1).toString());
}
