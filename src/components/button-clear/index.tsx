import { FC } from "react";
import { ButtonClearType } from "./type";
import './style.css';

export const ButtonClear: FC<ButtonClearType> = ({ labelClear, onClear }) => (
  <button className="clear" onClick={onClear}>{labelClear}</button>
);
