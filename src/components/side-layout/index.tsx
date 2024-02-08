import React, { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type ISideLayoutProps = {
  children?: React.ReactNode;
  side?: "start" | "end" | "between";
  padding?: "small" | "medium";
};

function SideLayout({ children, side, padding }: ISideLayoutProps) {
  const cn = bem("SideLayout");
  return (
    <div className={cn({ side, padding })}>
      {React.Children.map(children, (child, i) => (
        <div key={i} className={cn("item")}>
          {child}
        </div>
      ))}
    </div>
  );
}

/* SideLayout.defaultProps = {}; */

export default memo(SideLayout);
