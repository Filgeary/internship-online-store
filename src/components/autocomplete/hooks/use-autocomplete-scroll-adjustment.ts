import { MutableRefObject, RefObject, useEffect } from "react";

type Params = {
  itemRef: RefObject<HTMLLIElement | null>
  listRef: RefObject<HTMLUListElement | null>
  triggerMouseEnterRef: MutableRefObject<boolean>
  hoveredItem: {index: number, hovered: boolean} | null
}

function useAutocompleteScrollAdjustment(params: Params) {
  const {
    itemRef,listRef, hoveredItem, triggerMouseEnterRef
  } = params

  useEffect(() => {
    if (!itemRef?.current || !listRef?.current || !hoveredItem) return;
    // const $li = itemRef.current
    // const $ul = listRef.current
    // let newScrollTop: number | undefined
    // if (($li.offsetTop - 5) > ($ul.scrollTop + $ul.offsetHeight)) {
    //   newScrollTop = Math.floor(($ul.scrollTop + $li.offsetHeight)/$li.offsetHeight) * $li.offsetHeight
    // } else if (($li.offsetTop - $li.offsetHeight - 5) < $ul.scrollTop) {
    //   newScrollTop = Math.ceil(($ul.scrollTop - $li.offsetHeight)/$li.offsetHeight) * $li.offsetHeight
    // }
    // if (newScrollTop === undefined) return;
    // triggerMouseEnterRef.current = false
    // $ul.scrollTop = newScrollTop
    // console.log(1)
    // $li.scrollIntoView({behavior: 'instant', block: 'center'})
  }, [hoveredItem])
}

export default useAutocompleteScrollAdjustment