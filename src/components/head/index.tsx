import { memo } from "react";
import "./style.css";
interface IHeadProps {
  title: React.ReactNode;
  children: React.ReactNode;
}
const Head: React.FC<IHeadProps> = ({ title, children }) => {
  return (
    <div className="Head">
      <div className="Head-place">
        <h1>{title}</h1>
      </div>
      <div className="Head-place">{children}</div>
    </div>
  );
};

export default memo(Head);
