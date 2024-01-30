import { memo } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";

function BasketTotal({ sum, t, open }) {
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

BasketTotal.propTypes = {
  sum: PropTypes.number,
  t: PropTypes.func,
  open: PropTypes.func,
};

BasketTotal.defaultProps = {
  sum: 0,
  t: (text) => text,
  open: () => {},
};

export default memo(BasketTotal);
