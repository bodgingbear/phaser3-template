type Fn = (...args: never[]) => void;

type EnsureString<T> = Extract<T, string>
// type ExtractEventNames<Handlers> = Handlers extends string ? Handlers : EnsureString<keyof Handlers>
type ExtractEventNames<Handlers> = Handlers extends string ? Handlers : Extract<keyof Handlers, string>

type AA<Handlers> = Extract<keyof Handlers, string>

export class EventEmitter<
  // Handlers extends Record<Events, Fn> | string,
  // Events extends ExtractEventNames<Handlers> = ExtractEventNames<Handlers>,
  Handlers extends Record<Events, Fn>,
  Events extends Extract<keyof Handlers, string> = Extract<keyof Handlers, string>,
> extends Phaser.Events.EventEmitter {
  addListener<E extends Events>(event: E, cb: Handlers[E]) {
    return super.addListener(event, cb);
  }

  removeListener<E extends Events>(event: E, cb?: Handlers[E]) {
    return super.removeListener(event, cb);
  }

  on<E extends Events>(event: E, cb: Handlers[E]) {
    return super.on(event, cb);
  }

  emit<E extends Events>(event: E, ...data: Parameters<Handlers[E]>) {
    return super.emit(event, ...data);
  }
}

// export class Test extends EventEmitter<"click"> {
//   public hello() {
//     this.emit("click");
//   }
// }
// interface Test2Events {
//   click: (data: string, data2: number) => number;
//   click2: (data: number, data2: string) => number;
//   click3: () => number;
// }
// export class Test2 extends EventEmitter<Test2Events> {
//   public hello() {
//     const r1 = this.emit("click", "3", 5);
//     const r1bad = this.emit("click", 3, "5");

//     this.emit("")

//     const r2 = this.emit("click2", 3, "5");
//     const r2bad = this.emit("click2", "3", 5);

//     const r3 = this.emit("click3");
//     const r3bad = this.emit("click3", 1, 2, 3);
//   }
// }
