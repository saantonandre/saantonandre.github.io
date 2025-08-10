export class Box<T extends any> {
  private _value: T;
  onChange?: (prev: T, curr: T) => void;
  set value(v) {
    this.onChange?.(v, this._value);
    this._value = v;
  }
  get value() {
    return this._value;
  }
  constructor(initialValue: T, onChange?: (curr: T, prev: T) => void) {
    this._value = initialValue;
    this.onChange = onChange;
  }
}
