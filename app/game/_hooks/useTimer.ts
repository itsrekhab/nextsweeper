import { useCallback, useEffect, useRef, useState } from "react";

export function useTimer() {
  const initialTime = useRef(0);
  const timeBeforePause = useRef(0);
  const [seconds, setSeconds] = useState(0);
  const totalSeconds = Math.floor(seconds);

  const interval = useRef<NodeJS.Timeout | null>(null);
  const [isActive, setIsActive] = useState(false);

  const startTimer = useCallback(() => {
    if (isActive) return;
    initialTime.current = performance.now();
    setIsActive(true);
  }, [isActive]);

  const pauseTimer = useCallback(() => {
    if (!isActive) return;
    timeBeforePause.current += performance.now() - initialTime.current;
    setIsActive(false);
    if (interval.current) clearInterval(interval.current);
  }, [isActive]);

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setSeconds(0);
    timeBeforePause.current = 0;
    if (interval.current) clearInterval(interval.current);
  }, []);

  useEffect(() => {
    if (isActive) {
      interval.current = setInterval(() => {
        setSeconds(
          () =>
            (timeBeforePause.current +
              (performance.now() - initialTime.current)) /
            1000,
        );
      }, 100);
    } else {
      if (interval.current) clearInterval(interval.current);
    }
    return () => {
      if (interval.current) clearInterval(interval.current);
    };
  }, [isActive, initialTime, resetTimer]);

  return {
    seconds,
    totalSeconds,
    isActive,
    startTimer,
    pauseTimer,
    resetTimer,
  };
}
