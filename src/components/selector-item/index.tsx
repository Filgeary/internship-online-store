import { memo } from "react";
import { SelectorItemPropsType } from "./type";
import styles from "./style.module.css";

function SelectorItem(props: SelectorItemPropsType) {

  let itemClasses = props.isSelected ? `${styles.Item} ${styles.ItemSelected}` : styles.Item;
  itemClasses += props.isHovered ? ` ${styles.ItemHover}` : '';

  return (
    <div className={itemClasses}>
      <div className={styles.ItemIcon}>
        <div className={styles.ItemIconText}>{props.item.code}</div>
      </div>
      <div className={styles.ItemText}>
        {props.item.title.length < 21 ? props.item.title : `${props.item.title.substring(0, 21)}...`}
      </div>
    </div>
  );
}

export default memo(SelectorItem);
