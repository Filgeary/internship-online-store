import React from "react";

export interface ListProps {
  list: any[],
  renderItem: (item: any) => React.ReactNode
}
