import React, {memo, useEffect, useRef} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';

interface Props {
  title?: string,
  labelClose?: string,
  onClose: (e: React.MouseEvent) => void,
  children: React.ReactNode
}

const ModalLayout: React.FC<Props> = ({title = 'Модалка', labelClose = 'Закрыть', onClose, children}) => {

  const cn = bem('ModalLayout');

  // Корректировка центра, если модалка больше окна браузера.
  // Небольшая помарка, это не будет работать в NODE JS, так как там нет обьекта document ссылка с ответом ниже
  // https://stackoverflow.com/questions/55677600/typescript-how-to-pass-object-is-possibly-null-error
  const layout = useRef<HTMLDivElement>(document.createElement("div"));
  const frame = useRef<HTMLDivElement>(document.createElement("div"));
  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      // Центрирование frame или его прижатие к краю, если размеры больше чем у layout
      layout.current.style.alignItems = (layout.current.clientHeight < frame.current.clientHeight)
        ? 'flex-start'
        : 'center';
      layout.current.style.justifyContent = (layout.current.clientWidth < frame.current.clientWidth)
        ? 'flex-start'
        : 'center';
    });
    // Следим за изменениями размеров layout
    resizeObserver.observe(layout.current);
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
      resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className={cn()} ref={layout}>
      <div className={cn('frame')} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>{title}</h1>
          <button className={cn('close')} onClick={onClose}>{labelClose}</button>
        </div>
        <div className={cn('content')}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default memo(ModalLayout);
