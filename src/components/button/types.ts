export interface IButtonProps {
  value?: string;
  onClick?: (event?: React.MouseEvent) => void;
  isLoading?: boolean;
  size?: string;
  height?: string;
  props?: Record<string, unknown>;
  [propName: string]: unknown;
}
