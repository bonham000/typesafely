import {
  Ok,
  Err,
  matchResult,
  matchAsyncResult,
  AsyncResultLoading,
  AsyncOk,
  AsyncErr,
  AsyncResult,
  Result,
  Unit,
  UnitType,
} from "../src/result";
import { panic } from "../src/utils";

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

  test("Result ifOk and ifErr methods", () => {
    let flag = false;
    const result = Ok([1, 2, 3]);
    result.ifOk((x) => {
      flag = true;
      expect(x).toEqual([1, 2, 3]);
    });
    expect(flag).toBe(true);
    result.ifErr(panic);

    flag = false;
    const err = Err("error!");
    err.ifOk(panic);
    err.ifErr((e) => {
      flag = true;
      expect(e).toBe("error!");
    });
    expect(flag).toBe(true);
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

  test("Result isOk and isErr methods", () => {
    let result: Result<number, string> = Ok(100);
    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);

    result = Err("Error!");
    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(true);
  });

  test("AsyncResult isOk, isErr and isLoading methods", () => {
    let result: AsyncResult<number, string> = AsyncOk(100);
    expect(result.isOk()).toBe(true);
    expect(result.isErr()).toBe(false);
    expect(result.isLoading()).toBe(false);

    result = AsyncErr("Error!");
    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(true);
    expect(result.isLoading()).toBe(false);

    result = AsyncResultLoading();
    expect(result.isOk()).toBe(false);
    expect(result.isErr()).toBe(false);
    expect(result.isLoading()).toBe(true);
  });

  test("AsyncResult ifOk, ifErr, and ifLoading methods", () => {
    let flag = false;
    const result = AsyncOk([1, 2, 3]);
    result.ifOk((x) => {
      flag = true;
      expect(x).toEqual([1, 2, 3]);
    });
    result.ifLoading(panic);
    result.ifErr(panic);
    expect(flag).toBe(true);

    flag = false;
    const err = AsyncErr("error!");
    err.ifOk(panic);
    err.ifLoading(panic);
    err.ifErr((e) => {
      flag = true;
      expect(e).toBe("error!");
    });
    expect(flag).toBe(true);

    flag = false;
    const loading = AsyncResultLoading();
    loading.ifOk(panic);
    loading.ifLoading(() => {
      flag = true;
    });
    loading.ifErr(panic);
    expect(flag).toBe(true);
  });

  test("Result and AsyncResult Unit type", () => {
    {
      const result: Result<UnitType, string> = Ok(Unit());
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.unwrap().isNone()).toBe(true);
    }

    {
      const result: AsyncResult<UnitType, string> = AsyncOk(Unit());
      expect(result.isOk()).toBe(true);
      expect(result.isErr()).toBe(false);
      expect(result.isLoading()).toBe(false);
      expect(result.unwrap().isNone()).toBe(true);
    }
  });
});
