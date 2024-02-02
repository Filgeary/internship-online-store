import { cn as bem } from "@bem-react/classname";
import PropTypes from "prop-types";
import { memo } from "react";

import numberFormat from "@src/utils/number-format";

import "./style.css";

const ItemModalCatalog = (props) => {
  const cn = bem("ItemModalCatalog");

  const callbacks = {
    onAdd: () => props.onAdd(props.item._id),
  };

  return (
    <div className={cn({ selected: props.isSelected })}>
      <input
        type="checkbox"
        name="selectedItem"
        id={"selectedItem" + props.item._id}
        className={cn("checkbox")}
        checked={props.isSelected}
        onChange={(evt) =>
          props.onSelectItem(props.item._id, evt.target.checked)
        }
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
  isSelected: PropTypes.bool,
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
