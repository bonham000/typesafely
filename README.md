# RustScript

TypeScript types (`Result`, `Option`, and `AsyncResult`) designed to emulate Rust types and patterns.

```ts
type CalculationResult = Result<CalculationOk, CalculationError>;

// Return a Result from a calculation which may fail
const performCalculationSafely = (): CalculationResult => {
  try {
    const data = handleCalculation();
    return Ok(data);
  } catch (e) {
    return Err(e.message);
  }
};

// The data variable is now a Result type which must be either Ok or Err
const data: CalculationResult = performCalculationSafely();

// Now pass data to the matchResult function and explicitly handle each state:
matchResult(data, {
  ok: (x) => x,
  err: (e) => e,
});
```

## Usage

This library provides three high level types:

```
Option
Result
AsyncResult
```

The `Option` and `Result` types are modeled after the same types in Rust. The `AsyncResult` type is like a `Result` but includes an additional state to represent "loading" and is intended to be used for data which is produced asynchronously.

In addition to these type primitives, there are three 'match' functions which can be used to match against these types to define specific code logic for each possible variant state. Each of these types also includes `unwrap` and `unwrapOr` functions. Like in Rust, `unwrap` will "panic" if a type was not in an "Ok" state.

### Option Type

```ts
// Create a Some Option variant and pass it to a match statement
const opt: Option<number> = Some(900);

// The some branch will run and x will be 900
matchOption(opt, {
  some: (x) => console.log("[Some variant]:", x),
  none: () => console.log("[None variant]"),
});

// Create a None Option variant and pass it to a match statement
const opt: Option<number> = None();

// The none branch will run:
matchOption(opt, {
  some: (x) => console.log("[Some variant]:", x),
  none: () => console.log("[None variant]"),
});
```

### Result Type

```ts
// Create an Ok Result variant and pass it to a match statement
const result: Result<number, string> = Ok(100);

// The ok branch will run and x will be 100:
matchResult(result, {
  ok: (x) => console.log("[Ok variant]:", x),
  err: (e) => console.log("[Err variant]:", e),
});

// Create an Ok Result variant and pass it to a match statement
const err: Result<number, string> = Err("Error");

// The err branch will run and e will be "Error"
matchResult(result, {
  ok: (x) => console.log("[Ok variant]:", x),
  err: (e) => console.log("[Err variant]:", e),
});
```

### AsyncResult Type

The `AsyncResult` is similar to the `Result` type but includes another variant to represent loading state. This is especially useful for modelling asynchronously fetched data and provides strong guarantees you are handling the appropriate state of the response. No need to independently set and update loading/error/response states, which is error prone. No need to write out fragile logic like `!loading && !response` to check for error states.

## Motivation

The main idea behind this approach is twofold and similar to the [rationale for the similar design in Rust](https://learning-rust.github.io/docs/e3.option_and_result.html):

- `Result` types can be used to model values which may represent an error state and avoid throwing and catching errors (which is difficult to type-check correctly in TypeScript). A `Result` makes it explicitly that a function may result in an error state, which calling code must handle.
- `Option` types can be used to model values which may be in a present or absent state, which otherwise in JS/TS are usually modeled with `null` or `undefined`. An `Option` makes this presence or absence more explicit and avoids issues like `0 == false` `"" == false"` etc.

For instance, imagine you have some value which is declared but not initialized yet.

```ts
const value: number = null;
// Somewhere else:
value = 50;
```

Later you want to check if the value is initialized and then run some other code:

```ts
if (!!value) {
  // Run some other code which expects value to be defined
}
```

But what if actually, some other code had already set this value to be `0`? Then your `!!value` check would result in `false` and your code wouldn't run.

This is a simple example but a common pitfall and one which TypeScript can't easily protect against. Consider instead this:

```ts
const value: Option<number> = None();

matchOption(value, {
  some: (x) => x, // Handle non-empty case
  none: () => null, // Handle empty case
});
```

This code avoids the above issues completely.
