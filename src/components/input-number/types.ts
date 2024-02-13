export interface IInputNumberProps {
  value: string;
  updateValue: (value: string, name?: string) => void;
  placeholder: string;
  minValue: number;
  maxValue: number;
}
