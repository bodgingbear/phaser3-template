type Fn = (...args: never[]) => void;

export class EventEmitter<
  Handlers extends Record<Events, Fn>,
  Events extends Extract<keyof Handlers, string> = Extract<keyof Handlers, string>,
> extends Phaser.Events.EventEmitter {
  eventNames(): Events[] {
    return super.eventNames() as Events[];
  }

  listeners<E extends Events>(event: E): Handlers[E][] {
    return super.listeners(event) as Handlers[E][];
  }

  listenerCount<E extends Events>(event: E) {
    return super.listenerCount(event);
  }

  emit<E extends Events>(event: E, ...data: Parameters<Handlers[E]>) {
    return super.emit(event, ...data);
  }

  on<E extends Events>(event: E, cb: Handlers[E]) {
    return super.on(event, cb);
  }

  addListener<E extends Events>(event: E, cb: Handlers[E]) {
    return super.addListener(event, cb);
  }

  once<E extends Events>(event: E, cb: Handlers[E]) {
    return super.once(event, cb);
  }

  removeListener<E extends Events>(event: E, cb?: Handlers[E], once?: boolean) {
    return super.removeListener(event, cb, undefined, once);
  }

  off<E extends Events>(event: E, cb?: Handlers[E], once?: boolean) {
    return super.off(event, cb, undefined, once);
  }

  removeAllListeners<E extends Events>(event?: E) {
    return super.removeAllListeners(event);
  }
}
