import { memo } from "react";
import PropTypes from "prop-types";
import "./style.css";

function Controls({ onAdd, title  }) {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  );
}

Controls.propTypes = {
  onAdd: PropTypes.func,
  title: PropTypes.string,
};

Controls.defaultProps = {
  onAdd: () => {},
  title: "Добавить",
};

export default memo(Controls);
