import { cn as bem } from '@bem-react/classname';
import { Space } from 'antd';

import './style.css';

type Props = {
  value: string;
  label: string;
};

function SelectFieldOptionCountry({ value, label }: Props) {
  const cn = bem('SelectFieldOptionCountry');

  return (
    <Space>
      <span className={cn('value')}>{value || ''}</span>
      <span className={cn('label')}>{label}</span>
    </Space>
  );
}

export default SelectFieldOptionCountry;
