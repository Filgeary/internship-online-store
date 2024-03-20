import React from "react";

export interface ModalLayoutProps {
  title?: string,
  labelClose?: string,
  onClose: (e: React.MouseEvent) => void,
  children: React.ReactNode
}
