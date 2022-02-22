import {
  Ok,
  Err,
  matchResult,
  matchAsyncResult,
  AsyncResultLoading,
  AsyncOk,
  AsyncErr,
  Option,
  Some,
  matchOption,
  None,
  assertUnreachable,
} from "./main";

const panic = () => {
  throw new Error("An invalid match branch case occurred!");
};

describe("assertUnreachable", () => {
  test("Throws for any given value", () => {
    const x = 500 as never;
    expect(() => assertUnreachable(x)).toThrow();
  });
});

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
});

describe("Result Type", () => {
  test("matchResult Ok variant", () => {
    const expected = {
      flag: true,
      data: [1, 2, 3, 4, 5],
      description: "This is the data...",
    };

    const result = matchResult(Ok(expected), {
      ok: (x) => x,
      err: panic,
    });

    expect(result).toEqual(expected);
  });

  test("matchResult Err variant", () => {
    const expected = "Error Variant";
    const result = matchResult(Err(expected), {
      ok: panic,
      err: (e) => e,
    });

    expect(result).toBe(expected);
  });

  test("Result unwrap and unwrapOr for Ok variants", () => {
    const data = 100;
    expect(Ok(data).unwrap()).toEqual(data);
    expect(Ok(data).unwrapOr(700)).toEqual(data);
  });

  test("Result unwrap and unwrapOr for Err variants", () => {
    expect(() => Err("Error").unwrap("Failed!")).toThrowError("Failed!");
    expect(Err("Error").unwrapOr(700)).toEqual(700);
  });
});

describe("AsyncResult Type", () => {
  test("matchAsyncResult AsyncOk variant", () => {
    const expected = {
      flag: true,
      data: [1, 2, 3, 4, 5],
      description: "This is the data...",
    };

    const result = matchAsyncResult(AsyncOk(expected), {
      ok: (x) => x,
      err: panic,
      loading: panic,
    });

    expect(result).toEqual(expected);
  });

  test("matchAsyncResult AsyncErr variant", () => {
    const expected = "Error Variant";
    const result = matchAsyncResult(AsyncErr(expected), {
      ok: panic,
      err: (e) => e,
      loading: panic,
    });

    expect(result).toBe(expected);
  });

  test("matchAsyncResult AsyncResultLoading variant", () => {
    const expected = "Loading Variant";
    const result = matchAsyncResult(AsyncResultLoading(), {
      ok: panic,
      err: panic,
      loading: () => expected,
    });

    expect(result).toBe(expected);
  });

  test("AsyncResult unwrap and unwrapOr for AsyncOk variants", () => {
    const data = 900;
    expect(AsyncOk(data).unwrap()).toEqual(data);
    expect(AsyncOk(data).unwrapOr(42)).toEqual(data);
  });

  test("AsyncResult unwrap and unwrapOr for AsyncErr variants", () => {
    expect(() => AsyncErr("Error").unwrap("Failed!")).toThrowError("Failed!");
    expect(AsyncErr("Error").unwrapOr(700)).toEqual(700);
  });

  test("AsyncResult unwrap and unwrapOr for AsyncResultLoading variants", () => {
    expect(() => AsyncResultLoading().unwrap("Failed!")).toThrowError(
      "Failed!",
    );
    expect(AsyncResultLoading().unwrapOr(700)).toEqual(700);
  });
});
