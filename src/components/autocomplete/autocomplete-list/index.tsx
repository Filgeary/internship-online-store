import './style.css';

import { Scrollbar } from 'react-scrollbars-custom';
import { cn as bem } from '@bem-react/classname';
import { useAutocompleteContext } from '..';
import React, { memo } from 'react';

type ListProps = {
  children: React.ReactNode;
};

function AutocompleteList(props: ListProps) {
  const cn = bem('AutocompleteList');

  const { listRef } = useAutocompleteContext();

  return (
    <Scrollbar
      className={cn('col')}
      //@ts-ignore
      ref={listRef}
      translateContentSizeYToHolder
      thumbYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div {...restProps} ref={elementRef} className={cn('col-thumb')} />;
        },
      }}
      trackYProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div {...restProps} ref={elementRef} className={cn('col-track')} />;
        },
      }}
      wrapperProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div {...restProps} ref={elementRef} className={cn('col-wrapper')} />;
        },
      }}
      contentProps={{
        renderer: (props) => {
          const { elementRef, ...restProps } = props;
          return <div {...restProps} ref={elementRef} className={cn('col-content')} />;
        },
      }}
    >
      {props.children}
    </Scrollbar>
  );
}

export default memo(AutocompleteList);
