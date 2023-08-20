export const loadAsset = (url: string) => new URL(`../../../assets/${url}`, import.meta.url).href;
