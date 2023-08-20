type Frame = string | integer;

export class Button extends Phaser.GameObjects.Sprite {
  private hovered = false;

  private defaultFrame: Frame;

  private buttonActive = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    texture: string,
    defaultFrame: Frame,
    private hoverFrame: Frame,
    interactive?: object,
  ) {
    super(scene, x, y, texture, defaultFrame);
    this.defaultFrame = defaultFrame;

    this.setInteractive({
      useHandCursor: true,
      pixelPerfect: true,
      ...interactive,
    });

    this.on("pointerover", this.onMouseOver);
    this.on("pointerout", this.onMouseOut);
  }

  private onMouseOver = () => {
    if (this.buttonActive) {
      this.setFrame(this.hoverFrame);
      this.hovered = true;
    }
  };

  private onMouseOut = () => {
    if (this.buttonActive) {
      this.setFrame(this.defaultFrame);
      this.hovered = false;
    }
  };

  public setFrames = (defaultFrame: Frame, hoverFrame?: Frame) => {
    this.defaultFrame = defaultFrame;

    if (hoverFrame) {
      this.hoverFrame = hoverFrame;
    }
  };

  public setTexture = (texture: string): this => {
    super.setTexture(texture, this.hovered ? this.hoverFrame : this.defaultFrame);

    return this;
  };

  public setButtonActive = (active: boolean) => {
    this.buttonActive = active;
  };

  public resetHover = () => {
    this.setFrame(this.defaultFrame);
    this.hovered = false;
  };
}
