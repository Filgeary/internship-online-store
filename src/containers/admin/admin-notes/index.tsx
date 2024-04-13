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
import { TNote } from '@src/store/admin/types';
import { useAppSelector } from '@src/hooks/use-selector';
import useStore from '@src/hooks/use-store';

const { Title } = Typography;
const { TextArea } = Input;

const schema = z.object({
  title: z.string().min(1, { message: 'Обязательное поле' }),
  description: z.string().min(5, { message: 'Минимум 5 символов!' }),
});

function AdminNotes() {
  const store = useStore();

  const select = useAppSelector((state) => ({
    notesList: state.admin.notes.list,
  }));

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
    deleteNote: (id: string) => store.actions.admin.deleteNote(id),
  };

  const handlers = {
    onFormSubmit: (data: TNote) => {
      const newNote = {
        ...data,
        _id: crypto.randomUUID(),
      };
      store.actions.admin.appendNote(newNote);
    },
    onPointerEnter: () => !dragStatus && setDragStatus('grab'),
    onPointerLeave: () => dragStatus === 'grab' && setDragStatus(null),
    onDragStart: () => setDragStatus('grabbing'),
    onDragEnd: (event: DragEndEvent) => {
      setDragStatus(null);

      const { active, over } = event;
      console.log({ active, over });

      if (active.id !== over.id) {
        const oldIndex = select.notesList.findIndex((note) => note._id === active.id);
        const newIndex = select.notesList.findIndex((note) => note._id === over.id);

        const result = arrayMove(select.notesList, oldIndex, newIndex);
        store.actions.admin.setNotesList(result);
      }
    },
  };

  useEffect(() => {
    if (select.notesList.length) callbacks.resetForm();
  }, [select.notesList]);

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
          {select.notesList.length ? (
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
          <SortableContext
            items={select.notesList.map((note) => note._id)}
            strategy={rectSortingStrategy}
          >
            <AnimatePresence>
              {select.notesList.map((note) => (
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  key={note._id}
                >
                  <NoteCard
                    onPointerEnter={handlers.onPointerEnter}
                    onPointerLeave={handlers.onPointerLeave}
                    onDelete={() => callbacks.deleteNote(note._id)}
                    id={note._id}
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
