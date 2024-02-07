import { memo } from "react";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";

interface IBasketTotalProps {
  sum: number;
  t: (text: string, number?: number) => string;
  open: () => void;
}
const BasketTotal: React.FC<IBasketTotalProps> = ({ sum, t, open }) => {
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
};

export default memo(BasketTotal);
