import FlagIcon from "@/public/flag.svg";
import MineIcon from "@/public/mine.svg";
import { cn } from "@udecode/cn";
import { Cell } from "../types";

type CellProps = {
  x: number;
  y: number;
  cell: Cell;
};

export default function FieldCell({ x, y, cell }: CellProps) {
  const nearbyTwStyles: Record<PropertyKey, string> = {
    0: "",
    1: "text-blue-600 dark:text-blue-400",
    2: "text-green-700 dark:text-green-500",
    3: "text-red-600 dark:text-red-300",
    4: "text-blue-900 dark:text-blue-500",
    5: "text-red-900 dark:text-red-500",
    6: "text-purple-700 dark:text-purple-500",
    7: "text-black dark:text-white",
    8: "text-gray-500 dark:text-gray-300",
  };

  const { isRevealed, markType, isMine, nearbyMines } = cell;
  const display = () => {
    if (markType === "flag")
      return <FlagIcon className="w-4 h-4 pointer-events-none" />;
    if (!isRevealed) return "";
    if (isMine) return <MineIcon className="w-4 h-4" />;
    return nearbyMines > 0 ? nearbyMines : "";
  };

  return (
    <div
      className={cn([
        "flex size-6 cursor-pointer content-center justify-center items-center overflow-hidden border border-transparent font-black inset-shadow-[1px_1px_0_0_rgba(0,0,0,0.5)]",
        !isRevealed && "shadow-[2px_2px_0_0_rgba(0,0,0,0.125)] z-1",
        !isRevealed &&
          (markType === "zone"
            ? "[--bg-zone:hsl(0_0_0/40%)] dark:[--bg-zone:hsl(360_100_100/50%)] [background:repeating-linear-gradient(45deg,var(--bg-zone),var(--bg-zone)_10%,var(--interactive)_11%,var(--interactive)_20%)_content-box]"
            : "bg-interactive"),
        isRevealed && isMine && "bg-red-600 text-red-500",
        isRevealed && !isMine && `${nearbyTwStyles[nearbyMines]}`,
      ])}
      data-x={x}
      data-y={y}
    >
      {display()}
    </div>
  );
}
