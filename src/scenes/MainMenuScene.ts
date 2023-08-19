import { TextButton } from "../components/TextButton/TextButton";
import { centerElement } from "../utils/centerElement/centerElement";

export class MainMenuScene extends Phaser.Scene {
  public constructor() {
    super({
      key: "MainMenuScene",
    });
  }

  public create(): void {
    const vid = this.add.video(1280 / 2, 720 / 2, "demo");
    vid.play(true);
    vid.setScale(0.9);
    vid.setAlpha(0.75);

    const text = this.add
      .text(1280 / 2, 64, "Phaser 3 Template", {
        fontSize: "48px",
        color: "#fff",
        align: "center",
      })
      .setLineSpacing(10);

    centerElement(text);

    const pressSpaceButton = this.add
      .text(1280 / 2, 720 - 32 - 32, "Press SPACE to start", {
        fontSize: "24px",
        color: "#fff",
        align: "center",
      })
      .setLineSpacing(10);

    pressSpaceButton.setOrigin(0.5, 0.5);

    this.input.keyboard!.addKey("SPACE").on("down", (): void => {
      this.scene.start("GameScene");
    });

    const howToPlayButton = new TextButton(this, 32, 720 - 32, "How to play", {
      originX: 0,
      originY: 1,
    });
    howToPlayButton.on("click", () => this.scene.start("HowToPlayScene"));

    const creditsButton = new TextButton(this, 1280 - 32, 720 - 32, "Credits", {
      originX: 1,
      originY: 1,
    });
    creditsButton.on("click", () => this.scene.start("CreditsScene"));
  }
}
