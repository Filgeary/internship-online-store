import { memo } from 'react';

import { Form, Input, InputNumber, Select } from 'antd';

import { TCountry } from '@src/store/countries/types';

type TProps = {
  data: {
    _id: string | number;
    title: string;
    price: number;
    category: {
      _id: string;
    };
    madeIn: {
      _id: string;
    };
  };
  categories?: TCategory[];
  countries?: TCountry[];
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

    onCountryChange: (val: string) => {
      props.onChange('madeIn', val);
    },
  };

  const options = {
    categories: props.categories?.map((category) => ({
      value: category._id,
      label: <span>{category.title}</span>,
    })),
    countries: props.countries?.map((country) => ({
      value: country._id,
      label: <span>{country.title}</span>,
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

      {props.countries && (
        <Form.Item label='Страна' style={{ maxWidth: 300 }}>
          <Select
            options={options.countries}
            placeholder={'Выберите страну'}
            onChange={handlers.onCountryChange}
            value={props.data?.madeIn?._id}
          />
        </Form.Item>
      )}
    </Form>
  );
}

export default memo(FormEditArticle);
