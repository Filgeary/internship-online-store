import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { TranslateFunc } from "@src/i18n/types";

type BasketTotalProps = {
  sum: number;
  t: TranslateFunc;
};

function BasketTotal({ sum, t }: BasketTotalProps) {
  const cn = bem("BasketTotal");
  return (
    <div className={cn()}>
      <span className={cn("cell")}>{t("basket.total")}</span>
      <span className={cn("cell")}> {numberFormat(sum)} ₽</span>
      <span className={cn("cell")}></span>
    </div>
  );
}

BasketTotal.defaultProps = {
  sum: 0,
  t: (text) => text,
};

export default memo(BasketTotal);
