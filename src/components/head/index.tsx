import { memo } from "react";
import { HeadPropsType } from "./types";
import "./style.css";

function Head({ title, children }: HeadPropsType) {
  return (
    <div className="Head">
      <div className="Head-place">
        <h1>{title}</h1>
      </div>
      <div className="Head-place">{children}</div>
    </div>
  );
}

// Head.propTypes = {
//   title: PropTypes.node,
//   children: PropTypes.node,
// };

export default memo(Head);
