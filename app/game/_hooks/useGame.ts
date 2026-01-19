import { useCallback, useMemo, useState } from "react";

import { DifficultyId, difficultyModes } from "@/app/_constants/constants";
import { isDifficultyMode } from "@/app/helpers";
import { incrementGameCount, incrementWinCount } from "@/app/stats/utils";
import { createMineFieldGenerator, traverseAdjacent } from "../utils";

export function useGame(
  seed: number,
  startTimerFn: () => void,
  pauseTimerFn: () => void,
  resetTimerFn: () => void,
  saveHighScoreFn: (difficultyCode: DifficultyId) => void,
) {
  const difficultyId = useMemo(() => Number(String(seed)[0]), [seed]);
  const difficultyCode = useMemo<DifficultyId>(
    () => (isDifficultyMode(difficultyId) ? difficultyId : 3),
    [difficultyId],
  );

  const gameParams = useMemo(
    () =>
      difficultyModes.find((mode) => mode.id === difficultyCode)?.params ??
      difficultyModes[2].params,
    [difficultyCode],
  );
  const [pureSeed] = useState(() =>
    seed ? Number(String(seed).slice(1)) : Date.now(),
  );
  const { width, height, mines } = useMemo(() => gameParams, [gameParams]);
  const [gameState, setGameState] = useState<
    "not started" | "in progress" | "game over" | "win"
  >("not started");
  const [isFirstClick, setIsFirstClick] = useState(true);

  const gameObject = useMemo(
    () => createMineFieldGenerator(gameParams, pureSeed),
    [gameParams, pureSeed],
  );
  const [gameField, setGameField] = useState(() =>
    gameObject.initialGenerate(),
  );

  const revealedCells = useMemo(
    () =>
      gameField.reduce(
        (cells, row) =>
          cells +
          row.reduce((rowCells, cell) => rowCells + Number(cell.isRevealed), 0),
        0,
      ),
    [gameField],
  );

  const minesRemaining = useMemo(() => {
    const flagsCount =
      mines -
      gameField.reduce(
        (acc, row) => acc + row.filter((cell) => cell.isFlagged).length,
        0,
      );
    return flagsCount > 0 ? flagsCount : 0;
  }, [gameField, mines]);

  if (!isFirstClick && gameState === "not started") {
    setGameState("in progress");
  }
  if (gameState === "in progress" && revealedCells === width * height - mines) {
    pauseTimerFn();
    saveHighScoreFn(difficultyCode);
    setGameState("win");
    incrementWinCount(difficultyCode);
  }

  const revealCell = useCallback(
    (x: number, y: number) => {
      if (isFirstClick) {
        setGameField(() => gameObject.generate(x, y));
        startTimerFn();
        setIsFirstClick(false);
        incrementGameCount(difficultyCode);
      }
      if (
        !isFirstClick &&
        (gameState !== "in progress" || gameField[y][x].isFlagged)
      )
        return;
      let nearbyFlags = 0;
      traverseAdjacent(gameField, x, y, (aX, aY) => {
        if (gameField[aY][aX].isFlagged) nearbyFlags++;
      });
      const isChordable =
        nearbyFlags === gameField[y][x].nearbyMines &&
        gameField[y][x].isRevealed;
      if (gameField[y][x].isRevealed && !isChordable) return;

      setGameField((gf) => {
        const gfCopy = gf.map((row) => row.map((cell) => cell));
        let isChord = isChordable;

        function revealHelper(x: number, y: number) {
          if (gfCopy[y][x].isFlagged || (gfCopy[y][x].isRevealed && !isChord))
            return;
          if (gfCopy[y][x].isMine) {
            gfCopy[y][x] = { ...gfCopy[y][x], isRevealed: true };
            pauseTimerFn();
            setGameState("game over");
            return;
          }
          if (!isChord) gfCopy[y][x] = { ...gfCopy[y][x], isRevealed: true };
          if (gfCopy[y][x].nearbyMines === 0 || isChord) {
            isChord = false;
            traverseAdjacent(gfCopy, x, y, (aX, aY) => {
              revealHelper(aX, aY);
            });
          }
        }

        revealHelper(x, y);
        return gfCopy;
      });
    },
    [
      isFirstClick,
      gameObject,
      gameField,
      gameState,
      difficultyCode,
      startTimerFn,
      pauseTimerFn,
    ],
  );

  const flagCell = useCallback(
    (x: number, y: number) => {
      if (isFirstClick) {
        setGameField(() => gameObject.generate(x, y));
        setIsFirstClick(false);
        startTimerFn();
        incrementGameCount(difficultyCode);
      }
      if (
        !isFirstClick &&
        (gameState !== "in progress" || gameField[y][x].isRevealed)
      )
        return;
      setGameField((gf) => {
        const gfCopy = gf.map((row) => row.map((cell) => cell));
        gfCopy[y][x] = { ...gfCopy[y][x], isFlagged: !gfCopy[y][x].isFlagged };
        return gfCopy;
      });
    },
    [
      isFirstClick,
      gameObject,
      gameField,
      gameState,
      difficultyCode,
      startTimerFn,
    ],
  );

  const resetGame = useCallback(() => {
    setIsFirstClick(true);
    setGameField(() => gameObject.initialGenerate());
    setGameState("not started");
    resetTimerFn();
  }, [gameObject, resetTimerFn]);

  return {
    gameField,
    gameState,
    revealedCells,
    minesRemaining,
    revealCell,
    flagCell,
    resetGame,
  };
}
