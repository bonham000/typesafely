/** ===========================================================================
 * Types
 * ============================================================================
 */

type OkType<T> = {
  ok: true;
  value: T;
  unwrap: (message?: string) => T;
  unwrapOr: () => T;
};

type ErrType<T, E> = {
  ok: false;
  error: E;
  unwrap: (message?: string) => never;
  unwrapOr: (defaultValue: T) => T;
};

type LoadingType<T> = {
  ok: false;
  loading: true;
  unwrap: (message?: string) => never;
  unwrapOr: (defaultValue: T) => T;
};

/** ===========================================================================
 * Result type
 * ============================================================================
 */

export type Result<T, E> = OkType<T> | ErrType<T, E>;

export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

export const Err = <T, E>(error: E): Result<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap a Result which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
});

export interface ResultMatcher<T, E, R1, R2> {
  ok: (value: T) => R1;
  err: (error: E) => R2;
}

/**
 * Match-like statement for a Result which mimics the match statement semantics
 * in Rust.
 */
export const matchResult = <T, E, R1, R2>(
  x: Result<T, E>,
  matcher: ResultMatcher<T, E, R1, R2>,
) => {
  if ("error" in x) {
    // Error State
    return matcher.err(x.error);
  } else if (x.ok === true) {
    // Ok State
    return matcher.ok(x.value);
  } else {
    // No other possible states exist
    return assertUnreachable(x);
  }
};

/** ===========================================================================
 * AsyncResult Type
 * ============================================================================
 */

export type AsyncResult<T, E> = OkType<T> | ErrType<T, E> | LoadingType<T>;

export const AsyncOk = <T>(value: T): AsyncResult<T, never> => ({
  ok: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

export const AsyncErr = <T, E>(error: E): AsyncResult<T, E> => ({
  ok: false,
  error,
  unwrap: unwrap("Tried to unwrap an AsyncResult which was in the Err state!"),
  unwrapOr: unwrapOr<T>(),
});

export const AsyncResultLoading = <T>(): AsyncResult<T, never> => ({
  ok: false,
  loading: true,
  unwrap: unwrap(
    "Tried to unwrap an AsyncResult which was in the AsyncResultLoading state!",
  ),
  unwrapOr: unwrapOr<T>(),
});

export interface AsyncResultMatcher<T, E, R1, R2, R3> {
  ok: (value: T) => R1;
  err: (error: E) => R2;
  loading: () => R3;
}

/**
 * Match-like statement for a Result which mimics the match statement semantics
 * in Rust. Each potential variant (loading, error, ok) must be handled
 * when using this.
 */
export const matchAsyncResult = <T, E, R1, R2, R3>(
  x: AsyncResult<T, E>,
  matcher: AsyncResultMatcher<T, E, R1, R2, R3>,
) => {
  if ("loading" in x) {
    // Loading State
    return matcher.loading();
  } else if ("error" in x) {
    // Error State
    return matcher.err(x.error);
  } else if (x.ok === true) {
    // Ok State
    return matcher.ok(x.value);
  } else {
    // No other possible states exist
    return assertUnreachable(x);
  }
};

/** ===========================================================================
 * Option Type
 * ============================================================================
 */

type SomeType<T> = {
  some: true;
  value: T;
  unwrap: (message?: string) => T;
  unwrapOr: () => T;
};

type NoneType<T> = {
  some: false;
  unwrap: (message?: string) => T;
  unwrapOr: (defaultValue: T) => T;
};

export type Option<T> = SomeType<T> | NoneType<T>;

export const Some = <T>(value: T): Option<T> => ({
  some: true,
  value,
  unwrap: () => value,
  unwrapOr: () => value,
});

export const None = <T>(): Option<T> => ({
  some: false,
  unwrap: unwrap("Tried to unwrap an Option which was in the None state!"),
  unwrapOr: unwrapOr<T>(),
});

export interface OptionMatcher<T, R1, R2> {
  some: (value: T) => R1;
  none: () => R2;
}

/**
 * Match-like statement for an option, some and none variants must be handled.
 */
export const matchOption = <T, R1, R2>(
  x: Option<T>,
  matcher: OptionMatcher<T, R1, R2>,
) => {
  if (x.some === true) {
    return matcher.some(x.value);
  } else if (x.some === false) {
    return matcher.none();
  } else {
    return assertUnreachable(x);
  }
};

/** ===========================================================================
 * Helper Functions
 * ============================================================================
 */

/**
 * Assert a condition cannot occur. Used for writing exhaustive switch
 * blocks guarantee every value is handled.
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
