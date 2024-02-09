import { memo } from "react";

import { cn as bem } from "@bem-react/classname";
import "./style.css";

type SideLayoutProps = {
  children: React.ReactNode;
  side?: "start" | "end" | "between";
  padding?: "small" | "medium";
};

function SideLayout({
  children,
  side = "start",
  padding = "small",
}: SideLayoutProps) {
  const cn = bem("SideLayout");
  return (
    <div className={cn({ side, padding })}>
      <div className={cn("item")}>{children}</div>
    </div>
  );
}

export default memo(SideLayout);
