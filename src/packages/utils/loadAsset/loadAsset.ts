// eslint-disable-next-line global-require, import/no-dynamic-require
export const loadAsset = (url: string) =>
  require(`../../../../assets/${url}`).default;
