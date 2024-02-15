import type { HTMLInputTypeAttribute, HTMLProps } from "react"

type BaseProps = Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'value'>

type AdditionalProps<
  Value extends string, 
  Name extends string | undefined
> = {
  value: Value,
  name?: Name,
  onChange: (value: Value, name: Name) => void,
  theme?: 'big',
  delay?: number
}

export type InputProps<
  Value extends string,
  Name extends string | undefined
> = BaseProps & AdditionalProps<Value, Name>
