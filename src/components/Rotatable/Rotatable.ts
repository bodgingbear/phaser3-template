import { Bodyish } from "../../types/Bodyish";
import { EventEmitter } from "../../utils/EventEmitter/EventEmitter";
import { getAbsolutePosition } from "../../utils/getAbsolutePosition/getAbsolutePosition";
import { getAngle, getPositiveAngle } from "./Rotatable.utils";

interface RotatableHandlers {
  dragStart: () => void;
  drag: (angle: number) => void;
  dragEnd: () => void;
}

export class Rotatable extends EventEmitter<RotatableHandlers> {
  private startOffset: number = 0;

  private outOfBounds: boolean = false;

  constructor(
    private readonly obj: Bodyish,
    private readonly minAngle: number = 0,
    private readonly maxAngle: number = Math.PI * 2,
    private readonly camera?: Phaser.Cameras.Scene2D.Camera,
  ) {
    super();
    this.obj.setInteractive({
      draggable: true,
      cursor: "grab",
    });

    this.obj.addListener("dragstart", this.onDragStart);
    this.obj.addListener("drag", this.onDrag);
    this.obj.addListener("dragend", this.onDragEnd);
  }

  onDragStart = (pointer: Phaser.Input.Pointer) => {
    const { x, y } = getAbsolutePosition(this.obj);
    const { downX, downY } = pointer;

    const cameraX = this.camera?.scrollX ?? 0;
    const cameraY = this.camera?.scrollY ?? 0;
    const zoom = this.camera?.zoom ?? 1;

    const deltaStartX = (downX + cameraX - x) * zoom;
    const deltaStartY = (downY + cameraY - y) * zoom;

    this.startOffset = getAngle(deltaStartX, deltaStartY) - this.obj.rotation;
    this.emit("dragStart");
  };

  onDragEnd = () => {
    this.emit("dragEnd");
  };

  onDrag = (pointer: Phaser.Input.Pointer) => {
    const { x, y } = getAbsolutePosition(this.obj);

    const { x: pointerX, y: pointerY } = pointer;

    const cameraX = this.camera?.scrollX ?? 0;
    const cameraY = this.camera?.scrollY ?? 0;
    const zoom = this.camera?.zoom ?? 1;

    const deltaX = (pointerX + cameraX - x) * zoom;
    const deltaY = (pointerY + cameraY - y) * zoom;

    const angle = getAngle(deltaX, deltaY);

    const offsetAngle = getPositiveAngle(angle - this.startOffset);

    if (
      this.minAngle !== 0 &&
      this.maxAngle !== Math.PI * 2 &&
      (offsetAngle > this.maxAngle || offsetAngle < this.minAngle)
    ) {
      const boundedAngle = Math.min(Math.max(offsetAngle, this.minAngle), this.maxAngle);

      if (!this.outOfBounds) {
        this.obj.setRotation(boundedAngle);
        this.emit("drag", boundedAngle);
      }

      this.outOfBounds = true;

      return;
    }

    this.outOfBounds = false;
    this.obj.setRotation(offsetAngle);
    this.emit("drag", offsetAngle);
  };
}
