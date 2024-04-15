import { memo, useState } from 'react';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Button, Card, Divider, Popconfirm, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

type TProps = {
  id: string;
  title: string;
  description: string;
  renderDeadline?: () => React.ReactNode | string;
  onPointerEnter?: () => void;
  onPointerLeave?: () => void;
  onDelete?: () => void;
};

function NoteCard(props: TProps) {
  const { id, title, description, renderDeadline, onPointerEnter, onPointerLeave, onDelete } =
    props;
  const [isPopConfirmVisible, setIsPopConfirmVisible] = useState(false);

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
      extra={
        onDelete && (
          <Popconfirm
            open={isPopConfirmVisible}
            title='Удалить заметку?'
            description='Вы уверены?'
            cancelButtonProps={{
              onPointerDown: () => setIsPopConfirmVisible(false),
            }}
            okButtonProps={{
              onPointerDown: () => {
                onDelete();
                setIsPopConfirmVisible(false);
              },
            }}
            okText='Удалить'
            cancelText='Отмена'
          >
            <Button
              onPointerDown={() => setIsPopConfirmVisible(true)}
              danger
              icon={<DeleteOutlined />}
            />
          </Popconfirm>
        )
      }
      bordered={false}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <Typography.Paragraph>{description}</Typography.Paragraph>
      {renderDeadline && (
        <>
          <Divider />
          <Typography.Text>Дедлайн: {renderDeadline()}</Typography.Text>
        </>
      )}
    </Card>
  );
}

export default memo(NoteCard);
