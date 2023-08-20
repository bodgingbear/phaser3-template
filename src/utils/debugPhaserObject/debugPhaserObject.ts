/* eslint-disable @typescript-eslint/no-explicit-any */
export const debugPhaserObject = (object: any, key: string) => {
  const w = window as any;

  if (Object.hasOwn(w, key)) {
    console.error(`Debug key: ${key} has been already used.`);
  }

  w[key] = object;
};
