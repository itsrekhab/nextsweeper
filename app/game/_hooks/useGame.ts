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
  onWinFn: (difficultyCode: DifficultyId) => void,
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
  const [gameField, setGameField] = useState(() => gameObject.init());

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
        (acc, row) =>
          acc + row.filter((cell) => cell.markType === "flag").length,
        0,
      );
    return flagsCount > 0 ? flagsCount : 0;
  }, [gameField, mines]);

  if (!isFirstClick && gameState === "not started") {
    setGameState("in progress");
  }
  if (gameState === "in progress" && revealedCells === width * height - mines) {
    pauseTimerFn();
    onWinFn(difficultyCode);
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
        (gameState !== "in progress" || gameField[y][x].markType === "flag")
      )
        return;
      let nearbyFlags = 0;
      traverseAdjacent(gameField, x, y, (aX, aY) => {
        if (gameField[aY][aX].markType === "flag") nearbyFlags++;
      });
      const isChordable =
        nearbyFlags === gameField[y][x].nearbyMines &&
        gameField[y][x].isRevealed;
      if (gameField[y][x].isRevealed && !isChordable) return;

      setGameField((gf) => {
        const gfCopy = gf.map((row) => row.map((cell) => cell));
        let isChord = isChordable;

        function revealHelper(x: number, y: number) {
          if (
            gfCopy[y][x].markType === "flag" ||
            (gfCopy[y][x].isRevealed && !isChord)
          )
            return;
          if (gfCopy[y][x].isMine) {
            gfCopy[y][x] = { ...gfCopy[y][x], isRevealed: true };
            pauseTimerFn();
            setGameState("game over");
            return;
          }
          if (!isChord)
            gfCopy[y][x] = {
              ...gfCopy[y][x],
              isRevealed: true,
              markType: null,
            };
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
        gfCopy[y][x] = {
          ...gfCopy[y][x],
          markType: gfCopy[y][x].markType === "flag" ? null : "flag",
        };
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

  const markNearbyCells = useCallback(
    (x: number, y: number) => {
      if (
        gameState !== "in progress" ||
        isFirstClick ||
        !gameField[y][x].isRevealed ||
        gameField[y][x].nearbyMines === 0
      )
        return;
      let nearbyUnrevealed = 0;
      let nearbyFlagged = 0;
      let nearbyMarked = 0;
      let markMode: "flag" | "mark" | "remove" = "mark";
      traverseAdjacent(gameField, x, y, (aX, aY) => {
        if (!gameField[aY][aX].isRevealed) nearbyUnrevealed++;
        if (gameField[aY][aX].markType === "flag") nearbyFlagged++;
        if (gameField[aY][aX].markType === "zone") nearbyMarked++;
      });
      if (nearbyMarked > 0) markMode = "remove";
      if (nearbyUnrevealed === gameField[y][x].nearbyMines) markMode = "flag";
      console.log(nearbyUnrevealed, nearbyFlagged, nearbyMarked);
      if (nearbyUnrevealed === nearbyFlagged) markMode = "remove";
      setGameField((gf) => {
        const gfCopy = gf.map((row) => row.map((cell) => cell));
        traverseAdjacent(gameField, x, y, (aX, aY) => {
          const cell = gfCopy[aY][aX];
          if (cell.isRevealed) return;
          switch (markMode) {
            case "flag":
              gfCopy[aY][aX] = {
                ...cell,
                markType: "flag",
              };
              break;
            case "mark":
              gfCopy[aY][aX] = {
                ...cell,
                markType: cell.markType !== "flag" ? "zone" : cell.markType,
              };
              break;
            case "remove":
              gfCopy[aY][aX] = {
                ...gfCopy[aY][aX],
                markType:
                  nearbyUnrevealed === nearbyFlagged || cell.markType !== "flag"
                    ? null
                    : cell.markType,
              };
              break;
          }
        });
        return gfCopy;
      });
    },
    [gameField, gameState, isFirstClick],
  );

  const handleMark = useCallback(
    (x: number, y: number) => {
      if (gameField[y][x].isRevealed) {
        markNearbyCells(x, y);
      } else {
        flagCell(x, y);
      }
    },
    [gameField, flagCell, markNearbyCells],
  );

  const resetGame = useCallback(() => {
    setIsFirstClick(true);
    setGameField(() => gameObject.init());
    setGameState("not started");
    resetTimerFn();
  }, [gameObject, resetTimerFn]);

  return {
    gameField,
    gameState,
    revealedCells,
    minesRemaining,
    revealCell,
    handleMark,
    resetGame,
  };
}
