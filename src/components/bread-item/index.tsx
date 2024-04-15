import { memo } from "react";
import { NavLink } from "react-router-dom";

function BreadItem(currentRoute: any, params: any, items: any, paths: any) {
  const isLast = currentRoute?.path === items[items.length - 1]?.path;

  return isLast ? (
    <span>{currentRoute.title}</span>
  ) : (
    <NavLink to={`/${paths.join("/")}`}>{currentRoute.title}</NavLink>
  );
}

export default BreadItem;
