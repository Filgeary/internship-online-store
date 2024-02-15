export interface SelectProps<T  extends string> {
  options: {
    value: string,
    title: string
  }[],
  value: T,
  onChange: (value: T) => void
}
