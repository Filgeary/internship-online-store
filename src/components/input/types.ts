export type InputPropsType = {
  value?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  theme?: string;
  delay?: number
  onChange: (value: string, name: string) => void;
}
