// TODO: register events in the compute props somehow, and consume them after every loop
// no more subscribers shit.

type BaseEvents = Record<string, [any] | []>;
type EventsMap<T extends BaseEvents> = {
  [Properties in keyof T]: T[Properties];
};
type EventHandler<T extends BaseEvents, K extends keyof T> = (
  data: T[K][0],
  unsubscribe: () => void
) => void;
type SubsMap<T extends Record<string, any>> = {
  [Properties in keyof T]?: Array<EventSub<T, Properties>>;
};
type EventSub<T extends BaseEvents, K extends keyof T> = {
  id: string;
  type: K;
  handler: EventHandler<T, K>;
  unsubscribe: () => void;
};

/**
 * @example
 * ```
 * 
 *  type GameEvents = {
 *    "player-punch-hit": [{ perfect: boolean }];
 *    "player-damaged": [];
 *  };
const gameEvents = new EventsManager<GameEvents>();

gameEvents.publish("player-damaged");
 * ```
@deprecated
 */
export class GlobalEvents<
  /** Mapping of events -> callback data */
  InputType extends EventsMap<BaseEvents>
> {
  private subs: SubsMap<InputType> = {};
  private subsBin: [keyof InputType, number][] = [];
  private looping = false;
  /** "Publishes" an event (notifies all the subs) */
  publish<T extends keyof InputType>(eventType: T, ...data: InputType[T]) {
    console.log(`Event: ${String(eventType)}`);
    this.handleEvent(eventType, ...data);
  }
  /** Subscribes an handler to an event */
  subscribe<T extends keyof InputType>(
    type: T,
    handler: EventHandler<InputType, T>
  ) {
    const id = createId();
    const unsubscribe = () => this.unsubscribe(type, id);
    if (!this.subs[type]) {
      this.subs[type] = [];
    }
    const eventSub: EventSub<InputType, T> = {
      id,
      type,
      handler,
      unsubscribe,
    };
    this.subs[type]?.push(eventSub);
    return unsubscribe;
  }
  /** Notifies all the sub of `event` */
  private handleEvent<T extends keyof InputType>(
    eventType: T,
    ...data: InputType[T]
  ) {
    this.looping = true;
    const subs = this.subs[eventType];
    if (!subs?.length) return;
    for (let i = 0; i < subs.length; i++) {
      subs[i].handler(data[0], subs[i].unsubscribe);
    }
    this.looping = false;
    this.emptyBin();
  }
  /** Removes delayed unsubscriptions */
  private emptyBin() {
    this.subsBin.sort(([, a], [, b]) => b - a);
    this.subsBin.sort(([a], [b]) => (b as string).localeCompare(a as string));
    for (const [type, index] of this.subsBin) {
      this.subs[type]?.splice(index, 1);
    }
    this.subsBin = [];
  }
  /** Removes an element from subs listener */
  private unsubscribe<T extends keyof InputType>(type: T, id: string) {
    const index = this.subs[type]?.findIndex((e) => e.id === id);
    if (!index) return;
    if (this.looping) {
      return this.subsBin.push([type, index]);
    }
    this.subs[type]?.splice(index, 1);
  }
}

function createId() {
  const SIGNATURE_LENGTH = 16;
  return randomString(SIGNATURE_LENGTH);
}
const randomString = (length: number) => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let generatedString = "";
  for (let i = 0; i < length; i++) {
    generatedString += chars[(Math.random() * chars.length) | 0];
  }
  return generatedString;
};
