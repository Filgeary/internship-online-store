import {memo, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import './style.css';

function DialogLayout(props) {

  const cn = bem('DialogLayout');

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
    layout.current.style.paddingTop = `${props.index * 20}px`;
    layout.current.style.paddingLeft = `${props.index*20}px`;
    // Следим за изменениями размеров layout
    resizeObserver.observe(layout.current);
    document.body.style.overflow = 'hidden';
    return () => {
      // Сбрасываем, только если больше диалоговых окон не открыто
      if (!document.querySelector(".DialogLayout") && !document.querySelector(".ModalLayout")) {
        document.body.style.overflow = 'auto';
      }
      resizeObserver.disconnect();
    }
  }, []);

  return (
    <div className={cn()} onClick={props.onClose} ref={layout}>
      <div className={cn('frame')} onClick={(e) => e.stopPropagation()} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>{props.title}</h1>
          {/*<button className={cn('close')} onClick={props.onClose}>{props.labelClose}</button>*/}
        </div>
        <div className={cn('content')}>
          {props.children}
        </div>
      </div>
    </div>
  );
}

DialogLayout.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  children: PropTypes.node,
  labelClose: PropTypes.string
};

DialogLayout.defaultProps = {
  title: 'Диалоговое окно',
  labelClose: 'Закрыть',
  onClose: () => {
  }
};

export default memo(DialogLayout);
