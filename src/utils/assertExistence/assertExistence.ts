export const assertExistence = <T>(val: T | undefined | null): asserts val is T => {
  if (val === undefined || val === null) {
    throw new Error(`Passed value "${val}" was nullable.`);
  }
};
