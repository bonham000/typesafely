import { unwrap, unwrapOr, noopFn, assertUnreachable } from "./utils";

/** ===========================================================================
 * Types
 * ============================================================================
 */

interface OkVariant<T> {
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
  /**
   * Perform some action for an Ok variant. This is intended for side
   * effects or conditional actions, and does not return any values.
   */
  ifOk: (fn: ifOkFn<T>) => never;
  /**
   * Perform some action for an Ok variant. This does nothing for Err
   * variants.
   */
  ifErr: () => never;
}

interface ErrVariant<T, E> {
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
  /**
   * Perform some action for an Ok variant. This does nothing for Err
   * variants.
   */
  ifOk: () => never;
  /**
   * Perform some action for an Err variant.
   */
  ifErr: (fn: ifErrFn<E>) => never;
}

interface AsyncLoadingVariant<T> {
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
  /**
   * Perform some action for a Some variant. This does nothing for Loading
   * variants.
   */
  ifOk: () => never;
  /**
   * Perform some action for an Err variant. This does nothing for Loading
   * variants.
   */
  ifErr: () => never;
  /**
   * Perform some action for a Loading variant.
   */
  ifLoading: (fn: ifLoadingFn) => never;
}

/**
 * Method which runs a callback function conditionally for an Ok Result
 * or AsyncResult type.
 */
type ifOkFn<T> = (value: T) => any;
const ifOkFn = <T>(value: T) => {
  return (fn: ifOkFn<T>) => {
    fn(value);
    return null as never;
  };
};

/**
 * Method which runs a callback function conditionally for an Err Result
 * or AsyncResult type.
 */
type ifErrFn<E> = (error: E) => any;
const ifErrFn = <E>(error: E) => {
  return (fn: ifErrFn<E>) => {
    fn(error);
    return null as never;
  };
};

/**
 * Method which runs a callback function conditionally for a Loading Result
 * or AsyncResult type.
 */
type ifLoadingFn = () => any;
const ifLoadingFn = () => {
  return (fn: ifLoadingFn) => {
    fn();
    return null as never;
  };
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
  ifOk: ifOkFn(value),
  ifErr: noopFn,
});

/**
 * Create a new Result Err variant.
 */
export const Err = <T, E>(error: E): Result<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap a Result which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
  ifOk: noopFn,
  ifErr: ifErrFn(error),
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

interface AsyncOkVariant<T> extends OkVariant<T> {
  /**
   * Perform some action for a Loading variant. This does nothing for Err
   * variants.
   */
  ifLoading: () => never;
}

interface AsyncErrVariant<T, E> extends ErrVariant<T, E> {
  /**
   * Perform some action for a Loading variant. This does nothing for Err
   * variants.
   */
  ifLoading: () => never;
}

/**
 * An AsyncResult type can model asynchronously derived values and exists in
 * one of three states: 'ok' 'err' or 'loading'.
 */
export type AsyncResult<T, E> =
  | AsyncOkVariant<T>
  | AsyncErrVariant<T, E>
  | AsyncLoadingVariant<T>;

/**
 * Create a new AsyncResult Ok variant.
 */
export const AsyncOk = <T>(value: T): AsyncResult<T, never> => ({
  ok: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
  ifOk: ifOkFn(value),
  ifErr: noopFn,
  ifLoading: noopFn,
});

/**
 * Create a new AsyncResult Err variant.
 */
export const AsyncErr = <T, E>(error: E): AsyncResult<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap an AsyncResult which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
  ifOk: noopFn,
  ifErr: ifErrFn(error),
  ifLoading: noopFn,
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
  ifOk: noopFn,
  ifErr: noopFn,
  ifLoading: ifLoadingFn(),
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
