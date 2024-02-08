export interface SelectProps {
  options: {
    value: string;
    title: string;
  }[];
  value: string;
  onChange: (value: string) => void;
}
