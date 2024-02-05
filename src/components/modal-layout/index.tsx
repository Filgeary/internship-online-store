import React, {ForwardRefRenderFunction, useEffect, useRef} from "react";
import {cn as bem} from '@bem-react/classname';
import './style.css';

type ModalLayoutProps = {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
  labelClose?: string;
};

const defaultProps: ModalLayoutProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
  onClose: () => {},
};

ModalLayout.defaultProps = defaultProps;

function ModalLayout(props: ModalLayoutProps, outerRef: { current: any }) {
  const cn = bem('ModalLayout');

  // Корректировка центра, если модалка больше окна браузера.
  const layout = useRef<HTMLDivElement>();
  const frame = useRef<HTMLDivElement>();
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
    
    return () => {
      resizeObserver.disconnect();
    }
  }, []);

  const callbacks = {
    close: (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      props.onClose();
    }
  };

  return (
    <div className={cn()} ref={(el: HTMLDivElement) => { layout.current = el; outerRef.current = el }}>
      <div className={cn('frame')} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>{props.title}</h1>
          <button className={cn('close')} onClick={callbacks.close}>{props.labelClose}</button>
        </div>
        <div className={cn('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

export default React.forwardRef(ModalLayout as ForwardRefRenderFunction<unknown, ModalLayoutProps>);
