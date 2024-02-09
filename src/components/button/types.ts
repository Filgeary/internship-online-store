import { type MouseEventHandler } from 'react';

export interface IButtonProps {
  value?: string;
  onClick?: MouseEventHandler<HTMLInputElement>;
  isLoading?: boolean;
  size?: string;
  height?: string;
  props?: Record<string, unknown>;
}
