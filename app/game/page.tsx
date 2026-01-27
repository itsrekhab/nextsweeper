"use client";

import { redirect, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function GameRedirect() {
  const searchParams = useSearchParams();
  const [date] = useState(() => Date.now());
  redirect(
    `/game/${(searchParams.get("mode") || localStorage.getItem("difficulty") || "3") + date}`,
  );
}
