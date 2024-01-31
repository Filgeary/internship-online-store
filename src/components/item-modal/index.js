import { memo, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";

function ItemModal(props) {
  const [selected, setSelected] = useState(false);
  const cn = bem("ItemModal");

  const onSelect = () => {
    props.onSelect(props.item._id);
    setSelected(props.item.selected);
  };

  return (
    <div className={cn() + (selected ? " ItemModal_selected" : "")} onClick={onSelect}>
      <div className={cn("title")}>{props.item.title}</div>
      <div className={cn("price")}>
        {numberFormat(props.item.price)} {props.labelCurr}
      </div>
    </div>
  );
}

ItemModal.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func,
  labelCurr: PropTypes.string,
};

ItemModal.defaultProps = {
  onSelect: () => {},
  labelCurr: "₽",
};

export default memo(ItemModal);
