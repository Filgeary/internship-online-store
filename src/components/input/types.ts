export type InputPropsType = {
  value: string;
  name: string;
  type?: string;
  placeholder?: string;
  theme?: string;
  onChange: (value: string, name: string) => void;
}
