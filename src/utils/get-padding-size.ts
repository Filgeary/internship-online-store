export const getPaddingSize = (element: HTMLElement) => {
  const computedStyle = window.getComputedStyle(element);
  const paddingRight = +computedStyle
    .getPropertyValue("padding-right")
    .replace("px", "");
  const paddingLeft = +computedStyle
    .getPropertyValue("padding-left")
    .replace("px", "");
  const paddingTop = +computedStyle
    .getPropertyValue("padding-top")
    .replace("px", "");
    const paddingBottom = +computedStyle
      .getPropertyValue("padding-bottom")
      .replace("px", "");
    return {paddingTop, paddingRight, paddingBottom, paddingLeft}
}
