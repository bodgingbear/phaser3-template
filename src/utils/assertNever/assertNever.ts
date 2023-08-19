export const assertNever = (val: never): never => {
  throw new Error(`Unexpected value: ${val}`);
};
