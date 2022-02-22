/** ===========================================================================
 * Types
 * ============================================================================
 */

type OkVariant<T> = {
  ok: true;
  value: T;
  /**
   * Unwrap the Result and return the enclosed value. Will throw an error
   * if the Result is in a non-Ok None state.
   *
   * The optional message argument will be used as the error message in the
   * event of an error.
   */
  unwrap: (message?: string) => T;
  /**
   * Unwrap the Result or return the given default value.
   */
  unwrapOr: () => T;
};

type ErrVariant<T, E> = {
  ok: false;
  error: E;
  /**
   * Unwrap the Result and return the enclosed value. Will throw an error
   * if the Result is in a non-Ok None state.
   *
   * The optional message argument will be used as the error message in the
   * event of an error.
   */
  unwrap: (message?: string) => never;
  /**
   * Unwrap the Result or return the given default value.
   */
  unwrapOr: (defaultValue: T) => T;
};

type LoadingVariant<T> = {
  ok: false;
  loading: true;
  /**
   * Unwrap the Result and return the enclosed value. Will throw an error
   * if the Result is in a non-Ok None state.
   *
   * The optional message argument will be used as the error message in the
   * event of an error.
   */
  unwrap: (message?: string) => never;
  /**
   * Unwrap the Result or return the given default value.
   */
  unwrapOr: (defaultValue: T) => T;
};

/** ===========================================================================
 * Result Type
 * ============================================================================
 */

/**
 * The Result type models a value which can exist in one of two states:
 * 'ok' or 'err'.
 */
export type Result<T, E> = OkVariant<T> | ErrVariant<T, E>;

/**
 * Create a new Result Ok variant.
 */
export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

/**
 * Create a new Result Err variant.
 */
export const Err = <T, E>(error: E): Result<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap a Result which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
});

interface ResultMatcher<T, E, R1, R2> {
  ok: (value: T) => R1;
  err: (error: E) => R2;
}

/**
 * Result match statement which requires 'ok' and 'err' branches to handle
 * each Result variant.
 */
export const matchResult = <T, E, R1, R2>(
  result: Result<T, E>,
  matcher: ResultMatcher<T, E, R1, R2>,
) => {
  if ("error" in result) {
    // Error State
    return matcher.err(result.error);
  } else if (result.ok === true) {
    // Ok State
    return matcher.ok(result.value);
  } else {
    // No other states exist
    return assertUnreachable(result);
  }
};

/** ===========================================================================
 * AsyncResult Type
 * ============================================================================
 */

/**
 * An AsyncResult type can model asynchronously derived values and exists in
 * one of three states: 'ok' 'err' or 'loading'.
 */
export type AsyncResult<T, E> =
  | OkVariant<T>
  | ErrVariant<T, E>
  | LoadingVariant<T>;

/**
 * Create a new AsyncResult Ok variant.
 */
export const AsyncOk = <T>(value: T): AsyncResult<T, never> => ({
  ok: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

/**
 * Create a new AsyncResult Err variant.
 */
export const AsyncErr = <T, E>(error: E): AsyncResult<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap an AsyncResult which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
});

/**
 * Create a new AsyncResultLoading variant.
 */
export const AsyncResultLoading = <T>(): AsyncResult<T, never> => ({
  ok: false,
  loading: true,
  unwrap: unwrap(
    "Tried to unwrap an AsyncResult which was in the AsyncResultLoading state!",
  ),
  unwrapOr: unwrapOr<T>(),
});

interface AsyncResultMatcher<T, E, R1, R2, R3> {
  ok: (value: T) => R1;
  err: (error: E) => R2;
  loading: () => R3;
}

/**
 * AsyncResult match statement which requires 'ok', 'err', and 'loading'
 * branches to handle each AsyncResult variant.
 */
export const matchAsyncResult = <T, E, R1, R2, R3>(
  asyncResult: AsyncResult<T, E>,
  matcher: AsyncResultMatcher<T, E, R1, R2, R3>,
) => {
  if ("loading" in asyncResult) {
    // Loading State
    return matcher.loading();
  } else if ("error" in asyncResult) {
    // Error State
    return matcher.err(asyncResult.error);
  } else if (asyncResult.ok === true) {
    // Ok State
    return matcher.ok(asyncResult.value);
  } else {
    // No other states exist
    return assertUnreachable(asyncResult);
  }
};

/** ===========================================================================
 * Option Type
 * ============================================================================
 */

type SomeVariant<T> = {
  value: T;
  some: true;
  /**
   * Unwrap the Option and return the enclosed value. Will throw an error
   * if the Option is in the None state.
   *
   * The optional message argument will be used as the error message in the
   * event of an error.
   */
  unwrap: (message?: string) => T;
  /**
   * Unwrap the Option or return the given default value.
   */
  unwrapOr: () => T;
};

type NoneVariant<T> = {
  some: false;
  /**
   * Unwrap the Option and return the enclosed value. Will throw an error
   * if the Option is in the None state.
   */
  unwrap: (message?: string) => T;
  /**
   * Unwrap the Option or return the given default value.
   */
  unwrapOr: (defaultValue: T) => T;
};

/**
 * The Option type models a value which is either present or absent.
 */
export type Option<T> = SomeVariant<T> | NoneVariant<T>;

/**
 * Create a new Option Some variant.
 */
export const Some = <T>(value: T): Option<T> => ({
  some: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

/**
 * Create a new Option None variant.
 */
export const None = <T>(): Option<T> => ({
  some: false,
  unwrap: unwrap("Tried to unwrap an Option which was in the None state!"),
  unwrapOr: unwrapOr<T>(),
});

interface OptionMatcher<T, R1, R2> {
  some: (value: T) => R1;
  none: () => R2;
}

/**
 * Option match statement which requires 'some' and 'none' branches to
 * handle each Option variant.
 */
export const matchOption = <T, R1, R2>(
  opt: Option<T>,
  matcher: OptionMatcher<T, R1, R2>,
) => {
  if (opt.some === true) {
    // Some variant
    return matcher.some(opt.value);
  } else if (opt.some === false) {
    // None variant
    return matcher.none();
  } else {
    // No other states exist
    return assertUnreachable(opt);
  }
};

/** ===========================================================================
 * Helper Functions
 * ============================================================================
 */

/**
 * Assert a value cannot exist.
 */
export const assertUnreachable = (x: never): never => {
  throw new Error(
    `assertUnreachable received a value which should not exist: ${JSON.stringify(
      x,
    )}`,
  );
};

/**
 * Function to handle unwrapping values.
 */
const unwrap = (defaultMessage: string) => (message?: string) => {
  throw new Error(message || defaultMessage);
};

/**
 * Unwrap which provides a default value instead of throwing an error.
 */
const unwrapOr = <T>() => {
  return (defaultValue: T) => {
    return defaultValue;
  };
};
