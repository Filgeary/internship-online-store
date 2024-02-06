import React, { memo, FC } from "react";
import PropTypes from "prop-types";
import "./style.css";

interface IControls {
  onAdd: () => void;
  title: string;
}

const Controls: FC<IControls> = ({ onAdd, title }: IControls) => {
  return (
    <div className="Controls">
      <button onClick={() => onAdd()}>{title}</button>
    </div>
  );
};

Controls.propTypes = {
  onAdd: PropTypes.func,
  title: PropTypes.string,
};

Controls.defaultProps = {
  onAdd: () => {},
  title: "Добавить",
};

export default memo(Controls);
