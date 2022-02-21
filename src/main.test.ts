import {
  Ok,
  Err,
  matchResult,
  matchAsyncResult,
  AsyncResultLoading,
  AsyncOk,
  AsyncErr,
} from "./main";

describe("Result type", () => {
  const panic = () => {
    throw new Error(
      "matchResult matched a variant which should not be possible",
    );
  };

  test("matchResult ok variant", () => {
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

  test("matchResult err variant", () => {
    const expected = "Error Variant";
    const result = matchResult(Err(expected), {
      ok: panic,
      err: (e) => e,
    });

    expect(result).toBe(expected);
  });
});

describe("AsyncResult type", () => {
  const panic = () => {
    throw new Error(
      "matchAsyncResult matched a variant which should not be possible",
    );
  };

  test("matchAsyncResult ok variant", () => {
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

  test("matchAsyncResult err variant", () => {
    const expected = "Error Variant";
    const result = matchAsyncResult(AsyncErr(expected), {
      ok: panic,
      err: (e) => e,
      loading: panic,
    });

    expect(result).toBe(expected);
  });

  test("matchAsyncResult loading variant", () => {
    const expected = "Loading Variant";
    const result = matchAsyncResult(AsyncResultLoading(), {
      ok: panic,
      err: panic,
      loading: () => expected,
    });

    expect(result).toBe(expected);
  });
});
