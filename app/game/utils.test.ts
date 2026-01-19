import { describe, expect, test } from "vitest";
import { generateField } from "./utils";

describe("seeded generation is consistent", () => {
  test("without first click", () => {
    const field1 = generateField({ height: 10, width: 10, mines: 10 }, 1);
    const field2 = generateField({ height: 10, width: 10, mines: 10 }, 1);
    expect(field1).toEqual(field2);
  });

  test("with first click", () => {
    const seed = Date.now();
    const field1 = generateField({ height: 10, width: 10, mines: 10 }, seed, {
      x: 0,
      y: 0,
    });
    console.log(
      field1.reduce(
        (acc, row) =>
          acc + row.reduce((acc2, cell) => acc2 + Number(cell.isMine), ""),
        "",
      ),
    );
    const field2 = generateField({ height: 10, width: 10, mines: 10 }, seed, {
      x: 0,
      y: 0,
    });
    console.log(
      field2.reduce(
        (acc, row) =>
          acc + row.reduce((acc2, cell) => acc2 + Number(cell.isMine), ""),
        "",
      ),
    );
    expect(field1).toEqual(field2);
  });
});

test("field has the right amount of mines", () => {
  expect(
    generateField({ height: 10, width: 10, mines: 10 }, 1).reduce(
      (acc, row) =>
        acc + row.reduce((acc2, cell) => acc2 + Number(cell.isMine), 0),
      0,
    ),
  ).toBe(10);
});
