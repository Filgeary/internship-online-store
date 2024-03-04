import React, { memo } from "react"
import { cn as bem } from "@bem-react/classname"
import "./style.css"

const MessageCheck: React.FC = () => {
  const cn = bem("Message")

  return (
    <div className={cn("wrap-check")}>
      <div className={cn("wrap_1")}>
        <span id="check-part-1" className={cn("check")}></span>
        <span id="check-part-2" className={cn("check")}></span>
      </div>
      <div className={cn("wrap_2")}>
        <span id="check-part-1" className={cn("check")}></span>
        <span id="check-part-2" className={cn("check")}></span>
      </div>
    </div>
  );
};

export default memo(MessageCheck)
