"use client";
import "client-only";

import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { Button } from "../_components/Button";
import { DifficultyId, difficultyModes } from "../_constants/constants";
import { Score } from "../game/types";
import { isDifficultyMode } from "../helpers";
import {
  clearAllData,
  getGameCount,
  getHighScores,
  getTotalGameCount,
  getTotalWinCount,
  getWinCount,
} from "./utils";

export default function Stats() {
  const locale = useLocale();
  const t = useTranslations();
  const [gameCount, setGameCount] = useState(0);
  const [totalGameCount, setTotalGameCount] = useState(0);
  const [winCount, setWinCount] = useState(0);
  const [totalWinCount, setTotalWinCount] = useState(0);
  const [highScores, setHighScores] = useState<Score[]>([]);
  const [difficulty, setDifficulty] = useState<DifficultyId>(
    difficultyModes[0].id,
  );

  useEffect(() => {
    setTotalGameCount(getTotalGameCount());
    setTotalWinCount(getTotalWinCount());
  }, []);

  useEffect(() => {
    setGameCount(getGameCount(difficulty));
    setWinCount(getWinCount(difficulty));
    setHighScores(getHighScores(difficulty));
  }, [difficulty]);

  const dialog = useRef<HTMLDialogElement>(null);

  return (
    <main className="mx-auto flex flex-wrap justify-between gap-6 p-2 py-1 xl:w-3xl">
      <h1 className="w-fit text-3xl font-semibold">{t("Stats.body_title")}</h1>
      <Button
        onClick={() => {
          dialog.current?.showModal();
        }}
        className="h-fit self-center rounded-sm"
      >
        {t("Stats.clear_data")}
      </Button>
      <dialog
        ref={dialog}
        className="m-auto rounded-lg p-8 bg-background text-foreground backdrop:bg-black/50"
      >
        <form method="dialog" className="flex flex-wrap gap-2">
          <p className="basis-full">{t("Stats.Dialog.confirm_message")}</p>
          <Button className="rounded-sm border bg-background border-blue-700 text-blue-700 hover:bg-blue-300 dark:hover:bg-blue-950">
            {t("Stats.Dialog.cancel")}
          </Button>
          <Button
            onClick={() => {
              clearAllData();
              if (window) window.location.reload();
            }}
            className="rounded-sm"
          >
            {t("Stats.Dialog.confirm")}
          </Button>
        </form>
      </dialog>
      <section className="flex basis-full gap-4 -mt-2">
        <p className="flex flex-col gap-0.5">
          <span className="block font-semibold">{t("Stats.game_count")}</span>
          <span className="flex gap-1 font-light items-baseline *:leading-none">
            <span className="text-xl">{gameCount}</span>
            <span>/</span>
            <span className="text-lg">{totalGameCount}</span>
          </span>
        </p>
        <p className="flex flex-col gap-0.5">
          <span className="block font-semibold">{t("Stats.win_count")}</span>
          <span className="flex gap-1 font-light items-baseline *:leading-none">
            <span className="text-xl">{winCount}</span>
            <span>/</span>
            <span className="text-lg">{totalWinCount}</span>
          </span>
        </p>
      </section>
      <section className="flex flex-col basis-full gap-2">
        <h2 className="basis-full text-2xl font-semibold">
          {t("Stats.high_scores")}
        </h2>
        <p className="flex items-center gap-1 basis-full">
          <span>{t("DifficultySelect.message")}</span>
          <select
            className="rounded-sm bg-interactive hover:bg-interactive-hover px-2 py-1"
            value={difficulty}
            onChange={(e) => {
              const mode = Number(e.target.value);
              setDifficulty(isDifficultyMode(mode) ? mode : difficulty);
            }}
          >
            {difficultyModes.map((mode) => (
              <option key={mode.id} value={mode.id}>
                {t(`DifficultySelect.${mode.locale_code}`)}
              </option>
            ))}
          </select>
        </p>
        {highScores.length > 0 ? (
          <table className="**:text-start">
            <thead>
              <tr className="**:font-semibold">
                <th className="py-1 ps-0 pe-4 w-fit">{t("Stats.score")}</th>
                <th className="py-1 ps-0 pe-4">{t("Stats.timestamp")}</th>
              </tr>
            </thead>
            <tbody>
              {highScores.map((score, index) => (
                <tr key={index}>
                  <td className="py-1 ps-0 pe-4 w-fit">
                    {score.score.toFixed(3)}
                  </td>
                  <td className="py-1 ps-0 pe-4">
                    {new Date(score.timestamp).toLocaleString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="basis-full">{t("Stats.no_scores")}</div>
        )}
      </section>
    </main>
  );
}
