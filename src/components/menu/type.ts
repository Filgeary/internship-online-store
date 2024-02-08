interface Item {
  key: number;
  link: string;
  title: string;
}

export interface MenuProps {
  items: Item[];
  onNavigate: (item: Item) => void;
}
