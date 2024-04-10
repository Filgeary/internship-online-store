import { memo } from 'react';

import { Form, Input, InputNumber } from 'antd';

type TProps = {
  data: {
    _id: string | number;
    title: string;
    population: number;
  };
  onChange: (key: string, val: string | number) => void;
};

function FormEditCity(props: TProps) {
  const handlers = {
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange('title', e.target.value);
    },

    onPopulationChange: (val: number) => {
      props.onChange('population', val);
    },
  };

  return (
    <Form variant='outlined'>
      <Form.Item label='Название'>
        <Input value={props.data.title} onChange={handlers.onTitleChange} />
      </Form.Item>

      <Form.Item label='Население'>
        <InputNumber value={props.data.population} onChange={handlers.onPopulationChange} />
      </Form.Item>
    </Form>
  );
}

export default memo(FormEditCity);
