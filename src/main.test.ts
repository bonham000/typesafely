import { add } from "./main";

describe("Test placeholder", () => {
  test("add function", () => {
    const result = add(10, 20);
    expect(result).toMatchInlineSnapshot(`30`);
  });
});
