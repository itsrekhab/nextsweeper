import * as v from "valibot";

export class Cell {
  isMine: boolean = false;
  isRevealed: boolean = false;
  isFlagged: boolean = false;
  nearbyMines: number = 0;

  constructor(
    isMine = false,
    isRevealed = false,
    isFlagged = false,
    nearbyMines = 0,
  ) {
    this.isMine = isMine;
    this.isRevealed = isRevealed;
    this.isFlagged = isFlagged;
    this.nearbyMines = nearbyMines;
  }
}

export type MineField = Array<Array<Cell>>;

export type GameParams = {
  width: number;
  height: number;
  mines: number;
};

export const HighScoresSchema = v.array(
  v.object({
    score: v.pipe(v.number(), v.minValue(0)),
    timestamp: v.number(),
  }),
);

export type Score = v.InferInput<typeof HighScoresSchema>[number];
