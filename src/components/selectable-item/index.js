import { memo } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";

function SelectableItem(props) {
  const cn = bem("SelectableItem");

  const onSelect = () => {
    props.onSelect(props.item._id);
  };

  return (
    <div className={cn({selected: props.selected})} onClick={onSelect}>
      <div className={cn("title")}>{props.item.title}</div>
      <div className={cn("price")}>
        {numberFormat(props.item.price)} {props.labelCurr}
      </div>
    </div>
  );
}

SelectableItem.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  onSelect: PropTypes.func,
  labelCurr: PropTypes.string,
  selected: PropTypes.bool,
};

SelectableItem.defaultProps = {
  onSelect: () => {},
  selected: false,
  labelCurr: "₽",
};

export default memo(SelectableItem);
