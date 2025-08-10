type MouseEventProps = {
    x: number;
    y: number;
    pageX: number;
    pageY: number;
    button: number;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
  };
  type KeyboardEventProps = {
    key: string;
    code: number;
    repeat: boolean;
    ctrlKey: boolean;
    altKey: boolean;
    metaKey: boolean;
    shiftKey: boolean;
  };
  type WindowEvents = {
    mousedown: MouseEventProps;
    mouseup: MouseEventProps;
    mousemove: MouseEventProps;
    keydown: KeyboardEventProps;
    keyup: KeyboardEventProps;
    input: {
      value: string;
      code: number;
      ctrlKey: boolean;
      altKey: boolean;
      metaKey: boolean;
      shiftKey: boolean;
    };
    wheel: { deltaX: number; deltaY: number };
    fullscreen: { enabled: boolean };
    move: { left: number; top: number };
    resize: { height: number; width: number };
    frame: { frame: number };
    draw: { frame: number };
    blur: {};
    focus: {};
    setup: {};
  };
  type WindowEventsMap = {
    [EventName in keyof WindowEvents]: [
      {
        target: Window;
        type: EventName;
      } & WindowEvents[EventName]
    ];
  };