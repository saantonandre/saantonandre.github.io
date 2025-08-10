export class Prop<T> {
  private _value;
  onChange;
  constructor(initialValue: T, onChange?: (value: T) => void) {
    this._value = initialValue;
    this.onChange = onChange;
  }
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
    this.onChange?.(value);
  }
}
