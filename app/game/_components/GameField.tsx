"use client";

import { Fragment, memo } from "react";
import { MineField } from "../types";
import FieldCell from "./FieldCell";

type GameBoardProps = {
  gameField: MineField;
  onRevealAction: (x: number, y: number) => void;
  onFlagAction: (x: number, y: number) => void;
};

const GameBoard = memo(function GameBoard({
  gameField,
  onRevealAction,
  onFlagAction,
}: GameBoardProps) {
  const gridTwStyles: Record<
    "width" | "height",
    Record<number, `grid-${string}`>
  > = {
    width: {
      30: "grid-cols-30",
      16: "grid-cols-16",
      9: "grid-cols-9",
    },
    height: {
      16: "grid-rows-16",
      9: "grid-rows-9",
    },
  };
  const width = gameField[0].length;
  const height = gameField.length;

  return (
    <div
      className={`grid ${gridTwStyles.height[height]} ${gridTwStyles.width[width]} size-fit border-2 bg-background select-none`}
      onContextMenu={(e) => {
        e.preventDefault();
      }}
      onClick={(e) => {
        if (
          !(e.target instanceof HTMLElement) ||
          !e.target.dataset.x ||
          !e.target.dataset.y
        )
          return;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        onRevealAction(x, y);
      }}
      onMouseDown={(e) => {
        if (
          !(e.target instanceof HTMLElement) ||
          !e.target.dataset.x ||
          !e.target.dataset.y
        )
          return;
        const x = parseInt(e.target.dataset.x);
        const y = parseInt(e.target.dataset.y);
        if (e.button === 2) onFlagAction(x, y);
      }}
    >
      {gameField.map((row, y) => (
        <Fragment key={y}>
          {row.map((cell, x) => (
            <FieldCell key={x} x={x} y={y} cell={cell} />
          ))}
        </Fragment>
      ))}
    </div>
  );
});

export default GameBoard;
