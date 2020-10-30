type Fn = (...args: never[]) => void;

export class EventEmitter<
  Events extends string,
  Handlers extends Record<Events, Fn> = Record<Events, Fn>
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
