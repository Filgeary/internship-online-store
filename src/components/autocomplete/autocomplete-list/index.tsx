import './style.css';

import { Scrollbar } from 'react-scrollbars-custom';
import { cn as bem } from '@bem-react/classname';
import { useAutocomplete } from '..';
import React, { memo } from 'react';

type ListProps = {
  children: React.ReactNode;
};

function AutocompleteList(props: ListProps) {
  const cn = bem('AutocompleteList');

  const { listRef } = useAutocomplete();

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
      {/* {values.items.map((option: TOption) => (
        <Option
          key={option._id}
          isActive={option.code === values.active.code}
          code={option.code}
          title={props.displayStringForOption(option)}
          onClick={() => callbacks.setActive(option)}
          onKeyDown={helpers.onSpaceClick(() => callbacks.setActive(option))}
        />
      ))} */}
      {props.children}
    </Scrollbar>
  );
}

export default memo(AutocompleteList);
