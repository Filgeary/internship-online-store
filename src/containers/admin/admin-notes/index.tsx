import { memo, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { Col, Divider, Row, Typography, Form, Input, Button, Space, Tooltip, Flex } from 'antd';
import NoteCard from '@src/components/note-card';
import { ClearOutlined } from '@ant-design/icons';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';

const { Title } = Typography;
const { TextArea } = Input;

type TNote = {
  id: string;
  title: string;
  description: string;
};

const schema = z.object({
  title: z.string().min(1, { message: 'Обязательное поле' }),
  description: z.string().min(5, { message: 'Минимум 5 символов!' }),
});

function AdminNotes() {
  const [notes, setNotes] = useState<TNote[]>([
    {
      id: '123123',
      title: 'hello world',
      description: 'description here',
    },
    {
      id: 'gfdgfdgfdg',
      title: 'all title',
      description: '123123description here',
    },
    {
      id: 'fdssdf',
      title: 'gf dddddddddd',
      description: 'descrip12312312bfdgftion here',
    },
  ]);
  const [dragStatus, setDragStatus] = useState<'grab' | 'grabbing' | null>(null);

  const { control, handleSubmit, reset } = useForm<TNote>({
    defaultValues: { title: '', description: '' },
    resolver: zodResolver(schema),
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const options = {
    isSubmitDisabled: false,
  };

  const callbacks = {
    resetForm: () => reset(),
  };

  const handlers = {
    onFormSubmit: (data: TNote) => {
      const newNote = {
        ...data,
        id: crypto.randomUUID(),
      };
      console.log('@', newNote);
      setNotes((prevNotes) => [...prevNotes, newNote]);
    },
    onPointerEnter: () => !dragStatus && setDragStatus('grab'),
    onPointerLeave: () => !dragStatus && setDragStatus(null),
    onDragStart: () => setDragStatus('grabbing'),
    onDragEnd: (event: DragEndEvent) => {
      setDragStatus(null);

      const { active, over } = event;
      console.log({ active, over });

      if (active.id !== over.id) {
        setNotes((prevNotes) => {
          const oldIndex = prevNotes.findIndex((note) => note.id === active.id);
          const newIndex = prevNotes.findIndex((note) => note.id === over.id);

          return arrayMove(prevNotes, oldIndex, newIndex);
        });
      }
    },
  };

  useEffect(() => {
    if (notes.length) callbacks.resetForm();
  }, [notes]);

  useEffect(() => {
    document.body.style.setProperty('cursor', dragStatus);
  }, [dragStatus]);

  return (
    <>
      <Row>
        <Col span={24}>
          <Title level={3}>Добавить заметку</Title>

          <Form onFinish={handleSubmit(handlers.onFormSubmit)} style={{ maxWidth: 420 }}>
            <FormItem control={control} name='title' label={'Заголовок'}>
              <Input placeholder={'Название заметки'} />
            </FormItem>

            <FormItem control={control} name='description' label={'Описание'}>
              <TextArea placeholder={'Далеко-далеко за словесными горами...'} rows={3} />
            </FormItem>

            <Row justify={'end'}>
              <Space>
                <Tooltip title={'Стереть'}>
                  <Button onClick={callbacks.resetForm} icon={<ClearOutlined />} />
                </Tooltip>
                <Button disabled={options.isSubmitDisabled} htmlType={'submit'} type={'primary'}>
                  Создать
                </Button>
              </Space>
            </Row>
          </Form>
        </Col>
      </Row>

      <Divider />

      <Row>
        <Col span={24}>
          {notes.length ? (
            <Title level={3}>Все заметки</Title>
          ) : (
            <Title level={3}>Заметок пока нет...</Title>
          )}
        </Col>
      </Row>

      <Flex justify='space-between' wrap='wrap' gap={30}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handlers.onDragStart}
          onDragEnd={handlers.onDragEnd}
        >
          <SortableContext items={notes} strategy={rectSortingStrategy}>
            {notes.map((note) => (
              <NoteCard
                onPointerEnter={handlers.onPointerEnter}
                onPointerLeave={handlers.onPointerLeave}
                key={note.id}
                id={note.id}
                title={note.title}
                description={note.description}
              />
            ))}
          </SortableContext>
        </DndContext>
      </Flex>
    </>
  );
}

export default memo(AdminNotes);
