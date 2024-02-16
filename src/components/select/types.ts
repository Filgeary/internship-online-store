export interface ISelectProps {
  value: any;
  options: Array<{
    value: string | number;
    title: string;
  }>;
  onChange?: (value?: string) => void;
}
