import { memo } from 'react';

import { Form, Input, InputNumber, Select } from 'antd';

type TProps = {
  data: {
    _id: string | number;
    title: string;
    price: number;
    category: {
      _id: string;
    };
  };
  categories?: TCategory[];
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

    onCategoryChange: (val: string) => {
      props.onChange('category', val);
    },
  };

  const options = {
    categories: props.categories?.map((category) => ({
      value: category._id,
      label: <span>{category.title}</span>,
    })),
  };

  return (
    <Form variant='outlined'>
      <Form.Item label='Название'>
        <Input
          value={props.data.title}
          placeholder={'Введите название'}
          onChange={handlers.onTitleChange}
        />
      </Form.Item>

      <Form.Item label='Цена'>
        <InputNumber
          value={props.data.price}
          placeholder={'₽₽₽'}
          onChange={handlers.onPriceChange}
        />
      </Form.Item>

      {props.categories && (
        <Form.Item label='Категория' style={{ maxWidth: 300 }}>
          <Select
            options={options.categories}
            placeholder={'Выберите категорию'}
            onChange={handlers.onCategoryChange}
            value={props.data?.category?._id}
          />
        </Form.Item>
      )}
    </Form>
  );
}

export default memo(FormEditArticle);
