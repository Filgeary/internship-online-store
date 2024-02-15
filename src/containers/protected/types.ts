import type { ReactElement } from "react"
import type { To } from "react-router-dom"

export type ProtectedProps = {
  children: ReactElement,
  redirect: To
}