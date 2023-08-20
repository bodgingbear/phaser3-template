import { Bodyish } from "../../types/Bodyish";
import { EventEmitter } from "../../utils/EventEmitter/EventEmitter";

interface Handlers {
  drag: (newPos: Phaser.Math.Vector2) => void;
  drop: (dropZone: Phaser.GameObjects.Zone) => void;
  dragend: (dropped: boolean) => void;
  dragstart: () => void;
  click: () => void;
}

export class Draggable extends EventEmitter<Handlers> {
  private dragStartPosition: Phaser.Math.Vector2 | null = null;

  private click: boolean = true;

  constructor(
    private scene: Phaser.Scene,
    private element: Bodyish,
    private container?: Bodyish | Phaser.GameObjects.Container,
    private pixelPerfect: boolean = false,
    private cursor?: { grab?: string; grabbing?: string },
  ) {
    super();

    if (this.container) {
      this.makeContainerDraggable();
    } else {
      this.makeRootDraggable();
    }
  }

  private makeContainerDraggable() {
    if (!this.container) {
      throw new Error("Cannot run makeContainerDraggable when container is undefined");
    }

    this.setInteractive();

    this.element.on("dragstart", () => {
      this.scene.input.setDefaultCursor(this.cursor?.grabbing ?? "grabbing");
      this.dragStartPosition = new Phaser.Math.Vector2(this.container);
      this.emit("dragstart");
    });

    this.element.on("dragend", (_pointer: Phaser.Input.Pointer, _x: number, _y: number, dropped: boolean) => {
      this.scene.input.setDefaultCursor("default");
      this.dragStartPosition = null;

      if (this.click) {
        this.emit("click");
      } else {
        this.emit("dragend", dropped);
      }
    });

    this.element.on("drag", (_pointer: Phaser.Input.Pointer, x: number, y: number) => {
      if (!this.container) {
        throw new Error("Cannot run makeContainerDraggable when container is undefined");
      }

      if (this.dragStartPosition === null) {
        return;
      }

      const newPosition = new Phaser.Math.Vector2(this.dragStartPosition.x + x, this.dragStartPosition.y + y);

      this.emit("drag", newPosition);
    });

    this.element.on("drop", (_pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
      this.emit("drop", dropZone);
    });
  }

  private setInteractive() {
    this.element.setInteractive({
      draggable: true,
      cursor: this.cursor?.grab ?? "grab",
      pixelPerfect: this.pixelPerfect,
    });
  }

  private makeRootDraggable() {
    this.setInteractive();

    this.element.on("dragstart", () => {
      this.click = true;
      this.scene.input.setDefaultCursor(this.cursor?.grabbing ?? "grabbing");
      this.emit("dragstart");
    });

    this.element.on("dragend", (_pointer: Phaser.Input.Pointer, _x: number, _y: number, dropped: boolean) => {
      this.scene.input.setDefaultCursor("default");

      if (this.click) {
        this.emit("click");
      } else {
        this.emit("dragend", dropped);
      }
    });

    this.element.on("drag", (_pointer: Phaser.Input.Pointer, x: number, y: number) => {
      this.click = false;
      const newPosition = new Phaser.Math.Vector2(x, y);
      this.emit("drag", newPosition);
    });

    this.element.on("drop", (_pointer: Phaser.Input.Pointer, dropZone: Phaser.GameObjects.Zone) => {
      this.emit("drop", dropZone);
    });
  }
}
