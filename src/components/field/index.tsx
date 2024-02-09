import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type FieldProps = {
  label?: string;
  error?: string;
  children?: React.ReactNode;
};

function Field({ label, error, children }: FieldProps) {
  const cn = bem("Field");
  return (
    <div className={cn()}>
      <label className={cn("label")}>{label}</label>
      <div className={cn("input")}>{children}</div>
      <div className={cn("error")}>{error}</div>
    </div>
  );
}

export default memo(Field);
