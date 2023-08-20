import { Bodyish } from "../../types/Bodyish";
import { EventEmitter } from "../../utils/EventEmitter/EventEmitter";

const DEFAULT_EASING = Phaser.Math.Easing.Quartic.Out;
type Easing = (v: number) => number;

interface RaisableEvents {
  click: () => void;
  pointerOver: () => void;
  pointerOut: () => void;
}

export class Raisable extends EventEmitter<RaisableEvents> {
  private currentTween?: Phaser.Tweens.Tween;

  constructor(
    private readonly scene: Phaser.Scene,
    private readonly element: Bodyish,
    private readonly hoverDuration: number,
    private readonly initialY: number,
    private readonly hoverYDelta: number,
    private readonly raisingTarget: Bodyish | Phaser.GameObjects.Container = element,
    private readonly easing: Easing = DEFAULT_EASING,
  ) {
    super();

    this.element.setInteractive({
      useHandCursor: true,
    });

    this.element.addListener("pointerup", this.onPointerUp);
    this.element.addListener("pointerover", this.onMouseOver);
    this.element.addListener("pointerout", this.onMouseOut);
  }

  onPointerUp = () => {
    this.emit("click");
  };

  onMouseOver = () => {
    this.currentTween?.stop();

    const hoverPaneY = this.getHoverPaneY();

    const config = {
      targets: this.raisingTarget,
      props: {
        y: {
          value: hoverPaneY,
          duration: (target: { y: number }) => {
            const currentY = Math.abs(hoverPaneY - target.y);
            const frac = currentY / Math.abs(this.initialY - hoverPaneY);
            return frac * this.hoverDuration;
          },
          ease: this.easing,
        },
      },
      repeat: 0,
      yoyo: false,
    };

    this.currentTween = this.scene.tweens.add(config);

    this.emit("pointerOver");
  };

  onMouseOut = () => {
    this.currentTween?.stop();

    const hoverPaneY = this.getHoverPaneY();

    const config = {
      targets: this.raisingTarget,
      props: {
        y: {
          value: this.initialY,
          duration: (target: { y: number }) => {
            const currentY = Math.abs(this.initialY - target.y);
            const frac = currentY / Math.abs(this.initialY - hoverPaneY);
            return frac * this.hoverDuration;
          },
          ease: this.easing,
        },
      },
      repeat: 0,
      yoyo: false,
    };

    this.currentTween = this.scene.tweens.add(config);

    this.emit("pointerOut");
  };

  getHoverPaneY() {
    return this.initialY + this.hoverYDelta;
  }
}
