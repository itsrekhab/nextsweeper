import { test as baseTest, describe, expect } from "vitest";
import { createMineFieldGenerator } from "./utils";

const seed = Date.now();

const test = baseTest.extend({
  gen1: createMineFieldGenerator({ height: 10, width: 10, mines: 10 }, seed),
  gen2: createMineFieldGenerator({ height: 10, width: 10, mines: 10 }, seed),
});

describe("seeded generation is consistent", () => {
  test("without first click", ({ gen1, gen2 }) => {
    expect(gen1.init()).toEqual(gen2.init());
  });

  test("with first click", ({ gen1, gen2 }) => {
    const firstClick = {
      x: 0,
      y: 0,
    };
    gen1.init();
    gen2.init();
    expect(gen1.generate(firstClick.x, firstClick.y)).toEqual(
      gen2.generate(firstClick.x, firstClick.y),
    );
  });
});

test("field has the right amount of mines", ({ gen1 }) => {
  expect(
    gen1
      .init()
      .reduce(
        (acc, row) =>
          acc + row.reduce((acc2, cell) => acc2 + Number(cell.isMine), 0),
        0,
      ),
  ).toBe(10);
});
