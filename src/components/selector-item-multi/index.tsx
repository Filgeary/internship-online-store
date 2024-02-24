import { memo } from "react";
import { SelectorItemMultiPropsType } from "./type";
import styles from "./style.module.css";

function SelectorItemMulti(props: SelectorItemMultiPropsType) {

  let itemClasses = props.isSelected ? `${styles.Item} ${styles.ItemSelected}` : styles.Item;
  itemClasses += props.isHovered ? ` ${styles.ItemHover}` : '';

  return (
    <div className={itemClasses}>
      <div className={styles.ItemIcon}>
        <div className={styles.ItemIconText}>{props.item.code}</div>
      </div>
    </div>
  );
}

export default memo(SelectorItemMulti);
