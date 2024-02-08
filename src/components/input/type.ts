export interface InputProps {
  value: string;
  name: string;
  type?: string;
  placeholder?: string;
  onChange: (value: string, name: string) => void;
  theme?: string;
}
