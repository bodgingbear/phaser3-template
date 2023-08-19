export const bound = (min: number, max: number, value: number) => {
  if (min > max) {
    throw new Error("Min cannot be greater then max");
  }

  return Math.min(Math.max(min, value), max);
};
