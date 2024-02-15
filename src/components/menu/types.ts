import type { To } from "react-router-dom"

export type MenuItem = {
  title: string,
  key: number | string,
  link: To
}

export type MenuProps = {
  items: MenuItem[],
  onNavigate: (item: MenuItem) => void
}