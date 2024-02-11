import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import "./style.css";

type TPageLayoutProps = {
  head?: React.ReactNode;
  footer?: React.ReactNode;
  children?: React.ReactNode;
};
function PageLayout({ head, footer, children }: TPageLayoutProps) {
  const cn = bem("PageLayout");

  return (
    <div className={cn()}>
      <div className={cn("head")}>{head}</div>
      <div className={cn("center")}>{children}</div>
      <div className={cn("footer")}>{footer}</div>
    </div>
  );
}

export default memo(PageLayout);
