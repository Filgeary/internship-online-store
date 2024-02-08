import { ReactNode } from "react";

export interface ProtectedProps {
  children: ReactNode;
  redirect: string;
}
