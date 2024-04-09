import { memo } from 'react';

import { Form, Input, InputNumber } from 'antd';

type TProps = {
  data: {
    _id: string | number;
    title: string;
    price: number;
  };
  onChange: (key: string, val: string | number) => void;
};

function FormEditArticle(props: TProps) {
  const handlers = {
    onTitleChange: (e: React.ChangeEvent<HTMLInputElement>) => {
      props.onChange('title', e.target.value);
    },

    onPriceChange: (val: number) => {
      props.onChange('price', val);
    },
  };

  return (
    <Form variant='outlined'>
      <Form.Item label='Название'>
        <Input value={props.data.title} onChange={handlers.onTitleChange} />
      </Form.Item>

      <Form.Item label='Цена'>
        <InputNumber value={props.data.price} onChange={handlers.onPriceChange} />
      </Form.Item>
    </Form>
  );
}

export default memo(FormEditArticle);
