import React, { LegacyRef, memo } from 'react';
import './style.css';

import { Scrollbar } from 'react-scrollbars-custom';
import { cn as bem } from '@bem-react/classname';
import { useAutocompleteContext } from '..';

type ListProps = {
  children: React.ReactNode;
};

function AutocompleteList(props: ListProps) {
  const cn = bem('AutocompleteList');

  const { listRef } = useAutocompleteContext();

  return (
    <Scrollbar
      className={cn('col')}
      ref={listRef as LegacyRef<Scrollbar> & LegacyRef<HTMLDivElement>}
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
