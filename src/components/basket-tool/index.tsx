import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { TranslateFunc } from "@src/i18n/types";

type BasketToolProps = {
  sum: number;
  amount: number;
  onOpen: () => void;
  t: TranslateFunc;
};

function BasketTool({ sum, amount, onOpen, t }: BasketToolProps) {
  const cn = bem("BasketTool");
  return (
    <div className={cn()}>
      <span className={cn("label")}>{t("basket.inBasket")}</span>
      <span className={cn("total")}>
        {amount
          ? `${amount} ${t("basket.articles", amount)} / ${numberFormat(sum)} ₽`
          : t("basket.empty")}
      </span>
      <button onClick={onOpen}>{t("basket.open")}</button>
    </div>
  );
}

BasketTool.defaultProps = {
  onOpen: () => {},
  sum: 0,
  amount: 0,
  t: (text) => text,
};

export default memo(BasketTool);
