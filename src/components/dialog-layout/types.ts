import type { MouseEvent, ReactElement } from "react"

export type DialogLayoutProps = {
  background: boolean,
  title: string,
  labelSubmit: string,
  labelClose: string,
  onSubmit: (e: MouseEvent) => void,
  onClose: (e: MouseEvent) => void,
  submitDisabled: boolean,
  children: ReactElement | ReactElement[]
}