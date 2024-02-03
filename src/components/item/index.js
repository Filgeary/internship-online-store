import { memo } from "react";
import PropTypes from "prop-types";
import { cn as bem } from "@bem-react/classname";
import numberFormat from "@src/utils/number-format";
import "./style.css";
import { Link } from "react-router-dom";
import useSelector from "@src/hooks/use-selector";

function Item(props) {
  const cn = bem("Item");

  const selected = useSelector(
    (state) => (props.catalog && state.catalogModal.selectedItems) || []
  );
  const callbacks = {
    onAdd: (e) => props.onAdd(props.item._id),
    onSelect: (e) => {
      props.onSelect(props.item);
    },
  };
  const select = selected.find((el) => el.id == props.item._id);

  return (
    <div
      className={
        !props.catalog
          ? cn()
          : select?.selected
          ? cn() + " " + cn("pointer") + " " + cn("selected")
          : cn() + " " + cn("pointer")
      }
      onClick={props.catalog ? callbacks.onSelect : undefined}
    >
      <div className={cn("title")}>
        {props.catalog ? (
          props.item.title
        ) : (
          <Link to={props.link}>{props.item.title}</Link>
        )}
      </div>
      <div className={cn("actions")}>
        <div className={cn("price")}>
          {numberFormat(props.item.price)} {props.labelCurr}
        </div>
        {!props.catalog && (
          <button onClick={callbacks.onAdd}>{props.labelAdd}</button>
        )}
      </div>
    </div>
  );
}

Item.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    title: PropTypes.string,
    price: PropTypes.number,
  }).isRequired,
  link: PropTypes.string,
  onAdd: PropTypes.func,
  labelCurr: PropTypes.string,
  labelAdd: PropTypes.string,
  catalog: PropTypes.bool,
  onSelect: PropTypes.func,
};

Item.defaultProps = {
  onAdd: () => {},
  labelCurr: "₽",
  labelAdd: "Добавить",
  onSelect: () => {},
};

export default memo(Item);
