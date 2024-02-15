import {memo, useEffect, useRef} from "react";
import PropTypes from "prop-types";
import {cn as bem} from '@bem-react/classname';
import type { DialogLayoutProps } from "./types";
import './style.css';

function DialogLayout(props: DialogLayoutProps) {

  const cn = bem('DialogLayout');

  // Корректировка центра, если модалка больше окна браузера.
  const layout = useRef<HTMLDivElement>(null);
  const frame = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!layout.current || !frame.current) return
    const resizeObserver = new ResizeObserver(() => {
      if (!layout.current || !frame.current) return
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
    <div className={cn({background: String(props.background)})} ref={layout}>
      <div className={cn('frame')} ref={frame}>
        <div className={cn('head')}>
          <h1 className={cn('title')}>{props.title}</h1>
        </div>
        <div className={cn('content')}>
          {props.children}
        </div>
        <div className={cn('controls')}>
          <button className={cn('submit')} onClick={props.onSubmit} disabled={props.submitDisabled}>
            {props.labelSubmit}
          </button>
          <button className={cn('close')} onClick={props.onClose}>
            {props.labelClose}
          </button>
        </div>
      </div>
    </div>
  );
}

DialogLayout.propTypes = {
  title: PropTypes.string,
  onClose: PropTypes.func,
  onSubmit: PropTypes.func,
  children: PropTypes.node,
  labelClose: PropTypes.string,
  labelSubmit: PropTypes.string,
  submitDisabled: PropTypes.bool,
  background: PropTypes.bool,
};

DialogLayout.defaultProps = {
  title: 'Диалог',
  labelClose: 'Закрыть',
  labelSubmit: 'Ок',
  onClose: () => {
  },
  onSubmit: () => {
  },
  background: false
};

export default memo(DialogLayout);
