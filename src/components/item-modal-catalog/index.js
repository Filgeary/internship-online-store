import { cn as bem } from "@bem-react/classname";
import PropTypes from "prop-types";
import { memo, useState } from "react";

import numberFormat from "@src/utils/number-format";

import "./style.css";

const ItemModalCatalog = (props) => {
  const cn = bem("ItemModalCatalog");
  const [valueCheckbox, setValueCheckbox] = useState(false);

  const callbacks = {
    onAdd: () => props.onAdd(props.item._id),
    onSelectItem: (isAdding) => props.onSelectItem(props.item._id, isAdding),
    onChangeCheckbox: (evt) => {
      setValueCheckbox(evt.target.checked);
      if (evt.target.checked) {
        callbacks.onSelectItem(true);
      } else {
        callbacks.onSelectItem(false);
      }
    },
  };

  return (
    <div className={cn({ selected: valueCheckbox })}>
      <input
        type="checkbox"
        name="selectedItem"
        id={"selectedItem" + props.item._id}
        className={cn("checkbox")}
        onChange={callbacks.onChangeCheckbox}
        checked={valueCheckbox}
      />
      <div className={cn("title")}>{props.item.title}</div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(props.item.price)} {props.labelCurr}
        </div>
        <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
      </div>
    </div>
  );
};

ItemModalCatalog.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  onAdd: PropTypes.func,
  onSelectItem: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
};

ItemModalCatalog.defaultProps = {
  onAdd: () => {},
  onSelectItem: () => {},
  labelCurr: "₽",
  labelAdd: "Добавить",
};

export default memo(ItemModalCatalog);
