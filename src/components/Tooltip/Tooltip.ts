import { Bodyish } from "../../types/Bodyish";
import { getAbsolutePosition } from "../../utils/getAbsolutePosition/getAbsolutePosition";
import { TextButton } from "../TextButton/TextButton";

export class Tooltip {
  private readonly textButton: TextButton;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly element: Bodyish,
    private readonly spriteText: string,
    private readonly offsetY: number,
    readonly styles: object = {},
    readonly setInteractive: boolean = true,
    private disabled: boolean = false,
  ) {
    this.textButton = new TextButton(this.scene, 1920 / 2, 100 + Math.random() * 400, this.spriteText, {
      styles: {
        buttonColor: 0x000000,
        textColor: 0xffffff,
        fontSize: 28,
      },
      paddingY: 8,
    });
    this.textButton.disableInteractions();

    if (setInteractive) {
      this.element.setInteractive();
    }

    this.element.addListener("pointerover", this.show);
    this.element.addListener("pointerout", this.hide);

    this.setPositions();
    this.hide();
  }

  private setPositions() {
    const { y, x } = getAbsolutePosition(this.element);

    const elementTop = y - this.element.displayHeight * this.element.originY;

    this.textButton.setPosition(x, elementTop - this.offsetY - this.textButton.getDimensions().height / 2);
  }

  public setDisabled = (disabled: boolean) => {
    this.disabled = disabled;
  };

  public show = () => {
    if (this.disabled) {
      return;
    }

    this.setPositions();
    this.textButton.setVisible(true);
  };

  public hide = () => {
    if (this.disabled) {
      return;
    }

    this.setPositions();
    this.textButton.setVisible(false);
  };

  public setText = (newText: string) => {
    this.textButton.setLabel(newText);

    if (this.textButton.getVisible()) {
      this.setPositions();
    } else {
      this.hide();
    }
  };
}
