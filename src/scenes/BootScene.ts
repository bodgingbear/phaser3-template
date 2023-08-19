import { loadAsset } from "../utils/loadAsset/loadAsset";

export class BootScene extends Phaser.Scene {
  public constructor() {
    super({
      key: "BootScene",
    });
  }

  public preload(): void {
    this.load.spritesheet("intro", loadAsset("images/intro.png"), {
      frameWidth: 78,
      frameHeight: 44,
    });
  }

  public create(): void {
    this.anims.create({
      key: "intro-start",
      frames: this.anims.generateFrameNumbers("intro", {
        first: 0,
        start: 0,
        end: 9,
      }),
      frameRate: 9,
      repeat: 0,
    });

    this.anims.create({
      key: "intro-loop",
      frames: this.anims.generateFrameNumbers("intro", {
        start: 10,
        end: -1,
      }),
      frameRate: 3,
      repeat: -1,
    });

    this.scene.start("LoadingScene");
  }
}
