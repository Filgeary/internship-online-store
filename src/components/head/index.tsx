import { memo } from 'react';

import './style.css';

type Props = {
  title: React.ReactNode;
  children?: React.ReactNode;
};

function Head({ title, children }: Props) {
  return (
    <div className='Head'>
      <div className='Head-place'>
        <h1>{title}</h1>
      </div>
      <div className='Head-place'>{children}</div>
    </div>
  );
}

export default memo(Head);
