import { ReactNode } from "react";

export interface ModalLayoutProps {
  title: string;
  onClose?: () => void;
  children: ReactNode;
  labelClose?: string;
  isClose: boolean;
}
