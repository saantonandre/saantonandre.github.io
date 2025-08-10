type BaseEvents = Record<string, [any] | []>;
type EventsMap<T extends BaseEvents> = {
  [Properties in keyof T]: T[Properties];
};
type BoardPost<T extends BaseEvents, K extends keyof T> = T[K];
type EventsRecord<T extends Record<string, any>> = {
  [Properties in keyof T]?: Array<BoardPost<T, Properties>>;
};
type EventHandler<T extends BaseEvents, K extends keyof T> = (
  data: T[K][0]
) => void;
type TypedEventHandler<T extends BaseEvents, K extends keyof T> = (message: {
  type: K;
  data: T[K][0];
}) => void;
/**
 * Board events are *ephemeral*, i.e. meant to live just **1 loop cycle**.
 * Events will be added to the private property `currEvents`
 * At the start of every loop `prevEvents` will be discarded, and `currEvents` will empty out, to take their place
 *
 * This ensures readability for only and all computed entities.
 *
 * This is meant to be a singleton to have event shared across all loops.
 *
 * Event should be listened for within the frame computation cycle.
 *
 * This is unaware of callbacks.
 */
export class EventStream<
  /** Mapping of events -> callback data */
  InputType extends EventsMap<BaseEvents>
> {
  /** Events triggered within the last cycle */
  private board: EventsRecord<InputType> = {};
  /** Events occuring now, write only */
  private postRequests: EventsRecord<InputType> = {};

  /** This compute must happen at loop start */
  compute() {
    // Clears the board
    for (const key in this.board) {
      this.board[key]!.length = 0;
    }
    // Moves the new posts to the board
    for (const key in this.postRequests) {
      if (!this.board[key]) this.board[key] = [];
      this.board[key]!.push(...this.postRequests[key]!);
      this.postRequests[key]!.length = 0;
    }
  }

  /** Adds an event to the board */
  post<T extends keyof InputType>(type: T, ...data: InputType[T]) {
    if (!this.postRequests[type]) this.postRequests[type] = [];
    this.postRequests[type]!.push(data[0]);
  }

  /**
   * Reads all board events.
   * If the return value of `handler`
   *
   * @returns Amount of read messages in the board
   */
  read<T extends keyof InputType>(
    type: T,
    handler: EventHandler<InputType, T>
  ) {
    const events = this.board[type];
    if (!events) return 0;
    if (!events.length) return 0;
    for (const eventData of events) {
      handler(eventData);
    }
    return events.length;
  }
  
  /**
   * Reads all board events.
   * If the return value of `handler`
   *
   * @returns Amount of read messages in the board
   */
  readMulti<T extends keyof InputType>(
    types: T[],
    handler: TypedEventHandler<InputType, T>
  ) {
    let length = 0;
    for (const type of types) {
      const events = this.board[type];
      if (!events) continue;
      if (!events.length) continue;
      length += events.length;
      for (const eventData of events) {
        handler({ type, data: eventData });
      }
    }
    return length;
  }
}
