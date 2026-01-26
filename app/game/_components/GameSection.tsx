import { Button } from "@/app/_components/Button";
import { saveHighScore } from "@/app/stats/utils";
import PauseIcon from "@/public/pause.svg";
import PlayIcon from "@/public/play.svg";
import RestartIcon from "@/public/restart.svg";
import StepForwardIcon from "@/public/step-forward.svg";
import { cn } from "@udecode/cn";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { useGame } from "../_hooks/useGame";
import { useTimer } from "../_hooks/useTimer";
import GameBoard from "./GameField";

export default function GameSection({
  seed,
  onStartNewGame,
}: {
  seed: number;
  onStartNewGame: () => void;
}) {
  const [winAnimation, setWinAnimation] = useState(false);
  const {
    seconds,
    totalSeconds,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  } = useTimer();
  const {
    gameField,
    gameState,
    minesRemaining,
    revealCell,
    flagCell,
    resetGame,
  } = useGame(seed, startTimer, pauseTimer, resetTimer, (difficultyCode) => {
    saveHighScore(
      {
        score: seconds,
        timestamp: Date.now(),
      },
      difficultyCode,
    );
    setWinAnimation(true);
  });
  const t = useTranslations("Game");
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (gameState === "in progress")
      document.title = `${t("head.title.in progress")} - NextSweeper`;
    else document.title = `${t("head.title.default")} - NextSweeper`;
  }, [gameState, t]);

  return (
    <>
      <section className="grid w-full shrink-0 grid-cols-3 items-center xl:basis-2xl">
        <div className="flex w-fit flex-col items-center">
          <span className="text-xl leading-none font-light">{t("mines")}</span>
          <span className="font-mono text-3xl leading-none">
            {minesRemaining.toString().padStart(3, "0")}
          </span>
        </div>
        <div className="flex items-center justify-center gap-2">
          <Button
            className="rounded-sm p-2"
            onClick={() => {
              resetGame();
              setIsRestarting(true);
            }}
          >
            <RestartIcon
              className={cn("h-6 w-6", isRestarting && "animate-spin-to-left")}
              onAnimationEnd={() => setIsRestarting(false)}
            />
          </Button>
          <Button className="rounded-sm p-2" onClick={onStartNewGame}>
            <StepForwardIcon className="h-6 w-6" />
          </Button>
        </div>
        <div className="flex items-center justify-between">
          <Button
            className="rounded-sm p-2 disabled:pointer-events-none disabled:opacity-50"
            onClick={isActive ? pauseTimer : startTimer}
            disabled={gameState !== "in progress"}
          >
            {isActive ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6" />
            )}
          </Button>
          <div className="flex flex-col items-center">
            <span className="text-xl leading-none font-light">{t("time")}</span>
            <span
              className={cn([
                "font-mono text-3xl leading-none",
                gameState === "not started" && "text-gray-500",
                gameState === "game over" && "text-red-600 dark:text-red-500",
                gameState === "win" && "text-blue-700 dark:text-blue-500",
              ])}
            >
              {totalSeconds}
            </span>
          </div>
        </div>
      </section>
      <section className="mt-2 mx-auto">
        <GameBoard
          gameField={gameField}
          onRevealAction={revealCell}
          onFlagAction={flagCell}
          animationState={winAnimation}
          onAnimationEnd={() => setWinAnimation(false)}
        />
      </section>
    </>
  );
}
