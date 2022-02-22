import { matchOption, Some, None, Option } from "../src/option";
import { panic } from "../src/utils";

describe("Option Type", () => {
  test("matchOption Some variant", () => {
    const opt: Option<number> = Some(1000);
    const value = matchOption(opt, {
      some: (x) => x,
      none: panic,
    });
    expect(value).toEqual(1000);
  });

  test("matchOption None variant", () => {
    const opt: Option<number> = None();
    const value = matchOption(opt, {
      some: (x) => x,
      none: () => 5000,
    });
    expect(value).toEqual(5000);
  });

  test("matchOption unwrap and unwrapOr for Some variant", () => {
    const opt: Option<number> = Some(50);
    expect(opt.unwrap()).toEqual(50);
    expect(opt.unwrapOr(10)).toEqual(50);
  });

  test("matchOption unwrap and unwrapOr for None variant", () => {
    const opt: Option<number> = None();
    expect(() => opt.unwrap("Failed!")).toThrowError("Failed!");
    expect(opt.unwrapOr(10)).toEqual(10);
  });

  test("Option ifSome and ifNone method", () => {
    let flag = false;
    let opt = Some(10);
    opt.ifSome((value) => {
      flag = true;
      expect(value).toBe(10);
    });
    opt.ifNone(panic);
    expect(flag).toBe(true);

    opt = None();
    opt.ifSome(panic);
    opt.ifNone(() => {
      flag = true;
      expect(true).toBe(true);
    });
    expect(flag).toBe(true);
  });
});
