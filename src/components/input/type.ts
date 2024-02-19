export interface InputProps {
  value: string;
  name: string;
  onChange: (value: string, name: string) => void;
  type?: string;
  placeholder?: string;
  theme?: string;
}
