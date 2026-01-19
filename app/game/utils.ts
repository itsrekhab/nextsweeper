import { Cell, GameParams, MineField } from "./types";

function createRandomGenerator(seed: number): () => number {
  const m = 0x80000000;
  const a = 1103515245;
  const c = 12345;

  seed = seed % m;
  if (seed < 0) seed += m;

  function next(): number {
    seed = (a * seed + c) % m;
    return seed / (m - 1);
  }

  return next;
}

export function createMineFieldGenerator(
  gameParams: GameParams,
  seed: number,
): {
  init: () => MineField;
  generate: (x: number, y: number) => MineField;
} {
  const random = createRandomGenerator(seed);
  let cellIndices: number[] = [];
  let gameField: MineField = [];
  let generated: boolean = false;

  function init(): MineField {
    generated = false;

    const { width, height, mines } = gameParams;
    const totalCells = width * height;

    gameField = Array.from({ length: height }, () =>
      Array.from({ length: width }, () => new Cell(false, false, false, 0)),
    );

    cellIndices = Array.from({ length: totalCells }, (_, i) => i);

    for (let i = cellIndices.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      [cellIndices[i], cellIndices[j]] = [cellIndices[j], cellIndices[i]];
    }

    const mineIndices = cellIndices.slice(0, mines);

    mineIndices.forEach((index) => {
      const x = index % width;
      const y = Math.floor(index / width);
      gameField[y][x].isMine = true;
    });

    return gameField;
  }

  function generate(x: number, y: number): MineField {
    if (generated) return gameField;
    const { width, height, mines } = gameParams;
    const totalCells = width * height;

    const mineIndices = cellIndices.slice(0, mines);

    const excludedIndex = y * width + x;
    const minePosInSet = mineIndices.indexOf(excludedIndex);

    if (minePosInSet !== -1 && mines < totalCells) {
      gameField[y][x].isMine = false;

      mineIndices[minePosInSet] = cellIndices[mines];
      const newX = mineIndices[minePosInSet] % width;
      const newY = Math.floor(mineIndices[minePosInSet] / width);
      gameField[newY][newX].isMine = true;
    }

    for (const i of mineIndices) {
      const x = i % width;
      const y = Math.floor(i / width);
      if (gameField[y][x].isMine) {
        traverseAdjacent(gameField, x, y, (aX, aY) => {
          if (!gameField[aY][aX].isMine) {
            gameField[aY][aX].nearbyMines++;
          }
        });
      }
    }

    generated = true;

    return gameField;
  }

  return {
    init,
    generate,
  };
}

export function traverseAdjacent(
  gameField: MineField,
  x: number,
  y: number,
  traverseFn: (aX: number, aY: number) => void,
) {
  const height = gameField.length;
  const width = gameField[0]?.length || 0;

  for (let aY = -1; aY <= 1; aY++) {
    for (let aX = -1; aX <= 1; aX++) {
      if (aY === 0 && aX === 0) continue;
      const newY = y + aY;
      const newX = x + aX;

      if (newY >= 0 && newY < height && newX >= 0 && newX < width) {
        traverseFn(newX, newY);
      }
    }
  }
}
