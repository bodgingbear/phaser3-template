import { EventEmitter } from "../../utils/EventEmitter/EventEmitter";

interface DefaultButtonEvents {
  click: () => void;
}

type Styles = {
  buttonColor: number;
  buttonColorAlpha: number;
  hoverButtonColor: number;
  hoverButtonColorAlpha: number;
  borderColor: number;
  hoverBorderColor: number;
  hoverTextColor: number;
  borderStrokeWidth: number;
  textColor: number;
  fontFamily: string;
  fontSize: string | number;
  fontStyle?: string;
  backgroundColor?: string;
  stroke?: string;
  strokeThickness?: number;
  shadow?: Phaser.Types.GameObjects.Text.TextShadow;
  padding?: Phaser.Types.GameObjects.Text.TextPadding;
  align?: string;
  maxLines?: integer;
  fixedWidth?: number;
  fixedHeight?: number;
  resolution?: number;
  rtl?: boolean;
  testString?: string;
  baselineX?: number;
  baselineY?: number;
  wordWrap?: Phaser.Types.GameObjects.Text.TextWordWrap;
  metrics?: Phaser.Types.GameObjects.Text.TextMetrics;
};

export type StylesOptions = Partial<Styles>;

const hexColorToString = (hex: number) => `#${hex.toString(16)}`;

const getStyles = (styles: StylesOptions = {}): Styles => ({
  fontSize: 16,
  fontFamily: "'Press Start 2P'",
  buttonColor: 0xffffff,
  buttonColorAlpha: 0,
  hoverButtonColor: 0xffffff,
  hoverButtonColorAlpha: 1,
  borderColor: 0xffffff,
  hoverBorderColor: 0xffffff,
  textColor: 0xffffff,
  hoverTextColor: 0x000000,
  borderStrokeWidth: 4,
  ...styles,
});

export type ButtonOptions = Partial<{
  styles: StylesOptions;
  disabled: boolean;
  uppercase: boolean;
  fixedWidth: number;
  fixedHeight: number;
  paddingX: number;
  paddingY: number;
  originX: number;
  originY: number;
}>;

export class TextButton extends EventEmitter<DefaultButtonEvents> {
  private text: Phaser.GameObjects.Text;

  private depth: number = 10;

  private rect: Phaser.GameObjects.Rectangle;

  private clickStart: boolean = false;

  private interactionsDisabled: boolean = false;

  static readonly paddingX = 24;

  static readonly paddingY = 16;

  constructor(
    private readonly scene: Phaser.Scene,
    private x: number,
    private y: number,
    readonly buttonText: string,
    private buttonOptions: ButtonOptions = {
      styles: {},
      disabled: false,
      uppercase: true,
    },
  ) {
    super();
    this.text = this.scene.add.text(0, 0, "");
    this.rect = this.scene.add.rectangle();

    this.setDisabled(this.buttonOptions.disabled ?? false);
    this.setLabel(buttonText);
  }

  public setLabel = (label: string) => {
    const uppercase = this.buttonOptions.uppercase ?? true;
    this.text.setText(uppercase ? label.toUpperCase() : label);
    this.applyStyle();
  };

  public setStyle(newStyles: StylesOptions) {
    this.buttonOptions.styles = {
      ...this.buttonOptions.styles,
      ...newStyles,
    };

    this.applyStyle();
  }

  private applyStyle() {
    this.text.setStyle(getStyles(this.buttonOptions.styles));
    this.updateSize();

    const { buttonColor, borderColor, textColor, buttonColorAlpha, borderStrokeWidth } = getStyles(
      this.buttonOptions.styles,
    );
    this.updateButtonStyles(buttonColor, borderColor, textColor, buttonColorAlpha, borderStrokeWidth);
  }

  public setPosition = (x: number, y: number) => {
    const originX = this.buttonOptions.originX ?? 0.5;
    const originY = this.buttonOptions.originY ?? 0.5;

    this.rect.setPosition(
      x + this.rect.displayWidth / 2 - this.rect.displayWidth * originX,
      y + this.rect.displayHeight / 2 - this.rect.displayHeight * originY,
    );

    this.text.setPosition(this.rect.x - this.text.displayWidth / 2, this.rect.y - this.text.displayHeight / 2);

    this.setDepth(this.depth);

    this.x = x;
    this.y = y;
  };

  private updateSize = () => {
    const paddingY = this.buttonOptions.paddingY ?? TextButton.paddingY;
    const paddingX = this.buttonOptions.paddingX ?? TextButton.paddingX;
    const { fixedWidth, fixedHeight } = this.buttonOptions;
    const { buttonColor } = getStyles(this.buttonOptions.styles);

    this.rect.destroy();
    this.rect = this.scene.add.rectangle(
      0,
      0,
      fixedWidth ?? this.text.displayWidth + paddingX * 2,
      fixedHeight ?? this.text.displayHeight + paddingY * 2,
      buttonColor,
    );

    this.rect.setStrokeStyle(2, 0x000000);

    this.setPosition(this.x, this.y);

    if (!this.interactionsDisabled) {
      this.setupListeners();
    }
  };

  private setupListeners = () => {
    this.rect.setInteractive({
      useHandCursor: true,
    });

    this.rect.on("pointerdown", this.onPointerDown);
    this.rect.on("pointerup", this.onPointerUp);
    this.rect.on("pointerover", this.onMouseOver);
    this.rect.on("pointerout", this.onMouseOut);
  };

  private onPointerDown = () => {
    this.clickStart = true;
  };

  private onPointerUp = () => {
    if (this.clickStart) {
      this.emit("click");
    }
    this.clickStart = false;
  };

  private onMouseOver = () => {
    const { hoverButtonColor, hoverBorderColor, hoverTextColor, hoverButtonColorAlpha, borderStrokeWidth } = getStyles(
      this.buttonOptions.styles,
    );

    this.updateButtonStyles(
      hoverButtonColor,
      hoverBorderColor,
      hoverTextColor,
      hoverButtonColorAlpha,
      borderStrokeWidth,
    );
  };

  private onMouseOut = () => {
    const { buttonColor, borderColor, textColor, buttonColorAlpha, borderStrokeWidth } = getStyles(
      this.buttonOptions.styles,
    );
    this.updateButtonStyles(buttonColor, borderColor, textColor, buttonColorAlpha, borderStrokeWidth);
  };

  private updateButtonStyles(
    buttonColor: number,
    borderColor: number,
    textColor: number,
    buttonColorAlpha: number,
    strokeWidth: number,
  ) {
    this.rect.setFillStyle(buttonColor, buttonColorAlpha);
    this.rect.setStrokeStyle(strokeWidth, borderColor);
    this.text.setColor(hexColorToString(textColor));
  }

  public setDisabled(disabled: boolean) {
    if (!disabled) {
      this.onMouseOut();
      this.rect.setInteractive();
    } else {
      this.rect.setFillStyle(0xcccccc);
      this.rect.setStrokeStyle(2, 0x8c8c8c);
      this.text.setColor("#8c8c8c");
      this.rect.disableInteractive();
    }
  }

  public setVisible(visible: boolean) {
    this.rect.setVisible(visible);
    this.text.setVisible(visible);
  }

  public getVisible() {
    return this.text.visible;
  }

  public setDepth(depth: number) {
    this.depth = depth;
    this.rect.setDepth(this.depth);
    this.text.setDepth(this.depth + 1);
  }

  public resetHover() {
    this.onMouseOut();
  }

  public disableInteractions() {
    this.rect.disableInteractive();
    this.interactionsDisabled = true;
  }

  public getDimensions(): { height: number; width: number } {
    return {
      height: this.rect.displayHeight,
      width: this.rect.displayWidth,
    };
  }
}
