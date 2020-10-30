export const createAnimation = (
  key: string,
  frames: number,
  frameBaseName?: string,
  config?: Phaser.Animations.Animation,
  // @ts-ignore
): Phaser.Animations.Animation => (
  {
    key,
    frames: new Array(frames)
      .fill(null)
      .map(
        (_: null, i: number): Phaser.Animations.AnimationFrame => ({
          key: `${frameBaseName || key}${i}`,
          // @ts-ignore
          frame: 0,
        }),
      ),
    frameRate: 8,
    repeat: -1,
    ...config,
  }
);
