import { RefObject } from "react";

export const checkPosition = (targetElement: RefObject<Element>, elementHeight = 160) => {
  const windowHeight = window.innerHeight;
  const targetElementTop = targetElement.current?.getBoundingClientRect().top;

  return windowHeight - targetElementTop! < elementHeight;
}
