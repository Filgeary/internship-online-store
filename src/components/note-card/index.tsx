import { memo } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Card } from 'antd';

type TProps = {
  id: string;
  title: string;
  description: string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
};

function NoteCard(props: TProps) {
  const { id, title, description, onPointerEnter, onPointerLeave } = props;

  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id,
  });

  const style = {
    width: 300,
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      onPointerEnter={onPointerEnter || (() => {})}
      onPointerLeave={onPointerLeave || (() => {})}
      title={title}
      bordered={false}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {description}
    </Card>
  );
}

export default memo(NoteCard);
