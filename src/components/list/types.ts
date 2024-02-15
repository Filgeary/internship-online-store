import type { ReactElement } from "react"

export type ListProps<T extends {
  _id: string | number
}> = {
  list: T[],
  renderItem: (item: T) => ReactElement
}