type Value = string | number | boolean;
type ToPrimitive<T> = T extends string
  ? string
  : T extends number
  ? number
  : T extends boolean
  ? boolean
  : T;
export class Box<T extends Value> {
  private _value: T;
  private onChange?: (newValue: T, prevValue: T) => T;
  get value() {
    return this._value;
  }
  set value(newValue) {
    this._value = this.onChange?.(newValue, this._value) || newValue;
  }
  constructor(initialValue: T, onChange?: typeof this.onChange) {
    this._value = initialValue;
    this.onChange = onChange;
  }
}

export function createBox<T extends Value>(
  value: ToPrimitive<T>,
  onChange?: (
    newValue: ToPrimitive<T>,
    prevValue: ToPrimitive<T>
  ) => ToPrimitive<T>
) {
  return new Box(value, onChange);
}
