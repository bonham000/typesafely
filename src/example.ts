import {
  AsyncErr,
  AsyncOk,
  AsyncResult,
  AsyncResultLoading,
  matchAsyncResult,
} from "./main";

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

const example = async () => {
  console.log("\nRunning example code for AsyncResult:");

  let result: AsyncResult<Data, ErrorResponse> = AsyncResultLoading();
  console.log("\nChecking AsyncResultLoading variant:");
  matchResult(result);

  console.log("\nChecking AsyncOk variant:");
  const data: Data = {
    id: "asd7-f8as089df70a9s7dfs0a",
    name: "Enigma",
  };
  result = await Promise.resolve(AsyncOk(data));
  matchResult(result);

  console.log("\nChecking AsyncErr variant:");
  const err: ErrorResponse = {
    code: 100,
    message: "Failed to fetch data",
  };
  result = await Promise.resolve(AsyncErr(err));
  matchResult(result);

  console.log("\nDone.\n");
};

example();
