"use client";
import "client-only";

import { isDifficultyMode } from "@/app/helpers";
import { redirect, useParams } from "next/navigation";
import { useState } from "react";
import GameSection from "../_components/GameSection";

export default function GamePage() {
  const { seedParam } = useParams();
  const difficultyId = Number(seedParam ? seedParam[0] : 3);
  const difficultyCode = isDifficultyMode(difficultyId) ? difficultyId : 3;
  const [seed] = useState(() => (seedParam ? Number(seedParam) : Date.now()));

  return (
    <>
      <main className="mx-auto w-fit justify-center p-2">
        <GameSection
          seed={seed}
          onStartNewGame={() =>
            redirect(`/game/${difficultyCode + "" + Date.now()}`)
          }
        />
      </main>
    </>
  );
}
