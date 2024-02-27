import { memo, useEffect, useRef, useState } from "react";
import s from './style.module.css';

type ChatDisplayPropsType = {
  list: JSX.Element[];
  onTopBorderReached?: () => void;
};

function ChatDisplay(props: ChatDisplayPropsType) {
  const ref = useRef(null);
  const [userScrolling, setUserScrolling] = useState(false);
  const [prevHeight, setPrevHeight] = useState(0);

  useEffect(() => {
    setPrevHeight(ref.current.scrollHeight);
    if(!userScrolling) {
      ref.current.scrollTop = ref.current.scrollHeight;
    } else {
      ref.current.scrollTop = ref.current.scrollHeight - prevHeight;
    }
  }, [props.list])

  const callbacks = {
    onScrolling: () => {
      if(ref.current.scrollTop + ref.current.clientHeight === ref.current.scrollHeight) {
        setUserScrolling(false);
      } else {
        setUserScrolling(true);
      }
      if(ref.current.scrollTop === 0){
        props.onTopBorderReached();
      }
    },
  }

  return (
    <div ref={ref} className={s.Wrapper} onScroll={callbacks.onScrolling}>
      {props.list}
    </div>
  );
}

export default memo(ChatDisplay);
