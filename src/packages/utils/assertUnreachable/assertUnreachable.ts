/* eslint-disable @typescript-eslint/no-unused-vars */
// @ts-ignore
export const assertUnreachable = (x: never): never => {
  throw new Error("Didn't expect to get here");
};
/* eslint-enable @typescript-eslint/no-unused-vars */
