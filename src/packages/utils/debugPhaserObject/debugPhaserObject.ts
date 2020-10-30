/* eslint-disable @typescript-eslint/no-explicit-any, no-prototype-builtins, no-console */
export const debugPhaserObject = (object: any, key: string) => {
  const w = window as any;

  if (w.hasOwnProperty(key)) {
    console.error(`Debug key: ${key} has been already used.`);
  }

  w[key] = object;
};
