import throttle from 'lodash.throttle';
import { RefObject, useEffect, useState } from 'react';

type Props = {
  ref: RefObject<HTMLElement>;
};

export const useScroll = ({ ref }: Props) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [isReachedTop, setIsReachedTop] = useState(true);
  const [isReachedBottom, setIsReachedBottom] = useState(false);
  const [prevScrollHeight, setPrevScrollHeight] = useState(0);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = element;
      const localIsReachedTop = scrollTop === 0;
      const localIsReachedBottom = scrollTop + clientHeight >= scrollHeight - 1; // Account for rounding errors

      setIsReachedTop(localIsReachedTop);
      setIsReachedBottom(localIsReachedBottom);
      setIsScrolling(!localIsReachedBottom);
      setPrevScrollHeight(scrollHeight);
    };

    element.addEventListener('scroll', throttle(handleScroll, 100));

    return () => {
      element.removeEventListener('scroll', handleScroll);
    };
  }, [ref]);

  return { isScrolling, isReachedTop, isReachedBottom, prevScrollHeight };
};
