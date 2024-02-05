import './style.css';

import React from 'react'

import { cn as bem } from '@bem-react/classname';

type EntitiesProps = {
  children: React.ReactNode;
};

function Entities({ children }: EntitiesProps) {
  const cn = bem('Entities');
  
  return (
    <div className={cn()}>
      {children}
    </div>
  );
}

export default Entities;
