import { assertUnreachable } from "../src/utils";

describe("assertUnreachable", () => {
  test("Throws for any given value", () => {
    const x = 500 as never;
    expect(() => assertUnreachable(x)).toThrow();
  });
});
