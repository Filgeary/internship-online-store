import type { Dispatch } from "react"

export type NumberInputProps = {
  max: number,
  min: number,
  value: number,
  step: number,
  setValue: Dispatch<React.SetStateAction<number>>
}