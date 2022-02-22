# RustScript

TypeScript types (`Result`, `Option`, and `AsyncResult`) designed to emulate Rust types and patterns.

```ts
// Example: data is now a Result type which must exist in the Ok or Err state
const data: Result<CalculationOk, CalculationError> = performCalculation();
```

## Motivation

The main idea behind this approach is twofold:

- `Result` types can be used to model values which may represent an error state and avoid throwing and catching errors (which is difficult to type-check correctly in TypeScript). A `Result` makes it explicitly that a function may result in an error state, which calling code must handle.
- `Option` types can be used to model values which may be in a present or absent state, which otherwise in JS/TS are usually modeled with `null` or `undefined`. An `Option` makes this presence or absence more explicit and avoids issues like `0 == false` `"" == false"` etc.

## Usage

This library provides three high level types `Result`, `AsyncResult`, and `Option`. The `Result` and `Option` type are modeled after the same types in Rust. The `AsyncResult` type is like a `Result` but includes an additional state to represent "loading" and is intended to be used for data which is produced asynchronously.

For instance, imagine you have some value which is declared but not initialized yet.

```ts
const value: number = null;

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

Here is some example code using the `AsyncResult` type. All of this code type checks and it's not possible to interact with an unexpected variant unless you explicitly opt-out of TypeScript's type safety.

This code is also in the `src/example.ts` file which you can alter and run with the `yarn example` command.

```ts
interface Data {
  id: string;
  name: string;
}

interface ErrorResponse {
  code: number;
  message: string;
}

const matchResult = (result: AsyncResult<Data, ErrorResponse>) => {
  matchAsyncResult(result, {
    ok: (x) => console.log("[Ok variant]:", x),
    err: (e) => console.log("[Err variant]:", e),
    loading: () => console.log("[Loading variant]: loading..."),
  });
};

let result: AsyncResult<Data, ErrorResponse> = AsyncResultLoading();
matchResult(result); // -> Results in loading branch running

const data: Data = {
  id: "asd7-f8as089df70a9s7dfs0a",
  name: "Enigma",
};
result = await Promise.resolve(AsyncOk(data));
matchResult(result); // -> Results in ok branch running

const err: ErrorResponse = {
  code: 100,
  message: "Failed to fetch data",
};
result = await Promise.resolve(AsyncErr(err));
matchResult(result); // -> Results in err branch running
```
