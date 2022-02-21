import {
  Ok,
  Err,
  matchResult,
  matchAsyncResult,
  AsyncResultLoading,
  AsyncOk,
  AsyncErr,
  Result,
} from "./main";

describe("Result type", () => {
  const panic = () => {
    throw new Error(
      "matchResult matched a variant which should not be possible",
    );
  };

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

describe("AsyncResult type", () => {
  const panic = () => {
    throw new Error(
      "matchAsyncResult matched a variant which should not be possible",
    );
  };

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
