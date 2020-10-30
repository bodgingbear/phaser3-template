/* eslint-disable spaced-comment, import/no-default-export */
/// <reference types="phaser" />

declare namespace NodeJS {
  interface ProcessEnv {
    readonly NODE_ENV: 'development' | 'production' | 'test';
    readonly SKIP_INTRO?: 'true' | 'false';
  }
}

declare module '*.md' {
  const src: string;
  export default src;
}

declare module '*.png';
declare module '*.jpeg';
declare module '*.jpg' {
  const src: string;
  export default src;
}
declare module '*.gif';
declare module '*.svg' {
  const src: string;
  export default src;
}
declare module '*.mp3';
declare module '*.mp4' {
  const src: string;
  export default src;
}

declare module '*.module.scss' {
  const src: { [key: string]: string };
  export default src;
}
declare module '*.module.sass' {
  const src: { [key: string]: string };
  export default src;
}
