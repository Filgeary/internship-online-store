import React from "react";

export interface ItemProps {
  item: IArticle,
  link: string,
  onAdd: (item: IArticle) => void,
  labelCurr?: string,
  labelAdd?: string
}

export interface ItemCallbacks {
  onAdd: (event: React.MouseEvent<HTMLButtonElement>) => void
}
