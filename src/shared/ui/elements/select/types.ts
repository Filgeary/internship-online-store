interface Option {
  value: string | number,
  title: string
}

export interface SelectProps {
  onChange: (value: any) => void,
  value: string,
  options: Option[]
}
