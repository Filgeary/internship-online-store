import { cn as bem } from '@bem-react/classname';
import type { SelectProps } from 'antd';
import { Tag } from 'antd';

type TagRender = SelectProps['tagRender'];
// @ts-expect-error Type TagRender is not fully assignable to type Parameters
type TagRenderParams = Parameters<TagRender>[0];

import './style.css';

const SelectFieldTagCountry: TagRender = (props: TagRenderParams) => {
  const cn = bem('SelectFieldTagCountry');
  const { value, closable, onClose } = props;
  const onPreventMouseDown = (event: React.MouseEvent<HTMLSpanElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <Tag
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{ marginInlineEnd: 4 }}
    >
      <span className={cn('value')}>{value || ''}</span>
    </Tag>
  );
};

export default SelectFieldTagCountry;
