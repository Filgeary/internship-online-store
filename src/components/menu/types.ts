export type MenuPropsType = {
  items: NavigateItemType[];
  onNavigate: (value: NavigateItemType) => void;
}

export type NavigateItemType = {
  key: number;
  link: string;
  title: string;
}
