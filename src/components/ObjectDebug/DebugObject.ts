import { bound } from "../../utils/bound/bound";
import { Draggable } from "../Draggable/Draggable";
import type { KeysConfig } from "./types";

const VERTICAL_HANDLE_HEIGHT = 24;
const ORIGIN_DISPLAY_RESOLUTION = 3;
const DEBUG_TEXT_OFFSET = 8;

const rgbaToHex = (r: number, g: number, b: number, a: number = 1) => {
  const rHex = r.toString(16);
  const gHex = g.toString(16);
  const bHex = b.toString(16);
  const aHex = Math.round(a * 255).toString(16);

  // eslint-disable-next-line prefer-template
  return "#" + rHex + gHex + bHex + aHex;
};

type ObjectTypes = Phaser.GameObjects.Zone | Phaser.GameObjects.Rectangle | Phaser.GameObjects.Sprite;

const SELECTED_ALPHA = 0.2;
const UNSELECTED_ALPHA = 0.1;

export class DebugObject {
  private rectangle?: Phaser.GameObjects.Rectangle;

  private verticalHandle?: Phaser.GameObjects.Rectangle;

  private horizontalHandle?: Phaser.GameObjects.Rectangle;

  private bothHandle?: Phaser.GameObjects.Rectangle;

  private rectangleDraggable?: Draggable;

  private verticalHandleDraggable?: Draggable;

  private horizontalHandleDraggable?: Draggable;

  private bothHandleDraggable?: Draggable;

  private altKey?: Phaser.Input.Keyboard.Key;

  private shiftKey?: Phaser.Input.Keyboard.Key;

  private toggleKey?: Phaser.Input.Keyboard.Key;

  private printKey?: Phaser.Input.Keyboard.Key;

  private textKey?: Phaser.Input.Keyboard.Key;

  private originPoint?: Phaser.GameObjects.Arc;

  private originDraggable?: Draggable;

  private text?: Phaser.GameObjects.Text;

  private dragging: boolean = false;

  private selected: boolean = false;

  constructor(
    private readonly scene: Phaser.Scene,
    private object: ObjectTypes,
    { toggle: toggleKeyString, print: printKeyString, text: textKeyString }: KeysConfig,
    private debugObjects: DebugObject[],
    x: number,
    y: number,
    private initialWidth: number,
    private initialHeight: number,
    private originX: number,
    private originY: number,
  ) {
    this.rectangle = this.scene.add.rectangle(x, y, initialWidth, initialHeight, 0x00ff00, UNSELECTED_ALPHA);
    this.rectangle.setOrigin(originX, originY);

    this.verticalHandle = this.scene.add.rectangle(
      x,
      this.getVerticalHandleY(y),
      initialWidth,
      VERTICAL_HANDLE_HEIGHT,
      0xff0000,
      0.2,
    );
    this.horizontalHandle = this.scene.add.rectangle(
      this.getHorizontalHandleX(x),
      y,
      VERTICAL_HANDLE_HEIGHT,
      initialHeight,
      0x0000ff,
      0.2,
    );
    this.bothHandle = this.scene.add.rectangle(
      this.getHorizontalHandleX(x),
      this.getVerticalHandleY(y),
      VERTICAL_HANDLE_HEIGHT,
      VERTICAL_HANDLE_HEIGHT,
      0x0000ff,
      1,
    );

    this.verticalHandle.setOrigin(originX, originY);
    this.horizontalHandle.setOrigin(originX, originY);
    this.bothHandle.setOrigin(originX, originY);

    this.rectangleDraggable = new Draggable(this.scene, this.rectangle, undefined, false, {
      grab: "all-scroll",
      grabbing: "all-scroll",
    });
    this.rectangleDraggable.addListener("drag", this.onDrag);
    this.rectangleDraggable.addListener("dragstart", this.onDragStart);
    this.rectangleDraggable.addListener("dragend", this.onDragEnd);

    this.verticalHandleDraggable = new Draggable(this.scene, this.verticalHandle, undefined, false, {
      grab: "ns-resize",
      grabbing: "ns-resize",
    });
    this.verticalHandleDraggable.addListener("drag", this.onVerticalResizeDrag);

    this.horizontalHandleDraggable = new Draggable(this.scene, this.horizontalHandle, undefined, false, {
      grab: "ew-resize",
      grabbing: "ew-resize",
    });
    this.horizontalHandleDraggable.addListener("drag", this.onHorizontalResizeDrag);

    this.bothHandleDraggable = new Draggable(this.scene, this.bothHandle, undefined, false, {
      grab: "nwse-resize",
      grabbing: "nwse-resize",
    });
    this.bothHandleDraggable.addListener("drag", this.onBothResizeDrag);

    this.text = this.scene.add.text(0, 0, "", {
      color: "black",
      backgroundColor: rgbaToHex(255, 255, 255, 0.5),
    });

    this.originPoint = this.scene.add.circle(0, 0, 6, 0xff0000, 1);
    this.updateOriginPointPosition();

    this.originDraggable = new Draggable(this.scene, this.originPoint);
    this.originDraggable.addListener("drag", this.onOriginPointDrag);
    this.originDraggable.addListener("dragend", this.onOriginPointDragEnd);
    this.originDraggable.addListener("click", this.onOriginPointClick);

    this.shiftKey = this.scene.input.keyboard!.addKey("SHIFT");

    this.altKey = this.scene.input.keyboard!.addKey("ALT");
    this.altKey.on("up", this.onOrigin00ResizeStart);
    this.altKey.on("down", this.onOrigin00ResizeEnd);

    this.toggleKey = this.scene.input.keyboard!.addKey(toggleKeyString);
    this.toggleKey.on("up", this.toggle);

    this.printKey = this.scene.input.keyboard!.addKey(printKeyString);
    this.printKey.on("up", this.print);

    this.textKey = this.scene.input.keyboard!.addKey(textKeyString);
    this.textKey.on("up", this.toggleTextOverlay);

    this.onOrigin00ResizeStart();
    this.drawTextInfo();

    this.setKeyboardControls();
  }

  private setKeyboardControls = () => {
    const arrows = this.scene.input.keyboard!.addKeys(
      {
        up: "up",
        down: "down",
        left: "left",
        right: "right",
      },
      undefined,
      true,
    ) as {
      up: Phaser.Input.Keyboard.Key;
      down: Phaser.Input.Keyboard.Key;
      left: Phaser.Input.Keyboard.Key;
      right: Phaser.Input.Keyboard.Key;
    };

    const onChange = (x: -1 | 0 | 1, y: -1 | 0 | 1) => () => {
      if (!this.selected) {
        return;
      }

      const changeModifier = this.shiftKey?.isDown ? 10 : 1;
      const resize = this.altKey?.isDown;

      if (resize) {
        this.onOrigin00ResizeStart();
        const newWidth = this.object.displayWidth + changeModifier * x;
        const newHeight = this.object.displayHeight + changeModifier * y;
        this.rectangle?.setDisplaySize(newWidth, newHeight);
        this.object?.setDisplaySize(newWidth, newHeight);
        this.onOrigin00ResizeEnd();

        this.updateHandlesPositions();
        this.updateOriginPointPosition();
        this.drawTextInfo();
      } else {
        this.onDrag(new Phaser.Math.Vector2(this.object.x + x * changeModifier, this.object.y + y * changeModifier));
      }
    };

    arrows.up.on("down", onChange(0, -1));
    arrows.down.on("down", onChange(0, 1));
    arrows.left.on("down", onChange(-1, 0));
    arrows.right.on("down", onChange(1, 0));
  };

  private getElementsList = () => {
    return [this.rectangle, this.verticalHandle, this.bothHandle, this.horizontalHandle, this.text, this.originPoint];
  };

  private disable = () => {
    const list = this.getElementsList();

    list.forEach((el) => {
      el?.disableInteractive();
      el?.setVisible(false);
    });
  };

  private enable = () => {
    const list = this.getElementsList();

    list.forEach((el) => {
      el?.setInteractive();
      el?.setVisible(true);
    });
  };

  private toggle = () => {
    if (this.rectangle?.visible) {
      this.disable();
    } else {
      this.enable();
    }
  };

  private onDrag = ({ x, y }: Phaser.Math.Vector2) => {
    this.rectangle?.setPosition(x, y);
    this.verticalHandle?.setPosition(x, this.getVerticalHandleY(y));
    this.horizontalHandle?.setPosition(this.getHorizontalHandleX(x), y);
    this.bothHandle?.setPosition(this.getHorizontalHandleX(x), this.getVerticalHandleY(y));
    this.object?.setPosition(x, y);
    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private onDragStart = () => {
    this.dragging = true;
    this.setSelected(true);
  };

  private onDragEnd = () => {
    this.dragging = false;
  };

  private onOriginPointDrag = ({ x, y }: Phaser.Math.Vector2) => {
    this.setSelected(true);
    const left = this.object.x - this.object.displayWidth * this.object.originX;
    const right = this.object.x + this.object.displayWidth * (1 - this.object.originX);
    const top = this.object.y - this.object.displayHeight * this.object.originY;
    const bottom = this.object.y + this.object.displayHeight * (1 - this.object.originY);

    const boundedX = bound(left, right, x);
    const boundedY = bound(top, bottom, y);
    this.originPoint?.setPosition(boundedX, boundedY);

    const tmpOriginX = (boundedX - left) / this.object.displayWidth;
    const tmpOriginY = (boundedY - top) / this.object.displayHeight;

    this.drawTextInfo(tmpOriginX, tmpOriginY);
  };

  private onOriginPointDragEnd = () => {
    const { x, y } = this.originPoint ?? { x: 0, y: 0 };
    const left = this.object.x - this.object.displayWidth * this.object.originX;
    const top = this.object.y - this.object.displayHeight * this.object.originY;

    this.originX = (x - left) / this.object.displayWidth;
    this.originY = (y - top) / this.object.displayHeight;
  };

  private onOriginPointClick = () => {
    this.setSelected(true);
    this.originX = 0.5;
    this.originY = 0.5;
    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private onHorizontalResizeDrag = ({ x }: { x: number }) => {
    this.setSelected(true);
    const aspectRatio = this.object.displayHeight / this.object.displayWidth;
    const keepAspectRatio = this.shiftKey?.isDown;

    const newWidth = x - this.object.x + this.object.displayWidth * this.object.originX + VERTICAL_HANDLE_HEIGHT;
    const newHeight = keepAspectRatio ? newWidth * aspectRatio : this.object.displayHeight;

    this.rectangle?.setDisplaySize(newWidth, newHeight);
    this.object?.setDisplaySize(newWidth, newHeight);

    this.updateHandlesPositions();

    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private onOrigin00ResizeStart = () => {
    if (this.dragging && this.selected) return;

    const x = this.object.x - this.object.displayWidth * this.object.originX;
    const y = this.object.y - this.object.displayHeight * this.object.originY;

    this.object.setOrigin(0, 0);
    this.rectangle?.setOrigin(0, 0);
    this.verticalHandle?.setOrigin(0, 0);
    this.horizontalHandle?.setOrigin(0, 0);
    this.bothHandle?.setOrigin(0, 0);

    this.rectangle?.setPosition(x, y);
    this.object?.setPosition(x, y);
    this.verticalHandle?.setPosition(x, this.getVerticalHandleY(y));
    this.horizontalHandle?.setPosition(this.getHorizontalHandleX(x), y);
    this.bothHandle?.setPosition(this.getHorizontalHandleX(x), this.getVerticalHandleY(y));
    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private onOrigin00ResizeEnd = () => {
    if (this.dragging && this.selected) return;

    const x = this.object.x + this.object.displayWidth * this.originX;
    const y = this.object.y + this.object.displayHeight * this.originY;

    this.object.setOrigin(this.originX, this.originY);
    this.rectangle?.setOrigin(this.originX, this.originY);
    this.verticalHandle?.setOrigin(this.originX, this.originY);
    this.horizontalHandle?.setOrigin(this.originX, this.originY);
    this.bothHandle?.setOrigin(this.originX, this.originY);

    this.rectangle?.setPosition(x, y);
    this.object?.setPosition(x, y);
    this.verticalHandle?.setPosition(x, this.getVerticalHandleY(y));
    this.horizontalHandle?.setPosition(this.getHorizontalHandleX(x), y);
    this.bothHandle?.setPosition(this.getHorizontalHandleX(x), this.getVerticalHandleY(y));
    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private onVerticalResizeDrag = ({ y }: { y: number }) => {
    this.setSelected(true);
    const aspectRatio = this.object.displayWidth / this.object.displayHeight;
    const keepAspectRatio = this.shiftKey?.isDown;

    const newHeight = y - this.object.y + this.object.displayHeight * this.object.originY + VERTICAL_HANDLE_HEIGHT;

    const newWidth = keepAspectRatio ? newHeight * aspectRatio : this.object.displayWidth;

    this.rectangle?.setDisplaySize(newWidth, newHeight);
    this.object?.setDisplaySize(newWidth, newHeight);

    this.updateHandlesPositions();

    this.updateOriginPointPosition();
    this.drawTextInfo();
  };

  private updateHandlesPositions = () => {
    this.verticalHandle?.setDisplaySize(this.object.displayWidth, VERTICAL_HANDLE_HEIGHT);
    this.horizontalHandle?.setDisplaySize(VERTICAL_HANDLE_HEIGHT, this.object.displayHeight);

    this.verticalHandle?.setPosition(this.object.x, this.getVerticalHandleY(this.object.y));

    this.horizontalHandle?.setPosition(this.getHorizontalHandleX(this.object.x), this.object.y);

    this.bothHandle?.setPosition(this.getHorizontalHandleX(this.object.x), this.getVerticalHandleY(this.object.y));
  };

  private onBothResizeDrag = ({ x, y }: Phaser.Math.Vector2) => {
    this.onHorizontalResizeDrag({ x });
    this.onVerticalResizeDrag({ y });
  };

  private getVerticalHandleY = (y: number): number =>
    y + this.object.displayHeight * (1 - this.object.originY) - VERTICAL_HANDLE_HEIGHT * (1 - this.object.originY);

  private getHorizontalHandleX = (x: number): number =>
    x + this.object.displayWidth * (1 - this.object.originX) - VERTICAL_HANDLE_HEIGHT * (1 - this.object.originX);

  private updateOriginPointPosition = () => {
    this.originPoint?.setPosition(
      this.object.x - this.object.displayWidth * this.object.originX + this.object.displayWidth * this.originX,
      this.object.y - this.object.displayHeight * this.object.originY + this.object.displayHeight * this.originY,
    );
  };

  private getObjectInfo = (originX?: number, originY?: number) => {
    const originResolutionMultiplier = 10 ** ORIGIN_DISPLAY_RESOLUTION;
    const orm = originResolutionMultiplier;

    const realOriginX = originX ?? this.originX;
    const realOriginY = originY ?? this.originY;

    const x = this.object.x - this.object.displayWidth * this.object.originX + this.object.displayWidth * realOriginX;

    const y = this.object.y - this.object.displayHeight * this.object.originY + this.object.displayHeight * realOriginY;

    const scaleX = this.object.displayWidth / this.initialWidth;
    const scaleXRounded = Math.round(scaleX * orm) / orm;

    const scaleY = this.object.displayHeight / this.initialHeight;
    const scaleYRounded = Math.round(scaleY * orm) / orm;

    return {
      x: Math.round(x),
      y: Math.round(y),
      displayWidth: Math.round(this.object.displayWidth),
      displayHeight: Math.round(this.object.displayHeight),
      scaleX: scaleXRounded,
      scaleY: scaleYRounded,
      originX: Math.round(realOriginX * orm) / orm,
      originY: Math.round(realOriginY * orm) / orm,
    };
  };

  private drawTextInfo = (originX?: number, originY?: number) => {
    const left = this.object.x - this.object.displayWidth * this.object.originX;
    const top = this.object.y - this.object.displayHeight * this.object.originY;

    const {
      x,
      y,
      displayWidth,
      displayHeight,
      scaleX,
      scaleY,
      originX: realOriginX,
      originY: realOriginY,
    } = this.getObjectInfo(originX, originY);

    const text = `
X:  ${x}
Y:  ${y}
W:  ${displayWidth} (${scaleX})
H:  ${displayHeight} (${scaleY})
OX: ${realOriginX}
OY: ${realOriginY}
    `;

    this.text?.setText(text.trim());
    this.text?.setPosition(left + DEBUG_TEXT_OFFSET, top + DEBUG_TEXT_OFFSET);
  };

  private print = () => {
    if (this.selected) {
      // eslint-disable-next-line no-console
      console.log(this.getObjectInfo());
    }
  };

  private toggleTextOverlay = () => {
    this.text?.setVisible(!this.text.visible);
  };

  public setSelected = (selected: boolean) => {
    if (selected) {
      this.debugObjects.forEach((obj) => obj.setSelected(false));
      this.rectangle?.setFillStyle(this.rectangle.fillColor, SELECTED_ALPHA);
      this.rectangle?.setStrokeStyle(2, 0x000000);
    } else {
      this.rectangle?.setFillStyle(this.rectangle.fillColor, UNSELECTED_ALPHA);
      this.rectangle?.setStrokeStyle(0, 0x000000);
    }

    this.selected = selected;
  };
}
