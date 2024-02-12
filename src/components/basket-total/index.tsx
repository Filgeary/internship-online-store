import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { TDictionaryKeys } from "@src/i18n/translations";

type TBasketTotalProps = {
  sum: number;
  t: (text: TDictionaryKeys, number?: number) => string;
  open: () => void;
};
function BasketTotal({ sum, t, open }: TBasketTotalProps) {
  const cn = bem("BasketTotal");
  return (
    <>
      <div className={cn()}>
        <span className={cn("cell")}>{t("basket.total")}</span>
        <span className={cn("cell")}> {numberFormat(sum)} ₽</span>
        <span className={cn("cell")}></span>
      </div>
      <div className={cn("cell-btn")}>
        <button
          onClick={() => {
            open();
          }}
        >
          {t("basket.select.more")}
        </button>
      </div>
    </>
  );
}

/* BasketTotal.defaultProps = {
  sum: 0,
  t: (text: any) => text,
  open: () => {},
}; */

export default memo(BasketTotal);
