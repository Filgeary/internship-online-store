import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type TFieldProps = {
  label?: React.ReactNode;
  error?: React.ReactNode;
  children?: React.ReactNode;
};
function Field({ label, error, children }: TFieldProps) {
  const cn = bem("Field");
  return (
    <div className={cn()}>
      <label className={cn("label")}>{label}</label>
      <div className={cn("input")}>{children}</div>
      <div className={cn("error")}>{error}</div>
    </div>
  );
}

/* Field.defaultProps = {}; */

export default memo(Field);
