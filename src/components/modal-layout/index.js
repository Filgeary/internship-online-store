import React, {memo, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

const ModalLayout = React.forwardRef((props, outerRef) => {
  const cn = bem('ModalLayout');

  // Корректировка центра, если модалка больше окна браузера.
  const layout = useRef();
  const frame = useRef();
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
    close: (e) => {
      e.preventDefault();
      props.onClose();
    }
  };

  return (
    <div className={cn()} ref={(el) => { layout.current = el; outerRef.current = el }}>
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
});

ModalLayout.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  labelClose: PropTypes.string
};

ModalLayout.defaultProps = {
  title: 'Модалка',
  labelClose: 'Закрыть',
  onClose: () => {}
};

export default ModalLayout;
