interface IItem {
  key: number;
  link: string;
  title: string;
}

export interface IMenuProps {
  items: IItem[];
  onNavigate: (item: IItem) => void;
}
