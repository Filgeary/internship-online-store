export interface MenuItem {
  key: string | number,
  title: string,
  link: string
}

export interface MenuProps {
  items: MenuItem[],
  onNavigate: (item: MenuItem) => void
}
