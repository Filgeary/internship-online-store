/* eslint-disable prettier/prettier */
export interface IInputProps {
  value: string;
  name?: string;
  type?: string;
  placeholder?: string;
  onChange?: (value: string, name?: string) => void; // onChange опционально, потому что defaultProps
  theme?:
    | 'big'
    | 'nano'; // Можно было бы вынести в отдельное перечисление или тип, но нужно ли?
  validation?:
    | 'onlyNumber';
  autoFocus?: boolean;
  delay?: number;
  minWidth?: number;
  stretch?: boolean;
  minValue?: number;
  maxValue?: number;
  minDefaultValue?: number;
  maxDefaultValue?: number;
}