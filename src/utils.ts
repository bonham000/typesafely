/** ===========================================================================
 * Utils
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
export const unwrap = (defaultMessage: string) => (message?: string) => {
  throw new Error(message || defaultMessage);
};

/**
 * Unwrap which provides a default value instead of throwing an error.
 */
export const unwrapOr = <T>() => {
  return (defaultValue: T) => {
    return defaultValue;
  };
};

/**
 * No-op function which explicitly returns a never type to avoid any code
 * usage of return values. This is intended to represent functions which
 * should be used to run side effects only, and not return any values.
 */
export const noopFn = () => null as never;

/**
 * Throw an error. Used in tests.
 */
export const panic = () => {
  throw new Error("An invalid match branch case occurred!");
};
