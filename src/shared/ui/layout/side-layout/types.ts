import React from "react";

type side = 'start' | 'end' | 'between';
type padding = 'small' | 'medium';

export interface SideLayoutProps {
  children: React.ReactNode,
  side?: side,
  padding?: padding
}
