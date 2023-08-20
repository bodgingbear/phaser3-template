import { TEAM } from "../constants";
import { FontFile } from "../components/FontFile/FontFile";
import { loadAsset } from "../utils/loadAsset/loadAsset";
import { shouldSkipIntro } from "../utils/shouldSkipIntro/shouldSkipIntro";

export class LoadingScene extends Phaser.Scene {
  private introImage!: Phaser.GameObjects.Sprite;

  private timesLooped = 0;

  private animStopped = false;

  public constructor() {
    super({
      key: "LoadingScene",
    });
  }

  private loadAssets() {
    // Assets go here
    this.load.video("demo", loadAsset("videos/demo.mp4"), true);

    this.load.addFile(
      new FontFile(this.load, "Press Start 2P", {
        custom: ["Courier", "Press Start 2P"],
      }),
    );
  }

  public preload(): void {
    if (!shouldSkipIntro()) {
      this.showLoadingAnimation();
    }

    this.loadAssets();
    this.loadCreditsAssets();
  }

  public create(): void {}

  public update(): void {
    if (shouldSkipIntro()) {
      this.changeScene();
      return;
    }

    if (!this.animStopped && this.timesLooped > 2) {
      this.playEndingAnimation();
    }
  }

  private showLoadingAnimation = () => {
    this.introImage = this.add.sprite(0, 0, "intro", 11);
    this.introImage.setOrigin(0, 0);
    this.introImage.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.introImage.anims.play("intro-start");
    this.introImage.anims.chain("intro-loop");

    this.introImage.on("animationrepeat", (animation: Phaser.Animations.Animation): void => {
      if (animation.key === "intro-loop") {
        this.timesLooped += 1;
      }
    });
  };

  private playEndingAnimation = () => {
    this.animStopped = true;
    this.introImage.anims.stop();
    this.introImage.anims.playReverse("intro-start");
    this.introImage.on("animationcomplete", this.changeScene);
  };

  private loadCreditsAssets = () => {
    this.load.image("credits_logo", loadAsset("images/credits/logo.png"));
    this.load.image("credits_logo_hover", loadAsset("images/credits/logo_outline.png"));
    this.load.image("credits_background", loadAsset("images/credits/gradient.png"));
    for (const { imageKey, imagePath } of TEAM) {
      this.load.image(imageKey, loadAsset(imagePath));
    }
  };

  private changeScene = () => {
    this.scene.start("MainMenuScene");
  };
}
