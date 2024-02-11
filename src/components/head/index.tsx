import { memo } from "react";
import "./style.css";

type THeadProps = {
  title: React.ReactNode;
  children: React.ReactNode;
};
function Head({ title, children }: THeadProps) {
  return (
    <div className="Head">
      <div className="Head-place">
        <h1>{title}</h1>
      </div>
      <div className="Head-place">{children}</div>
    </div>
  );
}

export default memo(Head);
