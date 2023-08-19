import { ButtonOptions, TextButton } from "../TextButton/TextButton";

const BLACKLISTED_SCENES = ["LoadingScene"];
const START_SCENE = "GameScene";

type Scenes = {
  [key: string]: Phaser.Scene;
};

export class ResetButton {
  private button: TextButton;

  constructor(
    private scene: Phaser.Scene,
    x: number,
    y: number,
    private startScene = START_SCENE,
    buttonText = "Reset",
    buttonOptions: ButtonOptions = {},
  ) {
    this.button = new TextButton(this.scene, x, y, buttonText, buttonOptions);

    this.button.on("click", this.reset);
  }

  reset = () => {
    const scenes = this.scene.scene.manager.keys as Scenes;

    Object.entries(scenes)
      .filter(([key]) => !BLACKLISTED_SCENES.includes(key))
      .forEach(([, scene]) => scene.scene.stop());

    this.scene.scene.start(this.startScene, { restart: true });
  };
}
