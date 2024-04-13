import { memo, useEffect, useState } from 'react';

import { useForm } from 'react-hook-form';
import { FormItem } from 'react-hook-form-antd';

import { zodResolver } from '@hookform/resolvers/zod';
import z from 'zod';

import { Col, Divider, Row, Typography, Form, Input, Button, Space, Tooltip } from 'antd';
import NoteCard from '@src/components/note-card';
import { ClearOutlined } from '@ant-design/icons';

import { motion, AnimatePresence } from 'framer-motion';

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
      id: '1',
      title: 'Выучить JS',
      description: 'Таким образом новая модель организационной деятельности',
    },
    {
      id: '2',
      title: 'Выучить TS',
      description: 'Задача организации, в особенности же постоянное',
    },
    {
      id: '3',
      title: 'Выучить React',
      description: 'Значимость этих проблем настолько очевидна',
    },
  ]);
  const [dragStatus, setDragStatus] = useState<'grab' | 'grabbing' | null>(null);

  const { control, handleSubmit, reset, watch } = useForm<TNote>({
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
    isClearBtnDisabled: !watch('title').length && !watch('description').length,
  };

  const callbacks = {
    resetForm: () => reset(),
    deleteNote: (id: string) => {
      setNotes(notes.filter((note) => note.id !== id));
    },
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
    onPointerLeave: () => dragStatus === 'grab' && setDragStatus(null),
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
                  <Button
                    disabled={options.isClearBtnDisabled}
                    onClick={callbacks.resetForm}
                    icon={<ClearOutlined />}
                  />
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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 300px)',
          gridGap: '1rem',
          justifyContent: 'space-between',
        }}
      >
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handlers.onDragStart}
          onDragEnd={handlers.onDragEnd}
        >
          <SortableContext items={notes} strategy={rectSortingStrategy}>
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  key={note.id}
                >
                  <NoteCard
                    onPointerEnter={handlers.onPointerEnter}
                    onPointerLeave={handlers.onPointerLeave}
                    onDelete={() => callbacks.deleteNote(note.id)}
                    id={note.id}
                    title={note.title}
                    description={note.description}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </SortableContext>
        </DndContext>
      </div>
    </>
  );
}

export default memo(AdminNotes);
