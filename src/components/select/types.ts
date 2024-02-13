export type SelectPropsType = {
  options: {
    value: string;
    title: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}
