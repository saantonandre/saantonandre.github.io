export type FCChild = (() => Node) | Node | string | number;

export type FCData<T extends keyof HTMLElementTagNameMap> = {
  props?: Partial<Omit<HTMLElementTagNameMap[T], "style">>;
  style?: Partial<CSSStyleDeclaration>;
  children?: Value[];
};
export type FC = <T extends keyof HTMLElementTagNameMap>(
  tag: T,
  fn: () => FCData<T>
) => () => HTMLElementTagNameMap[T];

export type StyleMap = Record<
  keyof HTMLElementTagNameMap,
  Partial<CSSStyleDeclaration>
>;
