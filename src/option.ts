import { noopFn, unwrap, unwrapOr, assertUnreachable } from "./utils";

/** ===========================================================================
 * Option Type
 * ============================================================================
 */

interface SomeVariant<T> {
  readonly value: T;
  readonly some: true;
  /**
   * Check if the Option is in the Some state.
   */
  isSome: () => true;
  /**
   * Check if the Option is in the None state.
   */
  isNone: () => false;
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
  /**
   * Perform some action for a Some variant. This is intended for side
   * effects or conditional actions, and does not return any values.
   */
  ifSome: (fn: IfSomeFn<T>) => never;
  /**
   * Perform some action for a None variant. This does nothing for Some
   * variants.
   */
  ifNone: () => never;
}

interface NoneVariant<T> {
  readonly some: false;
  /**
   * Check if the Option is in the Some state.
   */
  isSome: () => false;
  /**
   * Check if the Option is in the None state.
   */
  isNone: () => true;
  /**
   * Unwrap the Option and return the enclosed value. Will throw an error
   * if the Option is in the None state.
   */
  unwrap: (message?: string) => T;
  /**
   * Unwrap the Option or return the given default value.
   */
  unwrapOr: (defaultValue: T) => T;
  /**
   * Perform some action for a Some variant. This does nothing for None
   * variants.
   */
  ifSome: () => never;
  /**
   * Perform some action for a None variant. This is intended for side
   * effects or conditional actions, and does not return any values.
   */
  ifNone: (fn: IfNoneFn) => never;
}

/**
 * The Option type models a value which is either present or absent.
 */
export type Option<T> = SomeVariant<T> | NoneVariant<T>;

/**
 * Method which runs a callback function conditionally for a Some Option
 * variant.
 */
type IfSomeFn<T> = (value: T) => any;
const ifSomeFn = <T>(value: T) => {
  return (fn: IfSomeFn<T>) => {
    fn(value);
    return null as never;
  };
};

/**
 * Method which runs a callback function conditionally for a None Option
 * variant.
 */
type IfNoneFn = () => any;
const ifNoneFn = () => {
  return (fn: IfNoneFn) => {
    fn();
    return null as never;
  };
};

/**
 * Create a new Option Some variant.
 */
export const Some = <T>(value: T): Option<T> => ({
  some: true,
  value,
  isSome: () => true,
  isNone: () => false,
  unwrap: () => value,
  unwrapOr: () => value,
  ifSome: ifSomeFn(value),
  ifNone: noopFn,
});

/**
 * Create a new Option None variant.
 */
export const None = <T>(): Option<T> => ({
  some: false,
  isSome: () => false,
  isNone: () => true,
  unwrap: unwrap("Tried to unwrap an Option which was in the None state!"),
  unwrapOr: unwrapOr<T>(),
  ifSome: noopFn,
  ifNone: ifNoneFn(),
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

type NullOrUndefined = null | undefined;

/**
 * Convert a non-null non-undefined value to a Some Option of that value. If
 * given null or undefined, a None Option will be returned.
 */
export const toOption = <T>(value: T | NullOrUndefined): Option<T> => {
  const isNullOrUndefined = value === null || value === undefined;
  const opt: Option<T> = isNullOrUndefined ? None() : Some(value);
  return opt;
};
