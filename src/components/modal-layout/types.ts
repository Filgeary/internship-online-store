import type { ReactElement } from "react"

interface PropsWithoutSubmit {
  background: boolean,
  labelClose: string,
  labelSubmit?: never,
  appendSubmit?: false,
  title: string,
  children: ReactElement | ReactElement[],
  submitDisabled?: never
  onClose: () => void,
  onSubmit?: never, 
}

interface PropsWithSubmit {
  background: boolean,
  labelClose: string,
  labelSubmit: string,
  appendSubmit: true,
  title: string,
  children: ReactElement | ReactElement[],
  submitDisabled: boolean
  onClose: () => void,
  onSubmit?: () => void, 
}

export type ModalLayoutProps = PropsWithSubmit | PropsWithoutSubmit