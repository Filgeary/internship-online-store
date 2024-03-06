import React, { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

interface IChatLayoutProps {
  children: React.ReactNode;
}

function ChatLayout(props: IChatLayoutProps) {
  const cn = bem("ChatLayout");

  return (
    <div className={cn()}>
      {props.children}
    </div>
  );
}

export default memo(ChatLayout);
