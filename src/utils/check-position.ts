import { RefObject } from "react";

export const checkPosition = (targetElement: RefObject<Element>, elementHeight: number) => {
  const windowHeight = window.innerHeight;
  const targetElementTop = targetElement.current?.getBoundingClientRect().top;

  return windowHeight - targetElementTop! < elementHeight;
}
