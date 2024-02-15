import { ReactElement } from "react"

export type SideLayoutProps = {
  side?: 'start' | 'end' | 'between',
  padding?: 'small' | 'medium',
  children: ReactElement | ReactElement[]
}